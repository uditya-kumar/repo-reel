// Drawn app UI (DESIGN.md 5.9), in the interface guideline kit/InterfaceDesignGuideline.md (a Linear-style system):
// near-black surfaces, hairline borders, 6 / 12 / pill radii, Inter 400-590 with cv01 / ss03 / zero, a mono face for
// code and IDs, acid lime only for the one primary action (and active indicators), colour-coded status badges.
// Sizes are the guideline's web scale x1.5 so they read on a phone. Every drawn app window shows real contents built
// from these pieces (never grey placeholder blocks). The reel's own frame (grid, captions, plates, labels, tubes,
// screenshots, CTA) keeps DESIGN.md; only the app interfaces use this file. Scenes load it with
// `const U = require("../lib/ui.cjs")(L), C = U.C;`. Worked example: kit/examples/replica/ (Replica reel).
// Pieces: windows (win, card, chrome + grow, mframeL), controls (input, btn, pill, badge, status, toggle, kbd, chev),
// a booking app (booking), Claude Code (ccWelcome, ccInput, ccLine), the compare slider (compareFrame + slideCompare),
// the scan line (scanLine + scan), the wireframe-to-real rebuild (wireSvg + rebuild), rounded trim paths (rrD, rrHalves).
module.exports = (L) => {
  // the guideline's colour tokens (void, carbon, obsidian, graphite, smoke, ash, fog, mist, bone, paper, lime, green,
  // coral, teal, iris, lav); text on dark uses paper (headings), mist (body), fog (muted)
  const C = {
    void: "#08090a", carbon: "#0f1011", obsidian: "#161718", graphite: "#23252a", smoke: "#383b3f", ash: "#62666d",
    fog: "#8a8f98", mist: "#d0d6e0", bone: "#e5e5e6", paper: "#ffffff", lime: "#e4f222", green: "#27a644",
    coral: "#eb5757", teal: "#02b8cc", iris: "#6366f1", lav: "#8b5cf6",
  };
  // a token as rgba (the guideline's translucent fills, e.g. rgba(255,255,255,0.05))
  const rgba = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;
  // Inter's guideline features (cv01, ss03, zero) as a style string (single quotes: it sits in a style attribute)
  const FEAT = `font-feature-settings:'cv01' on,'ss03' on,'zero' on;`;
  // the mono face for code, commands, file names and IDs (the guideline's Berkeley Mono; ui-monospace stands in)
  const MONO = `font-family:ui-monospace,Consolas,monospace;font-feature-settings:normal;letter-spacing:-0.013em;`;
  // radii: cards 12, buttons and inputs 8, badges 6 (pills 9999)
  const R = { card: 12, btn: 8, badge: 6 };
  const px = (n) => `${Math.round(n * 100) / 100}px`;
  // an absolutely placed div (x, y, w, h in the parent's px)
  const box = (id, x, y, w, h, style = "", inner = "") =>
    `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)};${style}">${inner}</div>`;
  const track = (fs) => (fs >= 60 ? "-0.022em" : fs >= 30 ? "-0.012em" : "-0.01em");
  // one line of UI text; o = { fs (24), fw (400), c (mist), mono, w, align, ls, lh, style }
  const tx = (id, x, y, text, o = {}) => {
    const fs = o.fs || 24;
    return `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${px(x)};top:${px(y)};font-size:${fs}px;font-weight:${o.fw || 400};` +
      `line-height:${o.lh || 1.25};white-space:pre;color:${o.c || C.mist};${o.mono ? MONO : `${FEAT}letter-spacing:${o.ls || track(fs)};`}` +
      `${o.w ? `width:${px(o.w)};` : ""}${o.align ? `text-align:${o.align};` : ""}font-variant-numeric:tabular-nums;${o.style || ""}">${text}</div>`;
  };
  // the guideline's hairline edge as an inset shadow (no layout cost, no outer shadow)
  const hair = (c = C.graphite) => `box-shadow:inset 0 0 0 1.5px ${c};`;
  // a 1.5px rule
  const divider = (x, y, w, c = C.graphite) => box("", x, y, w, 1.5, `background:${c};`);

  // ---- surfaces ----
  // a window's 48px title row: three dots and a centred title (title may hold spans to swap)
  const titleRow = (title) =>
    `<div class="tbar" style="position:absolute;left:0;top:0;right:0;height:48px;border-bottom:1.5px solid ${C.graphite}">` +
    [0, 1, 2].map((i) => `<i style="position:absolute;left:${18 + i * 20}px;top:18px;width:12px;height:12px;border-radius:50%;background:${C.smoke}"></i>`).join("") +
    `<span style="position:absolute;left:0;right:0;top:12px;text-align:center;font-size:20px;font-weight:510;color:${C.fog};${FEAT}letter-spacing:-0.01em;white-space:pre">${title}</span></div>`;
  // app window: obsidian card, 12px radius, smoke hairline (inset), the title row (title null = none). o.bare = no
  // fill or edge (a layer over a growing chrome); o.attr, o.style extra. The title row has class "tbar".
  // ids: #id, #id-c (title row + contents: wipeIn / wipeOut leave the bare card) · starts: visible
  const win = (id, x, y, w, h, title, inner, o = {}) =>
    `<div id="${id}" ${o.attr || ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${R.card}px;overflow:hidden;` +
    `${o.bare ? "" : `background:${C.obsidian};${hair(C.smoke)}`}${o.style || ""}"><div id="${id}-c" class="wc">${title == null ? "" : titleRow(title)}${inner}</div></div>`;
  // a nested card (darker inset surface)
  const card = (id, x, y, w, h, inner = "", o = {}) => box(id, x, y, w, h,
    `background:${o.bg || C.carbon};border-radius:${o.r || R.card}px;` + (o.dashed ? `border:1.5px dashed ${o.line || C.fog};` : hair(o.line || C.graphite)), inner);
  // a growing card drawn as an svg rounded rect (attr tweens interpolate sub-pixel, so it can grow smoothly)
  // ids: #id (rect) · starts: visible at r
  const chrome = (id, r) => `<svg class="art" viewBox="0 0 1080 1920" data-layout-allow-overlap style="position:absolute;left:0;top:0">` +
    `<rect id="${id}" x="${r[0] + 0.75}" y="${r[1] + 0.75}" width="${r[2] - 1.5}" height="${r[3] - 1.5}" rx="${R.card}" fill="${C.obsidian}" stroke="${C.smoke}" stroke-width="1.5"/></svg>`;
  const rv = (r) => `{ x: ${r[0] + 0.75}, y: ${r[1] + 0.75}, width: ${Math.max(0, r[2] - 1.5)}, height: ${Math.max(0, r[3] - 1.5)} }`;
  // anim code: a chrome grows from rect A to rect B (pair it with the layer's y and clip-path "inset(... round 12px)")
  const grow = (id, A, B, at, dur, ease = "E.inOut") =>
    `tl.fromTo("#${id}", { attr: ${rv(A)} }, { attr: ${rv(B)}, duration: ${dur}, ease: ${ease}, immediateRender: false }, ${at});`;
  // anim code: put a chrome at rect r up front
  const setChrome = (id, r) => `gsap.set("#${id}", { attr: ${rv(r)} });`;
  // the guideline's morph frame for cross-cut handoffs: the lib's five transform-only parts, in obsidian + smoke
  const mframeL = (id) => `<div id="${id}" class="mf" data-layout-allow-overlap>` +
    [["f", "mf-f", `background:${C.obsidian}`], ["t", "mf-h", `background:transparent;border-top:1.5px solid ${C.smoke}`],
      ["b", "mf-h", `background:transparent;border-bottom:1.5px solid ${C.smoke}`], ["l", "mf-v", `background:transparent;border-left:1.5px solid ${C.smoke}`],
      ["r", "mf-v", `background:transparent;border-right:1.5px solid ${C.smoke}`]]
      .map(([k, c, st]) => `<i id="${id}-${k}" class="${c}" style="${st}" ${L.MB()} data-layout-allow-overlap></i>`).join("") + `</div>`;

  // ---- controls ----
  // text input / search field: translucent fill, hairline, 8px radius
  const input = (id, x, y, w, h, inner) => box(id, x, y, w, h,
    `background:${rgba("#ffffff", 0.02)};border:1.5px solid ${rgba("#ffffff", 0.08)};border-radius:${R.btn}px;`, inner);
  // buttons: "primary" (acid lime, the one action per view), "ghost" (hairline), "white" (pill)
  const btn = (id, x, y, w, h, text, kind = "ghost", fs = 23) => {
    const st = kind === "primary" ? `background:${C.lime};border-radius:${R.btn}px;`
      : kind === "white" ? `background:${C.paper};border-radius:9999px;`
        : `border-radius:${R.btn}px;${hair(C.smoke)}`;
    const c = kind === "ghost" ? C.mist : C.void;
    return box(id, x, y, w, h, st, tx("", 0, (h - fs * 1.25) / 2, text, { fs, fw: 510, c, w, align: "center", ls: "-0.011em" }));
  };
  // a pill's width for its text (to lay a row of pills out)
  const pillW = (text, fs = 20, dot = false) => Math.round(text.length * fs * 0.53 + 34 + (dot ? 20 : 0));
  // pill: tag chips / sources (o.dot = a colour for a leading dot, o.mono)
  const pill = (id, x, y, text, o = {}) => {
    const fs = o.fs || 20, w = o.w || pillW(text, fs, !!o.dot), h = o.h || 38;
    return box(id, x, y, w, h, `background:${rgba("#ffffff", 0.05)};border-radius:9999px;`,
      (o.dot ? `<i style="position:absolute;left:16px;top:${h / 2 - 5}px;width:10px;height:10px;border-radius:50%;background:${o.dot}"></i>` : "") +
      tx("", o.dot ? 34 : 0, (h - fs * 1.25) / 2, text, { fs, fw: 400, c: C.mist, mono: o.mono, w: o.dot ? w - 46 : w, align: o.dot ? "left" : "center" }));
  };
  // a badge's width for its text (col = a colour-coded badge with its dot)
  const badgeW = (text, fs = 19, col = false) => Math.round(text.length * fs * 0.55 + (fs + 20) + (col ? 18 : 0));
  // badge: status / category (kind: neutral | green | coral | iris | lav)
  const badge = (id, x, y, text, kind = "neutral", o = {}) => {
    const fs = o.fs || 19, col = { green: C.green, coral: C.coral, iris: C.iris, lav: C.lav }[kind], h = o.h || 34, w = o.w || badgeW(text, fs, !!col);
    return box(id, x, y, w, h, `background:${col ? rgba(col, 0.14) : rgba("#ffffff", 0.05)};border-radius:${R.badge}px;`,
      (col ? `<i style="position:absolute;left:12px;top:${h / 2 - 4.5}px;width:9px;height:9px;border-radius:50%;background:${col}"></i>` : "") +
      tx("", col ? 28 : 0, (h - fs * 1.25) / 2, text, { fs, fw: 510, c: col ? C.mist : C.fog, w: col ? w - 36 : w, align: col ? "left" : "center" }));
  };
  // status icon: done (green, check), fail (coral, x), todo (hollow), run (iris half)
  const status = (id, x, y, kind = "done", s = 28) => {
    const r = s / 2 - 1.5, c = s / 2;
    const g = kind === "done" ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${C.green}"/><path d="M${c - 5.5} ${c + 0.5} L${c - 1.5} ${c + 4.5} L${c + 6} ${c - 4}" fill="none" stroke="${C.void}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`
      : kind === "fail" ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${C.coral}"/><path d="M${c - 4.5} ${c - 4.5} L${c + 4.5} ${c + 4.5} M${c + 4.5} ${c - 4.5} L${c - 4.5} ${c + 4.5}" fill="none" stroke="${C.void}" stroke-width="2.6" stroke-linecap="round"/>`
        : kind === "run" ? `<circle cx="${c}" cy="${c}" r="${r - 1}" fill="none" stroke="${C.iris}" stroke-width="2"/><path d="M${c} ${c - r + 4} A${r - 4} ${r - 4} 0 0 1 ${c} ${c + r - 4} Z" fill="${C.iris}"/>`
          : `<circle cx="${c}" cy="${c}" r="${r - 1}" fill="none" stroke="${C.fog}" stroke-width="2"/>`;
    return `<svg${id ? ` id="${id}"` : ""} width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style="position:absolute;left:${px(x)};top:${px(y)}">${g}</svg>`;
  };
  // a switch (on = iris track, white knob)
  const toggle = (x, y, on) => box("", x, y, 54, 30, `border-radius:15px;background:${on ? C.iris : C.smoke};`,
    `<i style="position:absolute;top:3px;${on ? "right" : "left"}:3px;width:24px;height:24px;border-radius:50%;background:${on ? C.paper : C.fog}"></i>`);
  // a keyboard key (mono)
  const kbd = (x, y, text) => box("", x, y, text.length * 12 + 18, 28, `background:${rgba("#ffffff", 0.05)};border-radius:${R.badge}px;`,
    tx("", 0, 3, text, { fs: 18, mono: true, c: C.fog, w: text.length * 12 + 18, align: "center" }));
  // a chevron or small line icon (d = its path in a 22 box)
  const chev = (x, y, d, s = 22, c = C.fog) => `<svg width="${s}" height="${s}" viewBox="0 0 22 22" style="position:absolute;left:${px(x)};top:${px(y)}"><path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  // the Claude mark in the neutral logo tone (assets/logos/claude-ink.svg as a CSS background; bring the logo in step 4.3)
  const claudeMark = (id, x, y, s) => box(id, x, y, s, s, `background:url(assets/logos/claude-ink.svg) center/contain no-repeat;`);

  // ---- rounded trim paths (cubic corners, so the spark sampler can follow them) ----
  const K = 0.5523;
  const f1 = (n) => Math.round(n * 100) / 100;
  // closed rounded rect, clockwise from the top-left straight
  const rrD = (x, y, w, h, r) => {
    const k = r * K, a = [x, y, x + w, y + h].map(f1);
    return `M${f1(x + r)} ${a[1]} H${f1(x + w - r)} C${f1(x + w - r + k)} ${a[1]} ${a[2]} ${f1(y + r - k)} ${a[2]} ${f1(y + r)} V${f1(y + h - r)} ` +
      `C${a[2]} ${f1(y + h - r + k)} ${f1(x + w - r + k)} ${a[3]} ${f1(x + w - r)} ${a[3]} H${f1(x + r)} C${f1(x + r - k)} ${a[3]} ${a[0]} ${f1(y + h - r + k)} ${a[0]} ${f1(y + h - r)} ` +
      `V${f1(y + r)} C${a[0]} ${f1(y + r - k)} ${f1(x + r - k)} ${a[1]} ${f1(x + r)} ${a[1]} Z`;
  };
  // the two halves of a rounded rect from the top-edge centre round to the bottom-edge centre (seeded outlines)
  const rrHalves = (x, y, w, h, r) => {
    const k = r * K, m = f1(x + w / 2), t = f1(y), b = f1(y + h), l = f1(x), rr = f1(x + w);
    return [
      `M${m} ${t} H${f1(x + w - r)} C${f1(x + w - r + k)} ${t} ${rr} ${f1(y + r - k)} ${rr} ${f1(y + r)} V${f1(y + h - r)} C${rr} ${f1(y + h - r + k)} ${f1(x + w - r + k)} ${b} ${f1(x + w - r)} ${b} H${m}`,
      `M${m} ${t} H${f1(x + r)} C${f1(x + r - k)} ${t} ${l} ${f1(y + r - k)} ${l} ${f1(y + r)} V${f1(y + h - r)} C${l} ${f1(y + h - r + k)} ${f1(x + r - k)} ${b} ${f1(x + r)} ${b} H${m}`,
    ];
  };
  // a path that starts hidden and draws on with draw() (pathLength 1)
  const trimPath = (id, d, c = C.mist, sw = 1.5) =>
    `<path${id ? ` id="${id}"` : ""} pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>`;

  // ---- booking app (the scheduling app the README clones), in the guideline ----
  // October 2026 starts on a Thursday (Monday-first grid). w = the frame's width; top = y of its first row.
  // extras: "sms" adds the SMS reminders row (the clone's improvement); "orig" / "yours" add the two features the
  // diff compares (yours draws them dashed: missing). Returns { html, parts (ids, top to bottom), rects, h }.
  function booking(id, w, top = 0, o = {}) {
    const m = 22, cw = w - 2 * m, col = cw / 7;
    const parts = [], rects = [];
    const part = (k, y, h, inner) => { parts.push(`${id}-k${k}`); rects.push([m - 9, y - 7, cw + 18, h + 14]); return box(`${id}-k${k}`, 0, y, w, h, "", inner); };
    let y = top + 18, html = "";
    const av = `<svg width="48" height="48" viewBox="0 0 48 48" style="position:absolute;left:${m}px;top:2px">` +
      `<circle cx="24" cy="24" r="24" fill="${C.graphite}"/><circle cx="24" cy="19" r="7" fill="none" stroke="${C.fog}" stroke-width="2"/>` +
      `<path d="M12 38 C15 30 33 30 36 38" fill="none" stroke="${C.fog}" stroke-width="2" stroke-linecap="round"/></svg>`;
    html += part(0, y, 54, av + tx("", m + 62, 0, "30 min meeting", { fs: 27, fw: 590, c: C.paper }) + tx("", m + 62, 33, "Video call", { fs: 20, c: C.fog }));
    y += 70;
    html += divider(m, y, cw);
    y += 16;
    html += part(1, y, 34, tx("", m, 2, "October 2026", { fs: 23, fw: 510, c: C.paper }) +
      chev(w - m - 62, 6, "M13 5 L7 11 L13 17") + chev(w - m - 26, 6, "M9 5 L15 11 L9 17"));
    y += 44;
    let cal = ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => tx("", m + i * col, 0, d, { fs: 18, fw: 510, c: C.fog, w: col, align: "center" })).join("");
    const sel = 15, rowH = 38;
    for (let d = 1; d <= 31; d++) {
      const idx = d + 2, r = Math.floor(idx / 7), c = idx % 7, cx = m + c * col, cy = 30 + r * rowH;
      if (d === sel) cal += box(`${id}-sel`, cx + col / 2 - 17, cy - 1, 34, 34, `background:${C.bone};border-radius:${R.btn}px;`);
      cal += tx("", cx, cy + 4, String(d), { fs: 20, fw: d === sel ? 590 : 400, c: d === sel ? C.void : C.mist, w: col, align: "center" });
    }
    html += part(2, y, 30 + 5 * rowH, cal);
    y += 30 + 5 * rowH + 14;
    const sw = (cw - 20) / 3;
    const slots = ["9:00", "9:30", "10:00"].map((t, i) => box(i === 1 ? `${id}-slot` : "", m + i * (sw + 10), 0, sw, 48,
      `border-radius:${R.btn}px;${i === 1 ? `background:${C.graphite};${hair(C.mist)}` : hair(C.smoke)}`,
      tx("", 0, 11, t, { fs: 21, fw: 510, c: i === 1 ? C.paper : C.mist, w: sw, align: "center" }))).join("");
    html += part(3, y, 48, slots);
    y += 62;
    html += part(4, y, 54, btn("", m, 0, cw, 54, "Confirm", "primary", 23));
    y += 54;
    const row = (k, label, on, dashed) => {
      y += 14;
      const r = part(k, y, 48, (dashed ? box("", m - 8, 0, cw + 16, 48, `border:1.5px dashed ${C.fog};border-radius:${R.btn}px;`) : "") +
        tx("", m + (dashed ? 4 : 0), 11, label, { fs: 21, fw: 400, c: dashed ? C.fog : C.mist }) + (dashed ? "" : toggle(m + cw - 54, 9, on)));
      y += 48;
      return r;
    };
    if (o.extras === "sms") html += row(5, "SMS reminders", true);
    if (o.extras === "orig" || o.extras === "yours") {
      const dash = o.extras === "yours";
      html += row(5, "Round-robin for teams", false, dash);
      html += row(6, "Embed on your website", false, dash);
    }
    return { html, parts, rects, h: y };
  }

  // ---- Claude Code pieces ----
  // Claude Code's welcome box (mark, "Welcome to Claude Code!", /help)
  const ccWelcome = (id, x, y, w) => card(id, x, y, w, 66,
    claudeMark("", 20, 17, 32) + tx("", 66, 8, "Welcome to Claude Code!", { fs: 23, fw: 510, c: C.paper }) + tx("", 66, 38, "/help for help", { fs: 17, mono: true, c: C.fog }), { r: R.btn });
  // Claude Code's prompt: "> " and a mono value (pass L.typed(...) to type it in)
  const ccInput = (id, x, y, w, inner) => input(id, x, y, w, 60,
    tx("", 18, 14, "&gt;", { fs: 25, fw: 510, c: C.fog, mono: true }) +
    `<div style="position:absolute;left:48px;top:15px;font-size:24px;color:${C.paper};white-space:pre;${MONO}">${inner}</div>`);
  // a tool-call log line: a status icon, the verb, its argument (inner html, e.g. typed)
  const ccLine = (id, x, y, verb, arg, o = {}) => box(id, x, y, o.w || 560, 34, "",
    status(o.sid || "", 0, 4, o.kind || "done", 24) +
    `<div style="position:absolute;left:36px;top:3px;font-size:21px;white-space:pre;color:${C.mist}">` +
    `<span style="font-weight:510;${FEAT}">${verb}</span>  <span style="color:${C.fog};${MONO}">${arg}</span></div>`);

  // ---- compare slider ----
  // compare slider (a diff view): layers A and B share one card; a divider with a round handle sweeps across it
  // ids: #id (card), #id-a, #id-b (layers), #id-d (divider + handle, moved with x)
  const compareFrame = (id, x, y, w, h, A, B) =>
    box(id, x, y, w, h, `background:${C.obsidian};border-radius:${R.card}px;${hair(C.smoke)}overflow:hidden;`,
      box(`${id}-a`, 0, 0, w, h, "", A) + box(`${id}-b`, 0, 0, w, h, `background:${C.obsidian};clip-path:inset(0px 0px 0px 0px);`, B)) +
    box(`${id}-d`, x - 1, y, 2, h, `background:${C.paper};`,
      box("", -21, h / 2 - 21, 44, 44, `background:${C.paper};border-radius:50%;`,
        `<svg width="44" height="44" viewBox="0 0 44 44" style="position:absolute;left:0;top:0"><path d="M18 15 L11 22 L18 29 M26 15 L33 22 L26 29" fill="none" stroke="${C.void}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`));
  // anim code: the divider sweeps from fraction a to b of the card's width, layer B revealed right of it
  const slideCompare = (id, w, a, b, at, dur) => {
    const ia = L.r2(w * a), ib = L.r2(w * b);
    return `
      gsap.set("#${id}-b", { clipPath: "inset(0px 0px 0px ${ia}px)" }); gsap.set("#${id}-d", { x: ${ia} });
      tl.fromTo("#${id}-b", { clipPath: "inset(0px 0px 0px ${ia}px)" }, { clipPath: "inset(0px 0px 0px ${ib}px)", duration: ${dur}, ease: E.inOut, immediateRender: false }, ${at});
      tl.fromTo("#${id}-d", { x: ${ia} }, { x: ${ib}, duration: ${dur}, ease: E.inOut, immediateRender: false }, ${at});`;
  };

  // ---- scan line ----
  // scan line: an iris rule that sweeps down a shot (an agent reading it); starts hidden, scan() runs it
  const scanLine = (id, x, y, w) => box(id, x, y - 1.5, w, 3, `background:${C.iris};border-radius:2px;opacity:0;`);
  // anim code: the scan line runs y0 -> y1 at an even pace, then hides
  const scan = (id, y0, y1, at, dur) => `
      tl.set("#${id}", { opacity: 1, y: 0 }, ${at});
      tl.fromTo("#${id}", { y: 0 }, { y: ${y1 - y0}, duration: ${dur}, ease: "none", immediateRender: false }, ${at});
      tl.set("#${id}", { opacity: 0 }, ${L.r2(at + dur)});`;

  // ---- rebuild ----
  // rebuild: rounded iris wireframes over a UI's parts (frames = the parts' rects, e.g. booking().rects); rebuild() runs them
  const wireSvg = (id, w, h, frames) =>
    `<svg id="${id}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" data-layout-allow-overlap style="position:absolute;left:0;top:0;overflow:visible">` +
    frames.map((r, i) => `<g id="${id}-${i}">${trimPath("", rrD(...r, R.btn), C.iris, 1.5)}</g>`).join("") + `</svg>`;
  // anim code: n wireframes draw on, the parts wipe in over them (staggered), the wireframes retract
  const rebuild = (wid, parts, n, at, st = 0.1) => `
      ${Array.from({ length: n }, (_, i) => `draw(q("#${wid}-${i} path"), ${L.r2(at + i * st)}, 0.32);`).join(" ")}
      wipeIn(q("${parts.map((p) => "#" + p).join(", ")}"), ${L.r2(at + 0.22)}, 0.4, ${st});
      ${Array.from({ length: n }, (_, i) => `untrim(q("#${wid}-${i} path"), ${L.r2(at + 0.55 + i * st)}, 0.25);`).join(" ")}`;

  return {
    C, rgba, FEAT, MONO, R, box, tx, hair, divider, win, card, chrome, grow, setChrome, mframeL, input, btn, pill, pillW, badge, badgeW,
    status, toggle, kbd, chev, claudeMark, rrD, rrHalves, trimPath, booking, ccWelcome, ccInput, ccLine, compareFrame, slideCompare,
    scanLine, scan, wireSvg, rebuild,
  };
};
