// First-run check (and safe to run any time). Verifies tools, Python packages, model files and the music bed.
// Usage: node setup.mjs [--quick] [--install-runtime]
//   --quick            size checks only (skip sha256 of ~1 GB of models)
//   --install-runtime  run `hyperframes models install parakeet` to fetch the small sherpa-onnx runtime
//                      (only after the model files are verified, so it never re-downloads the model)
// Never downloads a model. Missing model files -> prints the official links and where to put them.
import fs from "node:fs";
import path from "node:path";
import { CFG, SKILL, HERE, run, hf, duration, lufs, r2 } from "./_common.mjs";
import { MODELS, modelDir, checkGroup, explain, syncParakeet, parakeetRuntime, parakeetCache, musicFile } from "./models.mjs";

const deep = !process.argv.includes("--quick");
const todo = [];
const pass = (m) => console.log(`  ✓ ${m}`);
const bad = (m, fix) => { console.log(`  ✗ ${m}`); todo.push(fix || m); };
const warn = (m) => console.log(`  ⚠ ${m}`);
const has = (cmd, args = ["--version"]) => {
  const r = run(cmd, args, { capture: true, allowFail: true, shell: process.platform === "win32" && cmd === "npx" });
  return r.status === 0 ? (r.stdout || r.stderr).trim().split("\n")[0] : null;
};

for (const g of Object.keys(MODELS)) fs.mkdirSync(modelDir(g), { recursive: true });

console.log("\nTools");
const nodeMajor = +process.versions.node.split(".")[0];
nodeMajor >= 18 ? pass(`node ${process.versions.node}`) : bad(`node ${process.versions.node} is too old`, "install Node.js 18 or newer: https://nodejs.org");
for (const t of ["ffmpeg", "ffprobe"]) {
  const v = has(t, ["-version"]);
  v ? pass(v.slice(0, 40)) : bad(`${t} not on PATH`, `install ffmpeg (includes ffprobe) and put it on PATH: https://ffmpeg.org/download.html`);
}
const gh = has("gh");
if (!gh) bad("gh (GitHub CLI) not found", "install GitHub CLI: https://cli.github.com  then run: gh auth login");
else if (run("gh", ["auth", "status"], { capture: true, allowFail: true }).status !== 0) bad("gh is installed but not logged in", "run: gh auth login");
else pass(gh);
const hfv = has("npx", ["--yes", CFG.hyperframes, "--version"]);
hfv ? pass(`${CFG.hyperframes} (${hfv})`) : bad(`${CFG.hyperframes} did not run`, `check npm/network, then: npx --yes ${CFG.hyperframes} --version`);

console.log("\nPython");
const py = has(CFG.python);
if (!py) bad(`"${CFG.python}" not found`, `install Python 3.10+ (https://python.org) or set "python" in ${path.join(HERE, "config.local.json")}`);
else {
  pass(`${py} (${CFG.python})`);
  const r = run(CFG.python, ["-c", "import kokoro_onnx, soundfile, numpy, importlib.metadata as m; print(m.version('kokoro-onnx'))"], { capture: true, allowFail: true });
  r.status === 0 ? pass(`kokoro-onnx ${r.stdout.trim()}, soundfile, numpy`)
    : bad("Python packages missing", `${CFG.python} -m pip install kokoro-onnx==0.6.1 soundfile numpy`);
}

console.log(`\nModels${deep ? " (size + sha256)" : " (size only)"}`);
const kok = await checkGroup("kokoro", { deep });
kok.length ? bad(`Kokoro: ${kok.length} file(s) missing or wrong`, explain("kokoro", kok)) : pass(`Kokoro in ${modelDir("kokoro")}`);

const cacheOk = !(await checkGroup("parakeet", { dir: parakeetCache(), deep })).length;
const par = await checkGroup("parakeet", { deep });
if (!par.length) {
  pass(`Parakeet in ${modelDir("parakeet")}`);
  const linked = await syncParakeet();
  if (linked.length) pass(`copied Parakeet into the HyperFrames cache (${parakeetCache()})`);
} else if (cacheOk) {
  pass(`Parakeet already in the HyperFrames cache (${parakeetCache()})`);
  warn(`models/parakeet is empty or incomplete; fine on this machine, but keep a copy there so the cache can be rebuilt`);
} else bad(`Parakeet: ${par.length} file(s) missing or wrong`, explain("parakeet", par));

const rt = parakeetRuntime();
if (rt) pass(`Parakeet runtime ${rt}`);
else if (process.argv.includes("--install-runtime") && (cacheOk || !par.length)) {
  hf(["models", "install", "parakeet"], { allowFail: true });
  parakeetRuntime() ? pass(`Parakeet runtime ${parakeetRuntime()}`) : bad("runtime install failed", `npx --yes ${CFG.hyperframes} models install parakeet`);
} else bad("Parakeet runtime (sherpa-onnx, small npm package) not installed",
  `after the Parakeet model files are in place, run: node ${path.join(HERE, "setup.mjs")} --install-runtime`);

console.log("\nMusic bed");
const mf = musicFile();
if (!mf || !fs.existsSync(mf)) bad("no music track", `put one background track (mp3/wav/m4a, 40-60 s, licensed for social media) in ${path.join(SKILL, CFG.musicDir)}\n  or set music.file in ${path.join(HERE, "config.local.json")}`);
else {
  const len = r2(duration(mf)), L = lufs(mf);
  const vol = Math.round(CFG.music.refVolume * 10 ** ((CFG.music.refLufs - L) / 20) * 1e6) / 1e6;
  pass(`${path.basename(mf)}: ${len}s, ${L} LUFS -> volume ${vol}`);
  if (len < 25) warn("track is short; reels over its length restart it once, so aim for 40 s or more");
}

console.log("\nOutput");
fs.mkdirSync(CFG.videosDir, { recursive: true });
pass(`reels go to ${CFG.videosDir}`);
console.log("  · screenshots need the Chrome DevTools MCP server in your agent (checked by the agent, not here)");

console.log("\nKit");
const api = run("node", [path.join(HERE, "api.mjs"), "--check"], { capture: true, allowFail: true });
api.status === 0 ? pass("kit/API.md matches the kit lib")
  : bad("kit/API.md is out of date with kit/scripts/lib/reel-lib.cjs", `run: node ${path.join(HERE, "api.mjs")}`);

if (todo.length) {
  console.log(`\n${todo.length} thing(s) to fix:\n`);
  todo.forEach((t, i) => console.log(`${i + 1}. ${t}\n`));
  process.exit(1);
}
console.log("\n✓ ready: everything runs locally");
