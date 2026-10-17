// solution: "HarnessRouter handles that for you. Your app sends a task, and it passes it to the agent you choose."
// The problem's app window arrives mid-move (H3) and settles; the HarnessRouter engine rises under it and its three
// branches trace out to the agents. On "sends" the lime input tube draws, task packets drop through the engine and
// down the chosen branch, which turns lime on "passes". The scene clears around the result: the window's outline
// becomes the API request window (H4) while Codex and Claude Code are carried down to the switch's lanes (H4a, H4b).
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, adapter, dtube, cube, bpath, samples, klabel, lead, mframe, morphCode, MB, js } = L;
  const P = require("./_plan.cjs"), hin = P.H.h3, h = P.H.h4, ha = P.H.h4a, hb = P.H.h4b;
  const p = s.p;
  const [WX, WY, WW, WH] = P.R.solutionWin, [CX, CY] = P.R.solCodex, [KX, KY] = P.R.solClaude;
  const mid = WX + WW / 2, bot = WY + WH;
  const inT = [[mid, bot], [mid, bot + 40], [mid, bot + 80], [mid, 700]];
  const br = [
    [[470, 780], [400, 860], [CX + 170, 880], [CX + 170, CY - 10]],
    [[560, 830], [560, 930], [KX + 170, 980], [KX + 170, KY - 10]],
    [[650, 790], [740, 860], [852, 880], [852, 990]],
  ];
  const tHand = s.at("handles"), tSend = s.at("sends"), tTask = s.at("task"), tPass = s.at("passes"), tChoose = s.at("choose");
  const inner = ph(24, 70, 372, 28) + ph(24, 112, 110, 34, 1) + ph(148, 112, 110, 34, 1);
  const flyer = (id, x, y, text, kind) => plate(id, x, y, 340, text, kind).replace(`class="plate"`, `class="plate" ${MB()} data-layout-allow-overlap`);
  let cubes = "";
  for (let k = 0; k < 3; k++) cubes += cube(`${p}-q${k}`);
  const html =
    appWinC(`${p}-win`, WX, WY, WW, WH, "Your app", inner, { attr: `${MB()} data-layout-allow-overlap` }) +
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 58, 680, ["HARNESS", "ROUTER"])}</div>` +
    plate(`${p}-a0`, CX, CY, 340, "Codex", "none") +
    plate(`${p}-a1`, KX, KY, 340, "Claude Code") +
    plate(`${p}-a2`, 682, 1000, 340, "Hermes", "none") +
    // static stand-ins for the two carried plates (blur copies must match them)
    flyer(`${p}-f0`, CX, CY, "Codex", "none") + flyer(`${p}-f1`, KX, KY, "Claude Code");
  const svg =
    dtube(`${p}-tin`, bpath(inT), { w: 10, fill: T.lime }) +
    br.map((b, i) => dtube(`${p}-t${i}`, bpath(b), { w: 10, fill: T.paper })).join("") +
    dtube(`${p}-h1`, bpath(br[1]), { w: 10, fill: T.lime }) +
    cubes +
    `<g id="${p}-hb">${adapter(`${p}-hub`, 505, 660, "HR")}</g>` +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[76, 732], [76, 768], [372, 768]])}</g>`;
  const x0 = L.r2(h.at - 0.3);   // exits start
  const anim = `
      const IN = ${js(samples(inT, 0, 1, 6))}, OUT = ${js(samples(br[1], 0.05, 0.92, 12))};
      // H3 in: the window lands where the problem's app window was heading
      ${L.carry(`#${p}-win`, hin, "in", P.side("solution", P.R.solutionWin, "in"), 0)}
      gsap.set(q("#${p}-f0, #${p}-f1"), { opacity: 0 });
      // the engine rises in under the app, its label lands beside it
      tl.fromTo("#${p}-hub", { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: E.out }, ${L.r2(hin.inDur)});
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
        flow("#${p}-q" + k, IN.concat(OUT), at, 1.1, 0);
        tl.to("#${p}-q" + k, { opacity: 0, duration: 0.1 }, at + 1.05);
      });
      draw(q("#${p}-h1 path"), ${L.r2(tPass - 0.05)}, 0.45);
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
