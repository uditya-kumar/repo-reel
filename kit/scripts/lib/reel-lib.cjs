// repo-reel scene library: every object, helper and the scene shell from the v3 MultiPath reel, plus the v4 motion
// layer (HarnessRouter reel: custom eases, match-cut handoffs, morph frames, kinetic type, trims, pulses, motion blur)
// and crafted objects drawn with the Anatomy geometry kit (selector, board; see anat.cjs).
// Scene files in scripts/scenes/ receive this as `L`. Geometry uses assets/js/iso.js; colours come only from T.
const fs = require("fs");
const path = require("path");
global.window = global.window || {};
eval(fs.readFileSync(path.join(__dirname, "../../assets/js/iso.js"), "utf8"));
const { T, C, S, make, tube, arrow, leader, check } = window.ISO;

const r1 = (n) => Math.round(n * 10) / 10;
const txt = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="Inter" font-size="${o.size || 30}" font-weight="${o.w || 400}" fill="${o.fill || T.ink}" text-anchor="${o.a || "start"}" letter-spacing="${o.ls == null ? "0.04em" : o.ls}">${s}</text>`;
const label = (id, x, y, lines, o = {}) =>
  `<g id="${id}">${lines.map((l, i) => txt(x, y + i * 36, l, o)).join("")}</g>`;
// leader drawn on with dashoffset; arrowhead pops at the end
const lead = (id, pts) => {
  const [a, b] = pts.slice(-2), ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return `<polyline id="${id}-l" class="dr" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${T.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<g transform="translate(${b[0]} ${b[1]}) rotate(${r1(ang)})"><polygon id="${id}-h" points="0,0 -13,-6 -13,6" fill="${T.ink}"/></g>`;
};
// a tube whose two strokes draw on together
const dtube = (id, d, o) =>
  `<g id="${id}">` + tube(d, o).replace(/<path /g, `<path class="dr" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" `) + `</g>`;
// block arrow wrapped so it can wipe in from its tail
const barrow = (id, x, y, len, ang, fill, o) =>
  `<g transform="translate(${x} ${y}) rotate(${ang})"><g id="${id}">${arrow(0, 0, len, 0, fill, o)}</g></g>`;
// lime packet cube centred on (0,0); moved with x/y keyframes
const cube = (id, s = 22) =>
  `<g id="${id}" opacity="0"><g transform="translate(0 ${s / 2})">${make(0, 0).box(-s / 2, -s / 2, 0, s, s, s, { top: T.lime, left: T.limeL, right: T.limeR, sw: 2 })}</g></g>`;
const bez = (p, t) => {
  const u = 1 - t;
  return [0, 1].map((k) => r1(u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]));
};
const bpath = (p) => `M${p[0]} C${p[1]} ${p[2]} ${p[3]}`.replace(/,/g, " ").replace(/ C/, " C");
const samples = (p, a = 0, b = 1, n = 16) => Array.from({ length: n + 1 }, (_, i) => bez(p, a + ((b - a) * i) / n));
const nsv = `vector-effect="non-scaling-stroke"`;

