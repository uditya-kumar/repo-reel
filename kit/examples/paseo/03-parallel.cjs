// parallel: "You can give different agents different tasks and let them work at the same time."
// The desktop window's frame lands as the real Paseo chat ("fan them out to separate worktree agents", H2). The screen
// pushes in inside the fixed frame onto the two create_agent tool calls; a trim box draws round each on "different
// tasks". The push eases back out, lime tubes drop from the window into a Claude Code and a Codex window, and on
// "same time" both progress bars fill together under one stopwatch. The two agent windows leave as two morph frames
// (H3a / H3b) that land as the worktree plates.
module.exports = (L, s) => {
  const { klabel, screenWin, agentWin, hlTrim, dtube, pulse, stopwatch, mframe, morphCode, zoomIn, T } = L;
  const P = require("./_plan.cjs"), hin = P.H.h2, ha = P.H.h3a, hb = P.H.h3b;
  const p = s.p, r2 = L.r2;
  const [X, Y, W, Hh] = P.R.parWin, A = P.R.parA, B = P.R.parB;
  // mcp-fanout.png 1248 x 832 -> 959 x 639 (the viewport 959 x 419 shows its content, rows at y 235 / 299, 51 high)
  const Z = 1.4, OX = 81, OY = 292, zr = (y) => r2(OY + (y - OY) * Z);
  const tubes = ["M300 850 C300 900 258 900 258 940", "M780 850 C780 900 822 900 822 940"];
  const tDiff = s.at("different", 1), tTasks = s.at("tasks"), tLet = s.at("let"), tWork = s.at("work"), tSame = s.at("same");
  const html =
    screenWin(`${p}-win`, X, Y, W, Hh,
      [{ id: `${p}-s0`, src: "assets/shots/site/mcp-fanout.png", w: 959, h: 639, attr: L.MB() }],
      { over: hlTrim(`${p}-h0`, OX, zr(235), 866, r2(51 * Z)) + hlTrim(`${p}-h1`, OX, zr(299), 866, r2(51 * Z)) }) +
    agentWin(`${p}-a`, ...A, "Claude Code", "claude-code") + agentWin(`${p}-b`, ...B, "Codex", "codex") +
    klabel(`${p}-lb`, 540, 1290, ["SAME TIME"], { a: "middle" });
  const svg =
    tubes.map((d, i) => dtube(`${p}-t${i}`, d, { w: 12, fill: T.lime })).join("") +
    tubes.map((d, i) => pulse(`${p}-u${i}`, d, { lime: true, len: 0.35 })).join("") +
    stopwatch(`${p}-sw`, 540, 1090, 60);
  const tFill = r2(tWork - 0.05), fDur = r2(tSame + 0.45 - tFill), x0 = r2(ha.at - 0.3);
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      wipeIn("#${p}-win-c", ${hin.inDur}, 0.45);
      // push in on the tool calls (the frame stays put), one trim box per agent
      ${zoomIn(`#${p}-s0`, r2(hin.inDur + 0.1), Z, OX, OY, 0.65)}
      draw(q("#${p}-h0 path"), ${r2(tDiff - 0.06)}, 0.4);
      draw(q("#${p}-h1 path"), ${r2(tTasks - 0.06)}, 0.4);
      untrim(q("#${p}-h0 path, #${p}-h1 path"), ${r2(tLet - 0.32)}, 0.24);
      ${zoomIn(`#${p}-s0`, r2(tLet - 0.2), 1, OX, OY, 0.55, Z)}
      // each task drops into its own agent
      ${tubes.map((_, i) => `draw(q("#${p}-t${i} path"), ${r2(tLet - 0.05 + i * 0.08)}, 0.32);`).join(" ")}
      wipeIn("#${p}-a", ${r2(tLet + 0.1)}, 0.45); wipeIn("#${p}-b", ${r2(tLet + 0.2)}, 0.45);
      ${tubes.map((_, i) => `run("#${p}-u${i}", ${r2(tLet + 0.3 + i * 0.08)}, 0.42, 2, 0.06);`).join(" ")}
      // "work at the same time": both bars fill together, one stopwatch sweeps
      gsap.set(q("#${p}-a-pf, #${p}-b-pf"), { scaleX: 0 });
      tl.fromTo(q("#${p}-a-pf, #${p}-b-pf"), { scaleX: 0 }, { scaleX: 1, duration: ${fDur}, ease: E.inOut, immediateRender: false }, ${tFill});
      pop("#${p}-sw", ${r2(tFill - 0.12)});
      tl.fromTo("#${p}-sw-pie", { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: ${fDur}, ease: E.inOut }, ${tFill});
      tl.fromTo("#${p}-sw-hand", { rotation: 0 }, { rotation: 360, svgOrigin: "540 1090", duration: ${fDur}, ease: E.inOut }, ${tFill});
      kin("#${p}-lb", ${r2(tSame - 0.06)}, 0.06, 0.5);
      // clear for the cut: everything but the two agent windows goes, then they empty to their outlines
      kout("#${p}-lb", ${x0}); unpop("#${p}-sw", ${x0});
      ${tubes.map((_, i) => `tl.set("#${p}-u${i}", { opacity: 0 }, ${x0});`).join(" ")}
      untrim(q("${tubes.map((_, i) => `#${p}-t${i} path`).join(", ")}"), ${x0}, 0.2);
      wipeOut("#${p}-win", ${r2(x0 - 0.05)}, 0.26);
      wipeOut(q("#${p}-a-c, #${p}-b-c"), ${r2(ha.at - 0.16)}, 0.16);
      tl.set(q("#${p}-a, #${p}-b"), { opacity: 0 }, ${ha.at});${morphCode(`${p}-mfa`, ha, "out", ha.at)}${morphCode(`${p}-mfb`, hb, "out", hb.at)}`;
  return {
    lift: P.lift.parallel, cam: P.cam("parallel"), fade: false, svg, html,
    over: mframe(`${p}-mf`) + mframe(`${p}-mfa`) + mframe(`${p}-mfb`), anim,
  };
};
