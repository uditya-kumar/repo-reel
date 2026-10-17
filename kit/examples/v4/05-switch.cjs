// switch: "Want to switch from Codex to Claude Code? Just change the agent ID in your API request."
// The solution's window outline lands as the API request window (H4) while Codex and Claude Code arrive carried from
// the branches (H4a, H4b). The real field (metadata.harness_id) types "codex" and the traffic runs down Codex's lane;
// on "change" the value backspaces and retypes "claude-code", the lime lane retracts and redraws to Claude Code, and a
// trim box rings the field on "ID". The window then shrinks into Session 1 of the next line (H5).
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, dtube, cube, bpath, samples, klabel, lead, typed, hlTrim, mframe, morphCode, MB, js } = L;
  const P = require("./_plan.cjs"), hin = P.H.h4, ha = P.H.h4a, hb = P.H.h4b, h = P.H.h5;
  const p = s.p;
  const [WX, WY, WW, WH] = P.R.switchWin, [AX, AY] = P.R.swCodex, [BX, BY] = P.R.swClaude;
  const bot = WY + WH, ca = AX + 170, cb = BX + 170;
  const lanes = [
    [[500, bot], [500, bot + 150], [ca, bot + 190], [ca, AY]],
    [[580, bot], [580, bot + 150], [cb, bot + 190], [cb, BY]],
  ];
  const tX = s.at("Codex"), tC = s.at("Claude"), tCh = s.at("change"), tAg = s.at("agent"), tID = s.at("ID"), tAPI = s.at("API");
  let cubes = "";
  for (let k = 0; k < 2; k++) cubes += cube(`${p}-l${k}`);
  for (let k = 0; k < 3; k++) cubes += cube(`${p}-r${k}`);
  // the value field: dark well, ink text; both values sit centred in it and are typed in / out
  const cell = (id, text) => `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${typed(id, text)}</div>`;
  const field =
    `<div id="${p}-fd" class="rate" data-layout-allow-overlap style="left:290px;top:116px;width:286px;height:60px;font-weight:500;` +
    `background:${T.g700};color:${T.ink};border:2.5px solid ${T.ink};box-sizing:border-box">${cell(`${p}-v0`, "codex")}${cell(`${p}-v1`, "claude-code")}</div>`;
  const flyer = (id, x, y, text, kind) => plate(id, x, y, 340, text, kind).replace(`class="plate"`, `class="plate" ${MB()} data-layout-allow-overlap`);
  const html =
    appWinC(`${p}-win`, WX, WY, WW, WH, "API request",
      ph(24, 70, 552, 28) +
      `<div id="${p}-k" class="rate" style="left:24px;top:127px;font-weight:500">"harness_id":</div>` +
      field + ph(24, 196, 300, 28, 1) + hlTrim(`${p}-hl`, 290, 116, 286, 60)) +
    plate(`${p}-a0`, AX, AY, 340, "Codex") +
    plate(`${p}-a1`, BX, BY, 340, "Claude Code") +
    flyer(`${p}-g0`, AX, AY, "Codex", "none") + flyer(`${p}-g1`, BX, BY, "Claude Code") +
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 1022, 470, ["AGENT", "ID"], { a: "end" })}</div>`;
  const svg =
    lanes.map((b, i) => dtube(`${p}-t${i}`, bpath(b), { w: 10, fill: T.paper })).join("") +
    lanes.map((b, i) => dtube(`${p}-h${i}`, bpath(b), { w: 10, fill: T.lime })).join("") +
    cubes +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[1004, 524], [1004, 546], [834, 546]])}</g>`;
  const land = hin.inDur, x0 = L.r2(h.at - 0.35);
  const anim = `
      const LN = ${js(lanes.map((b) => samples(b, 0.04, 0.95, 12)))};${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      // H4a/H4b in: the carried plates land on the lanes' ends, then swap for the live ones
      gsap.set(q("#${p}-a0, #${p}-a1"), { opacity: 0 });
      ${L.carry(`#${p}-g0`, ha, "in", P.side("switch", P.R.swCodex, "in"), 0)}
      ${L.carry(`#${p}-g1`, hb, "in", P.side("switch", P.R.swClaude, "in"), 0)}
      tl.set(q("#${p}-g0, #${p}-g1"), { opacity: 0 }, ${land}); tl.set(q("#${p}-a0, #${p}-a1"), { opacity: 1 }, ${land});
      wipeIn(q("#${p}-win .win-ph, #${p}-k, #${p}-fd"), ${L.r2(land + 0.02)}, 0.45, 0.06);
      draw(q("#${p}-t0 path, #${p}-t1 path"), ${L.r2(land + 0.06)}, 0.5);
      drift(q("#${p}-lp, #${p}-lg"), ${land}, ${L.r2(h.at - land)}, -10);
      gsap.set(q("#${p}-h0 path, #${p}-h1 path"), { opacity: 0 });
      // "from Codex": the field types codex, the check moves to Codex and its lane lights
      unpop("#${p}-a1-tag", ${L.r2(tX - 0.12)});
      type("#${p}-v0", ${L.r2(tX)});
      draw(q("#${p}-h0 path"), ${L.r2(tX + 0.1)}, 0.4); pop("#${p}-a0-tag", ${L.r2(tX + 0.3)});
      [0, 1].forEach((k) => { const at = ${L.r2(tX + 0.38)} + k * 0.45; flow("#${p}-l" + k, LN[0], at, 0.9, 0); tl.to("#${p}-l" + k, { opacity: 0, duration: 0.1 }, at + 0.86); });
      // "just change": backspace, retype; the lime lane retracts and redraws to Claude Code
      untype("#${p}-v0", ${L.r2(tCh - 0.04)});
      type("#${p}-v1", ${L.r2(tCh + 0.18)});
      unpop("#${p}-a0-tag", ${L.r2(tCh + 0.05)}); untrim(q("#${p}-h0 path"), ${L.r2(tCh + 0.05)}, 0.32);
      draw(q("#${p}-h1 path"), ${L.r2(tCh + 0.5)}, 0.4);
      tl.fromTo("#${p}-a1-tag", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", immediateRender: false }, ${L.r2(tCh + 0.78)});
      [0, 1, 2].forEach((k) => { const at = ${L.r2(tCh + 0.8)} + k * 0.3; flow("#${p}-r" + k, LN[1], at, 0.9, Math.ceil((${x0} - at) / 0.9) - 1); tl.to("#${p}-r" + k, { opacity: 0, duration: 0.12 }, ${x0}); });
      // "the agent ID": label lands, the trim box rings the field
      kin("#${p}-lb", ${L.r2(tAg - 0.04)}, ${L.r2(tID - tAg)}, 0.5); lead("${p}-ld", ${L.r2(tID + 0.1)});
      draw(q("#${p}-hl path"), ${L.r2(tID - 0.05)}, 0.55);
      untrim(q("#${p}-hl path"), ${L.r2(tAPI + 0.3)}, 0.3);
      // clear for the cut, then the window shrinks into Session 1
      kout("#${p}-lb", ${x0}); unlead("${p}-ld", ${x0});
      untrim(q("#${p}-t0 path, #${p}-t1 path, #${p}-h1 path"), ${L.r2(x0 + 0.02)}, 0.3);
      wipeOut(q("#${p}-a0, #${p}-a1"), ${L.r2(x0 + 0.06)}, 0.26, 0.05);
      wipeOut("#${p}-win-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.switch, cam: P.cam("switch"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
