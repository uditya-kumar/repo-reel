// Steps 4-7 in one go, after the script is approved: tts -> transcribe -> align -> timing -> captions -> assemble -> plan.
// Usage: node audio.mjs <projectDir> [--from align]   (--from skips earlier steps, e.g. after editing words by hand)
//        node audio.mjs <projectDir> --voice <file>   (your own recording instead of Kokoro: voice.mjs replaces
//                                                     tts -> transcribe -> align, then timing ... plan run as usual)
// A project that uses your own voice is never re-voiced by Kokoro by accident: a plain run (or --from tts) stops and
// says how to go on; --tts replaces your recording with Kokoro on purpose.
import fs from "node:fs";
import path from "node:path";
import { CFG, HERE, projectDir, run, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const voice = arg("--voice");
const STEPS = [
  ["tts", CFG.python, [path.join(HERE, "tts.py"), dir]],
  ["transcribe", "node", [path.join(HERE, "transcribe.mjs"), dir]],
  ["align", "node", [path.join(HERE, "align.mjs"), dir]],
  ["timing", "node", [path.join(HERE, "timing.mjs"), dir]],
  ["captions", "node", [path.join(HERE, "captions.mjs"), dir]],
  ["assemble", "node", [path.join(HERE, "assemble.mjs"), dir]],
  ["plan", "node", [path.join(HERE, "plan.mjs"), dir]],   // writes the _plan.cjs stub once; never overwrites it
];
let steps;
if (voice) {
  if (arg("--from")) fail("--voice and --from don't mix: --voice always starts from the recording");
  steps = [["voice", "node", [path.join(HERE, "voice.mjs"), dir, path.resolve(voice)]], ...STEPS.slice(3)];
} else {
  const f = arg("--from");
  const from = f ? STEPS.findIndex((s) => s[0] === f) : 0;
  if (from < 0) fail(`--from must be one of ${STEPS.map((s) => s[0]).join(", ")}`);
  const nj = path.join(dir, "assets/audio/narration.json");
  const own = fs.existsSync(nj) && JSON.parse(fs.readFileSync(nj, "utf8")).source === "user";
  if (own && from === 0 && !process.argv.includes("--tts"))
    fail("this project uses your own recording (narration.json source: user), so Kokoro would replace it.\n" +
      "  re-voice it:   node audio.mjs <dir> --voice <file>\n  later steps:   node audio.mjs <dir> --from align (or timing, captions, ...)\n" +
      "  switch to TTS: node audio.mjs <dir> --tts");
  steps = STEPS.slice(from);
}
for (const [name, cmd, args] of steps) {
  console.log(`\n══ ${name}`);
  run(cmd, args, { cwd: dir });
}
console.log(`\nnext: read script/cues.md (word times) and API.md (kit helpers), fill scripts/scenes/_plan.cjs, write scripts/scenes/NN-<id>.cjs per scene, then node "${path.join(HERE, "verify.mjs")}" "${dir}"`);
