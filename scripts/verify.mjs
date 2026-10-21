// Step 10. Build scenes, run the strict check, and snapshot scenes for side-by-side review with v3.
// Usage: node verify.mjs <projectDir> [--no-snap] [--dense] [--cuts] [--scenes 05,11] [--infos]
// Fails on any build check, check error or warning. The check runs as JSON and only its errors and warnings are
// printed, one line each with its scene (--infos adds the info findings); the full report path is printed too.
// A cold first load that hits "Navigation timeout" is retried once with a longer timeout.
// Snapshots go to snaps/review/ (scene midpoints + one CTA end frame). --dense adds a frame every 0.6 s per scene and
// one contact sheet per scene: snaps/dense/<scene-id>.jpg (index.md lists each sheet's times), so after a fix only
// that scene's sheet needs looking at. --cuts adds one row of frames across every cut: snaps/cuts/NN-NN.jpg, framed
// on the handoff's t0 .. land when _plan.cjs has one, else around the scene start (implode, hold cut, fade).
// --scenes limits the snapshots to some scenes (numbers, ids or line keys; --cuts: the cuts into or out of them); the
// check still runs on the whole project.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { SKILL, projectDir, need, rd, run, hf, r2, ok, fail } from "./_common.mjs";

const argv = process.argv;
const dir = projectDir(argv[2]);
const T = rd(need(path.join(dir, "script/timing.json"), "run audio.mjs first"));
need(path.join(dir, "index.html"), "run assemble.mjs first");
delete process.env.GEMINI_API_KEY; // snapshot would send frames to Gemini; everything stays local
const opt = (k) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : null; };

console.log("── build scenes");
run("node", [path.join(dir, "scripts/build-scenes.cjs")], { cwd: dir });

