// Storyboard kit: frame pieces, pink annotation layer and the page layout for storyboard/storyboard.png (WORKFLOW.md step 5).
// Frames are drawn at real 1080x1920 reel coordinates with the project's own reel-lib, then scaled down on the page.
// Paths are relative to storyboard/storyboard.htm. (.htm, not .html: Studio lints every .html in the project as a composition.)
const L = require("../scripts/lib/reel-lib.cjs");
const { T, make, tube } = L;
const fs = require("fs"), path = require("path");

const PINK = "#FF5FA2";                 // notes only, never in the reel
const SHOTS = "../assets/shots/", LOGOS = "../assets/logos/";
const SC = 0.5;                          // frame thumbnail scale

// ---------- frame pieces (frame coordinates) ----------
const grid = () => {
  let g = "";
  for (let i = 0; i < 11; i++) { const x = 58 + 96.4 * i; g += `<line x1="${x}" y1="305" x2="${x}" y2="1305" stroke="${T.grid}" stroke-width="2"/>`; }
  return g + `<line x1="58" y1="800" x2="1022" y2="800" stroke="${T.grid}" stroke-width="2"/>`;
};
const caption = (words, active) =>
  `<div style="position:absolute;left:0;width:1080px;top:1420px;height:120px;display:flex;justify-content:center;align-items:center">` +
  `<div style="background:${T.hi};border:2.5px solid ${T.ink};padding:10px 22px;font-size:54px;font-weight:600;display:flex;gap:16px">` +
  words.split(" ").map((w) => w === active
    ? `<span style="background:${T.lime};color:${T.on};padding:0 10px;border:2.5px solid ${T.on}">${w}</span>`
    : `<span style="padding:0 2px">${w}</span>`).join("") + `</div></div>`;
// screen frame: a screenshot in a bare outline, no title bar (DESIGN.md 5.7); img fills the content width; o.h = fixed height, o.z = zoom inside the frame [scale, originX, originY], o.cover, o.inner)
const shotWin = (x, y, w, src, ar, o = {}) => {
  const iw = w - 5, ih = o.h ? o.h - 5 : Math.round(iw / ar);
  const z = o.z ? `transform:scale(${o.z[0]});transform-origin:${o.z[1]} ${o.z[2]};` : "";
  return `<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${ih + 5}px">` +
    `<div style="position:relative;width:${iw}px;height:${ih}px;overflow:hidden"><img src="${src}" style="position:absolute;left:0;top:0;width:${iw}px;${o.cover ? `height:${ih}px;object-fit:cover;object-position:top left;` : ""}${z}"></div>` +
    (o.inner || "") + `</div>`;
};
// bare screenshot with the 2.5px ink outline
const shot = (x, y, w, src, ar) => `<img src="${src}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w / ar)}px;outline:2.5px solid ${T.ink};outline-offset:-1.25px">`;
// drawn window: logo, placeholder lines (only those that fit), a lime progress bar
const agentWin = (x, y, w, h, title, logo, fill, o = {}) => {
  const lines = (o.lines || [0.8, 0.62, 0.7]).filter((f, i) => 70 + i * 34 + 16 < h - 62).map((f, i) => `<div class="win-ph" style="left:${o.logo === false ? 22 : 96}px;top:${70 + i * 34}px;width:${Math.round((w - (o.logo === false ? 48 : 122)) * f)}px;height:16px"></div>`).join("");
  return `<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">` +
    `<div class="win-bar"><i></i><i></i><i></i><span>${title}</span></div>` +
    (o.logo === false ? "" : `<img src="${LOGOS}${logo}.svg" style="position:absolute;left:22px;top:66px;width:56px;height:56px">`) + lines +
    (o.extra || "") +
    `<div class="pbar" style="left:22px;right:22px;bottom:22px;height:28px"><div class="pfill" style="width:${fill}%"></div></div></div>`;
};
const logoTile = (x, y, s, logo, pad = 0.18) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${T.hi};border:2.5px solid ${T.ink};box-sizing:border-box">` +
  `<img src="${LOGOS}${logo}.svg" style="position:absolute;left:${s * pad}px;top:${s * pad}px;width:${s * (1 - 2 * pad) - 5}px;height:${s * (1 - 2 * pad) - 5}px;object-fit:contain"></div>`;
