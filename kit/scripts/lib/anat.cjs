// Adapter: Anatomy's geometry kit (scripts/lib/anatomy, MIT) drawn in our identity.
// The camera is set so Anatomy's iso() equals make(ox, oy).P exactly at u = 1 (true 30-degree iso),
// and its SolidPaths are painted flat: lit side g300, shade side g500, top g100, ink outlines. No halo, no classes.
const K = require("./anatomy/iso-kit.mjs");

module.exports = (T, ox, oy, u = 1) => {
  // u: uniform size (1 world unit = u px); strokes stay at the identity weights
  const PR = { origin: [ox, oy], scale: Math.sqrt(1.5 / 1.6) * u, azimuth: 45, elevation: (Math.asin(1 / Math.sqrt(3)) * 180) / Math.PI };
  const f = (n) => (Math.round(n * 10) / 10).toString();
  const at = (p) => K.iso(p, PR);
  const ink = (d, sw = 2.5, c = T.ink) => (d ? `<path d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : "");
  const flat = (d, fill) => (d ? `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="0.6" stroke-linejoin="round"/>` : "");
  // a solid: base fill in the lit tone, the shade facets darker, the top face, then ink silhouette + crease
  function solid(sp, o = {}) {
    const lit = o.lit || T.g300, dark = o.dark || T.g500, top = o.top || T.g100;
    return flat(sp.fill, lit) + flat(sp.shades[0] + sp.shades[1], dark) + flat(sp.top, top) +
      ink(sp.outline + sp.crease, o.sw || 2.5) + (sp.bevel ? ink(sp.bevel, 1.25) : "");
  }
  const slab = (plan, z, h, o = {}) => solid(K.slabOf(plan, z, h, PR, 8, o.bevel || 0), o);
  const cyl = (cx, cy, r, z, h, o = {}) => solid(K.cylinder(cx, cy, r, z, h, PR, o.steps || 48, o.bevel || 0), o);
  // a circle in a vertical face plane (axis "x": plane x = const, "y": plane y = const), as a closed path
  const circ = (c, r, axis, n = 36) => K.pathOf(Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, u = r * Math.cos(a), v = r * Math.sin(a);
    return at(axis === "x" ? [c[0], c[1] + u, c[2] + v] : [c[0] + u, c[1], c[2] + v]);
  }), true);
  // convex hull of screen points (for a rod's side silhouette)
  function hull(pts) {
    const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of s) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = s.length - 1; i >= 0; i--) { const p = s[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return [...lo.slice(0, -1), ...up.slice(0, -1)];
  }
  // a horizontal gland sticking out of a face along +x or +y: body, end cap, dark bore
  function gland(axis, c, from, to, r, o = {}) {
    const ring = (s) => Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2, u = r * Math.cos(a), v = r * Math.sin(a);
      return at(axis === "x" ? [s, c[1] + u, c[2] + v] : [c[0] + u, s, c[2] + v]);
    });
    const end = axis === "x" ? [to, c[1], c[2]] : [c[0], to, c[2]];
    return `<path d="${K.pathOf(hull([...ring(from), ...ring(to)]), true)}" fill="${o.body || T.g500}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="${circ(end, r, axis)}" fill="${o.cap || T.g100}" stroke="${T.ink}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="${circ(end, r * 0.55, axis)}" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.5"/>`;
  }
  // screw head on a top face: ring + slot
  const screw = (x, y, z, r = 6) =>
    `<path d="${K.ring(x, y, r, z, PR, 24)}" fill="${T.g300}" stroke="${T.ink}" stroke-width="1.5"/>` + ink(K.lineOnTop([x - r * 0.55, y + r * 0.55], [x + r * 0.55, y - r * 0.55], z, PR), 1.5);
  // ticks on a top plane, angle 0 = +x, 90 = +y (degrees, world plane)
  const tick = (cx, cy, z, deg, r0, r1, sw = 2) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return ink(K.lineOnTop([cx + c * r0, cy + s * r0], [cx + c * r1, cy + s * r1], z, PR), sw);
  };
  const topM = (x, y, z) => K.topMatrix([x, y], z, PR);
  return { K, PR, f, at, ink, flat, solid, slab, cyl, circ, gland, screw, tick, topM };
};
