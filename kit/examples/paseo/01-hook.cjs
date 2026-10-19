// hook: "What if you could run multiple AI coding agents at once, and manage them all from your phone?"
// Three agent outlines trace on from frame 0 and fill in as Claude Code, Codex and Copilot windows; the label lands
// word by word; on "at once" all three progress bars fill together. On "manage" the row glides up, the real Paseo
// phone app rises in under it, and a tube drops from each window into the phone with lime pulses running down.
// The phone's outline becomes the morph frame that lands as the Paseo logo tile (match cut H1).
module.exports = (L, s) => {
  const { agentWin, shotBox, dtube, pulse, klabel, lead, trimRect, mframe, morphCode } = L;
  const P = require("./_plan.cjs"), h = P.H.h1;
  const p = s.p;
  const [PX, PY, PW, PHh] = P.R.hookPhone;
  const wins = [["Claude Code", "claude-code", 58], ["Codex", "codex", 395], ["Copilot", "copilot", 732]];
  const WY = 400, WH = 230, DY = 190;   // the row rests 190 px lower (centred) until "manage"
  const tubes = [[203, 470], [540, 540], [877, 610]].map(([x, e]) => `M${x} ${WY + WH} C${x} ${WY + WH + 70} ${e} ${PY - 70} ${e} ${PY}`);
  const tAI = s.at("AI"), tAt = s.at("at"), tMan = s.at("manage"), tThem = s.at("them"), tPh = s.at("phone");
  const html =
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 540, 535, ["AI CODING AGENTS"], { a: "middle" })}</div>` +
    wins.map(([t, l, x], i) => agentWin(`${p}-w${i}`, x, WY, 290, WH, t, l, { lines: [0.9, 0.6, 0.75] })).join("") +
    shotBox(`${p}-ph`, PX, PY, PW, PHh, "assets/shots/site/phone-chat.png", { attr: "data-layout-allow-overlap" }) +
    klabel(`${p}-lph`, 732, 1010, ["YOUR PHONE"]);
  const svg =
    wins.map(([, , x], i) => trimRect(`${p}-tr${i}`, x, WY + DY, 290, WH)).join("") +
    tubes.map((d, i) => dtube(`${p}-t${i}`, d, { w: 12 })).join("") +
    tubes.map((d, i) => pulse(`${p}-u${i}`, d, { lime: true, len: 0.22 })).join("") +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[720, 1000], [690, 1000]])}</g>`;
  const W = [0, 1, 2], ws = W.map((i) => `#${p}-w${i}`).join(", ");
  const tUp = L.r2(tMan - 0.1), tRise = L.r2(tMan + 0.06), x0 = L.r2(h.at - 0.26);
  const anim = `
      // frame 0: the three outlines trace on, the windows wipe in over them left to right
      ${W.map((i) => `tl.fromTo(q("#${p}-tr${i} path"), { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.7, ease: E.flow }, ${L.r2(i * 0.12)});`).join("\n      ")}
      gsap.set(q("${ws}"), { y: ${DY} });
      wipeIn(q("${ws}"), 0.3, 0.5, 0.14);
      tl.set(q("#${p}-tr0, #${p}-tr1, #${p}-tr2"), { opacity: 0 }, 1.1);
      gsap.set(q("${W.map((i) => `#${p}-w${i}-pf`).join(", ")}"), { scaleX: 0 });
      // the label lands with the voice: AI / coding / agents
      kin("#${p}-lb", ${L.r2(tAI - 0.04)}, 0.45, 0.5);
      drift("#${p}-lp", 0, ${L.SETTLE}, -10);
      // "at once": all three bars fill together
      tl.fromTo(q("${W.map((i) => `#${p}-w${i}-pf`).join(", ")}"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: E.outQ, immediateRender: false }, ${L.r2(tAt - 0.05)});
      // "manage": the label leaves, the row glides up, the phone rises in under it
      kout("#${p}-lb", ${L.r2(tUp - 0.3)});
      tl.fromTo(q("${ws}"), { y: ${DY} }, { y: 0, duration: 0.6, ease: E.inOut, stagger: 0.04, immediateRender: false }, ${tUp});
      tl.fromTo("#${p}-ph", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: E.out }, ${tRise});
      // "them all": a tube from each window into the phone, lime pulses running down
      ${W.map((i) => `draw(q("#${p}-t${i} path"), ${L.r2(tThem - 0.05 + i * 0.06)}, 0.42);`).join(" ")}
      ${W.map((i) => `run("#${p}-u${i}", ${L.r2(tThem + 0.3 + i * 0.1)}, 0.55, 2, 0.05);`).join(" ")}
      // "phone"
      kin("#${p}-lph", ${L.r2(tPh - 0.1)}, 0.08, 0.5); lead("${p}-ld", ${L.r2(tPh)});
      // clear for the cut: label, windows and tubes go, the phone empties to its outline
      kout("#${p}-lph", ${x0}); unlead("${p}-ld", ${x0});
      tl.set(q("${W.map((i) => `#${p}-u${i}`).join(", ")}"), { opacity: 0 }, ${x0});
      untrim(q("${W.map((i) => `#${p}-t${i} path`).join(", ")}"), ${x0}, 0.22);
      wipeOut(q("${ws}"), ${L.r2(x0 - 0.04)}, 0.24, 0.04);
      wipeOut("#${p}-ph-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-ph", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  return { lift: P.lift.hook, cam: P.cam("hook"), fade: false, svg, html, over: mframe(`${p}-mf`), anim };
};
