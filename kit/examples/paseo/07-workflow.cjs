// workflow: "Plus, you get a built-in editor, terminal, code diffs, and pull request tools, all in one interface."
// The phone's frame opens into one wide window (H6). Inside it the real screens push through on their words: the editor,
// the terminal, the review diff (the screen pushes in on the code) and the shipped PR (it pushes in on the passing
// checks), each ticking a plate in a 2 x 2 grid below. On "all in one interface" the screen eases back out and a trim
// box draws round each pane of the one app: sidebar, agent chat, PR panel. The window's frame leaves as H7.
module.exports = (L, s) => {
  const { plate, screenWin, fitShot, hlTrim, mframe, morphCode, pushScreens, zoomIn, MB } = L;
  const P = require("./_plan.cjs"), hin = P.H.h6, h = P.H.h7;
  const p = s.p, r2 = L.r2;
  const [X, Y, W, Hh] = P.R.wfWin, VW = W - 5, VH = Hh - 5;    // 959 x 551
  const SH = [
    ["app-editor", 1517 / 620, "cover"], ["cli-run", 1248 / 832, "width"], ["desk-review", 2432 / 1396, "width"], ["desk-ship", 2432 / 1396, "width"],
  ].map(([f, ar, m], i) => { const [w, hh] = fitShot(ar, VW, VH, m); return { id: `${p}-s${i}`, src: `assets/shots/site/${f}.png`, w, h: hh, attr: MB() }; });
  const PL = [["Editor", 58, 1030, "editor"], ["Terminal", 552, 1030, "terminal"], ["Code diffs", 58, 1120, "diffs"], ["Pull requests", 552, 1120, "request"]];
  const PANES = [[5.5, 5.5, 164, 540], [183.5, 5.5, 488, 540], [679.5, 5.5, 274, 540]];
  const tTerm = s.at("terminal"), tCode = s.at("code"), tPull = s.at("pull"), tTools = s.at("tools"),
    tAll = s.at("all"), tOne = s.at("one"), tIf = s.at("interface");
  const html =
    screenWin(`${p}-win`, X, Y, W, Hh, SH, { over: PANES.map((r, i) => hlTrim(`${p}-h${i}`, ...r)).join("") }) +
    PL.map(([t, x, y], i) => plate(`${p}-q${i}`, x, y, 470, t)).join("");
  const svg = "";
  const tP1 = r2(tTerm - 0.2), tP2 = r2(tCode - 0.15), tP3 = r2(tPull - 0.21), pD = 0.5;
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      wipeIn("#${p}-win-c", ${hin.inDur}, 0.45);
      gsap.set(q("#${p}-s1, #${p}-s2, #${p}-s3"), { x: ${VW} });
      // each tool ticks its plate on its word
      ${PL.map(([, , , w], i) => { const t = s.at(w); return `plateIn("#${p}-q${i}", ${r2(t - 0.16)}); pop("#${p}-q${i}-tag", ${r2(t + 0.1)});`; }).join("\n      ")}
      // the real screens push through: editor -> terminal -> diff (push in on the code) -> PR (push in on the checks)
      ${pushScreens(`${p}-s0`, `${p}-s1`, VW, tP1, pD)}
      ${pushScreens(`${p}-s1`, `${p}-s2`, VW, tP2, pD)}
      ${zoomIn(`#${p}-s2`, r2(tP2 + pD), 1.6, 422, 165, 0.45)}
      ${pushScreens(`${p}-s2`, `${p}-s3`, VW, tP3, pD)}
      ${zoomIn(`#${p}-s3`, r2(tP3 + pD), 1.6, 950, 150, 0.4)}
      ${zoomIn(`#${p}-s3`, r2(tTools + 0.04), 1, 950, 150, 0.4, 1.6)}
      // "all in one interface": one trim box per pane of the one app
      draw(q("#${p}-h0 path"), ${r2(tAll - 0.04)}, 0.4);
      draw(q("#${p}-h1 path"), ${r2(tOne - 0.04)}, 0.4);
      draw(q("#${p}-h2 path"), ${r2(tIf - 0.04)}, 0.4);
      // clear for the cut
      untrim(q("#${p}-h0 path, #${p}-h1 path, #${p}-h2 path"), ${r2(h.at - 0.36)}, 0.2);
      wipeOut(q("${PL.map((_, i) => `#${p}-q${i}`).join(", ")}"), ${r2(h.at - 0.36)}, 0.24, 0.03);
      wipeOut("#${p}-win-c", ${r2(h.at - 0.2)}, 0.2);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.workflow, cam: P.cam("workflow"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