// ---------- objects ----------
function router(id, ox, oy, s = 1) {
  const m = make(ox, oy), w = 170 * s, d = 100 * s, h = 44 * s;
  let g = m.box(0, 0, 0, w, d, h, { top: T.g100, left: T.g300, right: T.g500 });
  g += `<g transform="${m.yFace(0, d, 0, w, h)}">` +
    [0, 1, 2].map((i) => `<circle cx="${w - 64 * s + i * 22 * s}" cy="${h / 2}" r="${5 * s}" fill="${i === 0 ? T.lime : T.hi}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`).join("") +
    `<line x1="${18 * s}" y1="${h / 2}" x2="${70 * s}" y2="${h / 2}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/></g>`;
  g += `<g transform="${m.xFace(w, 0, 0, d, h)}">` +
    [0, 1, 2, 3].map((i) => `<line x1="${20 * s + i * 16 * s}" y1="${12 * s}" x2="${20 * s + i * 16 * s}" y2="${h - 12 * s}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`).join("") + `</g>`;
  const ant = (x, y) => {
    const b = m.P(x, y, h), tp = [b[0], b[1] - 110 * s];
    return `<line x1="${r1(b[0])}" y1="${r1(b[1])}" x2="${r1(tp[0])}" y2="${r1(tp[1])}" stroke="${T.ink}" stroke-width="${9 * s}" stroke-linecap="round"/>` +
      `<line x1="${r1(b[0])}" y1="${r1(b[1])}" x2="${r1(tp[0])}" y2="${r1(tp[1])}" stroke="${T.g500}" stroke-width="${4 * s}" stroke-linecap="round"/>` +
      m.knob(x, y, h, 9 * s, 6 * s, T.g500);
  };
  g += ant(22 * s, 14 * s) + ant(148 * s, 14 * s);
  return `<g id="${id}">${g}</g>`;
}
function wifiArcs(id, cx, cy) {
  const arcs = [16, 32, 48].map((r, i) => {
    const k = r * Math.SQRT1_2;
    return `<path id="${id}-a${i}" d="M${r1(cx - k)} ${r1(cy - k)} A${r} ${r} 0 0 1 ${r1(cx + k)} ${r1(cy - k)}" fill="none" stroke="${T.ink}" stroke-width="4" stroke-linecap="round"/>`;
  }).join("");
  return `<g id="${id}">${arcs}<circle cx="${cx}" cy="${cy}" r="5" fill="${T.ink}"/></g>`;
}
function phone(id, ox, oy, s = 1) {
  const m = make(ox, oy), w = 120 * s, d = 16 * s, h = 210 * s;
  let g = m.box(0, 0, 0, w, d, h, { top: T.g300, left: T.g100, right: T.g500 });
  g += `<g transform="${m.yFace(0, d, 0, w, h)}">` +
    `<rect x="${9 * s}" y="${18 * s}" width="${w - 18 * s}" height="${h - 36 * s}" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>` +
    `<circle cx="${w / 2}" cy="${9 * s}" r="${2.5 * s}" fill="${T.ink}"/>` +
    [0, 1, 2, 3].map((i) => `<rect id="${id}-b${i}" x="${24 * s + i * 18 * s}" y="${h - 50 * s - (14 + i * 10) * s}" width="${11 * s}" height="${(14 + i * 10) * s}" fill="${T.ink}" stroke="${T.ink}" stroke-width="1.25" ${nsv}/>`).join("") +
    `<text x="${w / 2}" y="${70 * s}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="${30 * s}" fill="${T.ink}">5G</text>` +
    `</g>`;
  return `<g id="${id}">${g}</g>`;
}
// default screen glyph (v3): two paths merging into one. Pass your own `glyph(id)` for another tool:
// screen inner area is x 12..288, y 12..178; give the drawable stroke id `${id}-gl` + pathLength="1" so draw() works.
const mergeGlyph = (id) =>
  `<path id="${id}-gl" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" d="M70 62 C120 62 120 95 160 95 M70 128 C120 128 120 95 160 95 L232 95" fill="none" stroke="${T.lime}" stroke-width="9" stroke-linecap="round"/>` +
  [[70, 62], [70, 128], [232, 95]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${T.hi}" stroke="${T.ink}" stroke-width="2" ${nsv}/>`).join("");
// one input splitting to three outputs (a router / gateway: one API -> many backends)
const fanGlyph = (id) =>
  `<path id="${id}-gl" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" d="M70 95 L128 95 C172 95 180 52 232 52 M128 95 L232 95 M128 95 C172 95 180 138 232 138" fill="none" stroke="${T.lime}" stroke-width="9" stroke-linecap="round"/>` +
  [[70, 95], [232, 52], [232, 95], [232, 138]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${T.hi}" stroke="${T.ink}" stroke-width="2" ${nsv}/>`).join("");
// named glyphs so reel.json can pick one: "cta": { "glyph": "fan" }
const GLYPHS = { merge: mergeGlyph, fan: fanGlyph };
function laptop(id, ox, oy, glyph = mergeGlyph) {
  if (typeof glyph === "string") glyph = GLYPHS[glyph] || mergeGlyph;
  const m = make(ox, oy), W = 300, D = 200, B = 16, L = 190, t = 10;
  let g = m.box(0, 0, 0, W, D, B, { top: T.g100, left: T.g300, right: T.g500 });
  let keys = "";
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 13; c++)
      keys += `<rect x="${r1(30 + c * 18.6)}" y="${40 + r * 18}" width="14.5" height="13.5" fill="${T.hi}" stroke="${T.ink}" stroke-width="1.25" ${nsv}/>`;
  keys += `<rect x="112" y="142" width="76" height="44" fill="${T.hi}" stroke="${T.ink}" stroke-width="1.5" ${nsv}/>`;
  g += `<g transform="${m.topFace(0, 0, B, W, D)}">${keys}</g>`;
  g += m.box(0, 0, B, W, t, L, { top: T.g300, left: T.g100, right: T.g500 });
  g += `<g transform="${m.yFace(0, t, B, W, L)}">` +
    `<rect x="12" y="12" width="${W - 24}" height="${L - 24}" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>` +
    glyph(id) +
    `</g>`;
  return `<g id="${id}">${g}</g>`;
}
// chip board / "engine" block; `mark` is the 2-3 letter chip text (v3: "MP")
function adapter(id, ox, oy, mark = "MP") {
  const m = make(ox, oy), W = 240, D = 160, H = 22;
  let g = m.box(0, 0, 0, W, D, H, { top: T.g100, left: T.g300, right: T.g500 });
  g += `<g transform="${m.yFace(0, D, 0, W, H)}">` +
    Array.from({ length: 15 }, (_, i) => `<rect x="${22 + i * 13.5}" y="6" width="8" height="11" fill="${T.g700}" stroke="${T.ink}" stroke-width="1" ${nsv}/>`).join("") + `</g>`;
  g += `<g transform="${m.topFace(0, 0, H, W, D)}">` +
    [[20, 30, 60, 30, 60, 60], [20, 140, 60, 140, 60, 110], [160, 80, 220, 80], [180, 30, 180, 55, 220, 55], [180, 140, 180, 110, 220, 110]]
      .map((p) => `<polyline points="${p.join(" ")}" fill="none" stroke="${T.g700}" stroke-width="1.75" ${nsv}/>`).join("") + `</g>`;
  g += m.box(195, 22, H, 26, 26, 10, { top: T.hi, left: T.g300, right: T.g500, sw: 1.75 });
  g += m.box(195, 112, H, 26, 26, 10, { top: T.hi, left: T.g300, right: T.g500, sw: 1.75 });
  g += m.box(60, 40, H, 100, 80, 14, { top: T.g900, left: T.g500, right: T.g700 });
  g += `<g transform="${m.topFace(60, 40, H + 14, 100, 80)}"><text x="50" y="50" text-anchor="middle" font-family="Inter" font-weight="600" font-size="30" fill="${T.ink}">${mark}</text></g>`;
  return `<g id="${id}">${g}</g>`;
}
// flat frontal app window (HTML)
const appWin = (id, x, y, w, h, title, inner) =>
  `<div id="${id}" class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">` +
  `<div class="win-bar"><i></i><i></i><i></i><span>${title}</span></div>${inner}</div>`;
// check tag: lime parallelogram + ink check; "x" = dark tag + paper cross; "plus" = lime tag + ink plus
const tagInner = (kind) => {
  const pg = (fill) => `<polygon points="14,2 56,2 44,38 2,38" fill="${fill}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (kind === "x") return pg(T.dark) + `<path d="M21 12 L37 28 M37 12 L21 28" fill="none" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (kind === "plus") return pg(T.lime) + `<path d="M29 10 V30 M19 20 H39" fill="none" stroke="${T.on}" stroke-width="3.5" stroke-linecap="round"/>`;
  return pg(T.lime) + check(17, 9, 22, 3.5);
};
// kind "none" = a name plate with no tag (e.g. an agent or service name)
// the text sits in a mask (.pt > .pw) so plateIn() can rise it in; it looks the same at rest
const plate = (id, x, y, w, text, kind) =>
  `<div id="${id}" class="plate" style="left:${x}px;top:${y}px;width:${w}px"><span class="pt"><span class="pw">${text}</span></span>` +
  (kind === "none" ? "" : `<svg id="${id}-tag" class="tag" width="58" height="40" viewBox="0 0 58 40">${tagInner(kind)}</svg>`) + `</div>`;
// svg tag centred on (cx, cy)
const stag = (id, cx, cy, kind) => `<g transform="translate(${cx - 29} ${cy - 20})"><g id="${id}">${tagInner(kind)}</g></g>`;

// ---------- more objects (v3 scenes 4-8) ----------
function ethBox(id, ox, oy, s = 1) {
  const m = make(ox, oy), w = 160 * s, d = 90 * s, h = 52 * s;
  let g = m.box(0, 0, 0, w, d, h, { top: T.g100, left: T.g300, right: T.g500 });
  const port = (x) => {
    const y = 12 * s, pw = 40 * s, ph = 26 * s;
    return `<path d="M${r1(x)} ${r1(y)} h${r1(pw)} v${r1(ph * 0.7)} h${r1(-pw * 0.2)} v${r1(ph * 0.3)} h${r1(-pw * 0.6)} v${r1(-ph * 0.3)} h${r1(-pw * 0.2)} z" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`;
  };
  g += `<g transform="${m.yFace(0, d, 0, w, h)}">${port(22 * s)}${port(76 * s)}` +
    `<circle cx="${r1(w - 18 * s)}" cy="${r1(h / 2)}" r="${r1(5 * s)}" fill="${T.lime}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/></g>`;
  g += `<g transform="${m.xFace(w, 0, 0, d, h)}">` +
    [0, 1, 2].map((i) => `<line x1="${r1(22 * s + i * 16 * s)}" y1="${r1(14 * s)}" x2="${r1(22 * s + i * 16 * s)}" y2="${r1(h - 14 * s)}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`).join("") + `</g>`;
  return `<g id="${id}">${g}</g>`;
}
// flat frontal stopwatch; a lime pie (thick dashed stroke) sweeps clockwise under the hand
function stopwatch(id, cx, cy, r) {
  const pr = r * 0.42;
  let g = `<rect x="${cx - 14}" y="${cy - r - 22}" width="28" height="16" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/>` +
    `<rect x="${cx - 5}" y="${cy - r - 8}" width="10" height="10" fill="${T.g500}" stroke="${T.ink}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>` +
    `<circle id="${id}-pie" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" cx="${cx}" cy="${cy}" r="${r1(pr)}" fill="none" stroke="${T.lime}" stroke-width="${r1(pr * 2)}" transform="rotate(-90 ${cx} ${cy})"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r1(pr * 2)}" fill="none" stroke="${T.ink}" stroke-width="1.75"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r0 = r - (i % 3 ? 8 : 14);
    g += `<line x1="${r1(cx + Math.sin(a) * r0)}" y1="${r1(cy - Math.cos(a) * r0)}" x2="${r1(cx + Math.sin(a) * (r - 3))}" y2="${r1(cy - Math.cos(a) * (r - 3))}" stroke="${T.ink}" stroke-width="2" stroke-linecap="round"/>`;
  }
  g += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r1(cy - pr * 2)}" stroke="${T.ink}" stroke-width="1.75"/>` +
    `<g id="${id}-hand"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r1(cy - pr * 2)}" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/></g>` +
    `<circle cx="${cx}" cy="${cy}" r="7" fill="${T.ink}"/>`;
  return `<g id="${id}">${g}</g>`;
}
// spec-sheet gauge: n of 10 cells lime (spare speed), the rest light grey
const gauge = (id, x, y, n) =>
  `<g id="${id}">` + Array.from({ length: 10 }, (_, i) =>
    `<rect id="${id}-c${i}" x="${x + i * 26}" y="${y}" width="22" height="30" fill="${i < n ? T.lime : T.g100}" stroke="${T.ink}" stroke-width="2"/>`).join("") + `</g>`;
// 68px flat icon tiles for the use-case checklist
const ICONS = {
  speed: `<path d="M14 46 A20 20 0 0 1 54 46" fill="none" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/><line x1="34" y1="46" x2="45" y2="30" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/><circle cx="34" cy="46" r="4.5" fill="${T.ink}"/>`,
  video: `<rect x="12" y="19" width="44" height="30" rx="7" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><polygon points="29,26 29,42 42,34" fill="${T.ink}"/>`,
  game: `<rect x="9" y="24" width="50" height="24" rx="11" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M22 30 V42 M16 36 H28" stroke="${T.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="33" r="3.2" fill="${T.ink}"/><circle cx="49" cy="39" r="3.2" fill="${T.ink}"/>`,
  magnet: `<path d="M20 16 V34 A14 14 0 0 0 48 34 V16" fill="none" stroke="${T.ink}" stroke-width="13"/><path d="M20 16 V34 A14 14 0 0 0 48 34 V16" fill="none" stroke="${T.g300}" stroke-width="8"/><rect x="13.5" y="12" width="13" height="10" fill="${T.hi}" stroke="${T.ink}" stroke-width="2"/><rect x="41.5" y="12" width="13" height="10" fill="${T.hi}" stroke="${T.ink}" stroke-width="2"/>`,
  download: `<polygon points="28,12 40,12 40,28 48,28 34,42 20,28 28,28" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/><polyline points="14,42 14,54 54,54 54,42" fill="none" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  file: `<polygon points="18,10 40,10 52,22 52,58 18,58" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/><polyline points="40,10 40,22 52,22" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M25 34 H45 M25 43 H45 M25 52 H37" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
  slides: `<rect x="10" y="14" width="48" height="34" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M18 24 H40 M18 32 H34" stroke="${T.ink}" stroke-width="3" stroke-linecap="round"/><path d="M34 48 V56 M24 56 H44" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
  sheet: `<rect x="11" y="13" width="46" height="42" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M11 27 H57 M11 41 H57 M26 13 V55 M41 13 V55" stroke="${T.ink}" stroke-width="2"/>`,
  chart: `<polyline points="12,12 12,56 58,56" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="19" y="36" width="9" height="20" fill="${T.g300}" stroke="${T.ink}" stroke-width="2"/><rect x="33" y="24" width="9" height="32" fill="${T.g300}" stroke="${T.ink}" stroke-width="2"/><rect x="47" y="30" width="9" height="26" fill="${T.g300}" stroke="${T.ink}" stroke-width="2"/>`,
  more: `<circle cx="20" cy="34" r="5" fill="${T.ink}"/><circle cx="34" cy="34" r="5" fill="${T.ink}"/><circle cx="48" cy="34" r="5" fill="${T.ink}"/>`,
};
// isolated workspace: a closed container box with a lid seam, a folder mark on top and a lime status LED
function workspace(id, ox, oy, s = 1) {
  const m = make(ox, oy), w = 150 * s, d = 150 * s, h = 90 * s;
  let g = m.box(0, 0, 0, w, d, h, { top: T.g100, left: T.g300, right: T.g500 });
  g += `<g transform="${m.yFace(0, d, 0, w, h)}">` +
    `<line x1="0" y1="${r1(h * 0.3)}" x2="${w}" y2="${r1(h * 0.3)}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>` +
    `<circle cx="${r1(w - 22 * s)}" cy="${r1(h * 0.65)}" r="${r1(6 * s)}" fill="${T.lime}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/></g>`;
  g += `<g transform="${m.xFace(w, 0, 0, d, h)}"><line x1="0" y1="${r1(h * 0.3)}" x2="${d}" y2="${r1(h * 0.3)}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/></g>`;
  g += `<g transform="${m.topFace(0, 0, h, w, d)}"><path d="M${r1(35 * s)} ${r1(45 * s)} h${r1(30 * s)} l${r1(8 * s)} ${r1(10 * s)} h${r1(42 * s)} v${r1(50 * s)} h${r1(-80 * s)} z" fill="${T.g300}" stroke="${T.ink}" stroke-width="1.75" stroke-linejoin="round" ${nsv}/></g>`;
  return `<g id="${id}">${g}</g>`;
}
const icoTile = (k) =>
  `<svg class="ico" width="68" height="68" viewBox="0 0 68 68"><rect x="1.25" y="1.25" width="65.5" height="65.5" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>${ICONS[k]}</svg>`;
const POINTER = `<path d="M3 3 L3 50 L15 39 L24 58 L33 54 L24 35 L41 35 Z" fill="${T.ink}" stroke="${T.on}" stroke-width="2.5" stroke-linejoin="round"/>`;
const ph = (x, y, w, h, lt) => `<div class="win-ph${lt ? " lt" : ""}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
const js = (o) => JSON.stringify(o);

// ---------- more objects (OpenCreator reel) ----------
// more icon tiles: image (thumbnail), mic (voice), pen (scripts), figure (stick figure)
Object.assign(ICONS, {
  image: `<rect x="11" y="13" width="46" height="42" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><polyline points="15,51 29,35 38,44 44,38 53,51" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="44" cy="25" r="5" fill="${T.ink}"/>`,
  mic: `<rect x="26" y="10" width="16" height="30" rx="8" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M18 32 A16 16 0 0 0 50 32 M34 48 V57 M25 57 H43" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
  pen: `<polygon points="44,12 56,24 28,52 14,54 16,40" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 18 L50 30 M16 40 L28 52" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
  figure: `<circle cx="34" cy="17" r="7" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M34 24 V42 M20 32 L34 29 L48 34 M34 42 L24 56 M34 42 L46 55" fill="none" stroke="${T.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
});
// upright media card: a thin iso slab standing on its edge, its dark screen showing what kind of media it is.
// kind "video" (play mark + lime subtitle bar `${id}-sub`), "voice" (waveform bars `${id}-w0..14`, centre ones lime),
// "image" (mountains + lime sun `${id}-sun`). Spans x ox-14..ox+173, y oy-130..oy+108.
const WAVE = [16, 28, 20, 40, 30, 52, 38, 62, 44, 56, 34, 46, 24, 32, 18];
function mediaCard(id, ox, oy, kind = "video") {
  const m = make(ox, oy), w = 200, d = 16, h = 130;
  let g = m.box(0, 0, 0, w, d, h, { top: T.g300, left: T.g100, right: T.g500 });
  let s = `<rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`;
  if (kind === "voice")
    s += WAVE.map((v, i) => `<rect id="${id}-w${i}" x="${28 + i * 10}" y="${65 - v / 2}" width="6" height="${v}" fill="${i > 4 && i < 10 ? T.lime : T.ink}" stroke="${T.ink}" stroke-width="1.25" ${nsv}/>`).join("");
  else if (kind === "image")
    s += `<polygon points="30,108 78,56 110,88 132,68 172,108" fill="${T.g300}" stroke="${T.ink}" stroke-width="1.75" stroke-linejoin="round" ${nsv}/>` +
      `<circle id="${id}-sun" cx="146" cy="40" r="13" fill="${T.lime}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`;
  else
    s += `<polygon points="88,26 88,62 118,44" fill="${T.ink}"/>` +
      `<rect id="${id}-sub" x="46" y="78" width="108" height="11" fill="${T.lime}" stroke="${T.ink}" stroke-width="1.5" ${nsv}/>` +
      `<rect x="66" y="96" width="68" height="8" fill="${T.g100}" stroke="${T.ink}" stroke-width="1.25" ${nsv}/>`;
  g += `<g transform="${m.yFace(0, d, 0, w, h)}">${s}</g>`;
  return `<g id="${id}">${g}</g>`;
}
// version layer: a thin iso sheet at height z with its name ("V1") on the top face. Stack several at rising z
// for a version history; move whole layers (y) to explode the stack. W 300 x D 200: x ox-173..ox+260, y oy-z-16..oy+250-z.
function layer(id, ox, oy, z, text, o = {}) {
  const m = make(ox, oy), W = o.w || 300, D = o.d || 200, H = 16;
  let g = m.box(0, 0, z, W, D, H, { top: T.g100, left: T.g300, right: T.g500 });
  g += `<g transform="${m.topFace(0, 0, z + H, W, D)}">` +
    `<rect x="24" y="24" width="${W - 48}" height="${D - 48}" fill="none" stroke="${T.ink}" stroke-width="1.5" ${nsv}/>` +
    `<text x="${W / 2}" y="${D / 2 + 12}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="36" fill="${T.ink}">${text}</text></g>`;
  return `<g id="${id}">${g}</g>`;
}
// settings slider (HTML, inside a window): track + lime fill + knob, resting at b (0..1) of width w.
// sliderAnim moves it from a to b: the knob glides and the fill grows with it.
const slider = (id, x, y, w, b) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:14px;background:${T.g300};border:2px solid ${T.ink}">` +
  `<div id="${id}-f" style="position:absolute;left:0;top:0;bottom:0;width:${Math.round(b * w)}px;background:${T.lime};border-right:2px solid ${T.on};transform-origin:0% 50%"></div>` +
  `<div id="${id}-k" style="position:absolute;left:${Math.round(b * w) - 14}px;top:-15px;width:28px;height:40px;background:${T.hi};border:2.5px solid ${T.ink};box-sizing:border-box"></div></div>`;
