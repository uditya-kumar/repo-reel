// Step 6. Scene slots, total length and music clips from the aligned words.
// Usage: node timing.mjs <projectDir>
// One scene per script line: id NN-<lineid>, starts sceneLead before its first word (snapped to 0.05), first at 0.
// total = voice length + tail (v3: 46.82 + 2.04 = 48.86), at most timing.maxReelSeconds (90 s). If the reel is longer
// than the music bed, the next clip restarts the bed inside the latest speech pause that still fits (v3's 42.83 s bed:
// at or before 42.4 s), as many times as needed.
// Music gain is set from the track's loudness so any bed sits where v3's did (garten at -7.0 LUFS -> 0.134896).
// Beat grid: with music.bpm and music.beatPhase (seconds of any beat in the file) set, `beats` = one [from, bpm, phase]
// per music clip in global seconds, ready for L.beatGrid(timing.beats); null (and a warning) when the track's tempo isn't set.
// Writes script/timing.json {total, voice:{file,duration}, scenes:[{id,p,n,line,start,dur}], music:[{id,start,dur,mediaStart}], beats}
// and script/cues.md (every scene's words at their scene-local times, plus its music beats).
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, wr, r2, r3, duration, lufs, ok, warn, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const lines = rd(need(path.join(dir, "script/lines.json")));
const words = rd(need(path.join(dir, "assets/audio/words.json"), "run align.mjs first"));
const voice = r2(duration(need(path.join(dir, "assets/audio/narration.wav"))));
const { sceneLead, round, tail } = CFG.timing;
const M = CFG.music;
const reel = rd(path.join(dir, "script/reel.json"));
const src = reel.music;
if (!src) fail("script/reel.json has no music entry (re-run scaffold, or set \"music\": \"<file in project root>\")");
const bed = need(path.join(dir, src), "music bed missing from the project root");
const bedLen = duration(bed), bedLufs = lufs(bed);
if (!Number.isFinite(bedLufs)) fail(`could not measure the loudness of ${src}`);
const volume = Math.round(M.refVolume * 10 ** ((M.refLufs - bedLufs) / 20) * 1e6) / 1e6;
const maxSplit = bedLen - M.splitMargin;
const total = r2(voice + tail);
const maxReel = CFG.timing.maxReelSeconds ?? 90;
if (total > maxReel) fail(`reel would be ${total}s, over the ${maxReel}s limit. Shorten the script and get it re-approved.`);
const snap = (t) => r2(Math.round(t / round) * round);

const starts = lines.map((l, li) => {
  const w = words.find((x) => x.li === li);
  if (!w) fail(`no words for line ${l.id}`);
  return li === 0 ? 0 : snap(Math.max(0, w.start - sceneLead));
});
const scenes = lines.map((l, i) => {
  const nn = String(i + 1).padStart(2, "0");
  const end = i + 1 < lines.length ? starts[i + 1] : total;
  if (end - starts[i] < 1) fail(`scene ${nn}-${l.id} is only ${r2(end - starts[i])}s; merge it with a neighbour line`);
  return { id: `${nn}-${l.id}`, p: `f${nn}`, n: i + 1, line: l.id, start: starts[i], dur: r2(end - starts[i]) };
});

// music: one clip if the bed covers the reel, else restart it inside a speech pause, as often as needed
const room = (ms) => r2(bedLen - ms);
const gaps = [];
for (let i = 1; i < words.length; i++) {
  const a = words[i - 1].end, b = words[i].start;
  if (b - a >= 0.15) gaps.push({ at: r2((a + b) / 2), len: b - a });
}
const music = [];
for (let at = 0, k = 0; ; k++) {
  const ms = k === 0 ? M.mediaStartA : M.mediaStartB, id = `el-bgm-${String.fromCharCode(97 + k)}`;
  if (total - at <= room(ms)) { music.push({ id, start: at, dur: r2(total - at), mediaStart: ms }); break; }
  // latest pause before this clip's bed runs out, but prefer a real breath (>= 0.25 s) within the last 6 s of the window
  const limit = at + maxSplit - (ms - M.mediaStartA);
  const win = gaps.filter((g) => g.at > at + 5 && g.at <= limit);
  if (!win.length) fail(`no speech pause between ${r2(at + 5)}s and ${r2(limit)}s where the music bed can restart; use a longer bed`);
  const latest = win[win.length - 1].at;
  const split = (win.filter((g) => g.len >= 0.25 && g.at >= latest - 6).pop() || win[win.length - 1]).at;
  music.push({ id, start: at, dur: r2(split - at), mediaStart: ms });
  at = split;
}

// a beat at file time beatPhase plays at global (clip start - mediaStart + beatPhase) in each clip
const beats = M.bpm > 0 ? music.map((m) => [m.start, M.bpm, r3(m.start - m.mediaStart + (M.beatPhase || 0))]) : null;

wr(path.join(dir, "script/timing.json"), { total, voice: { file: "assets/audio/narration.wav", duration: voice }, scenes,
  bed: { src, length: r2(bedLen), lufs: bedLufs, volume }, music, beats });
// word cues for writing scenes: each scene's words at the scene-local times s.at() returns; a repeated word shows the
// nth index s.at(word, n) needs (AI#1). Beats are listed in local time too, for landing handoffs.
const kw = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, "");
const beatAt = beats ? (a, b) => {
  const out = [];
  for (const [from, bpm, ph] of beats) { const P = 60 / bpm; for (let t = ph + Math.ceil((Math.max(a, from) - ph) / P) * P; t < b; t += P) out.push(r2(t)); }
  return [...new Set(out)].sort((x, y) => x - y);
} : null;
const cues = [`# Word cues (scene-local seconds = what s.at(word) returns). Regenerated by timing.mjs; don't edit.`, ""];
scenes.forEach((s) => {
  const own = words.filter((w) => w.line === s.line), seen = {};
  cues.push(`## ${s.id}  (${s.p})  start ${s.start}  dur ${s.dur}`, `"${lines.find((l) => l.id === s.line).text}"`);
  cues.push(own.map((w) => { const k = kw(w.text), n = seen[k] || 0; seen[k] = n + 1; return `${w.text}${n ? `#${n}` : ""} ${r2(w.start - s.start).toFixed(2)}`; }).join(" · "));
  if (beatAt) cues.push(`beats: ${beatAt(s.start, s.start + s.dur).map((t) => r2(t - s.start).toFixed(2)).join(" ")}`);
  cues.push("");
});
fs.writeFileSync(path.join(dir, "script/cues.md"), cues.join("\n"));
ok(`total ${total}s (voice ${voice}s + ${tail}s), ${scenes.length} scenes, ${music.length} music clip(s); word cues in script/cues.md`);
scenes.forEach((s) => console.log(`  ${s.id.padEnd(14)} ${s.start.toFixed(2).padStart(6)}  +${s.dur.toFixed(2)}`));
console.log(`  bed ${src}: ${r2(bedLen)}s, ${bedLufs} LUFS -> volume ${volume}`);
music.forEach((m) => console.log(`  ${m.id}  ${m.start.toFixed(2)} +${m.dur.toFixed(2)} (media ${m.mediaStart})`));
if (beats) console.log(`  beats ${M.bpm} BPM: ${beats.map((b) => `from ${b[0]} phase ${b[2]}`).join(", ")}`);
else warn("music.bpm is not set (config.local.json), so timing.json has no beat grid: place cuts on words only, or set the track's bpm and beatPhase");
