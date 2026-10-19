// Step 1a. Create a new reel project from the v3 kit.
// Usage: node scaffold.mjs <github-url> [--slug name]
// Makes videos/<slug>/ with the kit, the music bed, meta/package/title and script/reel.json. Refuses to overwrite.
import fs from "node:fs";
import path from "node:path";
import { CFG, SKILL, fail, ok, wr } from "./_common.mjs";
import { musicFile } from "./models.mjs";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
if (!url) fail("usage: node scaffold.mjs <github-url> [--slug name]");
const m = url.match(/github\.com[/:]([^/\s]+)\/([^/\s#?]+)/i) || url.match(/^([\w.-]+)\/([\w.-]+)$/);
if (!m) fail(`not a GitHub repo link: ${url}`);
const owner = m[1], repo = m[2].replace(/\.git$/, "");
const si = args.indexOf("--slug");
const slug = (si >= 0 ? args[si + 1] : repo).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const dir = path.join(CFG.videosDir, slug);
if (fs.existsSync(dir)) fail(`${dir} already exists. Pick another --slug or remove it yourself.`);
const music = musicFile();
if (!music || !fs.existsSync(music)) fail(`no music bed. Put one track (mp3/wav/m4a, ideally 40-60 s, licensed for social use) in
  ${path.join(SKILL, CFG.musicDir)}
or set music.file in scripts/config.local.json. Then run setup.mjs.`);

fs.cpSync(path.join(SKILL, "kit"), dir, { recursive: true, filter: (src) => !src.includes(`${path.sep}examples`) });
fs.copyFileSync(music, path.join(dir, path.basename(music)));
for (const d of ["assets/audio", "assets/shots", "compositions/scenes", "research", "script", "storyboard", "snaps", "renders"])
  fs.mkdirSync(path.join(dir, d), { recursive: true });

const pin = CFG.hyperframes;
wr(path.join(dir, "meta.json"), { id: `${slug}-reel`, name: `${slug}-reel` });
wr(path.join(dir, "package.json"), {
  name: `${slug}-reel`, private: true, type: "module",
  scripts: { dev: `npx --yes ${pin} preview`, check: `npx --yes ${pin} check`, render: `npx --yes ${pin} render`, publish: `npx --yes ${pin} publish` },
});
wr(path.join(dir, "script/reel.json"), {
  owner, repo, slug, title: repo,
  repoUrl: `https://github.com/${owner}/${repo}`,
  url: `github.com/${owner}/${repo}`,
  music: path.basename(music),
  cta: { trust: [] },
});
ok(`project created: ${dir}`);
console.log(`next: node "${path.join(SKILL, "scripts/intake.mjs")}" "${dir}"`);