const sliderAnim = (id, w, a, b, at, dur = 0.5) =>
  `tl.fromTo("#${id}-k", { x: ${Math.round((a - b) * w)} }, { x: 0, duration: ${dur}, ease: "power2.inOut" }, ${at});` +
  `tl.fromTo("#${id}-f", { scaleX: ${r1((a / b) * 100) / 100} }, { scaleX: 1, duration: ${dur}, ease: "power2.inOut" }, ${at});`;
// highlight box over a screenshot region (lime outline with dark edges on both sides); pop it on the word that names the region
const hlBox = (id, x, y, w, h) =>
  `<div id="${id}" data-layout-allow-overlap style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:2px solid ${T.on};box-sizing:border-box">` +
  `<div style="position:absolute;inset:0;border:4px solid ${T.lime}"><div style="position:absolute;inset:0;border:1.5px solid ${T.on}"></div></div></div>`;

// ---------- motion v4 (HarnessRouter reel): custom eases, match cuts, morphs, kinetic type, trims, pulses ----------
// Cubic-bezier solver (CSS semantics). Every ease below keeps y inside 0..1, so nothing overshoots (DESIGN.md 7).
// The same source runs in Node (to plan handoffs) and in each scene's timeline (as GSAP ease functions).
const BZ_SRC = `function bz(x1, y1, x2, y2) {
        const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
        const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
        return (u) => {
          if (u <= 0) return 0;
          if (u >= 1) return 1;
          let t = u;
          for (let i = 0; i < 8; i++) {
            const e = X(t) - u, d = dX(t);
            if (Math.abs(e) < 1e-7) return Y(t);
            if (Math.abs(d) < 1e-6) break;
            t -= e / d;
            if (t < 0 || t > 1) break;
          }
          let lo = 0, hi = 1;
          t = u;
          for (let i = 0; i < 40; i++) { const x = X(t); if (Math.abs(x - u) < 1e-7) break; if (x < u) lo = t; else hi = t; t = (lo + hi) / 2; }
          return Y(t);
        };
      }`;
// the reel's easing set (control points). out: UI entrances; outQ: softer settle; inOut: parts moving between rests;
// in: exits (accelerate away); ramp: speed-ramped handoffs (slow-fast-slow, the cut sits near peak speed);
// cam: camera drift; flow: trim paths / tubes drawing on.
const EZ = {
  out: [0.16, 1, 0.3, 1], outQ: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1], in: [0.55, 0, 1, 0.45],
  ramp: [0.8, 0, 0.2, 1], cam: [0.45, 0, 0.55, 1], flow: [0.4, 0, 0.2, 1],
};
const bz = new Function(`return (${BZ_SRC})`)();
const E = Object.fromEntries(Object.entries(EZ).map(([k, v]) => [k, bz(...v)]));
const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;

// camera: .cam scales about (540, 864) (50% 45% of the frame) and translates by (x, y)
const CAM_O = [540, 864];
// camera and parallax moves settle within SETTLE s, then hold: a slow sub-pixel crawl across a whole scene makes
// every thin outline shimmer (its antialiasing shifts frame to frame, worst in a scaled-down player)
const SETTLE = 1.1;
const camOf = (c) => ({ s: c && c.s ? c.s : 1, x: c && c.x ? c.x : 0, y: c && c.y ? c.y : 0 });
// a rect [x, y, w, h] in a scene's .lift coords -> screen coords, under camera state c
function toScreen(c, lift, r) {
  const { s, x, y } = camOf(c);
  return [r2(CAM_O[0] + s * (r[0] - CAM_O[0]) + x), r2(CAM_O[1] + s * (r[1] + lift - CAM_O[1]) + y), r2(r[2] * s), r2(r[3] * s)];
}
// GSAP {x, y, scale} (transform-origin 0 0) that puts an element whose CSS top-left is (lx, ly) in .lift
// at screen point S with screen scale k, under camera state c
function placeAt(c, lift, lx, ly, S, k = 1) {
  const { s, x, y } = camOf(c);
  return { x: r2((S[0] - CAM_O[0] - x) / s + CAM_O[0] - lx), y: r2((S[1] - CAM_O[1] - y) / s + CAM_O[1] - lift - ly), scale: r3(k / s) };
}
const lerp = (a, b, t) => a + (b - a) * t;
const lerpR = (A, B, t) => A.map((v, i) => r2(lerp(v, B[i], t)));