const hl = (x, y, w, h) => L.hlBox("h" + x + y, x, y, w, h);
// kinetic label; "/" splits lines; a = "start" | "middle" | "end"
const klab = (x, y, s, a = "start") => `<div style="position:absolute;top:${y - 29}px;${a === "middle" ? `left:${x - 400}px;width:800px;text-align:center` : a === "end" ? `right:${1080 - x}px;text-align:right` : `left:${x}px`};font-size:30px;font-weight:400;letter-spacing:0.04em;line-height:36px">${s.split("/").join("<br>")}</div>`;
const shift = (dy, h) => `<div style="position:absolute;left:0;top:${dy}px;width:1080px;height:1920px">${h}</div>`;
const svg = (inner) => `<svg class="art" viewBox="0 0 1080 1920">${inner}</svg>`;
const ltube = (d) => tube(d, { fill: T.lime, w: 10 });
const ntube = (d) => tube(d, { w: 12 });
// a lime data pulse on path d, from fraction a to b
const lpulse = (d, a, b) => `<path d="${d}" pathLength="1" stroke-dasharray="${b - a} 2" stroke-dashoffset="${-a}" fill="none" stroke="${T.on}" stroke-width="10"/><path d="${d}" pathLength="1" stroke-dasharray="${b - a} 2" stroke-dashoffset="${-a}" fill="none" stroke="${T.lime}" stroke-width="6"/>`;
const cubeAt = (x, y, s = 26) => `<g transform="translate(${x} ${y + s / 2})">${make(0, 0).box(-s / 2, -s / 2, 0, s, s, s, { top: T.lime, left: T.limeL, right: T.limeR, sw: 2 })}</g>`;

