// Step 4 (your own voice): use a recorded narration instead of Kokoro TTS. Run by `audio.mjs <dir> --voice <file>`.
// Usage: node voice.mjs <projectDir> <file.wav|mp3|m4a|...>
// Copies the file to assets/audio/narration-user.<ext>, loudnorms it exactly like tts.py (48 kHz mono, -16 LUFS) to
// assets/audio/narration.wav, then finds each line's span from the words themselves, since there are no TTS stitch
// points: pass 1 gives every line the whole file (so align.mjs only places the words), transcribe + align, pass 2 sets
// each line to its first word - 0.05 .. its last word + 0.08 (kept inside its neighbours' words), and align runs again
// with the real spans (it clamps words to them). Writes narration.json, transcript.json, words.json; audio.mjs then
// goes on from timing. Same limits as tts.py: fails over voice.maxSeconds (the reel is at most 90 s), warns under minSeconds.
import fs from "node:fs";
import path from "node:path";
import { CFG, HERE, projectDir, need, rd, wr, run, duration, ok, warn, fail, r3 } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const src = process.argv[3] && path.resolve(process.argv[3]);
if (!src || !fs.existsSync(src)) fail(`voice file not found: ${process.argv[3] || "(none given)"}\n  usage: node audio.mjs <projectDir> --voice <file.wav>`);
const lines = rd(need(path.join(dir, "script/lines.json"), "write the approved lines first (WORKFLOW step 2)"));
const A = path.join(dir, "assets/audio");
fs.mkdirSync(A, { recursive: true });
const V = CFG.voice;

// copy + loudnorm (the same chain tts.py uses, so voice and music sit where they always do)
const keep = path.join(A, `narration-user${path.extname(src).toLowerCase() || ".wav"}`);
if (path.resolve(keep) !== src) fs.copyFileSync(src, keep);
const wav = path.join(A, "narration.wav");
run("ffmpeg", ["-v", "error", "-y", "-i", keep, "-af", V.loudnorm, "-ac", "1", "-ar", "48000", wav]);
const total = r3(duration(wav));
ok(`narration.wav from ${path.basename(src)}: ${total}s (loudnorm, 48 kHz mono)`);
if (total > V.maxSeconds) fail(`the voice is ${total}s, over ${V.maxSeconds}s (the reel is at most 90 s with the tail). Trim the recording or shorten the script.`);
if (total < V.minSeconds) warn(`the voice is ${total}s, under ${V.minSeconds}s: a short reel. Fine if intended.`);

const NJ = path.join(A, "narration.json");
const node = (s) => run("node", [path.join(HERE, s), dir], { cwd: dir });
// pass 1: whole-file line spans
wr(NJ, { total, source: "user", lines: lines.map((l) => ({ id: l.id, text: l.text, start: 0, duration: total })) });
console.log("\n── transcribe"); node("transcribe.mjs");
console.log("\n── align (pass 1: whole-file spans)"); node("align.mjs");
// pass 2: each line's span from its own words
const W = rd(path.join(A, "words.json"));
const span = lines.map((_, i) => {
  const ws = W.filter((w) => w.li === i);
  if (!ws.length) fail(`line ${lines[i].id} has no aligned words: is it in the recording? Listen to ${path.basename(src)}.`);
  return [ws[0].start, ws[ws.length - 1].end];
});
const meta = lines.map((l, i) => {
  const a = Math.max(i ? span[i - 1][1] : 0, span[i][0] - 0.05);
  const b = Math.min(i < lines.length - 1 ? span[i + 1][0] : total, span[i][1] + 0.08);
  return { id: l.id, text: l.text, start: r3(a), duration: r3(b - a) };
});
wr(NJ, { total, source: "user", lines: meta });
console.log("\n── align (pass 2: each line's own span)"); node("align.mjs");
ok("own voice ready: narration.wav, narration.json (line spans from the words), words.json");
