// Step 5a. Local Parakeet word timestamps for assets/audio/narration.wav.
// Usage: node transcribe.mjs <projectDir>
// Writes assets/audio/transcript.json [{id,text,start,end}]. Never downloads anything: HyperFrames' Parakeet cache is
// filled from <skill>/models/parakeet (see models.json); if those files are missing it prints the download links and stops.
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, hf, ok, fail, scriptWords } from "./_common.mjs";
import { syncParakeet, parakeetRuntime } from "./models.mjs";

const dir = projectDir(process.argv[2]);
const wav = need(path.join(dir, "assets/audio/narration.wav"), "run tts.py first");

try {
  const linked = await syncParakeet();
  if (linked.length) console.log(`filled the HyperFrames Parakeet cache from models/parakeet (${linked.join(", ")})`);
} catch (e) { fail(e.message); }
if (!parakeetRuntime()) fail(`the Parakeet runtime (sherpa-onnx) is not installed. Run once, with the model already in place it only fetches the runtime:\n  npx --yes ${CFG.hyperframes} models install parakeet`);

const out = path.join(dir, "assets/audio/transcript.json");
const candidates = [out, path.join(dir, "transcript.json")];
const before = Date.now();
// the CLI can exit 1 after writing a good transcript, so judge by the file, not the exit code
hf(["transcribe", wav, "--engine", "parakeet", "-d", dir], { cwd: dir, allowFail: true });
const f = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).mtimeMs >= before - 1000);
if (f && f !== out) fs.renameSync(f, out);
const words = f ? rd(out) : null;
if (!Array.isArray(words) || !words.length) fail("Parakeet produced no transcript. Run node <skill>/scripts/setup.mjs to check the model and runtime.");

const lines = rd(need(path.join(dir, "script/lines.json")));
const n = scriptWords(lines).length;
const diff = Math.abs(words.length - n) / n;
ok(`transcript: ${words.length} words (script ${n}), voice ends ${words[words.length - 1].end}s`);
if (diff > 0.15) fail(`word count differs from the script by ${(diff * 100).toFixed(0)}%. Listen to narration.wav: TTS may have skipped or mangled a line.`);
