// Shared helpers for the repo-reel pipeline scripts. Every value that must match v3 lives in config.json.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SKILL = path.join(HERE, "..");
export const home = (p) => p.replace(/^~/, os.homedir());
// config.json = public defaults; config.local.json (gitignored, optional) = this machine's overrides, deep-merged
const merge = (a, b) => { for (const k in b) a[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) ? merge(a[k] || {}, b[k]) : b[k]; return a; };
const LOCAL = path.join(HERE, "config.local.json");
export const CFG = merge(JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8")),
  fs.existsSync(LOCAL) ? JSON.parse(fs.readFileSync(LOCAL, "utf8")) : {});
CFG.videosDir = path.resolve(home(CFG.videosDir));

export function fail(msg) { console.error(`\n✗ ${msg}`); process.exit(1); }
export function ok(msg) { console.log(`✓ ${msg}`); }
export function warn(msg) { console.log(`! ${msg}`); }

// project dir from argv (default: cwd); must look like a reel project
export function projectDir(arg) {
  const dir = path.resolve(arg || process.cwd());
  if (!fs.existsSync(path.join(dir, "script"))) fail(`${dir} is not a repo-reel project (no script/ folder). Run scaffold.mjs first.`);
  return dir;
}
export const rd = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
export const wr = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2) + "\n"); };
export const need = (f, hint) => { if (!fs.existsSync(f)) fail(`missing ${f}${hint ? ` (${hint})` : ""}`); return f; };
export const r2 = (n) => Math.round(n * 100) / 100;
export const r3 = (n) => Math.round(n * 1000) / 1000;

// run a command; inherit output unless capture
// shell is only used for npx (npx.cmd on Windows); args with spaces are quoted for it
export function run(cmd, args, { cwd, capture = false, allowFail = false, shell = false } = {}) {
  if (shell) args = args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a));
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", shell, stdio: capture ? "pipe" : "inherit", maxBuffer: 64 << 20 });
  if (r.error) fail(`${cmd}: ${r.error.message}`);
  if (r.status !== 0 && !allowFail) fail(`${cmd} ${args.join(" ")} exited ${r.status}\n${capture ? (r.stderr || r.stdout || "").slice(-2000) : ""}`);
  return r;
}
export const hf = (args, opts = {}) => run("npx", ["--yes", CFG.hyperframes, ...args], { ...opts, shell: true });

// media duration in seconds via ffprobe
export function duration(file) {
  const r = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { capture: true });
  return parseFloat(r.stdout.trim());
}

// integrated loudness (LUFS) via ffmpeg ebur128
export function lufs(file) {
  const r = run("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128", "-f", "null", "-"], { capture: true, allowFail: true });
  const m = (r.stderr || "").match(/Integrated loudness:\s*I:\s*(-?[\d.]+)/);
  return m ? parseFloat(m[1]) : NaN;
}

// words of the approved script, with their line id (hyphenated compounds stay one word)
export function scriptWords(lines) {
  const out = [];
  lines.forEach((l, li) => l.text.trim().split(/\s+/).forEach((w) => out.push({ text: w, line: l.id, li })));
  return out;
}
export const key = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, "");
