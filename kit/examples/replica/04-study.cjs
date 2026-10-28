// study: "It studies public pages, screenshots, and user flows to understand how the app works."
// The URL card's frame lands as the Claude Code session at the top (H3), which logs each read as it happens. Three
// sources hang off it on their words, each tubed up into the session with pulses running up: the Help center page, a
// store screenshot that an iris scan line reads (each part it passes gets a wireframe: new, scan) and the user flow.
// On "to understand" the three fly into one point and replica/recon.md opens there: 18 screens and 7 flows count up,
// the flows, the data model, features.csv, and the partner marketplace marked out of scope. Hold cut into build.
// All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, s) => {
  const { dtube, pulse, morphCode, converge } = L;
  const S = require("./_study.cjs")(L, s.p), U = S.U, C = U.C, P = require("./_plan.cjs"), hin = P.H.h3;
  const p = s.p, r2 = L.r2, at = s.at;
  const tPub = at("public"), tScr = at("screenshots"), tUser = at("user"), tFlows = at("flows"), tTo = at("to"), tUnd = at("understand"),
    tHow = at("how"), tApp = at("app"), tWorks = at("works");
  const CY = 640, CW = 298, CH = 290, CX = [58, 391, 724];
  // card A: the help center (README: help center, pricing page)
  const art = (i, t) => U.box(`${p}-a${i}`, 20, 116 + i * 52, CW - 40, 46, `border-bottom:1.5px solid ${C.graphite};`,
    U.tx("", 0, 10, t, { fs: 20 }) + U.chev(CW - 66, 12, "M9 5 L15 11 L9 17"));
  const cardA = U.win(`${p}-ca`, CX[0], CY, CW, CH, "Help center",
    U.input("", 20, 62, CW - 40, 42, U.tx("", 14, 9, "Search help", { fs: 19, c: C.fog })) +
    ["Set availability", "Share a booking link", "Reschedule"].map((t, i) => art(i, t)).join(""));
  // card B: a store screenshot of the booking page, read by the scan line
  const col = 36, gx = 23;
  let cal = U.tx("", gx, 60, "October 2026", { fs: 19, fw: 510, c: C.paper }) +
    ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => U.tx("", gx + i * col, 96, d, { fs: 15, fw: 510, c: C.fog, w: col, align: "center" })).join("");
  for (let d = 1; d <= 31; d++) {
    const k = d + 2, r = Math.floor(k / 7), c = k % 7;
    if (d === 15) cal += U.box("", gx + c * col + 4, 120 + r * 30 - 2, col - 8, 27, `background:${C.bone};border-radius:6px;`);
    cal += U.tx("", gx + c * col, 120 + r * 30 + 1, String(d), { fs: 17, fw: d === 15 ? 590 : 400, c: d === 15 ? C.void : C.mist, w: col, align: "center" });
  }
  const cardB = U.win(`${p}-cb`, CX[1], CY, CW, CH, "Screenshot",
    cal + U.wireSvg(`${p}-w`, CW, CH, [[12, 54, CW - 24, 34], [12, 90, CW - 24, 186]]) + U.scanLine(`${p}-sc`, 8, 54, CW - 16));
  // card C: the user flow (guest books a meeting)
  const node = (i, t) => U.card(`${p}-fn${i}`, 39, 62 + i * 74, CW - 78, 46, U.tx("", 0, 10, t, { fs: 20, fw: 510, w: CW - 78, align: "center" }), { r: U.R.btn });
  const conn = (i) => `<path id="${p}-fl${i}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="M${CW / 2} ${108 + i * 74} V${133 + i * 74}" fill="none" stroke="${C.fog}" stroke-width="2"/>` +
    `<polygon id="${p}-fh${i}" points="${CW / 2 - 6},${127 + i * 74} ${CW / 2 + 6},${127 + i * 74} ${CW / 2},${135 + i * 74}" fill="${C.fog}"/>`;
  const cardC = U.win(`${p}-cc`, CX[2], CY, CW, CH, "User flows",
    ["Pick a date", "Pick a time", "Confirm"].map((t, i) => node(i, t)).join("") +
    `<svg width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}" style="position:absolute;left:0;top:0">${conn(0)}${conn(1)}</svg>`);
  // tubes: each source feeds the session above it (the reel's own diagram line, not app UI)
  const TX = CX.map((x) => x + CW / 2), ty0 = P.R.studyTerm[1] + P.R.studyTerm[3], tubes = TX.map((x) => `M${x} ${CY} V${ty0}`);
  const svg = tubes.map((d, i) => dtube(`${p}-t${i}`, d, { w: 10 })).join("") + tubes.map((d, i) => pulse(`${p}-u${i}`, d, { lime: true, len: 0.4 })).join("");
  const html = S.term + cardA + cardB + cardC + S.recon;
  const cards = [[`#${p}-ca`, tPub - 0.12], [`#${p}-cb`, tScr - 0.14], [`#${p}-cc`, tUser - 0.06]];
  const tConv = r2(tTo - 0.08), tRec = r2(tUnd - 0.06);
  const count = (id, n, t, d) => `
      document.querySelector("#${id}").textContent = "0";
      tl.fromTo({ v: 0 }, { v: 0 }, { v: ${n}, duration: ${d}, ease: E.outQ, immediateRender: false, onUpdate: function () { document.querySelector("#${id}").textContent = Math.round(this.targets()[0].v); } }, ${t});`;
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-st`)}
      wipeIn("#${p}-st-c", ${hin.inDur}, 0.4);
      // each source on its word: the card wipes in, its tube draws up into the session, the session logs it
      ${cards.map(([sel, t], i) => `wipeIn("${sel}", ${r2(t)}, 0.45); draw(q("#${p}-t${i} path"), ${r2(t + 0.2)}, 0.3); run("#${p}-u${i}", ${r2(t + 0.42)}, 0.38, 2, 0.08); wipeIn("#${p}-lg${i}", ${r2(t + 0.26)}, 0.12); type("#${p}-lt${i}", ${r2(t + 0.3)}, 0.022);`).join("\n      ")}
      wipeIn(q("${[0, 1, 2].map((i) => `#${p}-a${i}`).join(", ")}"), ${r2(tPub + 0.2)}, 0.36, 0.08);
      // the scan line reads the screenshot; a wireframe lands on each part it passes
      ${U.scan(`${p}-sc`, 54, 280, r2(tScr + 0.1), 0.8)}
      draw(q("#${p}-w-0 path"), ${r2(tScr + 0.18)}, 0.3); draw(q("#${p}-w-1 path"), ${r2(tScr + 0.42)}, 0.4);
      wipeIn(q("#${p}-fn0, #${p}-fn1, #${p}-fn2"), ${r2(tUser + 0.14)}, 0.32, 0.12);
      draw(q("#${p}-fl0, #${p}-fl1"), ${r2(tFlows - 0.08)}, 0.2); pop(q("#${p}-fh0, #${p}-fh1"), ${r2(tFlows + 0.08)});
      // "to understand": the three fly into one point, replica/recon.md opens there
      ${[0, 1, 2].map((i) => `tl.set("#${p}-u${i}", { opacity: 0 }, ${tConv}); untrim(q("#${p}-t${i} path"), ${tConv}, 0.22);`).join(" ")}
      ${converge(CX.map((x, i) => [`#${p}-c${"abc"[i]}`, x, CY, CW]), [540, 900], tConv, 0.4, 0.05, 0.2)}
      wipeIn("#${p}-rc", ${tRec}, 0.45);
      wipeIn("#${p}-lg3", ${r2(tRec - 0.04)}, 0.12); type("#${p}-lt3", ${tRec}, 0.022);
      tl.fromTo("#${p}-rh", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: E.out }, ${r2(tRec + 0.12)});
      wipeIn(q("#${p}-s0, #${p}-s1"), ${r2(tHow - 0.1)}, 0.36, 0.1);${count(`${p}-n0`, 18, r2(tHow - 0.1), 0.7)}${count(`${p}-n1`, 7, r2(tHow), 0.6)}
      wipeIn(q("${S.flows.map((_, i) => `#${p}-f${i}`).join(", ")}"), ${r2(tHow + 0.1)}, 0.36, 0.08);
      wipeIn("#${p}-dm", ${r2(tApp - 0.2)}, 0.3);
      tl.fromTo(q("${S.model.map((_, i) => `#${p}-c${i}`).join(", ")}"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", stagger: 0.06 }, ${r2(tApp - 0.06)});
      wipeIn("#${p}-fc", ${r2(tWorks - 0.12)}, 0.36); pop("#${p}-fct", ${r2(tWorks + 0.1)});
      wipeIn("#${p}-os", ${r2(tWorks + 0.08)}, 0.36); pop("#${p}-ost", ${r2(tWorks + 0.3)});`;
  const boxes = [
    { id: "term", r: P.R.studyTerm },
    ...CX.map((x, i) => ({ id: `card${i}`, r: [x, CY, CW, CH], t: [cards[i][1], tConv] })),
    { id: "recon", r: P.R.recon, t: [tConv + 0.4, s.dur] },
  ];
  if (tWorks + 0.52 > s.dur) throw new Error("study: recon must be complete before the hold cut");
  return { lift: P.lift.study, cam: P.cam("study"), fade: false, svg, html, over: U.mframeL(`${p}-mf`), anim, boxes };
};
