// Step 7a. Dark v3 captions from the aligned script words.
// Usage: node captions.mjs <projectDir>
// Groups break at , . ? ! or a pause > captions.pause, then split to <= maxWords words / maxChars characters.
// Each group shows from its first word to min(next group, last word end + hold); the active word turns lime.
// Writes compositions/captions.html.
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, ok } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const words = rd(need(path.join(dir, "assets/audio/words.json"), "run align.mjs first"));
const { total: TOTAL } = rd(need(path.join(dir, "script/timing.json"), "run timing.mjs first"));
const C = CFG.captions;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f3 = (n) => n.toFixed(3);

const phrases = [];
let cur = [];
words.forEach((w, k) => {
  cur.push(w);
  const nxt = words[k + 1];
  if (/[,.?!]$/.test(w.text) || !nxt || nxt.start - w.end > C.pause) { phrases.push(cur); cur = []; }
});
const groups = [];
for (const ph of phrases) {
  const chars = ph.reduce((a, x) => a + x.text.length + 1, 0);
  const n = Math.max(Math.ceil(ph.length / C.maxWords), Math.ceil(chars / C.maxChars));
  const size = Math.ceil(ph.length / n);
  for (let j = 0; j < ph.length; j += size) groups.push(ph.slice(j, j + size));
}

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
const long = groups.filter((g) => g.reduce((a, x) => a + x.text.length + 1, 0) - 1 > C.maxChars + 4);
if (long.length) console.log(`⚠ wide groups (check they fit 940 px): ${long.map((g) => g.map((w) => w.text).join(" ")).join(" | ")}`);
