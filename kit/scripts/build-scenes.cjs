// Builds compositions/scenes/*.html for this reel. Run: node scripts/build-scenes.cjs
// Timing comes from script/timing.json (made by the repo-reel timing script). Each scene's art lives in
// scripts/scenes/NN-<id>.cjs:  module.exports = (L, s, reel) => ({ lift, svg, html, anim, over?, cam?, fade? })
//   L    = scripts/lib/reel-lib.cjs (objects, helpers, T tokens)
//   s    = { id, p, n, line, start, dur, words, at(word, nth) }  -- use s.at("word") for every cue time
//   reel = script/reel.json (repo facts, cta config)
// The last scene uses scenes/_cta.cjs unless NN-<id>.cjs exists. Missing scenes render a TODO placeholder.
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
