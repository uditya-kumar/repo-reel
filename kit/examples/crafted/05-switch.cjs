// switch: "Want to switch from Codex to Claude Code? Just change the agent ID in your API request."
// The routing is a physical rotary selector (L.selector), not two bare lanes. The request drops into the
// selector's cap; its pointer sits on the Codex port, whose lamp is lit and whose lane carries the traffic. On "change"
// the field retypes "claude-code" and the knob turns one detent (90 degrees, eased, no overshoot): the Codex lamp goes
// out, the Claude Code lamp lights and the lime lane moves with it. The object is the explanation.
// In/out handoffs are unchanged: H4/H4a/H4b in, H5 out.
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, dtube, cube, bpath, samples, klabel, lead, typed, hlTrim, mframe, morphCode, MB, js } = L;
  const P = require("./_plan.cjs"), hin = P.H.h4, ha = P.H.h4a, hb = P.H.h4b, h = P.H.h5;
  const p = s.p;
  const [WX, WY, WW, WH] = P.R.switchWin, [AX, AY] = P.R.swCodex, [BX, BY] = P.R.swClaude;
  const bot = WY + WH, ca = AX + 170, cb = BX + 170;
  const tX = s.at("Codex"), tCh = s.at("change"), tAg = s.at("agent"), tID = s.at("ID"), tAPI = s.at("API");

  // ---------- the selector (L.selector: crafted object, DESIGN.md 5.8) ----------
  const sel = L.selector(`${p}-sel`, 540, 884, 1.3);

  // ---------- lanes: the request into the cap, the two ports out to the agents ----------
  const top = sel.top, [n0, n1] = sel.ports;
  const inL = [[540, bot], [540, bot + 30], [540, top[1] - 30], [540, top[1]]];
  const outs = [
    [n0, [n0[0] - 70, n0[1] + 40], [ca, n0[1] + 90], [ca, AY]],
    [n1, [n1[0] + 70, n1[1] + 40], [cb, n1[1] + 90], [cb, BY]],
  ];
  let cubes = "";
  for (let k = 0; k < 5; k++) cubes += cube(`${p}-i${k}`) + cube(`${p}-o${k}`);

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
    sel.svg +
    [inL, ...outs].map((b, i) => dtube(`${p}-t${i}`, bpath(b), { w: 10, fill: T.paper })).join("") +
    [inL, ...outs].map((b, i) => dtube(`${p}-h${i}`, bpath(b), { w: 10, fill: T.lime })).join("") +
    cubes +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[1004, 524], [1004, 546], [834, 546]])}</g>`;
  const land = hin.inDur, x0 = L.r2(h.at - 0.35);
  const parts = sel.parts.join(", ");
  const anim = `
      const IN = ${js(samples(inL, 0, 1, 8))}, LN = ${js(outs.map((b) => samples(b, 0, 0.95, 12)))};${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      // H4a/H4b in: the carried plates land on the lanes' ends, then swap for the live ones
      gsap.set(q("#${p}-a0, #${p}-a1"), { opacity: 0 });
      ${L.carry(`#${p}-g0`, ha, "in", P.side("switch", P.R.swCodex, "in"), 0)}
      ${L.carry(`#${p}-g1`, hb, "in", P.side("switch", P.R.swClaude, "in"), 0)}
      tl.set(q("#${p}-g0, #${p}-g1"), { opacity: 0 }, ${land}); tl.set(q("#${p}-a0, #${p}-a1"), { opacity: 1 }, ${land});
      wipeIn(q("#${p}-win .win-ph, #${p}-k, #${p}-fd"), ${L.r2(land + 0.02)}, 0.45, 0.06);
      // the selector assembles bottom-up: base, housing, collar, knob, coupling (straight drops, no overshoot)
      // (each part's fade is short: a long one shows the parts beneath through it)
      tl.fromTo(q("${parts}"), { y: -34 }, { y: 0, duration: 0.36, ease: E.out, stagger: 0.045 }, ${L.r2(land - 0.04)});
      tl.fromTo(q("${parts}"), { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none", stagger: 0.045 }, ${L.r2(land - 0.04)});
      gsap.set("#${p}-sel-ptr", { svgOrigin: "0 0", rotation: 0 });
      draw(q("#${p}-t0 path"), ${L.r2(land + 0.12)}, 0.3);
      draw(q("#${p}-t1 path, #${p}-t2 path"), ${L.r2(land + 0.24)}, 0.45);
      drift(q("#${p}-lp, #${p}-lg"), ${land}, ${L.r2(h.at - land)}, -10);
      gsap.set(q("#${p}-h0 path, #${p}-h1 path, #${p}-h2 path"), { opacity: 0 });
      // a packet drops into the cap, then leaves by the port the pointer selects
      const pk = (k, lane, at) => {
        flow("#${p}-i" + k, IN, at, 0.3, 0); tl.to("#${p}-i" + k, { opacity: 0, duration: 0.06 }, at + 0.25);
        flow("#${p}-o" + k, LN[lane], at + 0.33, 0.75, 0); tl.to("#${p}-o" + k, { opacity: 0, duration: 0.1 }, Math.min(at + 1.0, ${x0}));
      };
      const lampOn = (s, at) => tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: E.out, immediateRender: false }, at);
      const lampOff = (s, at) => tl.fromTo(s, { opacity: 1 }, { opacity: 0, duration: 0.12, ease: E.in, immediateRender: false }, at);
      // "from Codex": the field types codex; the request line and the Codex port light, its lamp comes on
      unpop("#${p}-a1-tag", ${L.r2(tX - 0.12)});
      type("#${p}-v0", ${L.r2(tX)});
      draw(q("#${p}-h0 path"), ${L.r2(tX + 0.08)}, 0.25);
      lampOn("#${p}-sel-lp0", ${L.r2(tX + 0.3)}); draw(q("#${p}-h1 path"), ${L.r2(tX + 0.3)}, 0.4); pop("#${p}-a0-tag", ${L.r2(tX + 0.55)});
      pk(0, 0, ${L.r2(tX + 0.45)}); pk(1, 0, ${L.r2(tX + 0.85)});
      // "just change": backspace, retype, and the knob turns one detent; the lamp and the lane follow the pointer
      untype("#${p}-v0", ${L.r2(tCh - 0.04)});
      type("#${p}-v1", ${L.r2(tCh + 0.18)});
      tl.to("#${p}-sel-ptr", { rotation: -90, duration: 0.55, ease: E.inOut }, ${L.r2(tCh + 0.02)});
      lampOff("#${p}-sel-lp0", ${L.r2(tCh + 0.06)});
      unpop("#${p}-a0-tag", ${L.r2(tCh + 0.05)}); untrim(q("#${p}-h1 path"), ${L.r2(tCh + 0.05)}, 0.32);
      lampOn("#${p}-sel-lp1", ${L.r2(tCh + 0.52)}); draw(q("#${p}-h2 path"), ${L.r2(tCh + 0.52)}, 0.4);
      tl.fromTo("#${p}-a1-tag", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", immediateRender: false }, ${L.r2(tCh + 0.78)});
      [2, 3, 4].forEach((k, j) => pk(k, 1, ${L.r2(tCh + 0.62)} + j * 0.34));
      // "the agent ID": label lands, the trim box rings the field
      kin("#${p}-lb", ${L.r2(tAg - 0.04)}, ${L.r2(tID - tAg)}, 0.5); lead("${p}-ld", ${L.r2(tID + 0.1)});
      draw(q("#${p}-hl path"), ${L.r2(tID - 0.05)}, 0.55);
      untrim(q("#${p}-hl path"), ${L.r2(tAPI + 0.3)}, 0.3);
      // clear for the cut (the selector lifts away top-first), then the window shrinks into Session 1
      kout("#${p}-lb", ${x0}); unlead("${p}-ld", ${x0});
      untrim(q("#${p}-t0 path, #${p}-t1 path, #${p}-t2 path, #${p}-h0 path, #${p}-h2 path"), ${L.r2(x0 - 0.04)}, 0.28);
      lampOff("#${p}-sel-lp1", ${L.r2(x0 - 0.04)});
      // the parts lift top-first; the object fades as one so it never goes see-through
      tl.fromTo(q("${parts}"), { y: 0 }, { y: -24, duration: 0.26, ease: E.in, stagger: { each: 0.035, from: "end" }, immediateRender: false }, ${L.r2(x0 - 0.02)});
      tl.fromTo("#${p}-sel", { opacity: 1 }, { opacity: 0, duration: 0.24, ease: E.in, immediateRender: false }, ${L.r2(x0 + 0.08)});
      wipeOut(q("#${p}-a0, #${p}-a1"), ${L.r2(x0 + 0.06)}, 0.26, 0.05);
      wipeOut("#${p}-win-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.switch, cam: P.cam("switch"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
