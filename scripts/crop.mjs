// Step 8. Crop raw 2560 px-wide Chrome DevTools screenshots into scene-ready shots.
// Usage: node crop.mjs <projectDir> <spec.json> [--clean]
// spec: [{ "in": "_raw-readme.png", "out": "repo-header.png", "crop": "2560:1300:0:0" }]  (crop = W:H:X:Y, ffmpeg)
// Paths are relative to assets/shots/. --clean deletes the _raw-* inputs afterwards.
import fs from "node:fs";
import path from "node:path";
import { projectDir, need, rd, run, ok, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const spec = rd(need(path.resolve(process.argv[3] || ""), "usage: node crop.mjs <projectDir> <spec.json> [--clean]"));
const shots = path.join(dir, "assets/shots");
const size = (f) => {
  const r = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", f], { capture: true });
  return r.stdout.trim();
};
for (const s of spec) {
  const src = need(path.join(shots, s.in));
  if (!/^\d+:\d+:\d+:\d+$/.test(s.crop)) fail(`bad crop "${s.crop}" for ${s.in}; use W:H:X:Y`);
  const [w, h, x, y] = s.crop.split(":").map(Number);
  const [iw, ih] = size(src).split("x").map(Number);
  if (x + w > iw || y + h > ih) fail(`${s.in} is ${iw}x${ih}; crop ${s.crop} falls outside it`);
  run("ffmpeg", ["-y", "-v", "error", "-i", src, "-vf", `crop=${s.crop}`, path.join(shots, s.out)]);
  const out = path.join(shots, s.out);
  ok(`${s.out.padEnd(24)} ${size(out).padEnd(10)} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  if (w < 840) console.log(`  ⚠ ${s.out} is only ${w}px wide; at 2x that is under 420 px on screen (DESIGN.md minimum)`);
}
if (process.argv.includes("--clean"))
  for (const f of fs.readdirSync(shots)) if (f.startsWith("_raw-")) { fs.unlinkSync(path.join(shots, f)); console.log(`  removed ${f}`); }
