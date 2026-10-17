// problem: "Normally, connecting different agents means building and maintaining separate integrations for each one."
// The meet diagram's frame lands as the app window (H2). Five agents wipe in down the left; one cable per agent traces
// out of the window ("building"), an integration block drops onto each ("maintaining"), dark pulses keep running down
// every cable, and the blocks flash in turn on "each one". Everything clears, and the app window itself is carried
// across the cut into the solution (H3). All neutral: no lime until HarnessRouter arrives.
module.exports = (L, s) => {
  const { T, make, plate, appWinC, appWin, ph, dtube, bpath, klabel, lead, pulse, mframe, morphCode, MB } = L;
  const P = require("./_plan.cjs"), hin = P.H.h2, h = P.H.h3;
  const p = s.p;
  const [WX, WY, WW, WH] = P.R.problemWin;
  const agents = ["Codex", "Claude Code", "Hermes", "Pi", "OpenCode"], N = agents.length, I = [...Array(N).keys()];
  const cy = I.map((i) => 734 + i * 96);       // plate centres (plates 68 tall from y 700)
  const sx = I.map((i) => 650 + i * 72);       // cable starts along the app window's bottom edge
  const BX = 566;                              // integration blocks sit in one column on the cables
  const cables = I.map((i) => bpath([[sx[i], WY + WH], [sx[i], cy[i] - 30], [sx[i] - 40, cy[i]], [490, cy[i]]]));
  const block = (id, x, y) => {
    const m = make(x, y - 6), w = 34, hh = 22;   // silhouette centred on (x, y)
    return `<g id="${id}">${m.box(0, 0, 0, w, w, hh, { top: T.g100, left: T.g300, right: T.g500 })}</g>`;
  };
  const tAg = s.at("agents"), tBuild = s.at("building"), tMaint = s.at("maintaining"), tSep = s.at("separate"), tEach = s.at("each");
  const inner = ph(24, 70, 372, 28) + ph(24, 112, 110, 34, 1) + ph(148, 112, 110, 34, 1);
  const html =
    appWinC(`${p}-win`, WX, WY, WW, WH, "Your app", inner) +
    // the carried stand-in: static, so its motion-blur copies match it (DESIGN.md 7, motion blur)
    appWin(`${p}-wf`, WX, WY, WW, WH, "Your app", inner).replace(`class="win"`, `class="win" ${MB()} data-layout-allow-overlap`) +
    agents.map((a, i) => plate(`${p}-ag${i}`, 58, 700 + i * 96, 420, a, "none")).join("") +
    klabel(`${p}-lb`, 58, 452, ["SEPARATE", "INTEGRATIONS"]);
  const svg =
    I.map((i) => dtube(`${p}-c${i}`, cables[i], { w: 10, fill: T.paper })).join("") +
    I.map((i) => pulse(`${p}-u${i}`, cables[i], { len: 0.16 })).join("") +
    I.map((i) => block(`${p}-b${i}`, BX, cy[i])).join("") +
    lead(`${p}-ld`, [[330, 477], [BX, 477], [BX, 672]]);
  const each = (f) => I.map(f).join("\n      ");
  const x0 = h.at - 0.3;   // exits start
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      gsap.set("#${p}-wf", { opacity: 0 });
      wipeIn(q("#${p}-win .win-ph"), ${L.r2(hin.inDur + 0.04)}, 0.45, 0.08);
      // "different agents": the five plates wipe in down the column
      ${each((i) => `plateIn("#${p}-ag${i}", ${L.r2(tAg - 0.4 + i * 0.07)});`)}
      // "building": one cable traces out of the app per agent
      ${each((i) => `draw(q("#${p}-c${i} path"), ${L.r2(tBuild - 0.1 + i * 0.1)}, 0.55);`)}
      // "maintaining": an integration block drops onto every cable, and the work keeps flowing down each one
      ${each((i) => `tl.fromTo("#${p}-b${i}", { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E.out }, ${L.r2(tMaint - 0.1 + i * 0.07)});`)}
      ${each((i) => `run("#${p}-u${i}", ${L.r2(tMaint + 0.15 + i * 0.12)}, 0.7, 1, 0.25);`)}
      kin("#${p}-lb", ${L.r2(tSep - 0.07)}, 0.42, 0.5); lead("${p}-ld", ${L.r2(tSep + 0.03)});
      // "for each one": every integration block's top flashes in turn
      ${each((i) => `tl.fromTo(q("#${p}-b${i} polygon:last-child"), { attr: { fill: "${T.g100}" } }, { attr: { fill: "${T.dark}" }, duration: 0.12, yoyo: true, repeat: 1, ease: E.inOut, immediateRender: false }, ${L.r2(tEach - 0.12 + i * 0.04)});`)}
      // clear for the cut: label and leader out, cables retract into the app, plates and blocks leave
      kout("#${p}-lb", ${L.r2(x0 - 0.05)}); unlead("${p}-ld", ${L.r2(x0 - 0.05)});
      tl.to(q("${I.map((i) => `#${p}-u${i}`).join(", ")}"), { opacity: 0, duration: 0.12, ease: E.in }, ${L.r2(x0)});
      ${each((i) => `untrim(q("#${p}-c${i} path"), ${L.r2(x0 + 0.02 + i * 0.03)}, 0.3);`)}
      away(q("${I.map((i) => `#${p}-b${i}`).join(", ")}"), ${L.r2(x0 + 0.08)}, -18, 0.24, 0.03);
      wipeOut(q("${I.map((i) => `#${p}-ag${i}`).join(", ")}"), ${L.r2(x0 + 0.1)}, 0.26, 0.03);
      // H3: the app window itself travels to its place in the solution (the cut lands mid-move)
      tl.set("#${p}-win", { opacity: 0 }, ${h.at}); tl.set("#${p}-wf", { opacity: 1 }, ${h.at});
      ${L.carry(`#${p}-wf`, h, "out", P.side("problem", P.R.problemWin, "out"), h.at)}`;
  return { lift: P.lift.problem, cam: P.cam("problem"), fade: false, svg, html, over: mframe(`${p}-mf`), anim };
};
