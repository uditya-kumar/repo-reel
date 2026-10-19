// phone: "The best part? Your agents run on your own machine, but you can check their progress and manage them from your
// phone, even when you're away."
// The Codex frame grows into the real Paseo desktop app (H5). On "agents" a detail lens lifts its Working list (the two
// running agents) out into a magnified inset under it, held through YOUR MACHINE and closed before the phone. On "check" the
// real phone app rises under it, tied to the desktop by a live lime tube. On "progress" a detail lens lifts the phone's
// Working rows out into a magnified inset (new: detail lens). The phone switches to the agent chat on "phone", and on
// "even when you're away" it slides off to the right while the tube stretches with it, still pulsing (new: stretch
// tether), and a dimension line measures AWAY FROM YOUR DESK. The phone's frame leaves as H6.
module.exports = (L, s) => {
  const { T, klabel, lead, screenWin, shotBox, fitShot, hlTrim, dtube, pulse, dimLine, mframe, morphCode, lensIn, lensOut, stretch, MB } = L;
  const P = require("./_plan.cjs"), hin = P.H.h5, h = P.H.h6;
  const p = s.p, r2 = L.r2;
  const [X, Y, W, Hh] = P.R.phDesk, [, PY, PW, PHh] = P.R.phPhone, PX0 = 120, DX = P.R.phPhone[0] - PX0;
  const [sw, sh] = fitShot(2432 / 1396, W - 5, Hh - 5);
  const tA = "M540 810 C540 860 225 800 225 856", tB = "M540 810 C540 880 895 790 895 856";
  // desk lens: the sidebar's Working section (desk-build.png x 20..430, y 652..812: the two running agents) magnified
  // 1.5x of the source into an inset under the desktop. DBX = the region in the screen's own px (the trim box).
  const dk = sw / 2432, DR = [20, 652, 410, 160], DBX = DR.map((v) => L.r1(v * dk));
  const DSRC = [L.r1(X + 2.5 + DBX[0]), L.r1(Y + 2.5 + DBX[1]), DBX[2], DBX[3]];
  const dK = (W - 5) / DR[2], DINS = [X, 850, W, Math.round(DR[3] * dK) + 5];
  // lens: the phone's Working rows (phone-drawer.png y 1272..1526, x 50..942) magnified into a 592 x 169 inset
  const BOX = [122, 1112, 206, 66], INS = [430, 960, 592, 169], inS = (INS[2] - 5) / 892;
  const tRun = s.at("run"), tMach = s.at("machine"), tCheck = s.at("check"), tProg = s.at("progress"),
    tMan = s.at("manage"), tPh = s.at("phone"), tEven = s.at("even"), tAway = s.at("away");
  const html =
    klabel(`${p}-lb0`, 230, 384, ["THE BEST PART?"]) + klabel(`${p}-lb1`, 230, 384, ["YOUR MACHINE"]) +
    screenWin(`${p}-desk`, X, Y, W, Hh, [{ id: `${p}-s0`, src: "assets/shots/site/desk-build.png", w: sw, h: sh }],
      { over: hlTrim(`${p}-hw`, ...DBX) }) +
    `<div id="${p}-dn" class="win" style="left:${DINS[0]}px;top:${DINS[1]}px;width:${DINS[2]}px;height:${DINS[3]}px">` +
    `<div id="${p}-dn-i" style="position:absolute;left:0;top:0;width:${DINS[2] - 5}px;height:${DINS[3] - 5}px">` +
    `<div style="position:absolute;inset:0;background:url(assets/shots/site/desk-build.png) ${r2(-DR[0] * dK)}px ${r2(-DR[1] * dK)}px / ${r2(2432 * dK)}px ${r2(1396 * dK)}px no-repeat"></div></div></div>` +
    mframe(`${p}-md`) +
    shotBox(`${p}-ph`, PX0, PY, PW, PHh, "assets/shots/site/phone-drawer.png", {
      attr: `${MB()} data-layout-allow-overlap`,
      inner: `<img id="${p}-ph-j" src="assets/shots/site/phone-chat.png" alt="" data-layout-allow-overlap style="position:absolute;left:0;top:0;width:${PW - 5}px;height:${PHh - 5}px">`,
    }) +
    hlTrim(`${p}-lx`, ...BOX) +
    `<div id="${p}-in" class="win" style="left:${INS[0]}px;top:${INS[1]}px;width:${INS[2]}px;height:${INS[3]}px">` +
    `<div id="${p}-in-i" style="position:absolute;left:0;top:0;width:${INS[2] - 5}px;height:${INS[3] - 5}px">` +
    `<div style="position:absolute;inset:0;background:url(assets/shots/site/phone-drawer.png) ${r2(-50 * inS)}px ${r2(-1272 * inS)}px / ${r2(992 * inS)}px ${r2(2120 * inS)}px no-repeat"></div></div></div>` +
    mframe(`${p}-ml`) +
    klabel(`${p}-lp`, 430, 1200, ["PROGRESS"]) +
    klabel(`${p}-la`, 506, 1054, ["AWAY FROM", "YOUR DESK"], { a: "middle" });
  const svg =
    dtube(`${p}-tt`, tA, { w: 12, fill: T.lime }) + pulse(`${p}-tu`, tA, { lime: true, len: 0.25 }) +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[330, 1145], [400, 1060], [424, 1060]])}</g>` +
    dimLine(`${p}-dm`, 232, 780, 1140);
  const tRise = r2(tCheck - 0.25), tLens = r2(tProg - 0.06), tLab = r2(tLens + 0.5), tOff = r2(Math.max(tMan + 0.05, tLab + 0.65)), tSl = r2(tEven - 0.06), slD = 0.6;
  const tAg = s.at("agents"), tDl = r2(tAg - 0.15), tDo = r2(tRise - 0.28);
  if (tDo < tDl + 0.75 + 0.9) throw new Error(`${s.id}: desk lens holds under 0.9 s (opens ${tDl + 0.75}, closes ${tDo})`);
  const x0 = r2(h.at - 0.26);
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-desk`)}
      wipeIn("#${p}-desk-c", ${hin.inDur}, 0.45);
      kin("#${p}-lb0", 0.12, 0.06, 0.5); kout("#${p}-lb0", ${r2(tRun - 0.62)});
      // "your agents run on your own machine": a lens lifts the desktop's Working list (the running agents) out${lensIn(`${p}-hw`, `${p}-md`, `${p}-dn`, DSRC, DINS, tDl)}
      kin("#${p}-lb1", ${r2(tMach - 0.12)}, 0.06, 0.5);${lensOut(`${p}-hw`, `${p}-dn`, tDo)}
      // "check": the phone rises in, a live tube ties it to the machine
      tl.fromTo("#${p}-ph", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E.out }, ${tRise});
      gsap.set("#${p}-ph-j", { opacity: 0 });
      draw(q("#${p}-tt path"), ${r2(tCheck)}, 0.4);
      run("#${p}-tu", ${r2(tCheck + 0.3)}, 0.55, 3, 0.15);
      // "progress": the lens lifts the Working rows out of the phone${lensIn(`${p}-lx`, `${p}-ml`, `${p}-in`, BOX, INS, tLens)}
      lead("${p}-ld", ${r2(tLab - 0.05)}); kin("#${p}-lp", ${tLab}, 0.05, 0.5);
      kout("#${p}-lp", ${tOff}); unlead("${p}-ld", ${tOff});${lensOut(`${p}-lx`, `${p}-in`, r2(tOff + 0.04))}
      // "phone": it switches to the agent chat
      tl.set("#${p}-ph-j", { opacity: 1 }, ${r2(tPh - 0.3)});
      // "even when you're away": the phone slides off, the tube stretches with it and keeps pulsing
      tl.fromTo("#${p}-ph", { x: 0 }, { x: ${DX}, duration: ${slD}, ease: E.inOut, immediateRender: false }, ${tSl});
      ${stretch(`#${p}-tt path, #${p}-tu path`, tA, tB, tSl, slD)}
      run("#${p}-tu", ${r2(tSl + slD)}, 0.55, 1, 0.1);
      draw(q("#${p}-dm-l0, #${p}-dm-l1"), ${r2(tSl + 0.35)}, 0.45);
      pop("#${p}-dm-a", ${r2(tSl + 0.72)}); pop("#${p}-dm-b", ${r2(tSl + 0.72)});
      kin("#${p}-la", ${r2(tAway - 0.25)}, 0.06, 0.5);
      // clear for the cut: everything but the phone, then the phone empties to its outline
      kout("#${p}-lb1", ${x0}); kout("#${p}-la", ${x0});
      tl.to(q("#${p}-dm"), { opacity: 0, duration: 0.2, ease: E.in }, ${x0});
      tl.set("#${p}-tu", { opacity: 0 }, ${x0});
      untrim(q("#${p}-tt path"), ${x0}, 0.2);
      wipeOut("#${p}-desk", ${r2(x0 - 0.04)}, 0.26);
      wipeOut("#${p}-ph-c", ${r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-ph", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.phone, cam: P.cam("phone"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
