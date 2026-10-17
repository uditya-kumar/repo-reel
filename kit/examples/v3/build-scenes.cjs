// Generates the v3 (dark palette) scene compositions (compositions/scenes/*.html) in the DESIGN.md style.
// Geometry is computed here with assets/js/iso.js; motion is a GSAP timeline per scene.
// Run: node scripts/build-scenes.cjs
const fs = require("fs");
const path = require("path");
global.window = {};
eval(fs.readFileSync(path.join(__dirname, "../assets/js/iso.js"), "utf8"));
const { T, C, S, make, tube, arrow, leader, check } = window.ISO;
const OUT = path.join(__dirname, "../compositions/scenes");
fs.mkdirSync(OUT, { recursive: true });

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
function laptop(id, ox, oy) {
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
    // MultiPath glyph: two paths merging into one
    `<path id="${id}-gl" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" d="M70 62 C120 62 120 95 160 95 M70 128 C120 128 120 95 160 95 L232 95" fill="none" stroke="${T.lime}" stroke-width="9" stroke-linecap="round"/>` +
    [[70, 62], [70, 128], [232, 95]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${T.hi}" stroke="${T.ink}" stroke-width="2" ${nsv}/>`).join("") +
    `</g>`;
  return `<g id="${id}">${g}</g>`;
}
function adapter(id, ox, oy) {
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
  g += `<g transform="${m.topFace(60, 40, H + 14, 100, 80)}"><text x="50" y="50" text-anchor="middle" font-family="Inter" font-weight="600" font-size="30" fill="${T.ink}">MP</text></g>`;
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
const plate = (id, x, y, w, text, kind) =>
  `<div id="${id}" class="plate" style="left:${x}px;top:${y}px;width:${w}px"><span>${text}</span>` +
  `<svg id="${id}-tag" class="tag" width="58" height="40" viewBox="0 0 58 40">${tagInner(kind)}</svg></div>`;
// svg tag centred on (cx, cy)
const stag = (id, cx, cy, kind) => `<g transform="translate(${cx - 29} ${cy - 20})"><g id="${id}">${tagInner(kind)}</g></g>`;

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
`;
// shared timeline helpers (seek-safe: only fromTo/to tweens on a paused timeline)
const HELPERS = `
      const q = (s) => document.querySelectorAll(s);
      const slide = (s, at, dx = 40, dy = -23) => tl.fromTo(s, { x: dx, y: dy, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, at);
      const fadeUp = (s, at, d = 10, dur = 0.3) => tl.fromTo(s, { y: d, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease: "power2.out" }, at);
      const draw = (s, at, dur = 0.5) => {
        tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
        tl.fromTo(s, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, at);
      };
      const wipe = (s, at, dur = 0.35) => tl.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: dur, ease: "power2.out", transformOrigin: "0% 50%" }, at);
      const pop = (s, at) => tl.fromTo(s, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out", transformOrigin: "50% 50%" }, at);
      const lead = (id, at) => { draw("#" + id + "-l", at, 0.3); pop("#" + id + "-h", at + 0.28); };
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
function sceneRaw({ id, p, dur, lift, svg, html = "", anim }) {
  return `<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>${CSS}  </style>
  <div id="root" data-composition-id="${id}" data-start="0" data-duration="${dur}" data-width="1080" data-height="1920">
    <div id="${p}-stage" class="clip stage" data-start="0" data-duration="${dur}" data-track-index="1">
      <div id="${p}-cam" class="cam">
        <div class="lift" style="top:${lift}px">
        <svg id="${p}-art" class="art" viewBox="0 0 1080 1920">${svg}</svg>
        ${html}
        </div>
      </div>
    </div>
  </div>
  <script>
    (function () {
      const D = ${dur};
      const tl = gsap.timeline({ paused: true });${HELPERS}
${anim}
      // slow push across the scene, quick clear at the end (grid stays)
      tl.fromTo("#${p}-cam", { scale: 1 }, { scale: 1.03, duration: D, ease: "none" }, 0);
      tl.to("#${p}-cam", { opacity: 0, duration: 0.25, ease: "power1.in" }, D - 0.25);
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

// ===== Scene 1: hook =====
{
  const svg =
    barrow("f01-arL", 345, 955, 110, 35, T.lime) +
    barrow("f01-arR", 790, 930, 100, 145, T.lime) +
    router("f01-router", 290, 780) +
    wifiArcs("f01-wifi", 352, 712) +
    phone("f01-phone", 740, 830) +
    laptop("f01-laptop", 500, 1110) +
    `<g id="f01-plus">${txt(575, 800, "+", { size: 96, w: 400, a: "middle", ls: 0 })}</g>` +
    label("f01-lb1", 58, 700, ["WI-FI"]) + lead("f01-ld1", [[76, 716], [76, 808], [192, 808]]) +
    label("f01-lb2", 1022, 640, ["MOBILE", "DATA"], { a: "end" }) + lead("f01-ld2", [[1004, 692], [1004, 780], [856, 780]]) +
    label("f01-lb3", 58, 1150, ["YOUR PC"]) + lead("f01-ld3", [[76, 1166], [76, 1202], [318, 1202]]);
  const anim = `
      slide("#f01-laptop", 0.35);
      fadeUp("#f01-lb3", 0.75); lead("f01-ld3", 0.8);
      slide("#f01-router", 0.9);
      tl.fromTo(q("#f01-wifi path"), { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.12 }, 1.2);
      tl.fromTo("#f01-wifi circle", { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.15);
      fadeUp("#f01-lb1", 1.0); lead("f01-ld1", 1.05);
      slide("#f01-phone", 1.55, -40, -23);
      tl.fromTo(q("#f01-phone rect[id]"), { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.1 }, 1.9);
      fadeUp("#f01-lb2", 1.65); lead("f01-ld2", 1.7);
      pop("#f01-plus", 2.1);
      wipe("#f01-arL", 2.3); wipe("#f01-arR", 2.38);
      draw("#f01-laptop-gl", 2.6, 0.6);
      // wi-fi arcs keep breathing
      tl.to(q("#f01-wifi path"), { opacity: 0.25, duration: 0.3, stagger: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut" }, 2.6);`;
  fs.writeFileSync(path.join(OUT, "01-hook.html"), scene({
    id: "01-hook", p: "f01", dur: 4.15, lift: -140, svg, anim,
  }));
}

// ===== Scene 2: meet =====
{
  // tray screenshot: x 560, y 590, 420 wide; plain ink outline, no title bar
  const imgTop = 590 + 2.5 - 3;
  const rowY = (py) => Math.round(imgTop + (py / 1452) * 692);
  const yW = rowY(710), yU = rowY(893), yE = rowY(1063);
  const html =
    plate("f02-pl1", 58, 610, 470, "Free + open-source") +
    plate("f02-pl2", 58, 700, 470, "Windows + Linux") +
    `<div id="f02-win" class="win" style="left:560px;top:590px;width:420px;height:${2.5 + 684 + 2.5}px">` +
    `<img id="f02-shot" data-layout-allow-overflow src="assets/shots/tray-panel.png" alt="" style="position:absolute;left:-4px;top:-3px;width:424px;height:692px"></div>` +
    plate("f02-all", 58, 1212, 470, "All at the same time");
  const svg =
    label("f02-lb1", 58, yW + 11, ["WI-FI"]) + lead("f02-ld1", [[178, yW], [550, yW]]) +
    label("f02-lb2", 58, yE + 11, ["ETHERNET"]) + lead("f02-ld2", [[248, yE], [550, yE]]) +
    label("f02-lb3", 58, yU + 11, ["USB PHONE"]) + lead("f02-ld3", [[270, yU], [550, yU]]);
  const anim = `
      tl.fromTo("#f02-win", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.35);
      slide("#f02-pl1", 1.4, -40, 0); pop("#f02-pl1-tag", 1.75);
      slide("#f02-pl2", 2.9, -40, 0); pop("#f02-pl2-tag", 3.25);
      fadeUp("#f02-lb1", 4.5); lead("f02-ld1", 4.55);
      fadeUp("#f02-lb2", 5.25); lead("f02-ld2", 5.3);
      fadeUp("#f02-lb3", 6.25); lead("f02-ld3", 6.3);
      slide("#f02-all", 7.9, -40, 0); pop("#f02-all-tag", 8.25);`;
  fs.writeFileSync(path.join(OUT, "02-meet.html"), scene({
    id: "02-meet", p: "f02", dur: 9.25, lift: -130,
    svg, html, anim,
  }));
}

// ===== Scene 3: catch =====
{
  const inT = [
    [[200, 742], [200, 830], [440, 840], [470, 945]],
    [[540, 742], [540, 810], [540, 870], [540, 940]],
    [[880, 742], [880, 830], [640, 840], [610, 945]],
  ];
  const outT = [
    [[440, 1000], [420, 1100], [300, 1120], [300, 1260]],
    [[640, 1000], [700, 1080], [820, 1100], [830, 1200]],
  ];
  const ph = (x, y, w, h, lt) => `<div class="win-ph${lt ? " lt" : ""}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
  const wins = ["Browser", "Steam", "YouTube"].map((t, i) =>
    appWin(`f03-w${i}`, 70 + i * 340, 600, 260, 142, t, ph(16, 62, 222, 26) + ph(16, 98, 66, 28, 1) + ph(94, 98, 66, 28, 1) + ph(172, 98, 66, 28, 1))).join("");
  let packets = "";
  for (let t = 0; t < 3; t++) for (let k = 0; k < 3; k++) packets += cube(`f03-pi${t}${k}`);
  for (let t = 0; t < 2; t++) for (let k = 0; k < 3; k++) packets += cube(`f03-po${t}${k}`);
  const svg =
    inT.map((p, i) => dtube(`f03-ti${i}`, bpath(p), { w: 10, fill: T.lime })).join("") +
    outT.map((p, i) => dtube(`f03-to${i}`, bpath(p), { w: 10, fill: T.paper })).join("") +
    packets +
    adapter("f03-adapter", 505, 900) +
    router("f03-router", 260, 1250, 0.8) +
    phone("f03-phone", 800, 1250, 0.72) +
    label("f03-lb1", 58, 860, ["VIRTUAL", "ADAPTER"]) + lead("f03-ld1", [[76, 912], [76, 967], [356, 967]]) +
    label("f03-lb2", 58, 1180, ["WI-FI"]) + lead("f03-ld2", [[76, 1196], [76, 1277], [172, 1277]]) +
    label("f03-lb3", 1022, 1060, ["USB PHONE"], { a: "end" }) + lead("f03-ld3", [[1004, 1076], [1004, 1215], [872, 1215]]);
  const js = (o) => JSON.stringify(o);
  const anim = `
      tl.fromTo(q(".win[id^='f03-w']"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.12 }, 0.35);
      slide("#f03-router", 0.9); slide("#f03-phone", 1.05, -40, -23);
      fadeUp("#f03-lb2", 1.2); lead("f03-ld2", 1.25);
      fadeUp("#f03-lb3", 1.35); lead("f03-ld3", 1.4);
      slide("#f03-adapter", 2.4, 0, -60);
      fadeUp("#f03-lb1", 2.85); lead("f03-ld1", 2.9);
      draw(q("#f03-to0 path, #f03-to1 path"), 3.1, 0.6);
      draw(q("#f03-ti0 path, #f03-ti1 path, #f03-ti2 path"), 3.85, 0.7);
      const IN = ${js(inT.map((p) => samples(p, 0.04, 0.93)))};
      const OUT = ${js(outT.map((p) => samples(p, 0.12, 0.97)))};
      for (let t = 0; t < 3; t++) for (let k = 0; k < 3; k++) flow("#f03-pi" + t + k, IN[t], 4.4 + k * 0.4 + t * 0.13, 1.2, Math.floor((D - 0.35 - 4.4 - k * 0.4 - t * 0.13) / 1.2) - 1);
      for (let t = 0; t < 2; t++) for (let k = 0; k < 3; k++) flow("#f03-po" + t + k, OUT[t], 4.9 + k * 0.4 + t * 0.2, 1.2, Math.floor((D - 0.35 - 4.9 - k * 0.4 - t * 0.2) / 1.2) - 1);`;
  fs.writeFileSync(path.join(OUT, "03-catch.html"), scene({
    id: "03-catch", p: "f03", dur: 6.55, lift: -145, svg, html: wins, anim,
  }));
}

// ===== Scene 4: math (slot 05) =====
{
  const SZ = 90;
  // a box as three id'd faces so its height can grow by tweening polygon points
  const faces = (ox, oy, z0, h) => {
    const m = make(ox, oy), P = m.P, w = SZ, d = SZ, z = z0 + h;
    const s = (a) => a.map((p) => `${r1(p[0])},${r1(p[1])}`).join(" ");
    return {
      left: s([P(0, d, z), P(w, d, z), P(w, d, z0), P(0, d, z0)]),
      right: s([P(w, 0, z), P(w, d, z), P(w, d, z0), P(w, 0, z0)]),
      top: s([P(0, 0, z), P(w, 0, z), P(w, d, z), P(0, d, z)]),
    };
  };
  const bar = (id, ox, oy, z0, h, col) => {
    const f = faces(ox, oy, z0, h);
    const poly = (k, fill) => `<polygon id="${id}-${k}" points="${f[k]}" fill="${fill}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    return `<g id="${id}">${poly("left", col[1])}${poly("right", col[2])}${poly("top", col[0])}</g>`;
  };
  const GREY = [T.g100, T.g300, T.g500], LIME = [T.lime, T.limeL, T.limeR];
  const bars = [
    ["f05-b1", 200, 1180, 0, 200, GREY],
    ["f05-b2", 450, 1180, 0, 200, GREY],
    ["f05-b3", 820, 1180, 0, 200, GREY],
    ["f05-b4", 820, 1180, 200, 200, LIME],
  ];
  const svg =
    bars.map((b) => bar(...b)).join("") +
    `<g id="f05-plus">${txt(325, 1168, "+", { size: 90, a: "middle", ls: 0 })}</g>` +
    barrow("f05-ar", 552, 1130, 112, 0, T.lime) +
    `<g id="f05-v1">${txt(200, 948, '10 <tspan font-weight="400" font-size="34">Mbps</tspan>', { size: 50, w: 600, a: "middle", ls: 0 })}</g>` +
    `<g id="f05-v2">${txt(450, 948, '10 <tspan font-weight="400" font-size="34">Mbps</tspan>', { size: 50, w: 600, a: "middle", ls: 0 })}</g>` +
    `<g id="f05-v3">${txt(820, 742, '≈ 20 <tspan font-weight="400" font-size="40">Mbps</tspan>', { size: 66, w: 600, a: "middle", ls: 0 })}</g>` +
    label("f05-c1", 200, 1345, ["WI-FI"], { a: "middle" }) +
    label("f05-c2", 450, 1345, ["PHONE"], { a: "middle" }) +
    label("f05-c3", 820, 1345, ["COMBINED"], { a: "middle" });
  const grow = bars.map(([id, ox, oy, z0, h]) => [id, faces(ox, oy, z0, 0), faces(ox, oy, z0, h)]);
  const anim = `
      const G = ${JSON.stringify(grow)};
      const growBar = (i, at, dur = 0.55) => {
        const [id, a, b] = G[i];
        tl.fromTo("#" + id, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
        ["left", "right", "top"].forEach((k) => tl.fromTo("#" + id + "-" + k, { attr: { points: a[k] } }, { attr: { points: b[k] }, duration: dur, ease: "power3.out" }, at));
      };
      growBar(0, 0.25); fadeUp("#f05-c1", 0.3); fadeUp("#f05-v1", 0.65);
      pop("#f05-plus", 0.75);
      growBar(1, 0.9); fadeUp("#f05-c2", 0.95); fadeUp("#f05-v2", 1.3);
      wipe("#f05-ar", 1.55);
      growBar(2, 1.95); fadeUp("#f05-c3", 2.0);
      growBar(3, 2.45, 0.6);
      fadeUp("#f05-v3", 3.0, 16, 0.35);`;
  fs.writeFileSync(path.join(OUT, "05-math.html"), scene({
    id: "05-math", p: "f05", dur: 4, lift: -215, svg, anim,
  }));
}
require("./scenes-late.cjs")({ fs, path, OUT, T, make, r1, nsv, label, lead, dtube, cube, bpath, samples, adapter, router, phone, laptop, appWin, plate, stag, tagInner, scene });
console.log("scenes written to", OUT);
