// hook: "This GitHub repo gives Claude 11 different skills to recreate almost any app — and even improve it."
// All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs). Hook: on "This GitHub repo" the repo's real
// GitHub card fills the frame with its name blurred (6k stars, "Eleven free Claude skills that clone any app").
// On "gives Claude" the card's frame becomes Claude Code; "/replica-" types
// and on "11" the autocomplete drops all eleven real commands with their one-line jobs (README table), the first one
// selected. B: on "recreate" the list clears and the card itself
// morphs into the original booking app. On "app" your version rebuilds beside it part by part (each part's iris
// wireframe trims on, then its contents wipe in: new, rebuild), and on "improve" it gains an SMS reminders row the
// original doesn't have (IMPROVED +). Your version's card leaves as H1.
module.exports = (L, s) => {
  const { T, klabel, plate, typed, barrow, morphCode } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs"), h = P.H.h1;
  const p = s.p, r2 = L.r2, at = s.at;
  const TM = P.R.hookTerm, OR = P.R.hookOrig, CL = P.R.hookClone, IW = TM[2];
  // the GitHub card (opengraph image, repo name blurred: assets/shots/repo-card-blur.png, 1200 x 600 at 959 wide)
  const CARD = [58, 560, 964, 485];
  const tGives = at("gives");
  const tC = at("Claude"), t11 = at("11"), tSk = at("skills"), tRe = at("recreate"), tAny = at("any"), tApp = at("app"), tImp = at("improve");
  // A: the prompt and the autocomplete (the README's eleven, in order)
  const cmds = [
    ["recon", "Reverse-engineers any app"], ["architect", "Plans the stack and the schema"], ["design", "Rebuilds the design system"],
    ["build", "Rebuilds it screen by screen"], ["backend", "Auth, database, payments"], ["test", "Tests every flow for bugs"],
    ["diff", "Scores it against the original"], ["entrepreneur", "Reads what users hate"], ["brand", "Names and rebrands it"],
    ["launch", "Landing page and listing"], ["deploy", "Ships it on your domain"],
  ];
  const RY = 144, RH = 39.5;
  const rows = cmds.map(([c, d], i) =>
    U.box(`${p}-r${i}`, 22, RY + i * RH, IW - 44, RH, "",
      U.tx("", 22, 7, `/replica-${c}`, { fs: 21, mono: true, c: i ? C.mist : C.paper }) + U.tx("", 340, 7, d, { fs: 20, c: C.fog }))).join("");
  const termInner =
    U.ccInput(`${p}-in`, 22, 64, IW - 44, typed(`${p}-ty`, "/replica-")) + U.claudeMark(`${p}-cm`, IW - 22 - 48, 78, 32) +
    U.box(`${p}-sel`, 22, RY, IW - 44, RH, `background:${U.rgba("#ffffff", 0.05)};border-radius:${U.R.btn}px;`) +
    U.box(`${p}-sm`, 22, RY + 8, 3, RH - 16, `background:${C.lime};border-radius:2px;`) + rows;
  // B: the original and your version (same app, one more row)
  const bo = U.booking(`${p}-o`, OR[2], 48), bc = U.booking(`${p}-c`, CL[2], 48, { extras: "sms" });
  const html =
    // the session's card is a growing svg chrome under a bare layer, so it can open and then become the app
    L.shotBox(`${p}-gh`, ...CARD, "assets/shots/repo-card-blur.png") +
    U.chrome(`${p}-ch`, CARD) +
    U.win(`${p}-t`, ...TM, "Claude Code", termInner, { bare: true }) +
    U.win(`${p}-or`, ...OR, "Book a meeting", bo.html) +
    U.win(`${p}-cl`, ...CL, "Book a meeting", bc.html + U.wireSvg(`${p}-w`, CL[2], CL[3], bc.rects)) +
    klabel(`${p}-lo`, OR[0] + OR[2] / 2, 452, ["ORIGINAL"], { a: "middle" }) +
    klabel(`${p}-lc`, CL[0] + CL[2] / 2, 452, ["YOUR VERSION"], { a: "middle" }) +
    plate(`${p}-pi`, CL[0], 1158, CL[2], "Improved", "plus");
  const svg = barrow(`${p}-ar`, 512, OR[1] + 300, 58, 0, T.lime) +
    `<g id="${p}-ot">${U.trimPath("", U.rrD(CL[0] + 0.75, CL[1] + 0.75, CL[2] - 1.5, CL[3] - 1.5, U.R.card), C.mist, 1.5)}</g>`;
  const tMorph = r2(tRe + 0.12), mDur = 0.5, tOrig = r2(tMorph + mDur), tClone = r2(tApp - 0.04), tX = r2(h.at - 0.24), tG = r2(tGives + 0.06), gDur = 0.5;
  L.hold(tImp, tX, 0.3, "hook: improved plate");
  const anim = `
      // hook: the repo's GitHub card, its name blurred
      wipeIn("#${p}-gh", 0.04, 0.45);
      ${L.zoomIn(`#${p}-gh-i`, 0.08, 1.04, 480, 240, 1.0)}
      // "gives Claude": the card's frame becomes the Claude Code session, "/replica-" types
      wipeOut("#${p}-gh-c", ${r2(tG - 0.16)}, 0.16);
      gsap.set(q("#${p}-ch, #${p}-t"), { opacity: 0 });
      tl.set("#${p}-gh", { opacity: 0 }, ${tG}); tl.set(q("#${p}-ch, #${p}-t"), { opacity: 1 }, ${tG});
      ${U.grow(`${p}-ch`, CARD, TM, tG, gDur)}
      wipeIn("#${p}-t-c", ${r2(tG + gDur - 0.08)}, 0.36);
      type("#${p}-ty", ${r2(tG + gDur)}, 0.035);
      pop("#${p}-cm", ${r2(tG + gDur + 0.04)});
      // "11": the eleven drop in
      wipeIn(q("${cmds.map((_, i) => `#${p}-r${i}`).join(", ")}"), ${r2(Math.max(t11 - 0.06, tG + gDur + 0.1))}, 0.36, 0.055);
      pop("#${p}-sel", ${r2(tSk)}); wipe("#${p}-sm", ${r2(tSk + 0.04)}, 0.2);
      // B: the list clears and the card becomes the original app
      wipeOut(q("${cmds.map((_, i) => `#${p}-r${i}`).join(", ")}, #${p}-sel, #${p}-sm, #${p}-in, #${p}-cm"), ${r2(tRe - 0.2)}, 0.22, 0.012);
      wipeOut("#${p}-t-c", ${r2(tMorph - 0.14)}, 0.14);
      ${U.grow(`${p}-ch`, TM, OR, tMorph, mDur)}
      gsap.set("#${p}-or", { opacity: 0 });
      tl.set("#${p}-ch", { opacity: 0 }, ${tOrig}); tl.set("#${p}-or", { opacity: 1 }, ${tOrig});
      wipeIn("#${p}-or-c", ${tOrig}, 0.45);
      kin("#${p}-lo", ${r2(Math.max(tOrig, tAny - 0.1))}, 0.05, 0.5);
      // your version: its card outline trims on, then each part comes in as its wireframe and fills
      wipe("#${p}-ar", ${r2(tApp - 0.1)}, 0.36);
      draw(q("#${p}-ot path"), ${tClone}, 0.36);
      gsap.set("#${p}-cl", { opacity: 0 }); tl.set("#${p}-cl", { opacity: 1 }, ${r2(tClone + 0.36)}); tl.set("#${p}-ot", { opacity: 0 }, ${r2(tClone + 0.37)});
      wipeIn("#${p}-cl .tbar", ${r2(tClone + 0.36)}, 0.3);
      kin("#${p}-lc", ${r2(tClone + 0.1)}, 0.05, 0.5);
      ${U.rebuild(`${p}-w`, bc.parts.slice(0, 5), 5, r2(tClone + 0.4), 0.07)}
      // "improve": a row the original doesn't have
      wipeIn("#${bc.parts[5]}", ${r2(tImp - 0.08)}, 0.4);
      draw(q("#${p}-w-5 path"), ${r2(tImp - 0.32)}, 0.28); untrim(q("#${p}-w-5 path"), ${r2(tImp + 0.05)}, 0.2);
      plateIn("#${p}-pi", ${r2(tImp - 0.1)}); pop("#${p}-pi-tag", ${r2(tImp + 0.08)});
      // clear for the cut: everything but your version's card
      kout("#${p}-lo", ${tX}); kout("#${p}-lc", ${tX}); unwipe("#${p}-ar", ${tX}, 0.22);
      wipeOut("#${p}-pi", ${tX}, 0.22); wipeOut("#${p}-or", ${r2(tX + 0.02)}, 0.24);
      wipeOut("#${p}-cl-c", ${r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-cl", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  const boxes = [
    { id: "card", r: CARD, t: [0, tG] }, { id: "term", r: TM, t: [tG + gDur, tMorph] },
    { id: "orig", r: OR, t: [tMorph, h.at] }, { id: "clone", r: CL, t: [tClone, h.at] },
    { id: "plate", r: [CL[0], 1158, CL[2], 68], t: [tImp - 0.1, h.at] },
    { id: "labO", r: [OR[0] + 120, 422, 200, 36], t: [tOrig, h.at] }, { id: "labC", r: [CL[0] + 100, 422, 240, 36], t: [tClone, h.at] },
  ];
  return { lift: P.lift.hook, cam: P.cam("hook"), fade: false, svg, html, over: U.mframeL(`${p}-mf`), anim, boxes };
};
