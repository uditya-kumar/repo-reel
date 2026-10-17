// hook: "Want AI coding agents like Claude Code and Codex inside your own app?"
// The app window traces itself on from frame 0; the label types out word by word; the two agent plates wipe in on
// their names, then fly (motion-blurred) down the lime arrows into the window's empty slots. The window's outline
// then becomes the morph frame that opens into the product diagram (match cut H1).
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, barrow, klabel, trimRect, mframe, morphCode, MB } = L;
  const P = require("./_plan.cjs"), h = P.H.h1;
  const p = s.p;
  const tAI = s.at("AI"), tC = s.at("Claude"), tCode = s.at("Code"), tX = s.at("Codex"), tIn = s.at("inside"), tOwn = s.at("own");
  const [WX, WY, WW, WH] = P.R.hookWin;
  // slot rects inside the window (the plates land on these); +2.5 = the window's outline
  const slot = [[40, 126], [40, 214]], abs = slot.map(([x, y]) => [WX + 2.5 + x, WY + 2.5 + y]);
  const top = [[70, 440], [610, 440]], names = ["Claude Code", "Codex"];
  const html =
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 540, 392, ["AI CODING AGENTS"], { a: "middle" })}</div>` +
    plate(`${p}-ag0`, top[0][0], top[0][1], 400, names[0], "plus") +
    plate(`${p}-ag1`, top[1][0], top[1][1], 400, names[1], "plus") +
    appWinC(`${p}-win`, WX, WY, WW, WH, "Your app",
      `<div id="${p}-w0" style="position:absolute;inset:0">${ph(24, 70, 432, 28)}</div>` +
      `<div id="${p}-w1" style="position:absolute;inset:0">${ph(slot[0][0], slot[0][1], 400, 68, 1)}${ph(slot[1][0], slot[1][1], 400, 68, 1)}</div>` +
      `<div id="${p}-w2" style="position:absolute;inset:0">${ph(24, 306, 200, 28, 1)}${ph(240, 306, 120, 28, 1)}</div>` +
      plate(`${p}-in0`, slot[0][0], slot[0][1], 400, names[0]) +
      plate(`${p}-in1`, slot[1][0], slot[1][1], 400, names[1])) +
    // static stand-ins that make the flight (a motion-blurred element must look final when blur attaches)
    names.map((n, i) => plate(`${p}-fl${i}`, top[i][0], top[i][1], 400, n, "none").replace(`class="plate"`, `class="plate" ${MB()} data-layout-allow-overlap`)).join("");
  const svg =
    trimRect(`${p}-tr`, WX, WY, WW, WH) +
    barrow(`${p}-arL`, 300, 540, 150, 52, T.lime) +
    barrow(`${p}-arR`, 780, 540, 150, 128, T.lime);
  const fly = 0.48, tFly = L.r2(tIn + 0.1), tLand = L.r2(tFly + fly);
  const anim = `
      // frame 0: the window outline is already tracing; the window wipes in over it, its rows follow
      tl.fromTo(q("#${p}-tr path"), { attr: { "stroke-dashoffset": 0.75 } }, { attr: { "stroke-dashoffset": 0 } , duration: 0.9, ease: E.flow }, 0);
      wipeIn("#${p}-win", 0.3, 0.55);
      wipeIn(q("#${p}-w0, #${p}-w1, #${p}-w2"), 0.6, 0.45, 0.08);
      gsap.set(q("#${p}-in0, #${p}-in1, #${p}-fl0, #${p}-fl1"), { opacity: 0 });
      // the label lands word by word with the voice (AI / coding / agents)
      kin("#${p}-lb", ${L.r2(tAI - 0.04)}, 0.32, 0.5);
      drift("#${p}-lp", 0, ${h.at}, -14);
      // the agents, each on its name
      plateIn("#${p}-ag0", ${L.r2(tC - 0.12)}); pop("#${p}-ag0-tag", ${tCode});
      plateIn("#${p}-ag1", ${L.r2(tX - 0.12)}); pop("#${p}-ag1-tag", ${L.r2(tX + 0.2)});
      // "inside": the arrows shoot, the plates fly down them into the slots, the arrows pull in behind them
      unpop("#${p}-ag0-tag", ${L.r2(tIn - 0.15)}); unpop("#${p}-ag1-tag", ${L.r2(tIn - 0.1)});
      wipe("#${p}-arL", ${L.r2(tIn - 0.2)}, 0.3); wipe("#${p}-arR", ${L.r2(tIn - 0.15)}, 0.3);
      tl.set(q("#${p}-ag0, #${p}-ag1"), { opacity: 0 }, ${tFly});
      tl.set(q("#${p}-fl0, #${p}-fl1"), { opacity: 1 }, ${tFly});
      tl.fromTo("#${p}-fl0", { x: 0, y: 0 }, { x: ${abs[0][0] - top[0][0]}, y: ${abs[0][1] - top[0][1]}, duration: ${fly}, ease: E.inOut, immediateRender: false }, ${tFly});
      tl.fromTo("#${p}-fl1", { x: 0, y: 0 }, { x: ${abs[1][0] - top[1][0]}, y: ${abs[1][1] - top[1][1]}, duration: ${fly}, ease: E.inOut, immediateRender: false }, ${L.r2(tFly + 0.04)});
      unwipe("#${p}-arL", ${L.r2(tFly + 0.08)}, 0.3); unwipe("#${p}-arR", ${L.r2(tFly + 0.12)}, 0.3);
      tl.set("#${p}-fl0", { opacity: 0 }, ${tLand}); tl.set("#${p}-in0", { opacity: 1 }, ${tLand});
      tl.set("#${p}-fl1", { opacity: 0 }, ${L.r2(tLand + 0.04)}); tl.set("#${p}-in1", { opacity: 1 }, ${L.r2(tLand + 0.04)});
      // "your own app": both land checked
      pop("#${p}-in0-tag", ${L.r2(Math.max(tOwn, tLand + 0.02))}); pop("#${p}-in1-tag", ${L.r2(Math.max(tOwn, tLand + 0.02) + 0.07)});
      // clear for the cut: label rises out, the contents wipe away, the bare outline becomes the morph frame
      kout("#${p}-lb", ${L.r2(h.at - 0.4)});
      wipeOut("#${p}-win-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set(q("#${p}-win, #${p}-tr"), { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  return { lift: P.lift.hook, cam: P.cam("hook"), fade: false, svg, html, over: mframe(`${p}-mf`), anim };
};
