// Isometric line-art helpers for the v2 "editorial isometric" style (see DESIGN.md).
// World axes: x runs down-right, y runs down-left, z is up. 30-degree true isometric.
(function () {
  const C = Math.cos(Math.PI / 6), S = 0.5;
  const T = {
    paper: "#0E0F11", hi: "#18191C", sheet: "#16171A", grid: "#24252A", rule: "#34363B",
    g100: "#3A3C40", g300: "#2C2D31", g500: "#202124", g700: "#111214", g900: "#0A0B0C",
    dark: "#4A4C51", ink: "#ECEBE6", lime: "#D3F654", limeL: "#B9DC3A", limeR: "#9DBF2B", on: "#0E0F11",
  };
  const f = (n) => (Math.round(n * 10) / 10).toString();
  const pt = (p) => f(p[0]) + "," + f(p[1]);

  function make(ox, oy) {
    const P = (x, y, z) => [ox + (x - y) * C, oy + (x + y) * S - (z || 0)];
    const poly = (pts, fill, sw, extra) =>
      `<polygon points="${pts.map(pt).join(" ")}" fill="${fill}" stroke="${T.ink}" stroke-width="${sw == null ? 2.5 : sw}" stroke-linejoin="round" ${extra || ""}/>`;
    const quad = (a, b, c, d, fill, sw) => poly([P(...a), P(...b), P(...c), P(...d)], fill, sw);
    const line = (a, b, sw, color) =>
      `<line x1="${f(P(...a)[0])}" y1="${f(P(...a)[1])}" x2="${f(P(...b)[0])}" y2="${f(P(...b)[1])}" stroke="${color || T.ink}" stroke-width="${sw || 1.75}" stroke-linecap="round"/>`;

    // a box: top (lightest), y-face = lower-left (mid), x-face = lower-right (dark)
    function box(x, y, z, w, d, h, c) {
      c = c || {};
      const sw = c.sw == null ? 2.5 : c.sw;
      const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
      const xf = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)];
      const yf = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)];
      return poly(yf, c.left || T.g100, sw) + poly(xf, c.right || T.g500, sw) + poly(top, c.top || T.hi, sw);
    }

    // affine transform that maps local (0,0)->p00, (w,0)->p10, (0,h)->p01 (all world points)
    function face(p00, p10, p01, w, h) {
      const a = P(...p00), b = P(...p10), c = P(...p01);
      return `matrix(${f((b[0] - a[0]) / w * 1000) / 1000} ${f((b[1] - a[1]) / w * 1000) / 1000} ${f((c[0] - a[0]) / h * 1000) / 1000} ${f((c[1] - a[1]) / h * 1000) / 1000} ${f(a[0])} ${f(a[1])})`;
    }
    // local frames on box faces (content drawn in a w x h local box)
    const topFace = (x, y, z, w, d) => face([x, y, z], [x + w, y, z], [x, y + d, z], w, d);
    const yFace = (x, y, z, w, h) => face([x, y, z + h], [x + w, y, z + h], [x, y, z], w, h); // plane y = const
    const xFace = (x, y, z, d, h) => face([x, y, z + h], [x, y + d, z + h], [x, y, z], d, h); // plane x = const

    // iso ellipse on the ground plane (radius r, centre x,y,z)
    function disc(x, y, z, r, fill, sw) {
      const c = P(x, y, z);
      return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(r * C * Math.SQRT2)}" ry="${f(r * S * Math.SQRT2)}" fill="${fill}" stroke="${T.ink}" stroke-width="${sw == null ? 1.75 : sw}"/>`;
    }
    // short vertical cylinder (knob / antenna base)
    function knob(x, y, z, r, h, fill) {
      const a = P(x, y, z), b = P(x, y, z + h);
      const rx = r * C * Math.SQRT2, ry = r * S * Math.SQRT2;
      return `<path d="M${f(a[0] - rx)} ${f(a[1])} L${f(b[0] - rx)} ${f(b[1])} L${f(b[0] + rx)} ${f(b[1])} L${f(a[0] + rx)} ${f(a[1])} A${f(rx)} ${f(ry)} 0 0 1 ${f(a[0] - rx)} ${f(a[1])} Z" fill="${fill || T.g500}" stroke="${T.ink}" stroke-width="1.75" stroke-linejoin="round"/>` +
        `<ellipse cx="${f(b[0])}" cy="${f(b[1])}" rx="${f(rx)}" ry="${f(ry)}" fill="${T.hi}" stroke="${T.ink}" stroke-width="1.75"/>`;
    }
    return { P, poly, quad, line, box, face, topFace, yFace, xFace, disc, knob };
  }

  // ---- screen-space pieces ----
  // double-line tube along an SVG path (cable). lime=true for the accent flow tube
  function tube(d, o) {
    o = o || {};
    const w = o.w || 12, fill = o.fill || T.paper, edge = fill === T.lime ? T.on : T.ink;
    return `<path d="${d}" fill="none" stroke="${edge}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  // chunky block arrow, tail at (x,y), pointing along angle (deg), total length len
  function arrow(x, y, len, angle, fill, o) {
    o = o || {};
    const t = o.t || 26, hw = o.hw || t * 1.9, hl = o.hl || t * 1.5, s = len - hl;
    const pts = [[0, -t / 2], [s, -t / 2], [s, -hw / 2], [len, 0], [s, hw / 2], [s, t / 2], [0, t / 2]];
    return `<polygon transform="translate(${f(x)} ${f(y)}) rotate(${angle})" points="${pts.map(pt).join(" ")}" fill="${fill || T.lime}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  // leader line: polyline of points, small solid arrowhead at the last point
  function leader(points, o) {
    o = o || {};
    const [a, b] = points.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    const head = o.head === false ? "" :
      `<polygon transform="translate(${f(b[0])} ${f(b[1])}) rotate(${f(ang)})" points="0,0 -13,-6 -13,6" fill="${T.ink}"/>`;
    return `<polyline points="${points.map(pt).join(" ")}" fill="none" stroke="${T.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` + head;
  }
  // a check mark in local coordinates (for check tags)
  const check = (x, y, s, sw) =>
    `<path d="M${f(x)} ${f(y + s * 0.5)} L${f(x + s * 0.38)} ${f(y + s * 0.85)} L${f(x + s)} ${f(y + s * 0.1)}" fill="none" stroke="${T.on}" stroke-width="${sw || 3}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // flat frontal app window (title bar with three dots); content drawn by caller
  function windowFrame(x, y, w, h, o) {
    o = o || {};
    const bar = o.bar || 40;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || T.hi}" stroke="${T.ink}" stroke-width="2.5"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${bar}" fill="${T.g100}" stroke="${T.ink}" stroke-width="2.5"/>`;
    for (let i = 0; i < 3; i++) s += `<circle cx="${x + 20 + i * 20}" cy="${y + bar / 2}" r="5" fill="${T.hi}" stroke="${T.ink}" stroke-width="1.75"/>`;
    if (o.title) s += `<text x="${x + w / 2}" y="${y + bar / 2 + 8}" text-anchor="middle" font-family="Inter" font-weight="500" font-size="22" fill="${T.ink}">${o.title}</text>`;
    return s;
  }

  window.ISO = { T, C, S, make, tube, arrow, leader, check, windowFrame };
})();
