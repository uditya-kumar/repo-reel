// Step 12. Final local render, then verify the file. Only run after the user approved the Studio preview.
// Usage: node render.mjs <projectDir> [--quality standard]
// Writes renders/<slug>.mp4 and checks: 1080x1920, duration = timing total, an audio stream, integrated loudness.
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, run, hf, lufs as measure, ok, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const T = rd(need(path.join(dir, "script/timing.json")));
const reel = rd(path.join(dir, "script/reel.json"));
const qi = process.argv.indexOf("--quality");
const quality = qi > 0 ? process.argv[qi + 1] : CFG.render.quality;
const rel = `renders/${reel.slug || path.basename(dir)}.mp4`;
const out = path.join(dir, rel);
fs.mkdirSync(path.dirname(out), { recursive: true });

hf(["render", "--fps", String(CFG.render.fps), "--quality", quality, "-o", rel], { cwd: dir });
need(out, "render did not produce a file");

const probe = JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", out], { capture: true }).stdout);
const v = probe.streams.find((s) => s.codec_type === "video");
const hasAudio = probe.streams.some((s) => s.codec_type === "audio");
const dur = parseFloat(probe.format.duration);
const lufs = measure(out);
const probs = [];
if (!v || v.width !== 1080 || v.height !== 1920) probs.push(`video is ${v ? `${v.width}x${v.height}` : "missing"}, want 1080x1920`);
if (Math.abs(dur - T.total) > 0.15) probs.push(`duration ${dur.toFixed(2)}s, want ${T.total}s`);
if (!hasAudio) probs.push("no audio stream");
if (!(lufs > -22 && lufs < -12)) probs.push(`integrated loudness ${lufs} LUFS looks wrong (v3 voice is normalised to -16)`);
console.log(`\n${out}\n  ${v ? `${v.width}x${v.height}` : "?"}  ${dur.toFixed(2)}s  audio:${hasAudio ? "yes" : "NO"}  ${lufs} LUFS  ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);
if (probs.length) fail(probs.join("\n  "));
ok("render verified");
