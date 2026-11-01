// Step 4.1 in one command: every GitHub capture the reel can need, in headless Chrome (dark, DPR 2), no MCP calls.
// Usage: node capture.mjs <projectDir> [--only header,readme,tall,card,images] [--blur W:H:X:Y] [--tall 1700]
//   header  assets/shots/repo-header.png         2560 x 1300: repo name, About, stars (the CTA's repo window)
//   readme  renders/<slug>-readme-9x16.png       1080 x 1920: the README top, to post alongside the reel
//   tall    assets/shots/readme-tall.png         1080 x (2 x --tall, default 3400): the full-bleed README scroll
//   card    assets/shots/repo-card-blur.png      GitHub's social card for this repo, its name blurred (the hook)
//   images  assets/shots/_src-<name>.<ext>       every README screenshot from research/images.json (badges, charts
//                                                and avatar walls skipped) + research/_peek-images.jpg, a labelled sheet
// It prints what each shot shows (the README headings inside the tall shot and where they sit) so you can plan the
// scroll without opening it. Still read the PNGs you use (WORKFLOW 4.1). The product site (4.2) and logos (4.3) stay
// judgement work with the Chrome DevTools MCP; peek.mjs puts a grid on any shot for measuring regions.
import fs from "node:fs";
import path from "node:path";
import { projectDir, need, rd, run, ok, warn, fail } from "./_common.mjs";
import { browser } from "./_cdp.mjs";
import { sheet, size } from "./peek.mjs";

const a = process.argv, opt = (k) => { const i = a.indexOf(k); return i > 0 ? a[i + 1] : null; };
const dir = projectDir(a[2]);
const reel = rd(need(path.join(dir, "script/reel.json"), "run scaffold.mjs first"));
const ALL = ["header", "readme", "tall", "card", "images"];
const only = opt("--only") ? opt("--only").split(",").map((s) => s.trim()) : ALL;
const bad = only.filter((s) => !ALL.includes(s));
if (bad.length) fail(`--only: unknown ${bad.join(", ")} (one of ${ALL.join(", ")})`);
const SH = path.join(dir, "assets/shots"), repoUrl = reel.repoUrl || `https://github.com/${reel.owner}/${reel.repo}`;
fs.mkdirSync(SH, { recursive: true });

// GitHub page clean-up: no site header, no scrollbar, no banners, sticky/fixed elements static
const CLEAN = `() => {
  document.querySelectorAll('header.AppHeader, .js-header-wrapper, header[role=banner], .cookie-consent-banner, #cookie-consent-banner, .js-notice').forEach((e) => (e.style.display = 'none'));
  const s = document.createElement('style'); s.textContent = 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}'; document.head.appendChild(s);
  document.querySelectorAll('*').forEach((e) => { const p = getComputedStyle(e).position; if (p === 'sticky' || p === 'fixed') e.style.position = 'static'; });
}`;
// scroll so the README box (its tab bar) sits at the top edge; report the headings in view
const TO_README = `async () => {
  let box = [...document.querySelectorAll('a,span,h2')].find((e) => e.textContent.trim() === 'README' && e.getBoundingClientRect().height > 0);
  for (let i = 0; i < 8 && box && box.getBoundingClientRect().width <= 500; i++) box = box.parentElement;
  if (!box) return { found: false };
  window.scrollTo(0, box.getBoundingClientRect().top + window.scrollY);
  await new Promise((r) => setTimeout(r, 900));
  const H = innerHeight, hs = [...document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3')]
    .map((e) => [e.textContent.trim().slice(0, 50), Math.round(e.getBoundingClientRect().top)]).filter(([, y]) => y >= 0 && y < H);
  return { found: true, headings: hs };
}`;

