// handoff: "You can even have Claude plan a feature, then hand that plan over to Codex to build it."
// A Claude Code window fills the field; a PLAN card wipes in on "plan" and its rows tick on "feature". On "hand that
// plan over" the Claude window's frame shrinks to the corner and dims, and the PLAN card lifts off (a static,
// motion-blurred flyer) on an arc, riding a lime handoff tube into a Codex window that opens on "Codex"; the real skill
// name /paseo-handoff (README, Skills) wipes in beside the arc. On "build" code lines write into Codex and its bar
// fills. The Codex window's frame leaves as H5.
module.exports = (L, s) => {
  const { T, agentWin, plate, klabel, lead, dtube, pulse, mframe, morphCode, MB } = L;
  const P = require("./_plan.cjs"), h = P.H.h5;
  const p = s.p, r2 = L.r2;
  const CL = [58, 420, 964, 560], SM = [58, 340, 460, 310], CX = P.R.hoCodex;
  const PC = [96, 120, 560, 280];                                  // plan card inside the Claude window
  const PA = [CL[0] + 2.5 + PC[0], CL[1] + 2.5 + PC[1]];           // ... in .lift
  const K = 0.446, PB = [CX[0] + 2.5 + 36, CX[1] + 2.5 + 120];     // where it lands in the Codex window, at scale K
  const ROWS = [0.86, 0.7, 0.78, 0.55, 0.66];
  const card = (id, ticked, attr = "") => `<div id="${id}" class="win" ${attr} style="left:${PC[0]}px;top:${PC[1]}px;width:${PC[2]}px;height:${PC[3]}px;background:${T.g500}">` +
    `<div style="position:absolute;left:20px;top:14px;font-size:26px;font-weight:600;letter-spacing:0.04em">PLAN</div>` +
    ROWS.map((f, i) => `<div style="position:absolute;left:20px;top:${62 + i * 40}px;width:22px;height:22px;border:2px solid ${T.ink};background:${T.hi}"></div>` +
      `<div ${ticked ? "" : `id="${id}-k${i}" `}style="position:absolute;left:20px;top:${62 + i * 40}px;width:22px;height:22px;border:2px solid ${T.on};background:${T.lime}"></div>` +
      `<div class="win-ph" style="left:58px;top:${66 + i * 40}px;width:${Math.round((PC[2] - 90) * f)}px;height:14px"></div>`).join("") + `</div>`;
  const code = (id, x, y, w, n) => [0.9, 0.6, 0.8, 0.45, 0.7, 0.85, 0.5].slice(0, n).map((f, i) =>
    `<div id="${id}${i}" class="win-ph lt" style="left:${x + (i % 3 === 1 ? 28 : 0)}px;top:${y + i * 34}px;width:${Math.round(w * f)}px;height:16px"></div>`).join("");
  const arc = "M290 650 C290 820 420 860 560 860";
  const tPlan = s.at("plan"), tFeat = s.at("feature"), tHand = s.at("hand"), tOver = s.at("over"), tCodex = s.at("Codex"), tBuild = s.at("build");
  // the flyer: a static copy of the ticked card (its own element, so its contents never change while it's blurred)
  const fly = card(`${p}-fly`, true, `${MB()} data-layout-allow-overlap`).replace(`left:${PC[0]}px;top:${PC[1]}px`, `left:${PA[0]}px;top:${PA[1]}px`);
  const handoff = plate(`${p}-hp`, 560, 500, 430, "/paseo-handoff", "none").replace('style="', 'style="text-transform:none;letter-spacing:0;');
  const html =
    agentWin(`${p}-cl`, ...CL, "Claude Code", "claude-code", { lines: [0.4], extra: card(`${p}-pc`, false) + code(`${p}-cc`, 700, 140, 230, 7) }) +
    `<div id="${p}-dim">` + agentWin(`${p}-cs`, ...SM, "Claude Code", "", { lines: [0.6, 0.4], logo: false, lx: 96, extra: `<div style="position:absolute;left:22px;top:66px;width:56px;height:56px;background:url(assets/logos/claude-code.svg) center / contain no-repeat"></div>` }) + `</div>` + mframe(`${p}-mi`) +
    klabel(`${p}-lb`, 640, 1050, ["PLAN"]) + handoff +
    agentWin(`${p}-cx`, ...CX, "Codex", "codex", { lines: [0.4], extra: code(`${p}-xc`, 310, 130, 280, 7) }) +
    fly;
  const svg = `<g id="${p}-lg">${lead(`${p}-ld`, [[620, 1040], [380, 1040], [380, 1000]])}</g>` +
    dtube(`${p}-arc`, arc, { w: 12, fill: T.lime }) + pulse(`${p}-u`, arc, { lime: true, len: 0.3 });
  const tLift = r2(tHand + 0.05), fDur = r2(tOver + 0.45 - tLift), tShr = r2(tHand + 0.02), gDur = 0.5;
  const fx = r2(PB[0] - PA[0]), fy = r2(PB[1] - PA[1]);
  const anim = `
      wipeIn("#${p}-cl", 0.05, 0.5);
      gsap.set("#${p}-cl-pf", { scaleX: 0 });
      tl.fromTo("#${p}-cl-pf", { scaleX: 0 }, { scaleX: 1, duration: ${r2(tHand - 0.6)}, ease: E.inOut, immediateRender: false }, 0.5);
      // "plan a feature": the card wipes in, its rows tick one by one
      wipeIn("#${p}-pc", ${r2(tPlan - 0.15)}, 0.45);
      ${ROWS.map((_, i) => `pop("#${p}-pc-k${i}", ${r2(tFeat - 0.1 + i * 0.12)});`).join(" ")}
      wipeIn(q("${[0, 1, 2, 3, 4, 5, 6].map((i) => `#${p}-cc${i}`).join(", ")}"), ${r2(tPlan + 0.1)}, 0.3, 0.07);
      kin("#${p}-lb", ${r2(tPlan + 0.1)}, 0.05, 0.5); lead("${p}-ld", ${r2(tPlan + 0.25)});
      // "hand that plan over": the card lifts off, the Claude window shrinks to the corner and dims
      kout("#${p}-lb", ${r2(tHand - 0.3)}); unlead("${p}-ld", ${r2(tHand - 0.3)});
      gsap.set("#${p}-fly", { opacity: 0 });
      tl.set("#${p}-pc", { opacity: 0 }, ${tLift}); tl.set("#${p}-fly", { opacity: 1 }, ${tLift});
      tl.fromTo("#${p}-fly", { x: 0, scale: 1 }, { x: ${fx}, scale: ${K}, duration: ${fDur}, ease: E.inOut, transformOrigin: "0 0", immediateRender: false }, ${tLift});
      tl.fromTo("#${p}-fly", { y: 0 }, { y: ${fy}, duration: ${fDur}, ease: E.outQ, immediateRender: false }, ${tLift});
      wipeOut("#${p}-cl-c", ${r2(tShr - 0.12)}, 0.14);
      mfSet("${p}-mi", ${L.js(CL)}); gsap.set(q("#${p}-mi, #${p}-cs"), { opacity: 0 }); gsap.set("#${p}-dim", { opacity: 0.6 });
      tl.set("#${p}-cl", { opacity: 0 }, ${tShr}); tl.set("#${p}-mi", { opacity: 1 }, ${tShr});
      morph("${p}-mi", ${L.js(CL)}, ${L.js(SM)}, ${tShr}, ${gDur}, E.inOut);
      tl.set("#${p}-mi", { opacity: 0 }, ${r2(tShr + gDur)}); tl.set("#${p}-cs", { opacity: 1 }, ${r2(tShr + gDur)});
      wipeIn("#${p}-cs-c", ${r2(tShr + gDur)}, 0.35);
      draw(q("#${p}-arc path"), ${r2(tHand + 0.2)}, 0.5); run("#${p}-u", ${r2(tHand + 0.55)}, 0.5, 2, 0.1);
      plateIn("#${p}-hp", ${r2(tHand + 0.3)});
      // Codex opens, the plan lands in it; on "build" code writes in and its bar fills
      wipeIn("#${p}-cx", ${r2(tCodex - 0.36)}, 0.45);
      gsap.set("#${p}-cx-pf", { scaleX: 0 });
      wipeIn(q("${[0, 1, 2, 3, 4, 5, 6].map((i) => `#${p}-xc${i}`).join(", ")}"), ${r2(tCodex + 0.2)}, 0.26, 0.08);
      tl.fromTo("#${p}-cx-pf", { scaleX: 0 }, { scaleX: 1, duration: ${r2(h.at - 0.25 - (tBuild - 0.2))}, ease: E.inOut, immediateRender: false }, ${r2(tBuild - 0.2)});
      // clear for the cut
      tl.set("#${p}-u", { opacity: 0 }, ${r2(h.at - 0.3)});
      untrim(q("#${p}-arc path"), ${r2(h.at - 0.3)}, 0.2);
      wipeOut(q("#${p}-hp, #${p}-cs"), ${r2(h.at - 0.3)}, 0.24, 0.04);
      wipeOut(q("#${p}-cx-c, #${p}-fly"), ${r2(h.at - 0.16)}, 0.16);
      tl.set(q("#${p}-cx, #${p}-fly"), { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  return { lift: P.lift.handoff, cam: P.cam("handoff"), fade: false, svg, html, over: mframe(`${p}-mf`), anim };
};
