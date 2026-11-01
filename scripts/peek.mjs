// Look at an image with a coordinate grid, so regions are read off it in one look instead of cropping by eye.
// Usage: node peek.mjs <image> [--grid 100] [--crop x,y,w,h] [--w 1400] [--out file.jpg]
// Draws pink rules every --grid px of the SOURCE image (labels on the top and left edges are source px; every 5th rule
// is heavier), over the whole image or a --crop of it, scaled to --w px wide. Read the JPG, then use the numbers
// directly: crop.mjs specs, L.regionOf() rects for hlTrim boxes and zooms, region tiles. Output goes to
// <project>/research/_peek-<name>.jpg when the image is inside a reel project (WORKFLOW 4.4 deletes research/_peek*),
// else next to the image. Pink never appears in the reel; this is a research artifact.
// Also exports sheet(items, out) (a labelled contact sheet; capture.mjs uses it for the README images).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { run, fail, ok } from "./_common.mjs";
import { browser } from "./_cdp.mjs";

const PINK = "#FF5FA2";
export function size(file) {
  const r = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file], { capture: true });
  const [w, h] = r.stdout.trim().split(",").map(Number);
  return [w, h];
}
const url = (f) => pathToFileURL(path.resolve(f)).href;
async function render(html, w, h, out) {
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "reel-peek-")), "p.html");
  fs.writeFileSync(tmp, html);
  const b = await browser();
  try {
    await b.emulate({ w: Math.ceil(w), h: Math.ceil(h), dpr: 1 });
    await b.goto(url(tmp), 400);
    await b.eval(`async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => 0))); }`);
    await b.shot(out, { format: "jpeg", quality: 82 });
  } finally { await b.close(); fs.rmSync(path.dirname(tmp), { recursive: true, force: true }); }
  return out;
}
const CSS = `body{margin:0;background:#111214;font:12px/1.2 Inter,Segoe UI,Arial,sans-serif;color:#ECEBE6}`;

// one image with a grid in source px
export async function peek(file, o = {}) {
  const [iw, ih] = size(file), g = o.grid || 100;
  const [sx, sy, sw, sh] = o.crop || [0, 0, iw, ih];
  if (sx < 0 || sy < 0 || sx + sw > iw || sy + sh > ih) fail(`--crop ${[sx, sy, sw, sh]} is outside the ${iw}x${ih} image`);
  const W = Math.min(o.w || 1400, Math.max(sw, 400)), k = W / sw, H = Math.round(sh * k), ML = 52, MT = 24;
  let rules = "";
  for (let x = Math.ceil(sx / g) * g; x <= sx + sw; x += g) {
    const X = ML + (x - sx) * k, heavy = (x / g) % 5 === 0;
    rules += `<line x1="${X}" y1="${MT}" x2="${X}" y2="${MT + H}" stroke="${PINK}" stroke-width="${heavy ? 1.6 : 0.8}" opacity="${heavy ? 0.95 : 0.6}"/>` +
      `<text x="${X + 2}" y="${MT - 7}" fill="${PINK}" font-size="11">${x}</text>`;
  }
  for (let y = Math.ceil(sy / g) * g; y <= sy + sh; y += g) {
    const Y = MT + (y - sy) * k, heavy = (y / g) % 5 === 0;
    rules += `<line x1="${ML}" y1="${Y}" x2="${ML + W}" y2="${Y}" stroke="${PINK}" stroke-width="${heavy ? 1.6 : 0.8}" opacity="${heavy ? 0.95 : 0.6}"/>` +
      `<text x="${ML - 4}" y="${Y + 4}" fill="${PINK}" font-size="11" text-anchor="end">${y}</text>`;
  }
  const html = `<!doctype html><style>${CSS}</style><div style="position:relative;width:${ML + W}px;height:${MT + H}px">` +
    `<div style="position:absolute;left:${ML}px;top:${MT}px;width:${W}px;height:${H}px;overflow:hidden">` +
    `<img src="${url(file)}" style="position:absolute;left:${-sx * k}px;top:${-sy * k}px;width:${iw * k}px;height:${ih * k}px"></div>` +
    `<svg width="${ML + W}" height="${MT + H}" style="position:absolute;left:0;top:0">${rules}</svg></div>`;
  return render(html, ML + W, MT + H, o.out || outFor(file));
}
// a labelled contact sheet: items = [{ file, label }], cols thumbnails tw px wide
export async function sheet(items, out, { cols = 3, tw = 420 } = {}) {
  const cells = items.map((it) => {
    const [w, h] = size(it.file), th = Math.round((tw * h) / w);
    return { ...it, w, h, th };
  });
  const rows = [];
  for (let i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));
  const LH = 34;
  const H = rows.reduce((a, r) => a + Math.max(...r.map((c) => c.th)) + LH + 12, 12);
  const html = `<!doctype html><style>${CSS}.c{display:inline-block;vertical-align:top;width:${tw}px;margin:6px}` +
    `.c img{width:${tw}px;display:block;outline:1px solid #34363B}.c div{height:${LH}px;overflow:hidden;padding-top:3px}</style><div style="padding:6px">` +
    rows.map((r) => `<div>${r.map((c) => `<span class="c"><img src="${url(c.file)}"><div>${c.label} · ${c.w}x${c.h}</div></span>`).join("")}</div>`).join("") + `</div>`;
  return render(html, cols * (tw + 12) + 12, H, out);
}
export function outFor(file) {
  let d = path.dirname(path.resolve(file));
  for (let i = 0; i < 6; i++) { if (fs.existsSync(path.join(d, "script")) && fs.existsSync(path.join(d, "research"))) break; d = path.dirname(d); }
  const name = `_peek-${path.basename(file).replace(/\.[^.]+$/, "")}.jpg`;
  return fs.existsSync(path.join(d, "research")) ? path.join(d, "research", name) : path.join(path.dirname(path.resolve(file)), name);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const a = process.argv, opt = (k) => { const i = a.indexOf(k); return i > 0 ? a[i + 1] : null; };
  const file = a[2];
  if (!file || !fs.existsSync(file)) fail("usage: node peek.mjs <image> [--grid 100] [--crop x,y,w,h] [--w 1400] [--out file.jpg]");
  const crop = opt("--crop") ? opt("--crop").split(",").map(Number) : null;
  const out = await peek(file, { grid: +opt("--grid") || 100, crop, w: +opt("--w") || 1400, out: opt("--out") });
  const [w, h] = size(file);
  ok(`${out}  (${path.basename(file)} ${w}x${h}${crop ? `, crop ${crop.join(",")}` : ""}; grid labels are source px)`);
}