// ---- check (JSON), compact report ----
const sceneOf = (f) => {
  const file = String(f.sourceFile || f.file || "");
  let m = file.match(/scenes[\\/](\d\d-[\w-]+)\.html/);
  if (m) return m[1];
  m = String(f.selector || "").match(/#(f\d\d)-/);
  if (m) { const s = T.scenes.find((x) => x.p === m[1]); if (s) return s.id; }
  if (/captions/.test(file) || /#cap-/.test(f.selector || "")) return "captions";
  if (/bg\.html/.test(file) || /#bg-/.test(f.selector || "")) return "bg";
  const t = Array.isArray(f.times) && f.times.length ? f.times[0] : f.time;
  if (typeof t === "number") { const s = [...T.scenes].reverse().find((x) => t >= x.start); if (s) return `${s.id}?`; }
  return "";
};
function check(extra = []) {
  const r = hf(["check", "--strict", "--json", ...extra], { cwd: dir, capture: true, allowFail: true });
  const out = r.stdout || "", i = out.indexOf("{");
  try { return JSON.parse(out.slice(i)); } catch {
    console.log((out + (r.stderr || "")).slice(-3000));
    fail("check didn't return its JSON report (output above)");
  }
}
console.log("\n── hyperframes check --strict");
let J = check();
const SECTIONS = ["lint", "runtime", "layout", "motion", "contrast"];
const all = (j) => SECTIONS.flatMap((k) => ((j[k] && j[k].findings) || []).map((f) => ({ ...f, section: k })));
if (!J.ok && all(J).some((f) => /Navigation timeout/i.test(f.message || ""))) {
  console.log("  cold first load timed out; retrying once with --timeout=40000");
  J = check(["--timeout=40000"]);
}
const F = all(J), showInfo = argv.includes("--infos");
console.log("  " + SECTIONS.map((k) => {
  const s = J[k] || {};
  if (k === "contrast" && s.checked != null) return `contrast ${s.passed}/${s.checked}`;
  return `${k} ${s.errorCount || 0}e ${s.warningCount || 0}w${s.infoCount ? ` (${s.infoCount} info)` : ""}`;
}).join(" · "));
for (const f of F) {
  if (f.severity === "info" && !showInfo) continue;
  const t = Array.isArray(f.times) && f.times.length ? f.times.map((x) => r2(x)).join(",") : f.time != null ? r2(f.time) : "";
  const icon = f.severity === "error" ? "✗" : f.severity === "warning" ? "⚠" : "ℹ";
  console.log(`  ${icon} [${f.section}] ${f.code || f.rule || ""} ${sceneOf(f)}${t !== "" ? ` t=${t}` : ""} ${f.selector || ""}`);
  console.log(`      ${String(f.message || "").replace(/\s+/g, " ").slice(0, 300)}`);
  if (f.fixHint || f.fix) console.log(`      fix: ${String(f.fixHint || f.fix).replace(/\s+/g, " ").slice(0, 300)}`);
}
if (J.saved && J.saved.report) console.log(`  full report: ${J.saved.report}`);
if (!J.ok) fail("check failed. Fix every error and warning, then run verify again.");
ok("check clean");

// ---- snapshots ----
// tile frames [{ f, t }] into one contact sheet: left to right, top to bottom, `cols` to a row, each at 360 x 640
function sheet(fr, out, cols) {
  const W = 360, H = 640, c = Math.min(fr.length, cols), rows = Math.ceil(fr.length / c);
  const fc = fr.map((_, k) => `[${k}:v]scale=${W}:${H}[v${k}]`), rl = [];
  for (let r = 0; r < rows; r++) {
    const ks = fr.map((_, k) => k).slice(r * c, r * c + c), lab = ks.map((k) => `[v${k}]`).join("");
    fc.push(`${lab}${ks.length > 1 ? `hstack=inputs=${ks.length},` : ""}pad=${c * W}:${H}:0:0:color=0x111214[r${r}]`);
    rl.push(`[r${r}]`);
  }
  fc.push(rows > 1 ? `${rl.join("")}vstack=inputs=${rows}[out]` : `[r0]null[out]`);
  run("ffmpeg", ["-v", "error", "-y", ...fr.flatMap((x) => ["-i", x.f]), "-filter_complex", fc.join(";"), "-map", "[out]", "-frames:v", "1", "-q:v", "4", out]);
}
if (!argv.includes("--no-snap")) {
  const pick = opt("--scenes");
  const want = pick ? pick.split(",").map((x) => x.trim()).filter(Boolean) : null;
  const SC = want ? T.scenes.filter((s) => want.some((w) => s.id === w || s.line === w || s.id.startsWith(w.padStart(2, "0") + "-"))) : T.scenes;
  if (!SC.length) fail(`--scenes ${pick} matches no scene (${T.scenes.map((s) => s.id).join(", ")})`);
  const last = T.scenes[T.scenes.length - 1];
  const at = SC.map((s) => r2(s.start + s.dur / 2));
  if (SC.includes(last)) at.push(r2(T.total - 0.4));
  console.log(`\n── snapshots${want ? ` (${SC.map((s) => s.id).join(", ")})` : ""} at ${at.join(", ")}`);
  hf(["snapshot", "--at", at.join(","), "--no-end", "--timeout=30000", "-o", "snaps/review"], { cwd: dir, capture: true });
  ok(`snapshots: ${path.join(dir, "snaps/review")} (contact-sheet.jpg)`);
  if (argv.includes("--dense")) {
    const D = path.join(dir, "snaps/dense"), FR = path.join(D, "frames");
    fs.rmSync(FR, { recursive: true, force: true });
    fs.mkdirSync(FR, { recursive: true });
    const per = SC.map((s) => { const ts = []; for (let t = s.start + 0.3; t < s.start + s.dur - 0.05; t += 0.6) ts.push(r2(t)); return { s, ts }; });
    const dn = per.flatMap((x) => x.ts);
    console.log(`\n── dense snapshots: ${dn.length} frames in ${SC.length} scene(s)`);
    hf(["snapshot", "--at", dn.join(","), "--no-end", "--timeout=30000", "-o", "snaps/dense/frames"], { cwd: dir, capture: true });
    const files = fs.readdirSync(FR).filter((f) => /^frame-\d+-at-[\d.]+s\.png$/.test(f))
      .map((f) => ({ f: path.join(FR, f), t: +f.match(/-at-([\d.]+)s\.png$/)[1] }));
    for (const f of fs.readdirSync(FR)) if (/^contact-sheet/.test(f)) fs.rmSync(path.join(FR, f));
    // one sheet per scene: frames left to right, top to bottom, 6 to a row
    const index = ["# Dense contact sheets (one per scene; frames left to right, top to bottom)", ""];
    for (const { s, ts } of per) {
      const fr = ts.map((t) => files.find((x) => Math.abs(x.t - t) < 0.006)).filter(Boolean);
      if (!fr.length) continue;
      sheet(fr, path.join(D, `${s.id}.jpg`), 6);
      index.push(`- ${s.id}.jpg (${s.start}-${r2(s.start + s.dur)}s): ${fr.map((x) => x.t).join(" ")}`);
      console.log(`  ${s.id}.jpg  ${fr.length} frames: ${fr.map((x) => x.t).join(" ")}`);
    }
    fs.writeFileSync(path.join(D, "index.md"), index.join("\n") + "\n");
    ok(`dense sheets: ${D} (<scene-id>.jpg, times in index.md)`);
  }
  if (argv.includes("--cuts")) {
    // one row per cut, framed on the handoff when _plan.cjs has one (t0 .. land), else around the scene start
    // (implode, hold cut, plain fade): the dense 0.6 s grid skips straight over these, and they are where cut bugs show
    let P = null;
    const pf = path.join(dir, "scripts/scenes/_plan.cjs");
    if (fs.existsSync(pf)) { try { P = createRequire(import.meta.url)(pf); } catch (e) { console.log(`  (couldn't load _plan.cjs: ${e.message.split("\n")[0]})`); } }
    const keyOf = (i) => (P && P.KEYS && P.KEYS[i]) || T.scenes[i].line;
    const cuts = [];
    for (let i = 1; i < T.scenes.length; i++) {
      const a = T.scenes[i - 1], b = T.scenes[i];
      if (want && !SC.includes(a) && !SC.includes(b)) continue;
      const h = P && P.H ? Object.values(P.H).find((x) => x.from === keyOf(i - 1) && x.to === keyOf(i)) : null;
      const c = b.start, ts = h
        ? [h.t0 - 0.1, h.t0 + (c - h.t0) / 2, c - 0.03, c + 0.03, c + (h.land - c) / 2, h.land, h.land + 0.3]
        : [c - 0.5, c - 0.3, c - 0.15, c - 0.04, c + 0.04, c + 0.2, c + 0.45];
      cuts.push({ a, b, kind: h ? `handoff ${Object.keys(P.H).find((k) => P.H[k] === h)}` : "cut", ts: [...new Set(ts.map((t) => r2(Math.min(T.total - 0.02, Math.max(0, t)))))] });
    }
    const C = path.join(dir, "snaps/cuts"), CF = path.join(C, "frames");
    fs.rmSync(C, { recursive: true, force: true });
    fs.mkdirSync(CF, { recursive: true });
    const ct = [...new Set(cuts.flatMap((x) => x.ts))].sort((x, y) => x - y);
    console.log(`\n── cut snapshots: ${ct.length} frames around ${cuts.length} cut(s)`);
    hf(["snapshot", "--at", ct.join(","), "--no-end", "--timeout=30000", "-o", "snaps/cuts/frames"], { cwd: dir, capture: true });
    const files = fs.readdirSync(CF).filter((f) => /^frame-\d+-at-[\d.]+s\.png$/.test(f))
      .map((f) => ({ f: path.join(CF, f), t: +f.match(/-at-([\d.]+)s\.png$/)[1] }));
    const index = ["# Cut sheets (one row per cut: frames left to right across the cut)", ""];
    for (const { a, b, kind, ts } of cuts) {
      const fr = ts.map((t) => files.find((x) => Math.abs(x.t - t) < 0.006)).filter(Boolean);
      if (!fr.length) continue;
      const name = `${a.id.slice(0, 2)}-${b.id.slice(0, 2)}.jpg`;
      sheet(fr, path.join(C, name), fr.length);
      index.push(`- ${name} (${a.id} -> ${b.id}, ${kind} at ${b.start}s): ${fr.map((x) => x.t).join(" ")}`);
      console.log(`  ${name}  ${kind.padEnd(10)} ${fr.map((x) => x.t).join(" ")}`);
    }
    fs.writeFileSync(path.join(C, "index.md"), index.join("\n") + "\n");
    ok(`cut sheets: ${C} (NN-NN.jpg, times in index.md)`);
  }
  console.log(`compare against the v3 golden frames:\n  ${path.join(SKILL, "references/golden/contact-sheet-1.jpg")}\n  ${path.join(SKILL, "references/golden/contact-sheet-2.jpg")}`);
}
