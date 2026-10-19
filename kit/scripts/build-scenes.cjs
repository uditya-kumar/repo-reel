// Builds compositions/scenes/*.html for this reel. Run: node scripts/build-scenes.cjs
// Timing comes from script/timing.json (made by the repo-reel timing script). Each scene's art lives in
// scripts/scenes/NN-<id>.cjs:  module.exports = (L, s, reel) => ({ lift, svg, html, anim, over?, cam?, fade? })
//   L    = scripts/lib/reel-lib.cjs (objects, helpers, T tokens)
//   s    = { id, p, n, line, start, dur, words, at(word, nth) }  -- use s.at("word") for every cue time
//   reel = script/reel.json (repo facts, cta config)
// The last scene uses scenes/_cta.cjs unless NN-<id>.cjs exists. Missing scenes render a TODO placeholder.
// It also writes compositions/bg.html: the grid plus the frame chrome (DESIGN.md 4), replacing the plain grid assemble.mjs wrote.
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
timing.scenes.forEach((t, i) => {
  const s = L.makeCues(words, { ...t });
  const own = path.join(SRC, `${t.id}.cjs`);
  const last = i === timing.scenes.length - 1;
  let src = own;
  if (!fs.existsSync(own)) src = last ? path.join(SRC, "_cta.cjs") : null;
  const o = src ? require(src)(L, s, reel) : (todo++, L.todoScene(s));
  fs.writeFileSync(path.join(OUT, `${t.id}.html`), L.scene({ ...o, id: t.id, p: t.p, dur: t.dur, lift: o.lift || 0, svg: o.svg || "", html: o.html || "", anim: o.anim || "" }));
  console.log(`${t.id.padEnd(14)} ${String(t.dur).padStart(5)}s  ${src ? path.basename(src) : "TODO placeholder"}`);
});
if (todo) console.log(`\n${todo} scene(s) still TODO`);

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
