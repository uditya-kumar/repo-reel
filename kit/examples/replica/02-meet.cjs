// meet: "Meet Replica Skill, an open-source toolkit that helps Claude rebuild an app's functionality from scratch."
// Your version's frame grows to fill the whole screen (H1) and lands as the real README, captured 9:16 on GitHub
// (assets/shots/readme-tall.png, 1080 x 3400: the README tab, the intro, Install, then the eleven commands), full
// bleed edge to edge. It scrolls slowly down the page through the line, settling on "The eleven" table, then empties
// to its frame, which shrinks into the next scene's Claude Code session (H2).
module.exports = (L, s) => {
  const { mframe, morphCode } = L;
  const U = require("../lib/ui.cjs")(L), P = require("./_plan.cjs"), hin = P.H.h1, h = P.H.h2;
  const p = s.p, r2 = L.r2;
  const [X, Y, W, Hh] = P.R.meetFull;
  // the shot fills the screen's width (1080 real px = W in .lift px); the scroll runs to its bottom edge
  const IH = L.r3((3400 / 1080) * W), DY = L.r3(IH - Hh);
  const html =
    `<div id="${p}-rd" style="position:absolute;left:${X}px;top:${Y}px;width:${W}px;height:${Hh}px;overflow:hidden;background:#0d1117">` +
    `<div id="${p}-rd-c" class="wc"><img id="${p}-rs" src="assets/shots/readme-tall.png" alt="" data-layout-allow-overlap ` +
    `style="position:absolute;left:0;top:0;width:${W}px;height:${IH}px"></div></div>`;
  const tS = r2(hin.inDur + 0.25), tE = r2(h.at - 0.4);
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-rd`)}
      wipeIn("#${p}-rd-c", ${r2(hin.inDur - 0.02)}, 0.3);
      // the slow scroll down the README
      tl.fromTo("#${p}-rs", { y: 0 }, { y: ${-DY}, duration: ${r2(tE - tS)}, ease: E.cam }, ${tS});
      // clear for the cut: the page empties to its frame
      wipeOut("#${p}-rd-c", ${r2(h.at - 0.22)}, 0.22);
      tl.set("#${p}-rd", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  void U;
  return { lift: P.lift.meet, cam: P.cam("meet"), fade: false, html, svg: "", over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