// ---- handoff: an object-based match cut ----
// One object (a morph frame or a real element) travels from screen rect A (scene N) to screen rect B (scene N+1).
// The whole move is ONE eased curve over T = land - t0 (global seconds); the cut at fraction f splits it:
// scene N plays seg(ease, 0, f), scene N+1 plays seg(ease, f, 1), so position AND velocity match across the cut.
// Snap `land` to a music beat so the object settles on the beat.
function handoff({ A, B, t0, cut, land, ease = "ramp" }) {
  const T = r3(land - t0), f = r3((cut - t0) / T);
  if (!(f > 0 && f < 1)) throw new Error(`handoff: cut ${cut} must sit inside ${t0}..${land}`);
  return { A, B, M: lerpR(A, B, E[ease](f)), T, f, ease, t0, cut, land, outDur: r3(cut - t0), inDur: r3(land - cut) };
}
const segEase = (h, side) => side === "out" ? `seg(E.${h.ease}, 0, ${h.f})` : `seg(E.${h.ease}, ${h.f}, 1)`;
// a real element carried across the cut (not a morph frame). A/B/M of the handoff are its screen top-left points.
// o = { lx, ly, lift, cam } for this side: (lx, ly) = its CSS top-left in .lift; cam = the camera state while it moves
// (the end state on the out side; null on the in side, where the camera starts after the landing).
// Its screen scale follows the camera: s on the out side, 1 on the in side.
function carry(sel, h, side, o, at) {
  const s = camOf(side === "out" ? o.cam : null).s;
  const kM = lerp(s, 1, E[h.ease](h.f));
  const P = side === "out" ? [h.A, h.M] : [h.M, h.B], k = side === "out" ? [s, kM] : [kM, 1];
  const cam = side === "out" ? o.cam : null;
  const a = placeAt(cam, o.lift, o.lx, o.ly, P[0], k[0]), b = placeAt(cam, o.lift, o.lx, o.ly, P[1], k[1]);
  const dur = side === "out" ? h.outDur : h.inDur;
  return `tl.fromTo("${sel}", ${js({ ...a, transformOrigin: "0 0" })}, { x: ${b.x}, y: ${b.y}, scale: ${b.scale}, duration: ${dur}, ease: ${segEase(h, side)}, immediateRender: false }, ${at});`;
}
// morph-frame code for one side of a handoff: out = swap the source for the frame at `at`, move A -> M until the cut;
// in = frame starts at M, lands on B, then swaps for the target (`show`: selector set visible on landing)
function morphCode(id, h, side, at, show) {
  if (side === "out") return `
      mfSet("${id}", ${js(h.A)}); gsap.set("#${id}", { opacity: 0 });
      tl.set("#${id}", { opacity: 1 }, ${at});
      morph("${id}", ${js(h.A)}, ${js(h.M)}, ${at}, ${h.outDur}, ${segEase(h, "out")});`;
  return `
      mfSet("${id}", ${js(h.M)});
      morph("${id}", ${js(h.M)}, ${js(h.B)}, 0, ${h.inDur}, ${segEase(h, "in")});
      tl.set("#${id}", { opacity: 0 }, ${h.inDur});` + (show ? `
      gsap.set(q("${show}"), { opacity: 0 }); tl.set(q("${show}"), { opacity: 1 }, ${h.inDur});` : "");
}

// ---- morph frame: a window outline that changes size and place (DESIGN.md 7 "Morph": parts move, no blob tweening) ----
// Five transform-only parts (fill + four 2.5px edges), each motion-blurred on its own, so the smear follows size changes too.
// Lives in the stage's screen layer (`over`) for cross-cut handoffs, or inside .lift for a morph within one scene.
const MB = (n = 12) => `data-hf-motion-blur='{"shutterAngle":360,"shutterPhase":-180,"samplesPerFrame":${n}}'`;
const mframe = (id) =>
  `<div id="${id}" class="mf" data-layout-allow-overlap>` +
  [["f", "mf-f"], ["t", "mf-h"], ["b", "mf-h"], ["l", "mf-v"], ["r", "mf-v"]]
    .map(([k, c]) => `<i id="${id}-${k}" class="${c}" ${MB()} data-layout-allow-overlap></i>`).join("") + `</div>`;
// a window's outline drawn as a trim path: two halves start at the top-left corner and meet bottom-right
const trimRect = (id, x, y, w, h) => {
  const a = x + 1.25, b = y + 1.25, c = x + w - 1.25, d = y + h - 1.25;
  const p = (dd) => `<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${dd}" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="square"/>`;
  return `<g id="${id}">${p(`M${a} ${b} H${c} V${d}`)}${p(`M${a} ${b} V${d} H${c}`)}</g>`;
};
// app window whose chrome + contents sit in one layer (#id-c), so the contents can wipe out and leave the bare outline
// (the outline is what a morph frame picks up at a match cut). o.attr: extra attributes on the window (e.g. MB()).
const appWinC = (id, x, y, w, h, title, inner, o = {}) =>
  `<div id="${id}" class="win" ${o.attr || ""} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div id="${id}-c" class="wc">` +
  `<div class="win-bar"><i></i><i></i><i></i><span>${title}</span></div>${inner}</div></div>`;
// highlight box drawn as a trim path (lime 4px with dark edges) around a screenshot region; HTML, place it inside the window
const hlTrim = (id, x, y, w, h) => {
  const P = 6, d = `M${P} ${P} H${w + P} V${h + P} H${P} Z`;
  const p = (k, c, sw) => `<path id="${id}-${k}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linejoin="miter" stroke-linecap="square"/>`;
  return `<svg id="${id}" class="hlt" data-layout-allow-overlap width="${w + 2 * P}" height="${h + 2 * P}" viewBox="0 0 ${w + 2 * P} ${h + 2 * P}" style="left:${x - P}px;top:${y - P}px">${p("u", T.on, 7.5)}${p("o", T.lime, 4)}</svg>`;
};
// data pulse: a short segment running inside a tube's core. Neutral pulses are one `dark` stroke;
// lime pulses get a dark edge (on 10 under lime 6) like every lime shape. len = fraction of the path.
const pulse = (id, d, o = {}) => {
  const len = o.len || 0.14, lime = !!o.lime;
  const p = (c, sw) => `<path pathLength="1" stroke-dasharray="${len} 2" stroke-dashoffset="${len}" d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="butt"/>`;
  return `<g id="${id}" data-len="${len}">${lime ? p(T.on, 10) + p(T.lime, 6) : p(T.dark, o.w || 6)}</g>`;
};
// kinetic label: same type as label() (Inter 400 30px caps, 0.04em, 36px leading), each word in a mask so kin() can rise it.
// (x, y) is the first baseline, like txt(). a: "start" | "middle" | "end".
const klabel = (id, x, y, lines, o = {}) => {
  const a = o.a || "start";
  const pos = a === "end" ? `right:${1080 - x}px;text-align:right` : a === "middle" ? `left:${x - 300}px;width:600px;text-align:center` : `left:${x}px`;
  return `<div id="${id}" class="klab" style="top:${y - 29}px;${pos}">` +
    lines.map((l) => `<div>${l.split(" ").map((w) => `<span class="km"><span class="kw">${w}</span></span>`).join(" ")}</div>`).join("") + `</div>`;
};
// typed value: characters rise in one by one inside a mask (no caret needed); type() / untype() drive it.
// "--" stays one unit: split apart, the two inline-block hyphens lose their kerning and read as "- -"
const typed = (id, text) =>
  `<span id="${id}" class="km">${(text.match(/--|[\s\S]/g) || []).map((c) => `<span class="kw">${c}</span>`).join("")}</span>`;
// music beat grid: beats(bpm, phase) -> snap(t) = the nearest beat to t (global seconds); pass several grids
// as [[from, bpm, phase], ...] when the bed restarts mid-reel
const beatGrid = (grids) => (t) => {
  const g = grids.filter((x) => t >= x[0] - 0.3).pop() || grids[0];
  const P = 60 / g[1], k = Math.round((t - g[2]) / P);
  return r3(g[2] + k * P);
};

// ---------- crafted objects (Anatomy kit via anat.cjs; DESIGN.md 5.8) ----------
// Built from real parts (base, bevel, seam, screws, glands, lamps), drawn in the 3 flat tones with ink outlines.
// Each returns { svg, ...ids and screen points } so a scene can wire tubes to its ports and animate its parts.
const anat = (ox, oy, u) => require("./anat.cjs")(T, ox, oy, u);
// lamp on a vertical face: dark well, plus a lime cap (opacity 0) the scene fades on for the active route
const lampOf = (A, id, c, r, axis) => `<path d="${A.circ(c, r, axis)}" fill="${T.g900}" stroke="${T.ink}" stroke-width="${r > 5 ? 1.5 : 1.25}"/>` +
  `<path id="${id}" d="${A.circ(c, r, axis)}" fill="${T.lime}" stroke="${T.ink}" stroke-width="${r > 5 ? 1.5 : 1.25}" opacity="0"/>`;
