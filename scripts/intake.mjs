// Step 1b. Fetch everything the script can be based on: repo metadata, README, image list, releases.
// Usage: node intake.mjs <projectDir>
// Writes research/repo.json, research/README.md, research/images.json and a facts.md skeleton (never overwrites facts.md).
import fs from "node:fs";
import path from "node:path";
import { projectDir, rd, wr, run, ok, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const reel = rd(path.join(dir, "script/reel.json"));
const R = `repos/${reel.owner}/${reel.repo}`;
const gh = (p, raw) => {
  const r = run("gh", ["api", ...(raw ? ["-H", "Accept: application/vnd.github.raw"] : []), p], { capture: true, allowFail: true });
  return r.status === 0 ? r.stdout : null;
};
const meta = JSON.parse(gh(R) || "null");
if (!meta) fail(`gh api ${R} failed. Is the repo public and gh logged in?`);
const readme = gh(`${R}/readme`, true) || "";
const releases = JSON.parse(gh(`${R}/releases?per_page=5`) || "[]");
const languages = JSON.parse(gh(`${R}/languages`) || "{}");

// README images (markdown + <img>), resolved to absolute raw URLs
const raw = (src) => {
  if (/^https?:/i.test(src)) return src.replace(/github\.com\/([^/]+)\/([^/]+)\/blob\//, "raw.githubusercontent.com/$1/$2/");
  return `https://raw.githubusercontent.com/${reel.owner}/${reel.repo}/${meta.default_branch}/${src.replace(/^\.?\//, "")}`;
};
const images = [];
for (const mm of readme.matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?[^)]*\)/g)) images.push({ alt: mm[1], src: raw(mm[2]) });
for (const mm of readme.matchAll(/<img\b[^>]*>/gi)) {
  const src = mm[0].match(/src=["']([^"']+)/i), alt = mm[0].match(/alt=["']([^"']*)/i);
  if (src) images.push({ alt: alt ? alt[1] : "", src: raw(src[1]) });
}
const badge = /shields\.io|badge|badgen|img\.shields|githubusercontent\.com\/.*\/workflows/i;
const logo = /simpleicons\.org|skillicons\.dev|devicon/i;
const imgs = images.filter((x) => !badge.test(x.src) && !logo.test(x.src));
const stack = [...new Set(images.filter((x) => logo.test(x.src)).map((x) => x.src))];

const repo = {
  name: meta.name, full_name: meta.full_name, description: meta.description, homepage: meta.homepage || null,
  stars: meta.stargazers_count, forks: meta.forks_count, license: meta.license && meta.license.spdx_id,
  topics: meta.topics || [], language: meta.language, languages: Object.keys(languages),
  default_branch: meta.default_branch, created_at: meta.created_at, pushed_at: meta.pushed_at, archived: meta.archived,
  releases: releases.map((r) => ({ tag: r.tag_name, name: r.name, date: r.published_at, assets: (r.assets || []).map((a) => a.name) })),
};
wr(path.join(dir, "research/repo.json"), repo);
wr(path.join(dir, "research/images.json"), { screenshots: imgs, stackLogos: stack });
fs.writeFileSync(path.join(dir, "research/README.md"), readme);
reel.title = meta.name;
wr(path.join(dir, "script/reel.json"), reel);

const facts = path.join(dir, "research/facts.md");
if (!fs.existsSync(facts)) fs.writeFileSync(facts, `# Facts: ${meta.full_name}
Every line needs a source (README line / section, docs URL, or repo.json field). The script may only use these.

- What it is: ${meta.description || "?"}  (repo description)
- Licence: ${repo.license || "none listed"}  (repo.json)
- Platforms: ?
- Who it's for: ?
- How it works, step 1: ?
- How it works, step 2 (the smart part): ?
- One concrete number or example: ?
- Reliability / safety / edge case: ?
- Use cases (4-5, named): ?
- Trust points (local, no account, free...): ?
- Real UI screenshot candidates (from images.json / docs): ?
`);
ok(`${meta.full_name}: ★${repo.stars}, ${repo.license || "no licence"}, README ${readme.length} chars, ${imgs.length} image(s) + ${stack.length} stack logo(s), ${releases.length} release(s)`);
imgs.slice(0, 12).forEach((x) => console.log(`  img: ${x.alt || "(no alt)"} -> ${x.src}`));