const b = await browser();
const done = [];
try {
  if (only.includes("header")) {
    await b.emulate({ w: 1280, h: 1400, dpr: 2 });
    await b.goto(repoUrl, 2000);
    await b.eval(CLEAN); await b.eval(`async () => { window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 700)); }`);
    const f = await b.shot(path.join(SH, "repo-header.png"), { clip: { x: 0, y: 0, width: 1280, height: 650 } });
    done.push(["repo-header.png", size(f).join("x"), "repo name, About, stars, file list top (CTA; cta.shotH 1300)"]);
  }
  for (const [k, h, out, what] of [
    ["readme", 960, path.join(dir, "renders", `${reel.slug}-readme-9x16.png`), "README top, 9:16, to post with the reel"],
    ["tall", +opt("--tall") || 1700, path.join(SH, "readme-tall.png"), "tall README for the full-bleed slow scroll"],
  ]) {
    if (!only.includes(k)) continue;
    await b.emulate({ w: 540, h, dpr: 2 });
    await b.goto(`${repoUrl}#readme`, 2000);
    await b.eval(CLEAN);
    const r = await b.eval(TO_README);
    if (!r.found) warn(`${k}: no README tab found; the shot starts at the page top`);
    const f = await b.shot(out);
    const hs = (r.headings || []).map(([t, y]) => `"${t}" @${y * 2}`).join(", ");
    done.push([path.relative(dir, f), size(f).join("x"), `${what}${hs ? `; headings at shot px: ${hs}` : ""}`]);
  }
} finally { await b.close(); }

if (only.includes("card")) {
  // GitHub's own social card for this repo (1200 x 600), the repo name blurred so the hook keeps it a mystery
  const res = await fetch(`https://opengraph.githubassets.com/1/${reel.owner}/${reel.repo}`);
  if (!res.ok) fail(`social card: HTTP ${res.status}`);
  const tmpd = fs.mkdtempSync(path.join(dir, "research", "_og-")), og = path.join(tmpd, "og.png");
  fs.writeFileSync(og, Buffer.from(await res.arrayBuffer()));
  const [bw, bh, bx, by] = (opt("--blur") || "840:230:40:60").split(":").map(Number);
  run("ffmpeg", ["-v", "error", "-y", "-i", og, "-filter_complex", `[0]crop=${bw}:${bh}:${bx}:${by},gblur=sigma=16:steps=3[b];[0][b]overlay=${bx}:${by}`, path.join(SH, "repo-card-blur.png")]);
  fs.rmSync(tmpd, { recursive: true, force: true });
  done.push(["assets/shots/repo-card-blur.png", "1200x600", `social card, name blurred in ${bw}:${bh}:${bx}:${by} (read it: name fully blurred, description sharp; else --blur)`]);
}

if (only.includes("images")) {
  const J = rd(need(path.join(dir, "research/images.json"), "run intake.mjs first"));
  const skip = /contrib\.rocks|star-history|shields\.io|badge|api\.githubstar|repobeats|komarev|visitor/i;
  const used = new Set(), items = [];
  for (const im of J.screenshots || []) {
    const src = im.src || im.url;
    if (!src || skip.test(src)) continue;
    const u = new URL(src), parts = u.pathname.split("/").filter(Boolean);
    let base = decodeURIComponent(parts[parts.length - 1] || "image").replace(/[^\w.-]/g, "_");
    if (!/\.(png|jpe?g|gif|webp|svg)$/i.test(base)) base += ".png";
    const stem = base.replace(/\.[^.]+$/, "");
    if (/^(screenshot|image|demo|preview|img|shot)\d*$/i.test(stem) || used.has(base)) base = `${parts[parts.length - 2] || "x"}-${base}`;
    used.add(base);
    const res = await fetch(src);
    if (!res.ok) { warn(`${base}: HTTP ${res.status} (${src})`); continue; }
    const f = path.join(SH, `_src-${base}`);
    fs.writeFileSync(f, Buffer.from(await res.arrayBuffer()));
    if (/\.svg$/i.test(f)) { done.push([path.relative(dir, f), "svg", im.alt || ""]); continue; }
    items.push({ file: f, label: `_src-${base}` });
    done.push([path.relative(dir, f), size(f).join("x"), (im.alt || "").slice(0, 90)]);
  }
  if (items.length) {
    const out = await sheet(items, path.join(dir, "research/_peek-images.jpg"));
    done.push([path.relative(dir, out), "", "all README images on one labelled sheet (read this one, then only the shots you use)"]);
  }
}

console.log("\n| file | px | what |\n|---|---|---|");
for (const [f, s, w] of done) console.log(`| ${f.replace(/\\/g, "/")} | ${s} | ${w} |`);
ok(`captured ${only.join(", ")}`);