// rotary selector: base on feet, housing with two output glands (+y = port 0, lower-left; +x = port 1, lower-right)
// and a lamp each, detent scale, collar, knob with grip ring + pointer, input coupling on the axis. (ox, oy) = axis on
// the ground; u = size. ids: parts `${id}-p0..p4` (bottom-up), pointer `${id}-ptr` (gsap.set svgOrigin "0 0"; rotation
// 0 = port 0, -90 = port 1), lamps `${id}-lp0/1`. Points: top (input enters here, from above), ports [tip0, tip1].
function selector(id, ox, oy, u = 1.3) {
  const A = anat(ox, oy, u), K = A.K;
  const basePl = { x: -122, y: -122, w: 244, d: 244, r: 16 }, housePl = { x: -84, y: -84, w: 168, d: 168, r: 12 };
  const ZB = 14, ZH = 74, ZC = 82, ZK = 124, ZT = 132;
  const pA =
    [[-98, -98], [98, -98], [-98, 98], [98, 98]].map(([x, y]) => A.cyl(x, y, 10, -9, 9, { steps: 24, top: T.g500 })).join("") +
    A.slab(basePl, 0, ZB, { top: T.g500, bevel: 3 }) +
    A.ink(K.planOutline(K.insetPlan(basePl, 9), ZB, A.PR), 1.25) +
    K.corners(basePl, 18).map(([x, y]) => A.screw(x, y, ZB)).join("");
  const det = [-22.5, 0, 22.5, 45, 67.5, 90, 112.5].map((d) => (d === 0 || d === 90 ? A.tick(0, 0, ZH, d, 63, 77, 2.5) : A.tick(0, 0, ZH, d, 66, 74, 1.5))).join("");
  const pB =
    A.slab(housePl, ZB, ZH - ZB, { top: T.g100, bevel: 3 }) +
    A.ink(K.sideSeam(housePl, 28, A.PR), 1.25) +
    A.gland("y", [0, 0, 46], 84, 106, 13) + A.gland("x", [0, 0, 46], 84, 106, 13) +
    lampOf(A, `${id}-lp0`, [-54, 84, 56], 6.5, "y") + lampOf(A, `${id}-lp1`, [84, -54, 56], 6.5, "x") + det;
  const pC = A.cyl(0, 0, 56, ZH, ZC - ZH, { top: T.g500 });
  const grip = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return `<line x1="${A.f(Math.cos(a) * 37)}" y1="${A.f(Math.sin(a) * 37)}" x2="${A.f(Math.cos(a) * 42)}" y2="${A.f(Math.sin(a) * 42)}" stroke="${T.ink}" stroke-width="1.25" stroke-linecap="round" ${nsv}/>`;
  }).join("");
  const ptr = `<line x1="0" y1="15" x2="0" y2="38" stroke="${T.ink}" stroke-width="7" stroke-linecap="round" ${nsv}/>`;
  const pD = A.cyl(0, 0, 46, ZC, ZK - ZC, { top: T.g100, bevel: 3 }) + `<g transform="${A.topM(0, 0, ZK)}"><g id="${id}-ptr">${grip}${ptr}</g></g>`;
  const pE = A.cyl(0, 0, 13, ZK, ZT - ZK, { steps: 32, top: T.g300 });
  const svg = `<g id="${id}">` + [pA, pB, pC, pD, pE].map((g, i) => `<g id="${id}-p${i}">${g}</g>`).join("") + `</g>`;
  return { svg, parts: [0, 1, 2, 3, 4].map((i) => `#${id}-p${i}`), top: A.at([0, 0, ZT]), ports: [A.at([0, 106, 46]), A.at([106, 0, 46])] };
}
// router board: standoffs, bevelled board with seam, vent slots, screws and traces; a chip (mark) with pins; two
// capacitors and an input socket. Three output glands, each with a lamp: port 0 and 1 on the +y face (lower-left),
// port 2 on the +x face (lower-right). (ox, oy) = the board's back corner on the ground (same footprint as adapter()).
// ids: parts `${id}-hp0..hp2` (board, chip, small parts), lamps `${id}-lmp0..2`. Points: sock (input, from above), ports.
function board(id, ox, oy, mark = "HR", u = 1) {
  const A = anat(ox, oy, u), K = A.K;
  const bd = { x: 0, y: 0, w: 240, d: 160, r: 12 }, H = 28, sock = [58, 18];
  const part0 =
    [[22, 22], [218, 22], [22, 138], [218, 138]].map(([x, y]) => A.cyl(x, y, 8, -8, 8, { steps: 24, top: T.g500 })).join("") +
    A.slab(bd, 0, H, { top: T.g100, bevel: 3 }) +
    A.ink(K.sideSeam(bd, 9, A.PR), 1.25) +
    Array.from({ length: 6 }, (_, i) => A.ink(K.segment([118 + i * 9, 160, 8], [118 + i * 9, 160, 20], A.PR), 1.5)).join("") +
    A.gland("y", [70, 0, 14], 160, 177, 9) + A.gland("y", [216, 0, 14], 160, 177, 9) + A.gland("x", [0, 70, 14], 240, 257, 9) +
    lampOf(A, `${id}-lmp0`, [94, 160, 14], 4.5, "y") + lampOf(A, `${id}-lmp1`, [192, 160, 14], 4.5, "y") + lampOf(A, `${id}-lmp2`, [240, 46, 14], 4.5, "x") +
    K.corners(bd, 12).map(([x, y]) => A.screw(x, y, H, 4.5)).join("") +
    `<g transform="${A.topM(0, 0, H)}">` +
    [[20, 60, 60, 60, 60, 80], [20, 140, 60, 140, 60, 110], [160, 80, 222, 80], [180, 40, 180, 55, 222, 55], [180, 140, 180, 110, 222, 110], [58, 30, 80, 30, 80, 40]]
      .map((q) => `<polyline points="${q.join(" ")}" fill="none" stroke="${T.g700}" stroke-width="1.75" ${nsv}/>`).join("") + `</g>`;
  const pins = Array.from({ length: 7 }, (_, i) => A.ink(K.lineOnTop([68 + i * 14, 120], [68 + i * 14, 127], H, A.PR), 1.5) +
    A.ink(K.lineOnTop([160, 46 + i * 11], [167, 46 + i * 11], H, A.PR), 1.5)).join("");
  const part1 = pins + A.slab({ x: 60, y: 40, w: 100, d: 80, r: 5 }, H, 14, { top: T.g900, lit: T.g500, dark: T.g700, bevel: 2 }) +
    `<g transform="${A.topM(60, 40, H + 14)}"><text x="50" y="50" text-anchor="middle" font-family="Inter" font-weight="600" font-size="30" fill="${T.ink}">${mark}</text></g>`;
  const part2 = [[208, 35], [208, 125]].map(([x, y]) => A.cyl(x, y, 10, H, 13, { steps: 32, top: T.g300 }) + A.ink(K.ring(x, y, 5, H + 13, A.PR, 20), 1.25)).join("") +
    A.cyl(sock[0], sock[1], 10, H, 9, { steps: 32, top: T.g300 }) +
    `<path d="${K.ring(sock[0], sock[1], 5.5, H + 9, A.PR, 20)}" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.25"/>`;
  const svg = `<g id="${id}">` + [part0, part1, part2].map((g, i) => `<g id="${id}-hp${i}">${g}</g>`).join("") + `</g>`;
  return { svg, parts: [0, 1, 2].map((i) => `#${id}-hp${i}`), sock: A.at([sock[0], sock[1], H + 9]), ports: [A.at([70, 177, 14]), A.at([216, 177, 14]), A.at([257, 70, 14])] };
}

