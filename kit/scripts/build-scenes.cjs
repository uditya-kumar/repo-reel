// Builds compositions/scenes/*.html for this reel. Run: node scripts/build-scenes.cjs
// Timing comes from script/timing.json (made by the repo-reel timing script). Each scene's art lives in
// scripts/scenes/NN-<id>.cjs:  module.exports = (L, s, reel) => ({ lift, svg, html, anim, over?, cam?, fade? })
//   L    = scripts/lib/reel-lib.cjs (objects, helpers, T tokens)
//   s    = { id, p, n, line, start, dur, words, at(word, nth) }  -- use s.at("word") for every cue time
//   reel = script/reel.json (repo facts, cta config)
// The last scene uses scenes/_cta.cjs unless NN-<id>.cjs exists. Missing scenes render a TODO placeholder.
// It also writes compositions/bg.html: the grid plus the frame chrome (DESIGN.md 4), replacing the plain grid assemble.mjs wrote.
// Build-time checks (each fails the build with the fix in the message, before any check or snapshot):
//   - duplicate ids, within a scene or across scenes (a spark and a screen both called p-s0 silently moved the screen);
//   - declared boxes: a scene may return boxes: [{ id, r: [x, y, w, h], t?: [t0, t1] }] (its main objects and labels in
//     .lift coords; L.isoBounds / L.boundsOf help) and overlapOk: [[idA, idB]]. Boxes that overlap while both are on
//     screen fail, and so do boxes that leave the grid field (x 58..1022, y 305..1305 after the lift).
const fs = require("fs");
const path = require("path");
const L = require("./lib/reel-lib.cjs");

const ROOT = path.join(__dirname, "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const timing = read("script/timing.json");
const words = read("assets/audio/words.json");
const reel = fs.existsSync(path.join(ROOT, "script/reel.json")) ? read("script/reel.json") : {};
const OUT = path.join(ROOT, "compositions/scenes");
const SRC = path.join(__dirname, "scenes");
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".html")) fs.unlinkSync(path.join(OUT, f));

