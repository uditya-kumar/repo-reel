// Step 7a. Dark v3 captions from the aligned script words.
// Usage: node captions.mjs <projectDir>
// Groups break at , . ? ! or a pause > captions.pause, then split into the fewest groups that fit maxWords words and
// maxChars characters, balanced by width. script/reel.json -> "captions" overrides config.json for one reel.
// Each group shows from its first word to min(next group, last word end + hold); the active word turns lime.
// Writes compositions/captions.html.
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, ok } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const words = rd(need(path.join(dir, "assets/audio/words.json"), "run align.mjs first"));
const { total: TOTAL } = rd(need(path.join(dir, "script/timing.json"), "run timing.mjs first"));
// per-project overrides: script/reel.json -> "captions": { maxWords, maxChars, pause, hold } (same keys as config.json)
const REEL = path.join(dir, "script/reel.json");
const C = { ...CFG.captions, ...((fs.existsSync(REEL) && rd(REEL).captions) || {}) };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f3 = (n) => n.toFixed(3);

const phrases = [];
let cur = [];
words.forEach((w, k) => {
  cur.push(w);
  const nxt = words[k + 1];
  if (/[,.?!]$/.test(w.text) || !nxt || nxt.start - w.end > C.pause) { phrases.push(cur); cur = []; }
});
// split a phrase into the fewest groups that each fit maxWords and maxChars, balanced so the widest group is as narrow
// as possible (an even split by word count let long words build a 34-character group that ran off the frame)
const width = (g) => g.reduce((a, x) => a + x.text.length, 0) + g.length - 1;
function partition(ph, n) {
  // best[k][i] = narrowest possible widest group when the first i words make k groups
  const best = Array.from({ length: n + 1 }, () => Array(ph.length + 1).fill(Infinity)), cut = best.map((r) => r.map(() => 0));
  best[0][0] = 0;
  for (let k = 1; k <= n; k++)
    for (let i = 1; i <= ph.length; i++)
      for (let j = Math.max(0, i - C.maxWords); j < i; j++) {
        const v = Math.max(best[k - 1][j], width(ph.slice(j, i)));
        if (v < best[k][i]) { best[k][i] = v; cut[k][i] = j; }
      }
  if (!Number.isFinite(best[n][ph.length])) return null;
  const out = [];
  for (let k = n, i = ph.length; k > 0; i = cut[k][i], k--) out.unshift(ph.slice(cut[k][i], i));
  return { groups: out, widest: best[n][ph.length] };
}
function split(ph) {
  for (let n = Math.ceil(ph.length / C.maxWords); n <= ph.length; n++) {
    const p = partition(ph, n);
    if (p && p.widest <= C.maxChars) return p.groups;
  }
  return ph.map((w) => [w]);   // a single word wider than maxChars: one word per group (flagged below)
}
const groups = phrases.flatMap(split);

const html = [], js = [];
groups.forEach((g, gi) => {
  const gs = g[0].start;
  const nxt = gi + 1 < groups.length ? groups[gi + 1][0].start : TOTAL;
  const ge = gi + 1 < groups.length ? Math.min(nxt, g[g.length - 1].end + C.hold) : TOTAL;
  const spans = g.map((w, wi) => `<span class="cw" id="cap-g${gi}-w${wi}">${esc(w.text)}</span>`);
  html.push(`      <div class="cg" id="cap-g${gi}"><div class="cbox">${spans.join(" ")}</div></div>`);
  js.push(`      grp("#cap-g${gi}", ${f3(gs)}, ${f3(ge)}, [${g.map((w) => `[${f3(w.start)}, ${f3(w.end)}]`).join(", ")}]);`);
});

const doc = `<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    @font-face { font-family: "Inter"; src: url("assets/fonts/Inter-var.woff2") format("woff2"); font-weight: 100 900; }
    #root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    #root .cap-layer { position: absolute; inset: 0; }
    .cg { position: absolute; left: 70px; right: 70px; top: 1420px; height: 120px; display: flex; align-items: center; justify-content: center; opacity: 0; }
    .cbox { display: block; background: #18191c; border: 3px solid #ecebe6; border-radius: 3px; padding: 12px 20px 14px; font-family: "Inter", sans-serif; font-weight: 600; font-size: 54px; line-height: 1.1; letter-spacing: -0.01em; color: #ecebe6; white-space: nowrap; }
    .cw { display: inline-block; padding: 0 8px; border-radius: 2px; }
  </style>
  <div id="root" data-composition-id="captions" data-start="0" data-duration="${TOTAL}" data-width="1080" data-height="1920">
    <div id="cap-layer" class="clip cap-layer" data-start="0" data-duration="${TOTAL}" data-track-index="1">
${html.join("\n")}
    </div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      const grp = (sel, s, e, ws) => {
        // v3 used a 0.14 s opacity fade; a clip wipe keeps the same rise but never shows half-transparent text,
        // which the contrast audit flags whenever a sample lands inside a fade with the first word lit
        tl.set(sel, { opacity: 1 }, s);
        tl.fromTo(sel, { clipPath: "inset(100% 0% 0% 0%)", y: 10 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.14, ease: "power2.out" }, s);
        tl.set(sel, { opacity: 0 }, e);
        ws.forEach(([a, b], i) => {
          const w = sel + "-w" + i;
          tl.set(w, { backgroundColor: "#d3f654", color: "#0e0f11" }, a);
          tl.set(w, { backgroundColor: "rgba(211, 246, 84, 0)", color: "#ecebe6" }, b);
        });
      };
${js.join("\n")}
      window.__timelines["captions"] = tl;
    })();
  </script>
</template>
`;
fs.mkdirSync(path.join(dir, "compositions"), { recursive: true });
fs.writeFileSync(path.join(dir, "compositions/captions.html"), doc);
ok(`captions.html: ${groups.length} groups`);
const long = groups.filter((g) => width(g) > C.maxChars);
if (long.length) console.log(`⚠ single words wider than ${C.maxChars} characters (check they fit 940 px): ${long.map((g) => g.map((w) => w.text).join(" ")).join(" | ")}`);
console.log(`  widest group: ${Math.max(...groups.map(width))} characters (max ${C.maxChars}, ${C.maxWords} words)`);