// ---------- shell ----------
const CSS = `
    @font-face { font-family: "Inter"; src: url("assets/fonts/Inter-var.woff2") format("woff2"); font-weight: 100 900; }
    #root { position: absolute; inset: 0; overflow: hidden; color: ${T.ink}; font-family: "Inter", sans-serif; }
    .stage, .cam { position: absolute; inset: 0; }
    .cam { transform-origin: 50% 45%; }
    .lift { position: absolute; left: 0; width: 1080px; height: 1920px; }
    .art { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: visible; }
    .win { position: absolute; background: ${T.hi}; border: 2.5px solid ${T.ink}; overflow: hidden; }
    .win-bar { position: relative; height: 46px; background: ${T.hi}; border-bottom: 2.5px solid ${T.ink}; display: flex; align-items: center; padding-left: 14px; gap: 8px; }
    .win-bar i { width: 12px; height: 12px; border-radius: 50%; border: 1.75px solid ${T.ink}; background: ${T.hi}; }
    .win-bar span { position: absolute; left: 0; right: 0; text-align: center; font-size: 26px; font-weight: 500; }
    .win-ph { position: absolute; background: ${T.g300}; border: 1.75px solid ${T.ink}; }
    .win-ph.lt { background: ${T.g100}; }
    .plate { position: absolute; height: 68px; background: ${T.hi}; border: 2.5px solid ${T.ink}; display: flex; align-items: center; justify-content: space-between; padding: 0 12px 0 22px; font-size: 30px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .tag { display: block; }
    .row { position: absolute; width: 700px; height: 68px; }
    .ico { position: absolute; left: 0; top: 0; width: 68px; height: 68px; }
    .pbar { position: absolute; background: ${T.hi}; border: 2.5px solid ${T.ink}; overflow: hidden; }
    .pfill { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: ${T.lime}; border-right: 2.5px solid ${T.on}; transform-origin: 0% 50%; }
    .code { position: absolute; font-size: 24px; font-weight: 500; white-space: pre; font-variant-numeric: tabular-nums; }
    .rate { position: absolute; font-size: 30px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .tagbox { position: relative; width: 58px; height: 40px; }
    .tagbox svg { position: absolute; left: 0; top: 0; }
    .cursor { position: absolute; left: 0; top: 0; }
    .ctr { position: absolute; left: 0; width: 1080px; display: flex; justify-content: center; }
    .url { background: ${T.hi}; border: 2.5px solid ${T.ink}; padding: 12px 26px 14px; font-size: 34px; font-weight: 500; letter-spacing: 0.01em; }
    .ftxt { font-size: 56px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.15; }
    .hl { position: relative; white-space: nowrap; }
    .hl i { position: absolute; left: -6px; right: -6px; bottom: 2px; height: 20px; background: ${T.lime}; border: 2.5px solid ${T.on}; transform-origin: 0% 50%; }
    .hl b { position: relative; font-weight: inherit; }
    .btn { position: absolute; width: 420px; height: 92px; }
    .bst { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 18px; border: 2.5px solid ${T.ink}; font-size: 36px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
    .bst.on { background: ${T.ink}; color: ${T.hi}; }
    .bst.off { background: ${T.hi}; color: ${T.ink}; opacity: 0; }
    .over { position: absolute; inset: 0; }
    .mf { position: absolute; left: 0; top: 0; width: 0; height: 0; }
    .mf i { position: absolute; left: 0; top: 0; display: block; transform-origin: 0 0; }
    .mf .mf-f { width: 100px; height: 100px; background: ${T.hi}; }
    .mf .mf-h { width: 100px; height: 2.5px; background: ${T.ink}; }
    .mf .mf-v { width: 2.5px; height: 100px; background: ${T.ink}; }
    .pt { display: block; overflow: hidden; line-height: 1.25; }
    .pw { display: block; }
    .klab { position: absolute; font-size: 30px; font-weight: 400; letter-spacing: 0.04em; line-height: 36px; white-space: nowrap; }
    .km { display: inline-block; overflow: hidden; vertical-align: top; }
    .kw { display: inline-block; }
    .hlt { position: absolute; overflow: visible; }
    .wc { position: absolute; inset: 0; }
    .plane { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
`;
// shared timeline helpers (seek-safe: only fromTo/to tweens on a paused timeline)
const HELPERS = `
      const q = (s) => document.querySelectorAll(s);
      const bz = ${BZ_SRC};
      const E = {${Object.entries(EZ).map(([k, v]) => ` ${k}: bz(${v.join(", ")})`).join(",")} };
      // a slice [a, b] of an ease, renormalised: the two sides of a cut play seg(e, 0, f) and seg(e, f, 1)
      const seg = (e, a, b) => { const ea = e(a), eb = e(b); return (u) => (e(a + u * (b - a)) - ea) / (eb - ea); };
      const slide = (s, at, dx = 40, dy = -23, dur = 0.55) => tl.fromTo(s, { x: dx, y: dy, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: dur, ease: E.out }, at);
      const fadeUp = (s, at, d = 10, dur = 0.35) => tl.fromTo(s, { y: d, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease: E.out }, at);
      const draw = (s, at, dur = 0.5) => {
        tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
        tl.fromTo(s, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: E.flow }, at);
      };
      // trims tween the stroke-dashoffset ATTRIBUTE: the CSS property snaps to whole numbers under pathLength="1"
      // trim off: the stroke retracts from its start toward its end
      // (hidden once retracted: a round cap still paints a dot at a zero-length dash)
      const untrim = (s, at, dur = 0.35, st = 0) => {
        tl.fromTo(s, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -1 }, duration: dur, ease: E.in, stagger: st, immediateRender: false }, at);
        const n = typeof s === "string" ? q(s).length : s.length || 1;
        tl.set(s, { opacity: 0 }, at + dur + st * (n - 1));
      };
      const wipe = (s, at, dur = 0.38) => tl.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: dur, ease: E.out, transformOrigin: "0% 50%" }, at);
      const unwipe = (s, at, dur = 0.3) => tl.fromTo(s, { scaleX: 1 }, { scaleX: 0, duration: dur, ease: E.in, transformOrigin: "100% 50%", immediateRender: false }, at);
      const pop = (s, at) => tl.fromTo(s, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%" }, at);
      const unpop = (s, at) => tl.fromTo(s, { scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0, duration: 0.16, ease: E.in, transformOrigin: "50% 50%", immediateRender: false }, at);
      const lead = (id, at) => { draw("#" + id + "-l", at, 0.32); pop("#" + id + "-h", at + 0.28); };
      const unlead = (id, at) => { untrim("#" + id + "-l", at, 0.25); unpop("#" + id + "-h", at); };
      // clip reveals: left -> right in, and out toward the right
      const wipeIn = (s, at, dur = 0.5, st = 0) => tl.fromTo(s, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: E.out, stagger: st }, at);
      const wipeOut = (s, at, dur = 0.28, st = 0) => tl.fromTo(s, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: dur, ease: E.in, stagger: st, immediateRender: false }, at);
      // kinetic type: masked words rise in (and leave upward)
      const kin = (s, at, st = 0.05, dur = 0.6) => tl.fromTo(q(s + " .kw"), { yPercent: 110 }, { yPercent: 0, duration: dur, ease: E.out, stagger: st }, at);
      const kout = (s, at, st = 0.03, dur = 0.32) => tl.fromTo(q(s + " .kw"), { yPercent: 0 }, { yPercent: -110, duration: dur, ease: E.in, stagger: st, immediateRender: false }, at);
      // typed value: one character every cps seconds; untype removes them last-first
      const type = (s, at, cps = 0.04) => tl.fromTo(q(s + " .kw"), { yPercent: 105 }, { yPercent: 0, duration: 0.16, ease: E.out, stagger: cps }, at);
      const untype = (s, at, cps = 0.03) => tl.fromTo(q(s + " .kw"), { yPercent: 0 }, { yPercent: 105, duration: 0.12, ease: E.in, stagger: { each: cps, from: "end" }, immediateRender: false }, at);
      // label plate: the frame wipes in, the name rises in its mask
      const plateIn = (s, at, dur = 0.5) => { wipeIn(s, at, dur); tl.fromTo(s + " .pw", { yPercent: 110 }, { yPercent: 0, duration: dur, ease: E.out }, at + 0.1); };
      const away = (s, at, dy = -24, dur = 0.3, st = 0) => tl.fromTo(s, { y: 0, opacity: 1 }, { y: dy, opacity: 0, duration: dur, ease: E.in, stagger: st, immediateRender: false }, at);
      // parallax plane: a group drifts against the camera, a few px, settling with it (never longer than SETTLE)
      const drift = (s, at, dur, dy, dx = 0) => tl.fromTo(s, { x: 0, y: 0 }, { x: dx, y: dy, duration: Math.min(dur, ${SETTLE}), ease: E.cam }, at);
      // data pulse (pulse() in the lib): the segment runs the tube start -> end at an even pace
      const run = (s, at, dur = 0.7, reps = 0, gap = 0) => {
        const g = document.querySelector(s), len = +g.getAttribute("data-len");
        tl.fromTo(q(s + " path"), { attr: { "stroke-dashoffset": len } }, { attr: { "stroke-dashoffset": -1 }, duration: dur, ease: "none", repeat: reps, repeatDelay: gap, immediateRender: false }, at);
      };
      // morph frame (mframe() in the lib): rect r = [x, y, w, h]
      const mfV = (r) => ({
        f: { x: r[0], y: r[1], scaleX: r[2] / 100, scaleY: r[3] / 100 }, t: { x: r[0], y: r[1], scaleX: r[2] / 100 },
        b: { x: r[0], y: r[1] + r[3] - 2.5, scaleX: r[2] / 100 }, l: { x: r[0], y: r[1], scaleY: r[3] / 100 },
        r: { x: r[0] + r[2] - 2.5, y: r[1], scaleY: r[3] / 100 },
      });
      const mfSet = (id, r) => { const v = mfV(r); for (const k in v) gsap.set("#" + id + "-" + k, v[k]); };
      const morph = (id, A, B, at, dur, ease) => {
        const a = mfV(A), b = mfV(B);
        for (const k in a) tl.fromTo("#" + id + "-" + k, a[k], { ...b[k], duration: dur, ease, immediateRender: false }, at);
      };
      // packet cube travels a sampled path, looping with an even pace
      const flow = (s, pts, at, dur, reps) => {
        const kf = { easeEach: "none" };
        pts.forEach((p, i) => { kf[(i / (pts.length - 1)) * 100 + "%"] = { x: p[0], y: p[1] }; });
        tl.set(s, { x: pts[0][0], y: pts[0][1] }, 0);
        tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
        tl.to(s, { keyframes: kf, ease: "none", duration: dur, repeat: Math.max(0, reps) }, at);
      };`;

// lift: vertical offset that centres the scene's art in the grid field (y 305 -> 1305)
const LIMES = [T.lime, T.limeL, T.limeR].map((c) => `fill="${c}"`);
const limeEdges = (m) => m.replace(/<(polygon|rect|circle|path)[^>]*>/g, (el) =>
  LIMES.some((f) => el.includes(f)) ? el.split(`stroke="${T.ink}"`).join(`stroke="${T.on}"`) : el);
