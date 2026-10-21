// Steps 4-7 in one go, after the script is approved: tts -> transcribe -> align -> timing -> captions -> assemble -> plan.
// Usage: node audio.mjs <projectDir> [--from align]   (--from skips earlier steps, e.g. after editing words by hand)
import path from "node:path";
import { CFG, HERE, projectDir, run } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const STEPS = [
  ["tts", CFG.python, [path.join(HERE, "tts.py"), dir]],
  ["transcribe", "node", [path.join(HERE, "transcribe.mjs"), dir]],
  ["align", "node", [path.join(HERE, "align.mjs"), dir]],
  ["timing", "node", [path.join(HERE, "timing.mjs"), dir]],
  ["captions", "node", [path.join(HERE, "captions.mjs"), dir]],
  ["assemble", "node", [path.join(HERE, "assemble.mjs"), dir]],
  ["plan", "node", [path.join(HERE, "plan.mjs"), dir]],   // writes the _plan.cjs stub once; never overwrites it
];
const fi = process.argv.indexOf("--from");
const from = fi > 0 ? STEPS.findIndex((s) => s[0] === process.argv[fi + 1]) : 0;
if (from < 0) { console.error(`--from must be one of ${STEPS.map((s) => s[0]).join(", ")}`); process.exit(1); }
for (const [name, cmd, args] of STEPS.slice(from)) {
  console.log(`\n══ ${name}`);
  run(cmd, args, { cwd: dir });
}
console.log(`\nnext: read script/cues.md (word times) and API.md (kit helpers), fill scripts/scenes/_plan.cjs, write scripts/scenes/NN-<id>.cjs per scene, then node "${path.join(HERE, "verify.mjs")}" "${dir}"`);
