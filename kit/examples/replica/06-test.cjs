// test: "It even tests for bugs and compares your version against the original to identify what's missing."
// The build window's frame lands as replica-test (H5): the test plan from the 7 flows runs, each spec passing; on
// "bugs" the slot-taken-mid-booking spec fails with an S1. On "compares" the window pushes to replica-diff: the
// original booking page and yours share one card with a compare slider (new) that sweeps across on "your version
// against the original", so yours replaces the original strip by strip. On "identify" the parity readouts count up
// (features 86, layout 91), and on "missing" fail marks land on the two features yours doesn't have yet (README:
// round-robin for teams, the website embed). Then the whole frame implodes into one lime seed.
// All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, s) => {
  const { morphCode, seed, implode } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs"), hin = P.H.h5;
  const p = s.p, r2 = L.r2, at = s.at;
  const TW = P.R.test, VW = TW[2], VH = TW[3] - 48;
  const tTests = at("tests"), tBugs = at("bugs"), tComp = at("compares"), tYour = at("your"), tOrig = at("original"), tId = at("identify"), tMiss = at("missing");
  // pane A: the test plan
  const specs = [["Guest books a meeting"], ["Host sets availability"], ["Guest reschedules"], ["Time zones"], ["Slot taken mid-booking", 1], ["Double submit"]];
  const RW = VW - 60, pw = U.badgeW("Passed", 19, true), sw = U.badgeW("S1 · Urgent", 19, true);
  const paneA = U.box(`${p}-qa`, 0, 48, VW, VH, "",
    U.tx("", 30, 22, "Test plan", { fs: 34, fw: 510, c: C.paper }) + U.pill(`${p}-pw`, VW - 30 - U.pillW("Playwright", 20), 24, "Playwright", { mono: true }) +
    U.tx("", 30, 70, "7 flows: happy paths and edge cases", { fs: 21, c: C.fog }) +
    specs.map(([t, bug], i) => U.card(`${p}-sp${i}`, 30, 118 + i * 76, RW, 62,
      U.status(`${p}-tg${i}`, 18, 17, bug ? "fail" : "done", 28) + U.tx("", 60, 17, t, { fs: 22, fw: 510 }) +
      (bug ? U.badge(`${p}-s1`, RW - 18 - sw, 14, "S1 · Urgent", "coral") : U.badge("", RW - 18 - pw, 14, "Passed", "green")), { r: U.R.btn })).join("") +
    U.tx("", 30, 590, "Bugs logged by severity until no S1 or S2 is open", { fs: 20, c: C.fog }));
  // pane B: replica-diff, the compare slider
  const FW = 440, FX = Math.round((VW - FW) / 2);
  const bo = U.booking(`${p}-o`, FW, 0, { extras: "orig" }), by = U.booking(`${p}-y`, FW, 0, { extras: "yours" });
  const FH = bo.h + 18, FY = 46;
  const miss = [5, 6].map((k) => U.status(`${p}-mx${k}`, FW - 22 - 38, by.rects[k][1] + 17, "fail", 26)).join("");
  const readout = (id, y, name, n) => U.box(`${p}-${id}`, FX + FW + 34, y, 200, 110, "",
    U.tx("", 0, 0, name, { fs: 20, fw: 510, c: C.fog }) + U.tx(`${p}-${id}n`, 0, 30, String(n), { fs: 64, fw: 510, c: C.paper }));
  const paneB = U.box(`${p}-qb`, 0, 48, VW, VH, "",
    U.badge(`${p}-lo`, 30, FY + 4, "Original", "neutral", { fs: 20, h: 36 }) +
    U.badge(`${p}-ly`, FX + FW + 34, FY + 4, "Yours", "iris", { fs: 20, h: 36 }) +
    U.compareFrame(`${p}-cf`, FX, FY, FW, FH, bo.html, by.html + miss) +
    U.box(`${p}-im`, 30, FY + 260, 190, 140, "", U.pill("", 0, 0, "imgdiff.py", { mono: true }) + U.tx("", 0, 58, "Layout diff,", { fs: 20, c: C.fog }) + U.tx("", 0, 86, "ignores colour", { fs: 20, c: C.fog })) +
    readout("rf", FY + 220, "Features", 86) + readout("rl", FY + 370, "Layout", 91));
  const html = U.win(`${p}-tw`, ...TW, `<span id="${p}-ta">replica-test</span><span id="${p}-tb" style="opacity:0;position:absolute;left:0;right:0">replica-diff</span>`,
    `<div style="position:absolute;left:0;top:0;width:${VW}px;height:${TW[3]}px;overflow:hidden">${paneA + paneB}</div>`);
  const count = (id, n, t, d) => `
      document.querySelector("#${id}").textContent = "0";
      tl.fromTo({ v: 0 }, { v: 0 }, { v: ${n}, duration: ${d}, ease: E.outQ, immediateRender: false, onUpdate: function () { document.querySelector("#${id}").textContent = Math.round(this.targets()[0].v); } }, ${t});`;
  const tImp = r2(s.dur - 0.42), tPush = r2(tComp - 0.12);
  L.hold(tMiss, tImp, 0.2, "test: missing marks");
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-tw`)}
      gsap.set("#${p}-qb", { x: ${VW} });
      wipeIn("#${p}-tw-c", ${hin.inDur}, 0.4);
      // the specs run, each passing; the double-booking edge case fails with an S1
      wipeIn(q("${specs.map((_, i) => `#${p}-sp${i}`).join(", ")}"), ${r2(tTests - 0.1)}, 0.32, 0.06);
      ${specs.map(([, bug], i) => bug ? "" : `pop("#${p}-tg${i}", ${r2(tTests + 0.2 + i * 0.07)});`).join(" ")}
      pop("#${p}-tg4", ${r2(tBugs)}); pop("#${p}-s1", ${r2(tBugs + 0.08)});
      // "compares": the window pushes to replica-diff
      ${L.pushScreens(`${p}-qa`, `${p}-qb`, VW, tPush, 0.55)}
      tl.set("#${p}-ta", { opacity: 0 }, ${r2(tPush + 0.25)}); tl.set("#${p}-tb", { opacity: 1 }, ${r2(tPush + 0.25)});
      // "your version against the original": the slider sweeps, yours replaces the original
      ${U.slideCompare(`${p}-cf`, FW, 1, 0.06, r2(tYour - 0.05), r2(tOrig + 0.25 - tYour))}
      wipeIn("#${p}-im", ${r2(tYour)}, 0.36);
      // "identify what's missing": parity counts up, the two missing features get their fail marks
      wipeIn(q("#${p}-rf, #${p}-rl"), ${r2(tId - 0.16)}, 0.32, 0.08);${count(`${p}-rfn`, 86, r2(tId - 0.1), 0.6)}${count(`${p}-rln`, 91, r2(tId - 0.02), 0.6)}
      pop("#${p}-mx5", ${r2(tMiss - 0.12)}); pop("#${p}-mx6", ${r2(tMiss - 0.02)});
      // the turn: everything implodes into the seed the next scene grows from
      ${implode(p, tImp, P.SEED7, P.lift.test, P.camEnd.test)}`;
  const boxes = [{ id: "win", r: TW }];
  return { lift: P.lift.test, cam: P.cam("test"), fade: false, html, svg: "", over: U.mframeL(`${p}-mf`) + seed(p), anim, boxes };
};