function scene(o) { return limeEdges(sceneRaw(o)); }
// over: HTML in the stage's screen layer (above the camera; morph frames of cross-cut handoffs live here).
// cam: { s, x, y, t0, t1 } = one eased camera move to (scale s, offset x/y) over local t0..t1 (default: the v3 push to 1.03, settled within SETTLE).
// fade: false for scenes that hand off to the next one through a match cut (nothing to clear: the cut is the transition).
function sceneRaw({ id, p, dur, lift, svg, html = "", anim, over = "", cam, fade = true }) {
  const c = cam ? camOf(cam) : null;
  const camAnim = c
    ? `      // camera: one slow eased move, settled before the handoff starts
      tl.fromTo("#${p}-cam", { scale: 1, x: 0, y: 0 }, { scale: ${c.s}, x: ${c.x}, y: ${c.y}, duration: ${r3((cam.t1 == null ? dur : cam.t1) - (cam.t0 || 0))}, ease: E.cam }, ${cam.t0 || 0});`
    : `      // short eased push at the start, then still (a push across the whole scene makes thin outlines shimmer)
      tl.fromTo("#${p}-cam", { scale: 1 }, { scale: 1.03, duration: Math.min(D, ${SETTLE}), ease: E.cam }, 0);`;
  return `<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script src="assets/js/motion-blur.js"></script>
  <style>${CSS}  </style>
  <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="1080" data-height="1920">
    <div id="${p}-stage" class="clip stage" data-start="0" data-duration="${dur}" data-track-index="1">
      <div id="${p}-cam" class="cam">
        <div class="lift" style="top:${lift}px">
        <svg id="${p}-art" class="art" viewBox="0 0 1080 1920">${svg}</svg>
        ${html}
        </div>
      </div>
      <div id="${p}-over" class="over">${over}</div>
    </div>
  </div>
  <script>
    (function () {
      const D = ${dur};
      const tl = gsap.timeline({ paused: true });${HELPERS}
${anim}
${camAnim}${fade ? `
      // quick clear at the end (grid stays)
      tl.to("#${p}-cam", { opacity: 0, duration: 0.25, ease: E.in }, D - 0.25);` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

// ---------- word cues ----------
// Scene objects come from build-scenes.cjs: { id, p, n, line, start, dur, words, at(word, nth) }.
// at() returns the scene-local time of the nth spoken occurrence of `word` (case/punctuation-insensitive),
// so every pop lands on its word. It throws if the word is missing, so a script edit never silently desyncs.
const keyOf = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, "");
function makeCues(all, sc) {
  const own = all.filter((w) => w.line === sc.line);
  sc.words = own.map((w) => ({ text: w.text, t: +(w.start - sc.start).toFixed(3), end: +(w.end - sc.start).toFixed(3) }));
  sc.at = (word, nth = 0) => {
    const k = keyOf(word);
    const hits = own.filter((w) => keyOf(w.text) === k);
    if (!hits[nth]) throw new Error(`${sc.id}: word "${word}" (#${nth}) not in line "${sc.line}"`);
    return +(hits[nth].start - sc.start).toFixed(3);
  };
  return sc;
}

// ---------- fixed CTA scene (DESIGN.md 6.1) ----------
// cfg: { url, trust: [{ text, kind: "x" | undefined, word }...] (all but the last go on top, the last under the device),
//        device?: (id, ox, oy) => svg  (default laptop; false = no device), glyph?: laptop screen glyph fn or a GLYPHS name ("merge" | "fan"), shotH?: crop height of repo-header.png at 2560 wide,
//        follow?: word that starts "Follow for more useful tools" (default "follow") }
// The last trust item may carry code: ["line", ...] (e.g. the install command): beat A then moves up to make room
// and a Terminal window under that plate types the lines in while its sentence is spoken.
function ctaScene(sc, cfg) {
  const { p, dur } = sc, at = sc.at;
  const items = cfg.trust || [];
  const top = items.slice(0, -1), bottom = items[items.length - 1];
  const RW = 964 - 5, RH = Math.round((RW * (cfg.shotH || 1300)) / 2560);
  const urlTop = 370 + RH + 5 + 48, ftTop = urlTop + 102, btnTop = urlTop + 214;
  const r2 = (n) => Math.round(n * 100) / 100;
  // beat A: trust plates pop on their words, the device sits between them
  // (device: false drops the device; all plates stack, then the code window if any, centred in the field)
  let anim = "", prev = -1;
  const noDev = cfg.device === false, code = bottom && bottom.code;
  const FS = noDev ? 28 : 24, LH = noDev ? 40 : 34, codeH = code ? 46 + 30 + code.length * LH : 0;
  const stackH = items.length * 90 - 22 + (code ? 30 + codeH : 0);
  const y0 = noDev ? Math.round(805 - stackH / 2) : code ? 310 : 400;        // laptop spans oy-208 .. oy+252
  const pcY = noDev ? y0 + top.length * 90 : code ? 968 : 1090, codeY = pcY + (noDev ? 98 : 82);
  const htmlA = top.map((it, i) => plate(`${p}-n${i + 1}`, 290, y0 + i * 90, 500, it.text, it.kind)).join("") +
    (bottom ? plate(`${p}-pc`, 290, pcY, 500, bottom.text, bottom.kind) : "") +
    (code ? appWin(`${p}-code`, 190, codeY, 700, codeH, "Terminal",
      code.map((l, i) => `<div id="${p}-cl${i}" class="code" style="left:26px;top:${62 + i * LH}px;font-size:${FS}px">${l}</div>`).join("")) : "");
  top.forEach((it, i) => {
    const s = r2(Math.max(0.05, at(it.word) - 0.3, prev + 0.3));
    anim += `
      slide("#${p}-n${i + 1}", ${s}, -40, 0); pop("#${p}-n${i + 1}-tag", ${r2(s + 0.3)});`;
    prev = s;
  });
  const dev = r2(Math.max(0.05, prev + (noDev ? 0.3 : 0.7)));
  let svgA = `<g id="${p}-ga"></g>`;
  if (!noDev) {
    svgA = `<g id="${p}-ga">${(cfg.device || ((id, x, y) => laptop(id, x, y, cfg.glyph)))(`${p}-laptop`, 470, code ? 696 : 800)}</g>`;
    anim += `
      slide("#${p}-laptop", ${dev});`;
    if (!cfg.device) anim += `
      draw("#${p}-laptop-gl", ${r2(dev + 0.4)}, 0.6);`;
  }
  if (bottom) {
    const s = r2(Math.max(at(bottom.word) - 0.28, noDev ? prev + 0.3 : dev + 0.5));
    anim += `
      slide("#${p}-pc", ${s}, -40, 0); pop("#${p}-pc-tag", ${r2(s + 0.28)});`;
    if (code) {
      const c = r2(Math.max(noDev ? prev + 0.3 : dev + 0.2, s - 0.4));
      anim += `
      tl.fromTo("#${p}-code", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, ${c});`;
      code.forEach((_, i) => { anim += `
      tl.fromTo("#${p}-cl${i}", { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, ${r2(c + 0.3 + i * 0.16)});`; });
    }
  }
  // beat B: repo, URL, follow line, the Follow button gets clicked
  const B = r2(at(cfg.follow || "follow") + 0.02);
  if (dur < B + 2.6) throw new Error(`${sc.id}: scene too short for the follow click (dur ${dur}, needs ${r2(B + 2.6)})`);
  const htmlB =
    `<div id="${p}-repo" class="win" style="left:58px;top:370px;width:964px;height:${RH + 5}px">` +
    `<img src="${cfg.shot || "assets/shots/repo-header.png"}" alt="" style="position:absolute;left:0;top:0;width:${RW}px;height:${RH}px"></div>` +
    `<div class="ctr" style="top:${urlTop}px"><div id="${p}-url" class="url">${cfg.url}</div></div>` +
    `<div class="ctr" style="top:${ftTop}px"><div id="${p}-ft" class="ftxt">Follow for more <span class="hl"><i id="${p}-ul"></i><b>useful tools</b></span></div></div>` +
    `<div id="${p}-btn" class="btn" style="left:330px;top:${btnTop}px">` +
    `<div id="${p}-bA" class="bst on"><svg width="58" height="40" viewBox="0 0 58 40">${tagInner("plus")}</svg><span>Follow</span></div>` +
    `<div id="${p}-bB" class="bst off"><svg width="58" height="40" viewBox="0 0 58 40">${tagInner()}</svg><span>Following</span></div></div>` +
    `<svg id="${p}-cur" class="cursor" width="46" height="62" viewBox="0 0 46 62" style="left:700px;top:${btnTop + 62}px">${POINTER}</svg>`;
  const b = (d) => r2(B + d);
  anim += `
      tl.to(q("#${p}-a, #${p}-ga"), { opacity: 0, duration: 0.25, ease: "power1.in" }, ${b(-0.22)});
      gsap.set(q("#${p}-b, #${p}-gb"), { opacity: 0 });
      tl.set(q("#${p}-b, #${p}-gb"), { opacity: 1 }, ${B});
      tl.fromTo("#${p}-repo", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, ${b(0.03)});
      fadeUp("#${p}-url", ${b(0.28)}, 14, 0.35);
      fadeUp("#${p}-ft", ${b(0.48)}, 16, 0.4);
      wipe("#${p}-ul", ${b(0.88)}, 0.4);
      tl.fromTo("#${p}-btn", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.out" }, ${b(1.03)});
      tl.fromTo("#${p}-cur", { x: 170, y: 140, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, ${b(1.33)});
      tl.to("#${p}-cur", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", transformOrigin: "0% 0%" }, ${b(1.98)});
      tl.to("#${p}-btn", { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b(1.98)});
      tl.set("#${p}-bA", { opacity: 0 }, ${b(2.04)});
      tl.set("#${p}-bB", { opacity: 1 }, ${b(2.04)});
      pop("#${p}-bB svg", ${b(2.08)});`;
  return { lift: 0, svg: svgA, html: `<div id="${p}-a">${htmlA}</div><div id="${p}-b">${htmlB}</div>`, anim };
}

// placeholder for a scene whose file doesn't exist yet (shows up in preview so nothing is forgotten)
const todoScene = (sc) => ({
  lift: 0, html: "",
  svg: label(`${sc.p}-todo`, 540, 805, [`TODO: ${sc.id.toUpperCase()}`], { a: "middle" }),
  anim: `\n      fadeUp("#${sc.p}-todo", 0.1);`,
});

