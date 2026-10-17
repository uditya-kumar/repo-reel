// meet: "Meet HarnessRouter. It's an open-source tool that lets your app connect to different AI agents through one API."
// The hook's window outline lands as the frame of the product diagram (H1), which wipes in. A lime trim box then
// walks the diagram with the voice: your product -> the agents -> 1 API (each box retracts as the next one draws).
// The diagram's frame leaves as the next morph frame (H2).
module.exports = (L, s) => {
  const { plate, klabel, lead, hlTrim, mframe, morphCode } = L;
  const P = require("./_plan.cjs"), hin = P.H.h1, h = P.H.h2;
  const p = s.p;
  const [X, Y, W, Hh] = P.R.meetWin, IW = W - 5, IH = Hh - 5;   // harnessRouter.png 1013x311 -> 959x294
  const bot = Y + Hh, LX = 927;
  const tOS = s.at("open-source"), tYour = s.at("your"), tDiff = s.at("different"), tThr = s.at("through"),
    tOne = s.at("one"), tAPI = s.at("API");
  const html =
    `<div id="${p}-win" class="win" style="left:${X}px;top:${Y}px;width:${W}px;height:${Hh}px">` +
    `<img id="${p}-shot" src="assets/shots/harnessRouter.png" alt="" style="position:absolute;left:0;top:0;width:${IW}px;height:${IH}px">` +
    hlTrim(`${p}-hl0`, 6, 114, 150, 71) + hlTrim(`${p}-hl1`, 664, 50, 270, 198) + hlTrim(`${p}-hl2`, 199, 131, 80, 36) + `</div>` +
    `<div id="${p}-pl" class="plane">` +
    plate(`${p}-pl1`, 58, 420, 430, "Open source") +
    plate(`${p}-pl2`, 58, bot + 40, 430, "One API") +
    klabel(`${p}-lb`, 1022, bot + 80, ["DIFFERENT", "AI AGENTS"], { a: "end" }) + `</div>`;
  const svg = `<g id="${p}-pg">${lead(`${p}-ld`, [[LX, bot + 44], [LX, bot + 12]])}</g>`;
  const hl = (i, at) => `draw(q("#${p}-hl${i} path"), ${L.r2(at)}, 0.55);`;
  const unhl = (i, at) => `untrim(q("#${p}-hl${i} path"), ${L.r2(at)}, 0.3);`;
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      wipeIn("#${p}-shot", ${hin.inDur}, 0.6);
      // parallax: the plates and the label float a few px against the camera
      drift(q("#${p}-pl, #${p}-pg"), ${hin.inDur}, ${L.r2(h.at - hin.inDur)}, -10);
      plateIn("#${p}-pl1", ${L.r2(tOS - 0.12)}); pop("#${p}-pl1-tag", ${L.r2(tOS + 0.28)});
      // the trim box walks the diagram with the voice
      ${hl(0, tYour)}
      ${unhl(0, tDiff - 0.05)} ${hl(1, tDiff + 0.05)}
      kin("#${p}-lb", ${L.r2(tDiff - 0.04)}, 0.36, 0.5); lead("${p}-ld", ${L.r2(tDiff + 0.3)});
      plateIn("#${p}-pl2", ${L.r2(tThr + 0.05)});
      ${unhl(1, tOne - 0.08)} ${hl(2, tOne)}
      pop("#${p}-pl2-tag", ${tAPI});
      // clear for the cut
      ${unhl(2, h.at - 0.38)}
      kout("#${p}-lb", ${L.r2(h.at - 0.32)}); unlead("${p}-ld", ${L.r2(h.at - 0.32)});
      wipeOut(q("#${p}-pl1, #${p}-pl2"), ${L.r2(h.at - 0.3)}, 0.26, 0.05);
      wipeOut("#${p}-shot", ${L.r2(h.at - 0.25)}, 0.25);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.meet, cam: P.cam("meet"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
