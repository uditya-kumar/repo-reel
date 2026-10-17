// solution: "HarnessRouter handles that for you. Your app sends a task, and it passes it to the agent you choose."
// The problem's app window arrives mid-move (H3) and settles; the HarnessRouter board assembles under it and its three
// branches trace out of its ports to the agents. The Claude Code port's lamp lights on "passes". On "sends" the lime input tube draws, task packets drop through the engine and
// down the chosen branch, which turns lime on "passes". The scene clears around the result: the window's outline
// becomes the API request window (H4) while Codex and Claude Code are carried down to the switch's lanes (H4a, H4b).
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, dtube, cube, bpath, samples, klabel, lead, mframe, morphCode, MB, js } = L;
  const P = require("./_plan.cjs"), hin = P.H.h3, h = P.H.h4, ha = P.H.h4a, hb = P.H.h4b;
  const p = s.p;
  const [WX, WY, WW, WH] = P.R.solutionWin, [CX, CY] = P.R.solCodex, [KX, KY] = P.R.solClaude;
  const mid = WX + WW / 2, bot = WY + WH;
  // ---------- the engine (L.board: crafted object, DESIGN.md 5.8); every cable ends on one of its ports ----------
  const hub = L.board(`${p}-hub`, 505, 660, "HR"), tips = hub.ports;
  const inT = [[mid, bot], [mid, bot + 30], [mid, hub.sock[1] - 30], [mid, hub.sock[1]]];
  const br = [
    [tips[0], [tips[0][0] - 52, tips[0][1] + 30], [CX + 170, tips[0][1] + 95], [CX + 170, CY - 10]],
    [tips[1], [tips[1][0] - 22, tips[1][1] + 13], [KX + 170, tips[1][1] + 110], [KX + 170, KY - 10]],
    [tips[2], [tips[2][0] + 52, tips[2][1] + 30], [852, tips[2][1] + 75], [852, 990]],
  ];
  const tHand = s.at("handles"), tSend = s.at("sends"), tTask = s.at("task"), tPass = s.at("passes"), tChoose = s.at("choose");
  const inner = ph(24, 70, 372, 28) + ph(24, 112, 110, 34, 1) + ph(148, 112, 110, 34, 1);
  const flyer = (id, x, y, text, kind) => plate(id, x, y, 340, text, kind).replace(`class="plate"`, `class="plate" ${MB()} data-layout-allow-overlap`);
  let cubes = "";
  for (let k = 0; k < 3; k++) cubes += cube(`${p}-q${k}`) + cube(`${p}-o${k}`);
  const html =
    appWinC(`${p}-win`, WX, WY, WW, WH, "Your app", inner, { attr: `${MB()} data-layout-allow-overlap` }) +
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 58, 680, ["HARNESS", "ROUTER"])}</div>` +
    plate(`${p}-a0`, CX, CY, 340, "Codex", "none") +
    plate(`${p}-a1`, KX, KY, 340, "Claude Code") +
    plate(`${p}-a2`, 682, 1000, 340, "Hermes", "none") +
    // static stand-ins for the two carried plates (blur copies must match them)
    flyer(`${p}-f0`, CX, CY, "Codex", "none") + flyer(`${p}-f1`, KX, KY, "Claude Code");
  const svg =
    `<g id="${p}-hb">${hub.svg}</g>` +
    dtube(`${p}-tin`, bpath(inT), { w: 10, fill: T.lime }) +
    br.map((b, i) => dtube(`${p}-t${i}`, bpath(b), { w: 10, fill: T.paper })).join("") +
    dtube(`${p}-h1`, bpath(br[1]), { w: 10, fill: T.lime }) +
    cubes +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[76, 732], [76, 768], [372, 768]])}</g>`;
  const x0 = L.r2(h.at - 0.3);   // exits start
  const anim = `
      const IN = ${js(samples(inT, 0, 1, 6))}, OUT = ${js(samples(br[1], 0, 0.92, 12))};
      // H3 in: the window lands where the problem's app window was heading
      ${L.carry(`#${p}-win`, hin, "in", P.side("solution", P.R.solutionWin, "in"), 0)}
      gsap.set(q("#${p}-f0, #${p}-f1"), { opacity: 0 });
      // the engine rises in under the app, its label lands beside it
      // (assembles bottom-up: board, chip, parts; each part's fade is short so nothing reads see-through)
      tl.fromTo(q("${hub.parts.join(", ")}"), { y: -40 }, { y: 0, duration: 0.5, ease: E.out, stagger: 0.07 }, ${L.r2(hin.inDur)});
      tl.fromTo(q("${hub.parts.join(", ")}"), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "none", stagger: 0.07 }, ${L.r2(hin.inDur)});
      kin("#${p}-lb", 0.45, 0.2, 0.5); lead("${p}-ld", 0.72);
      drift(q("#${p}-lp, #${p}-lg"), ${hin.inDur}, ${L.r2(h.at - hin.inDur)}, -10);
      // "handles": the branches trace out to the agents, each plate wipes in where its branch lands
      ${[0, 1, 2].map((i) => `draw(q("#${p}-t${i} path"), ${L.r2(tHand - 0.1 + i * 0.08)}, 0.5);`).join(" ")}
      ${[0, 1, 2].map((i) => `plateIn("#${p}-a${i}", ${L.r2(tHand + 0.02 + i * 0.1)});`).join(" ")}
      // "sends a task": lime input, packets fall through the engine and down the chosen branch
      draw(q("#${p}-tin path"), ${L.r2(tSend - 0.08)}, 0.4);
      gsap.set(q("#${p}-h1 path"), { opacity: 0 });
      [0, 1, 2].forEach((k) => {
        const at = ${L.r2(tTask - 0.1)} + k * 0.55;
        // the packet drops into the socket, the engine sends it out of the chosen port
        flow("#${p}-q" + k, IN, at, 0.3, 0); tl.to("#${p}-q" + k, { opacity: 0, duration: 0.06 }, at + 0.25);
        flow("#${p}-o" + k, OUT, at + 0.36, 0.75, 0); tl.to("#${p}-o" + k, { opacity: 0, duration: 0.1 }, at + 1.06);
      });
      draw(q("#${p}-h1 path"), ${L.r2(tPass - 0.05)}, 0.45);
      tl.fromTo("#${p}-hub-lmp1", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: E.out, immediateRender: false }, ${L.r2(tPass - 0.05)});
      pop("#${p}-a1-tag", ${tChoose});
      // clear around the result: label, engine, branches and Hermes leave; the window empties to its outline
      kout("#${p}-lb", ${L.r2(x0 - 0.1)}); unlead("${p}-ld", ${L.r2(x0 - 0.1)});
      untrim(q("#${p}-tin path, #${p}-h1 path, #${p}-t0 path, #${p}-t1 path, #${p}-t2 path"), ${x0}, 0.28);
      away("#${p}-hb", ${L.r2(x0 + 0.06)}, 24, 0.26);
      wipeOut("#${p}-a2", ${L.r2(x0 + 0.04)}, 0.24);
      wipeOut("#${p}-win-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}
      // H4a/H4b: the two agents of the next line are carried down to its lanes
      tl.set(q("#${p}-a0, #${p}-a1"), { opacity: 0 }, ${h.at}); tl.set(q("#${p}-f0, #${p}-f1"), { opacity: 1 }, ${h.at});
      ${L.carry(`#${p}-f0`, ha, "out", P.side("solution", P.R.solCodex, "out"), ha.at)}
      ${L.carry(`#${p}-f1`, hb, "out", P.side("solution", P.R.solClaude, "out"), hb.at)}`;
  return { lift: P.lift.solution, cam: P.cam("solution"), fade: false, svg, html, over: mframe(`${p}-mf`), anim };
};