// ---------- annotation layer: numbered pink markers, dashed motion arrows, dashed zoom boxes ----------
const mk = (x, y, n) => `<g><circle cx="${x}" cy="${y}" r="30" fill="${PINK}"/><text x="${x}" y="${y + 12}" font-family="Inter" font-size="36" font-weight="700" fill="#0E0F11" text-anchor="middle">${n}</text></g>`;
const marr = (d) => `<path d="${d}" fill="none" stroke="${PINK}" stroke-width="6" stroke-dasharray="18 12" stroke-linecap="round" marker-end="url(#ah)"/>`;
const zoomRect = (x, y, w, h, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${PINK}" stroke-width="5" stroke-dasharray="14 10"/>` +
  (t ? `<text x="${x + 8}" y="${y - 14}" font-family="Inter" font-size="30" font-weight="700" fill="${PINK}">${t}</text>` : "");
const ann = (inner) => `<svg class="art" viewBox="0 0 1080 1920" style="z-index:5"><defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${PINK}"/></marker></defs>${inner}</svg>`;

// ---------- page ----------
// key frame f = { k: "A", t: "2.8", cap: "caption words", act: "lit word", body: html, ann: svg }
const frame = (f) => `<div class="fr"><div class="fi"><div class="sc">${svg(grid())}${f.body}${caption(f.cap, f.act)}${f.ann ? ann(f.ann) : ""}</div></div>` +
  `<div class="ft"><b>${f.k}</b> @ ${f.t}s &nbsp;·&nbsp; “${f.act}”</div></div>`;
// scene s = { n, name, t, vo, a, b, steps: [html], out, assets, strip?: [[shot path under assets/shots/, label]] }
const card = (s) => `<section class="card">
  <div class="head"><span class="num">${s.n}</span><span class="nm">${s.name}</span><span class="tm">${s.t} s</span></div>
  <div class="body">
    <div class="frames">${frame(s.a)}${frame(s.b)}</div>
    <div class="notes">
      <div class="vo">“${s.vo}”</div>
      <ol>${s.steps.map((x) => `<li>${x}</li>`).join("")}</ol>
      ${s.strip ? `<div class="strip">${s.strip.map(([f, label]) => `<div><img src="${SHOTS}${f}"><span>${label}</span></div>`).join('<em>→</em>')}</div>` : ""}
      <div class="out"><b>TRANSITION OUT</b> ${s.out}</div>
      <div class="as"><b>ASSETS</b> ${s.assets}</div>
    </div>
  </div>
</section>`;

const LEGEND = `<span class="pinkleg">Pink markers / dashed arrows / dashed boxes = notes only</span>, never in the video. Numbers match the steps.<br>
      <span style="color:${T.lime}">Lime words</span> = the cue word each move lands on (word time in s).<br>
      Camera: 1 → 1.03 push settled in 1.1 s unless noted. Motion blur only on moving things. No bounce, no spins.`;

// p = { name, meta, chainTitle, chain: [[scene no, "what carries the cut"]], news: [[primitive, "what it is (scene)"]], legend?, scenes }
const page = (p) => {
  const css = L.CSS.split("assets/fonts/").join("../assets/fonts/");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  html, body { overflow-x:hidden; } * { box-sizing:border-box; } .sc *, .sc { box-sizing:content-box; } .win, .plate { box-sizing:border-box; } body { margin:0; background:#060707; color:${T.ink}; font-family:Inter, sans-serif; width:2640px; }
  .page { padding:60px 60px 40px; }
  h1 { font-size:64px; font-weight:700; margin:0 0 6px; letter-spacing:-0.01em; }
  h1 span { color:${T.lime}; }
  .meta { font-size:26px; color:#A9AAA6; margin-bottom:22px; }
  .hdr { display:grid; grid-template-columns: 1.3fr 1fr 0.7fr; gap:28px; margin-bottom:40px; }
  .box { border:2px solid ${T.rule}; background:${T.paper}; padding:20px 24px; font-size:22px; line-height:1.5; }
  .box h3 { margin:0 0 10px; font-size:20px; letter-spacing:0.08em; color:${T.lime}; }
  .chain { display:flex; flex-wrap:wrap; gap:8px 6px; align-items:center; }
  .chain .s { border:2px solid ${T.ink}; padding:2px 10px; font-weight:600; }
  .chain .t { color:#A9AAA6; font-size:19px; }
  .grid { display:grid; grid-template-columns:minmax(0,1fr); gap:36px; }
  .card { min-width:0; border:2px solid ${T.rule}; background:${T.paper}; }
  .head { display:flex; align-items:baseline; gap:18px; padding:16px 22px; border-bottom:2px solid ${T.rule}; }
  .num { background:${T.lime}; color:${T.on}; font-weight:700; font-size:28px; padding:0 10px; }
  .nm { font-size:30px; font-weight:700; letter-spacing:0.04em; }
  .tm { margin-left:auto; font-size:24px; color:#A9AAA6; font-variant-numeric:tabular-nums; }
  .body { display:flex; gap:24px; padding:22px; }
  .frames { display:flex; gap:16px; flex:none; }
  .fr { width:${1080 * SC}px; }
  .fi { position:relative; width:${1080 * SC}px; height:${1920 * SC}px; overflow:hidden; outline:2px solid ${T.rule}; }
  .sc { position:absolute; left:0; top:0; width:1080px; height:1920px; transform:scale(${SC}); transform-origin:0 0; background:${T.paper}; overflow:hidden; color:${T.ink}; }
  .ft { font-size:24px; margin-top:8px; color:#A9AAA6; }
  .ft b { color:${T.ink}; }
  .notes { flex:1; font-size:25px; columns:2; column-gap:44px; line-height:1.45; min-width:0; }
  .vo { break-inside:avoid; font-size:28px; font-style:italic; color:${T.ink}; border-left:5px solid ${T.lime}; padding-left:14px; margin-bottom:12px; }
  ol { margin:0 0 12px; padding-left:0; list-style:none; counter-reset:n; }
  li { break-inside:avoid; counter-increment:n; position:relative; padding-left:42px; margin-bottom:8px; color:#D6D5D0; }
  li::before { content:counter(n); position:absolute; left:0; top:2px; width:30px; height:30px; border-radius:50%; background:${PINK}; color:#0E0F11; font-weight:700; font-size:18px; text-align:center; line-height:30px; }
  li i { color:${T.lime}; font-style:normal; }
  li b { color:${T.lime}; }
  code { font-size:22px; background:${T.g500}; padding:0 5px; }
  .out, .as { break-inside:avoid; font-size:23px; color:#BDBCB7; margin-top:6px; }
  .out b, .as b { color:${T.ink}; letter-spacing:0.06em; margin-right:8px; font-size:16px; }
  .out { border-top:2px solid ${T.rule}; padding-top:10px; }
  .strip { break-inside:avoid; display:flex; align-items:center; gap:8px; margin:6px 0 10px; }
  .strip div { display:flex; flex-direction:column; align-items:center; font-size:16px; color:#A9AAA6; }
  .strip img { height:72px; outline:2px solid ${T.ink}; }
  .strip em { color:${PINK}; font-style:normal; font-size:26px; }
  .pinkleg { color:${PINK}; font-weight:700; }
</style></head><body><div class="page">
  <h1>${p.name} <span>/</span> STORYBOARD</h1>
  <div class="meta">${p.meta}</div>
  <div class="hdr">
    <div class="box"><h3>${p.chainTitle || "TRANSITION CHAIN"}</h3><div class="chain">
      ${p.chain.map(([n, t]) => `<span class="s">${n}</span><span class="t">${t}</span>`).join("")}</div></div>
    <div class="box"><h3>NEW IN THIS REEL</h3>
      ${p.news.map(([k, v]) => `<b>${k}</b>: ${v}`).join("<br>\n      ")}</div>
    <div class="box"><h3>LEGEND</h3>
      ${p.legend || LEGEND}</div>
  </div>
  <div class="grid">${p.scenes.map(card).join("")}</div>
</div></body></html>`;
};
const write = (dir, p) => {
  fs.writeFileSync(path.join(dir, "storyboard.htm"), page(p));
  console.log("storyboard.htm written,", p.scenes.length, "scenes");
};

module.exports = {
  L, PINK, SHOTS, LOGOS, SC,
  grid, caption, shotWin, shot, agentWin, logoTile, hl, klab, shift, svg, ltube, ntube, lpulse, cubeAt,
  mk, marr, zoomRect, ann, frame, card, page, write,
};