let todo = 0;
const ids = new Map(), errs = [];
function checkIds(sid, html) {
  const seen = new Set();
  for (const m of html.matchAll(/\sid="([^"$]+)"/g)) {
    const id = m[1];
    if (id === "root") continue;   // every composition's own root
    if (seen.has(id)) errs.push(`${sid}: id "${id}" is used twice (rename one: a duplicate id silently animates the wrong element)`);
    else if (ids.has(id)) errs.push(`${sid}: id "${id}" is also used in ${ids.get(id)}`);
    seen.add(id); ids.set(id, sid);
  }
}
// a box's shape as a convex polygon: r = [x, y, w, h] or [[x, y], ...] (L.isoHull gives an iso object's silhouette)
const poly = (r) => (Array.isArray(r[0]) ? r : [[r[0], r[1]], [r[0] + r[2], r[1]], [r[0] + r[2], r[1] + r[3]], [r[0], r[1] + r[3]]]);
// how far two convex polygons overlap (separating axis test): 0 when apart, else the smallest push that parts them
function depth(A, B) {
  let best = Infinity;
  for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length], n = [y1 - y2, x2 - x1], L = Math.hypot(n[0], n[1]) || 1;
    const pr = (Q) => Q.map((q) => (q[0] * n[0] + q[1] * n[1]) / L), a = pr(A), b = pr(B);
    const d = Math.min(Math.max(...a), Math.max(...b)) - Math.max(Math.min(...a), Math.min(...b));
    if (d <= 0) return 0;
    best = Math.min(best, d);
  }
  return best;
}
function checkBoxes(sid, o, lift, dur) {
  const B = (o.boxes || []).map((b) => ({ ...b, P: poly(b.r) })), allowed = new Set((o.overlapOk || []).map((pr) => [...pr].sort().join("|")));
  for (const b of B) {
    const xs = b.P.map((p) => p[0]), ys = b.P.map((p) => p[1] + lift);
    if (Math.min(...xs) < 57.5 || Math.max(...xs) > 1022.5 || Math.min(...ys) < 304.5 || Math.max(...ys) > 1305.5)
      errs.push(`${sid}: box "${b.id}" (x ${Math.round(Math.min(...xs))}..${Math.round(Math.max(...xs))}, y ${Math.round(Math.min(...ys))}..${Math.round(Math.max(...ys))} after lift ${lift}) leaves the grid field x 58..1022, y 305..1305`);
  }
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    const a = B[i], b = B[j], ta = a.t || [0, dur], tb = b.t || [0, dur];
    if (allowed.has([a.id, b.id].sort().join("|")) || Math.min(ta[1], tb[1]) <= Math.max(ta[0], tb[0])) continue;
    const d = depth(a.P, b.P);
    if (d > 2) errs.push(`${sid}: boxes "${a.id}" and "${b.id}" overlap (by ${Math.round(d)} px) while both are on screen (move one, or list the pair in overlapOk if it is meant)`);
  }
}
timing.scenes.forEach((t, i) => {
  const s = L.makeCues(words, { ...t });
  const own = path.join(SRC, `${t.id}.cjs`);
  const last = i === timing.scenes.length - 1;
  let src = own;
  if (!fs.existsSync(own)) src = last ? path.join(SRC, "_cta.cjs") : null;
  const o = src ? require(src)(L, s, reel) : (todo++, L.todoScene(s));
  const html = L.scene({ ...o, id: t.id, p: t.p, dur: t.dur, lift: o.lift || 0, svg: o.svg || "", html: o.html || "", anim: o.anim || "" });
  checkIds(t.id, html);
  checkBoxes(t.id, o, o.lift || 0, t.dur);
  fs.writeFileSync(path.join(OUT, `${t.id}.html`), html);
  console.log(`${t.id.padEnd(14)} ${String(t.dur).padStart(5)}s  ${src ? path.basename(src) : "TODO placeholder"}`);
});
if (todo) console.log(`\n${todo} scene(s) still TODO`);
// the cut plan's handoff report (L.plan): every hand's sides and cut fraction, with a fix for any out of range
{
  const pf = path.join(SRC, "_plan.cjs");
  const P = fs.existsSync(pf) ? require(pf) : null;
  if (P && typeof P.table === "function" && P.report && P.report.length) {
    console.log(`\n${P.table()}`);
    const bad = P.report.filter((r) => r.issues.length);
    if (bad.length) console.log(`⚠ ${bad.length} handoff(s) out of range (warning, not an error): fix them in scripts/scenes/_plan.cjs`);
  }
}
if (errs.length) {
  console.error(`\n✗ build checks failed:\n  ${errs.join("\n  ")}`);
  process.exit(1);
}

// bg: the persistent grid (DESIGN.md 4) plus the v5 frame chrome (registration marks, FIG readout, scene segments)
{
  const D = timing.total, ch = L.chrome(timing.scenes, D);
  const vx = Array.from({ length: 11 }, (_, i) => (58 + 96.4 * i).toFixed(1));
  const grid = vx.map((x) => `<line x1="${x}" y1="305" x2="${x}" y2="1305" stroke="${L.T.grid}" stroke-width="1.5" />`).join("") +
    `<line x1="58" y1="800" x2="1022" y2="800" stroke="${L.T.grid}" stroke-width="1.5" /><line x1="58" y1="1305" x2="1022" y2="1305" stroke="${L.T.rule}" stroke-width="1.5" />`;
  fs.writeFileSync(path.join(ROOT, "compositions/bg.html"), `<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    @font-face { font-family: "Inter"; src: url("assets/fonts/Inter-var.woff2") format("woff2"); font-weight: 100 900; }
    #root { position: absolute; inset: 0; overflow: hidden; }
    #bg-paper { position: absolute; inset: 0; background: ${L.T.paper}; }
    #bg-grid { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
    .km { display: inline-block; overflow: hidden; vertical-align: top; }
  </style>
  <div id="root" data-composition-id="bg" data-start="0" data-duration="${D}" data-width="1080" data-height="1920">
    <div id="bg-paper" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
      <svg id="bg-grid" viewBox="0 0 1080 1920">${grid}</svg>
      ${ch.html}
    </div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });${L.HELPERS}
${ch.anim}
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
  console.log(`bg             ${D}s  grid + frame chrome`);
}
