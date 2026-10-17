// Step 10. Build scenes, run the strict check, and snapshot every scene for side-by-side review with v3.
// Usage: node verify.mjs <projectDir> [--no-snap]
// Fails on any check error or warning. Snapshots go to snaps/review/ (scene midpoints + one CTA end frame).
import path from "node:path";
import { SKILL, projectDir, need, rd, run, hf, r2, ok, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const T = rd(need(path.join(dir, "script/timing.json"), "run audio.mjs first"));
need(path.join(dir, "index.html"), "run assemble.mjs first");
delete process.env.GEMINI_API_KEY; // snapshot would send frames to Gemini; everything stays local

console.log("── build scenes");
run("node", [path.join(dir, "scripts/build-scenes.cjs")], { cwd: dir });

console.log("\n── hyperframes check --strict");
const c = hf(["check", "--strict"], { cwd: dir, allowFail: true });
if (c.status !== 0) fail("check failed. Fix every error and warning, then run verify again.");
ok("check clean");

if (!process.argv.includes("--no-snap")) {
  const at = T.scenes.map((s) => r2(s.start + s.dur / 2));
  at.push(r2(T.total - 0.4));
  console.log(`\n── snapshots at ${at.join(", ")}`);
  hf(["snapshot", "--at", at.join(","), "--no-end", "-o", "snaps/review"], { cwd: dir });
  ok(`snapshots: ${path.join(dir, "snaps/review")}`);
  console.log(`compare against the v3 golden frames:\n  ${path.join(SKILL, "references/golden/contact-sheet-1.jpg")}\n  ${path.join(SKILL, "references/golden/contact-sheet-2.jpg")}`);
}
