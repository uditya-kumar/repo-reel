// Step 5b. Put Parakeet timings on the approved script's own words (script spelling + punctuation wins).
// Usage: node align.mjs <projectDir>
// Character-level edit-distance alignment of script letters against ASR letters, so ASR splits/merges
// ("open source" vs "open-source", "checks." swallowing 3 words, "10" vs "ten") resolve without manual patches.
// Writes assets/audio/words.json [{text,start,end,line,li}].
import path from "node:path";
import { projectDir, need, rd, wr, r3, ok, scriptWords, key } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const lines = rd(need(path.join(dir, "script/lines.json")));
const asr = rd(need(path.join(dir, "assets/audio/transcript.json"), "run transcribe.mjs first"));
const narr = rd(need(path.join(dir, "assets/audio/narration.json"), "run tts.py first"));
const SW = scriptWords(lines);

// letters of each side; ASR letters get an evenly spread time slice of their word
const S = [], A = [];
SW.forEach((w, wi) => { for (const c of key(w.text)) S.push({ c, wi }); });
asr.forEach((w) => {
  const k = key(w.text), d = (w.end - w.start) / Math.max(1, k.length);
  [...k].forEach((c, j) => A.push({ c, t0: w.start + j * d, t1: w.start + (j + 1) * d }));
});

// Levenshtein with backtrace. ops: 0 diag (match/sub), 1 skip script letter, 2 skip ASR letter
const n = S.length, m = A.length, W = m + 1;
const cost = new Int32Array((n + 1) * W), op = new Uint8Array((n + 1) * W);
for (let i = 1; i <= n; i++) { cost[i * W] = i; op[i * W] = 1; }
for (let j = 1; j <= m; j++) { cost[j] = j; op[j] = 2; }
for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
  const d = cost[(i - 1) * W + j - 1] + (S[i - 1].c === A[j - 1].c ? 0 : 1);
  const u = cost[(i - 1) * W + j] + 1, l = cost[i * W + j - 1] + 1;
  const o = d <= u && d <= l ? 0 : u <= l ? 1 : 2;
  cost[i * W + j] = o === 0 ? d : o === 1 ? u : l; op[i * W + j] = o;
}
const span = SW.map(() => ({ s: Infinity, e: -Infinity, hit: 0, n: 0 }));
S.forEach((x) => span[x.wi].n++);
for (let i = n, j = m; i > 0 || j > 0;) {
  const o = op[i * W + j];
  if (o === 0) { const sp = span[S[i - 1].wi], a = A[j - 1]; sp.s = Math.min(sp.s, a.t0); sp.e = Math.max(sp.e, a.t1); if (S[i - 1].c === a.c) sp.hit++; i--; j--; }
  else if (o === 1) i--; else j--;
}

// unmapped words: spread across the gap between neighbours (or share the previous word's span)
const out = SW.map((w, i) => ({ text: w.text, start: span[i].s, end: span[i].e, line: w.line, li: w.li }));
for (let i = 0; i < out.length; i++) {
  if (Number.isFinite(out[i].start)) continue;
  let k = i; while (k < out.length && !Number.isFinite(out[k].start)) k++;
  const a = i > 0 ? out[i - 1].end : 0, b = k < out.length ? out[k].start : a;
  const step = Math.max(0, b - a) / (k - i);
  for (let q = i; q < k; q++) {
    out[q].start = step ? a + (q - i) * step : out[Math.max(0, i - 1)].start;
    out[q].end = step ? a + (q - i + 1) * step : a;
  }
  i = k - 1;
}
// keep each line inside its sample-exact TTS span (Parakeet word ends run on to the next word, eating the line gaps)
out.forEach((w) => {
  const l = narr.lines[w.li], a = l.start, b = l.start + l.duration;
  w.start = Math.min(Math.max(w.start, a), b - 0.02);
  w.end = Math.min(Math.max(w.end, w.start + 0.02), b);
});
// monotonic, non-overlapping
for (let i = 1; i < out.length; i++) {
  const p = out[i - 1], w = out[i];
  if (w.start < p.end) { if (w.start > p.start) p.end = w.start; else w.start = p.end; }
  if (w.end < w.start + 0.02) w.end = w.start + 0.02;
}
out.forEach((w) => { w.start = r3(w.start); w.end = r3(w.end); });
wr(path.join(dir, "assets/audio/words.json"), out);

// report: weak words and line-start agreement with the TTS stitch points
const weak = SW.map((w, i) => ({ w: w.text, r: span[i].n ? span[i].hit / span[i].n : 1 })).filter((x) => x.r < 0.5);
const dist = cost[n * W + m];
ok(`aligned ${out.length} script words to ${asr.length} ASR words (edit distance ${dist} over ${n} letters)`);
if (weak.length) console.log(`  weak matches (check by ear): ${weak.map((x) => x.w).join(", ")}`);
let bad = 0;
narr.lines.forEach((l, li) => {
  const first = out.find((w) => w.li === li), last = [...out].reverse().find((w) => w.li === li);
  const off = first.start - l.start;
  if (Math.abs(off) > 0.4) bad++;
  console.log(`  ${l.id.padEnd(10)} tts ${l.start.toFixed(2).padStart(6)}  words ${first.start.toFixed(2).padStart(6)}-${last.end.toFixed(2).padStart(6)}${Math.abs(off) > 0.4 ? "  ⚠ off by " + off.toFixed(2) : ""}`);
});
if (dist / n > 0.12 || bad) console.log("⚠ alignment looks loose; listen to narration.wav before going on");
