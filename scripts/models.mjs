// Local model files: where they live, how to check them, and what to tell the user when they are missing.
// The pipeline never downloads a model. Missing files -> print the official links and stop.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CFG, SKILL, HERE, home } from "./_common.mjs";

export const MODELS = JSON.parse(fs.readFileSync(path.join(HERE, "models.json"), "utf8"));
const abs = (p) => (path.isAbsolute(home(p)) ? home(p) : path.join(SKILL, p));
export const modelDir = (group) => abs(path.join(CFG.modelsDir, path.basename(MODELS[group].dir)));
export const modelFile = (group, name) => path.join(modelDir(group), name);
export const parakeetCache = () => home(CFG.asr.parakeetCache);

const readNorm = (f) => {
  const s = fs.readFileSync(f, "utf8").replace(/\r/g, "");
  return Buffer.from(s.endsWith("\n") ? s : s + "\n");
};
const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const shaFile = (f) => new Promise((res, rej) => {
  const h = crypto.createHash("sha256");
  fs.createReadStream(f).on("data", (c) => h.update(c)).on("end", () => res(h.digest("hex"))).on("error", rej);
});

// problems for one group: [{file, why}]. deep = also verify sha256 (slow: ~1 GB for Parakeet)
export async function checkGroup(group, { deep = false, dir = modelDir(group) } = {}) {
  const out = [];
  for (const f of MODELS[group].files) {
    const p = path.join(dir, f.name);
    if (!fs.existsSync(p)) { out.push({ file: f, why: "missing" }); continue; }
    if (f.text) {
      const b = readNorm(p);
      if (b.length !== f.bytes || sha(b) !== f.sha256) out.push({ file: f, why: "wrong file (content does not match the pinned release)" });
      continue;
    }
    const size = fs.statSync(p).size;
    if (size !== f.bytes) out.push({ file: f, why: size < f.bytes ? `incomplete download (${size} of ${f.bytes} bytes)` : `wrong file (${size} bytes, expected ${f.bytes})` });
    else if (deep && (await shaFile(p)) !== f.sha256) out.push({ file: f, why: "sha256 mismatch (corrupt or a different release)" });
  }
  return out;
}

export function explain(group, problems) {
  const m = MODELS[group], dir = modelDir(group);
  const lines = [`${m.name}: ${problems.length} file(s) need attention in`, `  ${dir}`, ""];
  for (const p of problems) lines.push(`  ✗ ${p.file.name}  (${p.why})`, `    download: ${p.file.url}`);
  lines.push("", `  Download the file(s) above (or browse ${m.page}) and put them in that folder,`,
    `  keeping the exact file names. Then run setup again:  node ${path.join(HERE, "setup.mjs")}`);
  return lines.join("\n");
}

// HyperFrames reads Parakeet from its own cache folder. Fill it from models/parakeet (hard link when possible,
// tokens.txt rewritten with LF). Returns a list of what was done; throws with an explanation if the source is incomplete.
export async function syncParakeet() {
  const cache = parakeetCache();
  if (!(await checkGroup("parakeet", { dir: cache })).length) return [];
  const bad = await checkGroup("parakeet");
  if (bad.length) throw new Error(explain("parakeet", bad));
  fs.mkdirSync(cache, { recursive: true });
  const done = [];
  for (const f of MODELS.parakeet.files) {
    const src = modelFile("parakeet", f.name), dst = path.join(cache, f.name);
    fs.rmSync(dst, { force: true });
    if (f.text) fs.writeFileSync(dst, readNorm(src));
    else { try { fs.linkSync(src, dst); } catch { fs.copyFileSync(src, dst); } }
    done.push(f.name);
  }
  return done;
}

// the sherpa-onnx runtime HyperFrames installs next to its cache (small npm package, separate from the model)
export function parakeetRuntime() {
  const opt = path.join(path.dirname(path.dirname(parakeetCache())), "optional");
  return fs.existsSync(opt) ? fs.readdirSync(opt).find((d) => d.startsWith("sherpa-onnx-node@")) || null : null;
}

// music bed: config music.file, else the first audio file in music/
export function musicFile() {
  if (CFG.music.file) return abs(CFG.music.file);
  const dir = abs(CFG.musicDir);
  const f = fs.existsSync(dir) && fs.readdirSync(dir).find((x) => /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(x));
  return f ? path.join(dir, f) : null;
}