// ---------- more objects + motion (Paseo reel) ----------
// screen frame: a bare 2.5px ink outline (no title bar: DESIGN.md 5.7) whose inside is a viewport (#id-v, overflow
// hidden) holding one or more screens (#sid, absolute, top-left).
// A screen = { id, src, w, h, x?, y?, inner?, attr? }: inner = extra HTML that moves with it (trim boxes that zoom with the
// shot); attr = extra attributes (MB() for screens that push). #id-o = a fixed layer over the screens (o.over: trim boxes
// that don't zoom). The viewport sits in #id-c, so wipeOut("#id-c") leaves the bare outline for a morph frame.
// Viewport size: (w - 5) x (h - 5).
const screenWin = (id, x, y, w, h, screens, o = {}) => {
  const vw = w - 5, vh = h - 5;
  return `<div id="${id}" class="win" ${o.attr || ""} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div id="${id}-c" class="wc">` +
    `<div id="${id}-v" style="position:absolute;left:0;top:0;width:${vw}px;height:${vh}px;overflow:hidden;background:${T.g900}">` +
    screens.map((sc) => `<div id="${sc.id}" ${sc.attr || ""} data-layout-allow-overlap style="position:absolute;left:${sc.x || 0}px;top:${sc.y || 0}px;width:${sc.w}px;height:${sc.h}px">` +
      `<img src="${sc.src}" alt="" data-layout-allow-overlap style="position:absolute;left:0;top:0;width:${sc.w}px;height:${sc.h}px">${sc.inner || ""}</div>`).join("") +
    `<div id="${id}-o" data-layout-allow-overlap style="position:absolute;inset:0">${o.over || ""}</div></div>` +
    `</div></div>`;
};
// screen size for a shot of aspect ar in a viewport vw x vh: "width" fills the width (crops the bottom), "cover" fills both
const fitShot = (ar, vw, vh, mode = "width") => {
  if (mode === "cover" && vw / vh < ar) return [Math.round(vh * ar), vh];
  return [vw, Math.round(vw / ar)];
};
// bare framed shot (a phone screen, a logo tile): .win box (2.5px ink edge) with the image (#id-i) filling it, in #id-c.
// pad = inset of the image as a fraction of the box (logo tiles; the image keeps its aspect).
const shotBox = (id, x, y, w, h, src, o = {}) => {
  const pad = o.pad || 0, iw = w - 5, ih = h - 5;
  return `<div id="${id}" class="win" ${o.attr || ""} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div id="${id}-c" class="wc">` +
    `<img id="${id}-i" src="${src}" alt="" data-layout-allow-overlap style="position:absolute;left:${r1(iw * pad)}px;top:${r1(ih * pad)}px;width:${r1(iw * (1 - 2 * pad))}px;height:${r1(ih * (1 - 2 * pad))}px${pad ? ";object-fit:contain" : ""}">` +
    (o.inner || "") + `</div></div>`;
};
// agent window: its logo, placeholder rows, a lime progress bar (#id-pf, grows with scaleX); contents in #id-c
const agentWin = (id, x, y, w, h, title, logo, o = {}) => {
  const lx = o.lx ?? (o.logo === false ? 22 : 96);
  const rows = (o.lines || [0.8, 0.62, 0.7]).filter((f, i) => 70 + i * 34 + 16 < h - 66)
    .map((f, i) => `<div class="win-ph${i ? " lt" : ""}" style="left:${lx}px;top:${70 + i * 34}px;width:${Math.round((w - lx - 26) * f)}px;height:16px"></div>`).join("");
  return appWinC(id, x, y, w, h, title,
    (o.logo === false ? "" : `<img src="assets/logos/${logo}.svg" alt="" style="position:absolute;left:22px;top:66px;width:56px;height:56px">`) + rows + (o.extra || "") +
    `<div class="pbar" style="left:22px;right:22px;bottom:22px;height:28px"><div id="${id}-pf" class="pfill"></div></div>`, o);
};

// branch rails: a git graph. trunk = path d, branches = [d, ...] (neutral tubes that draw on, each with a lime twin
// #id-g<i> that draws over it when changes flow down it), nodes = [[x, y], ...] commit dots #id-n<k> that pop as the trim passes.
const rails = (id, trunk, branches, nodes) =>
  `<g id="${id}">` + dtube(`${id}-t`, trunk, { w: 12 }) +
  branches.map((d, i) => dtube(`${id}-b${i}`, d, { w: 12 })).join("") +
  branches.map((d, i) => dtube(`${id}-g${i}`, d, { w: 12, fill: T.lime })).join("") +
  nodes.map(([x, y], k) => `<circle id="${id}-n${k}" cx="${x}" cy="${y}" r="14" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>`).join("") + `</g>`;
// dimension line: a measured span with end ticks; the line (#id-l0/l1) trims out from its centre, the ticks (#id-a/b) pop
const dimLine = (id, x1, x2, y, tick = 20) => {
  const m = r1((x1 + x2) / 2), p = (k, d) => `<path id="${id}-${k}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${d}" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linecap="square"/>`;
  return `<g id="${id}">${p("l0", `M${m} ${y} H${x1}`)}${p("l1", `M${m} ${y} H${x2}`)}` +
    `<path id="${id}-a" d="M${x1} ${y - tick} V${y + tick}" stroke="${T.ink}" stroke-width="2.5"/><path id="${id}-b" d="M${x2} ${y - tick} V${y + tick}" stroke="${T.ink}" stroke-width="2.5"/></g>`;
};

// ---- timeline code builders (strings for a scene's anim) ----
// stretch tether: a live tube (and the pulses riding it) re-routes as the thing it is tied to moves. Every path under
// the selectors gets its d tweened A -> B (same command structure, so GSAP interpolates each number).
const stretch = (sels, dA, dB, at, dur, ease = "E.inOut") =>
  `tl.fromTo(q("${sels}"), { attr: { d: "${dA}" } }, { attr: { d: "${dB}" }, duration: ${dur}, ease: ${ease}, immediateRender: false }, ${r2(at)});`;
// detail lens: a trim box draws on a region of a shot (box = an hlTrim id), then a morph frame (mf, an mframe in .lift)
// lifts out of that region and opens into the inset (a shotBox showing the region magnified), which appears as the
// frame lands, its image settling from a slight push. src / dst = [x, y, w, h] in .lift coords.
const lensIn = (box, mf, inset, src, dst, at, dur = 0.45) => `
      draw(q("#${box} path"), ${r2(at)}, 0.4);
      mfSet("${mf}", ${js(src)}); gsap.set(q("#${mf}, #${inset}"), { opacity: 0 });
      tl.set("#${mf}", { opacity: 1 }, ${r2(at + 0.3)});
      morph("${mf}", ${js(src)}, ${js(dst)}, ${r2(at + 0.3)}, ${dur}, E.inOut);
      tl.set("#${mf}", { opacity: 0 }, ${r2(at + 0.3 + dur)}); tl.set("#${inset}", { opacity: 1 }, ${r2(at + 0.3 + dur)});
      tl.fromTo("#${inset}-i", { scale: 1.12 }, { scale: 1, duration: 0.6, ease: E.outQ, transformOrigin: "50% 50%" }, ${r2(at + 0.3 + dur)});`;
const lensOut = (box, inset, at) => `
      wipeOut("#${inset}", ${r2(at)}, 0.26);
      untrim(q("#${box} path"), ${r2(at + 0.08)}, 0.28);`;
// converge into a window: each item [sel, x, y, w] (CSS top-left and width of a square item in .lift) flies its centre
// to point pt, shrinking to scale k about its centre (the same origin pop() uses, so scrubbing never jumps) and
// accelerating in (E.in), staggered, and is hidden on arrival. Give the items MB() and static contents.
const converge = (items, pt, at, dur = 0.42, st = 0.05, k = 0.25) => items.map(([sel, x, y, w], i) => {
  const t = r2(at + i * st), dx = r2(pt[0] - (x + w / 2)), dy = r2(pt[1] - (y + w / 2));
  return `
      tl.fromTo("${sel}", { x: 0, y: 0, scale: 1 }, { x: ${dx}, y: ${dy}, scale: ${k}, duration: ${dur}, ease: E.in, transformOrigin: "50% 50%", immediateRender: false }, ${t});
      tl.set("${sel}", { opacity: 0 }, ${r2(t + dur)});`;
}).join("");
// screen push: screen a leaves left as screen b enters from the right (one eased move; give both MB())
const pushScreens = (a, b, vw, at, dur = 0.55) => `
      tl.fromTo("#${a}", { x: 0 }, { x: ${-vw}, duration: ${dur}, ease: E.inOut, immediateRender: false }, ${r2(at)});
      tl.fromTo("#${b}", { x: ${vw} }, { x: 0, duration: ${dur}, ease: E.inOut, immediateRender: false }, ${r2(at)});`;
// zoom inside a window: the screen scales about (ox, oy) (px in its own coords) while the frame stays put
const zoomIn = (sel, at, s, ox, oy, dur = 0.7, from = 1) =>
  `tl.fromTo("${sel}", { scale: ${from} }, { scale: ${s}, duration: ${dur}, ease: E.cam, transformOrigin: "${ox}px ${oy}px", immediateRender: false }, ${r2(at)});`;

module.exports = {
  fs, path, T, C, S, make, tube, arrow, leader, check,
  r1, txt, label, lead, dtube, barrow, cube, bez, bpath, samples, nsv,
  router, wifiArcs, phone, mergeGlyph, fanGlyph, GLYPHS, laptop, adapter, appWin, tagInner, plate, stag,
  ethBox, stopwatch, gauge, workspace, ICONS, icoTile, POINTER, ph, js,
  mediaCard, layer, slider, sliderAnim, hlBox,
  BZ_SRC, EZ, bz, E, r2, r3, CAM_O, camOf, toScreen, placeAt, lerp, lerpR, handoff, segEase, carry, morphCode,
  SETTLE, MB, mframe, appWinC, trimRect, hlTrim, pulse, klabel, typed, beatGrid,
  anat, selector, board,
  CSS, HELPERS, scene, sceneRaw, limeEdges, keyOf, makeCues, ctaScene, todoScene,
  screenWin, fitShot, shotBox, agentWin, rails, dimLine, stretch, lensIn, lensOut, converge, pushScreens, zoomIn,
};
