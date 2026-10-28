// launch: "And it helps you brand, launch, and deploy your app as your own product."
// The reviews card's frame lands as your app's landing page, still on localhost (H7). On "brand" a new mark and name
// come in; on "launch" the page builds round the angle the Entrepreneur found (booking links for small teams, flat
// pricing) with its pricing card and the checked store listing. On "deploy" the preflight runs (tests, parity, sweep,
// listing: README) and the address rolls to your own domain; LIVE ON YOUR DOMAIN ticks on "own". That plate's frame
// becomes the CTA's first plate (H8). All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, s) => {
  const { typed, plate, mframe, morphCode } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs"), hin = P.H.h7, h = P.H.h8;
  const p = s.p, r2 = L.r2, at = s.at;
  const LW = P.R.launch, VW = LW[2], LV = P.R.live;
  const tBrand = at("brand"), tLaunch = at("launch"), tDeploy = at("deploy"), tYour = at("your"), tOwn = at("own");
  const mark = `<svg width="40" height="40" viewBox="0 0 40 40" style="position:absolute;left:0;top:0"><rect width="40" height="40" rx="10" fill="${C.paper}"/>` +
    `<path d="M11 28 L20 11 L29 28 Z" fill="${C.void}"/></svg>`;
  const lw = U.badgeW("Checked", 19, true);
  const inner =
    U.box(`${p}-mk`, 30, 66, 40, 40, "", mark) +
    `<div style="position:absolute;left:84px;top:70px;font-size:25px;font-weight:510;color:${C.paper};white-space:pre;${U.FEAT}letter-spacing:-0.012em">${typed(`${p}-nm`, "Your brand")}</div>` +
    U.box(`${p}-nv`, VW - 330, 64, 300, 44, "", U.tx("", 0, 10, "Pricing", { fs: 20 }) + U.tx("", 96, 10, "Log in", { fs: 20 }) + U.btn("", 178, 0, 122, 44, "Sign up", "white", 20)) +
    U.box(`${p}-h1`, 30, 142, 900, 70, "", U.tx("", 0, 0, "Booking links for small teams", { fs: 58, fw: 510, c: C.paper, ls: "-0.022em" })) +
    U.box(`${p}-h2`, 30, 222, 900, 34, "", U.tx("", 0, 0, "Flat pricing. SMS reminders. Time zones confirmed.", { fs: 23, c: C.fog })) +
    U.btn(`${p}-bt`, 30, 280, 200, 56, "Get started", "primary", 22) +
    U.box(`${p}-bl`, 252, 280, 220, 56, "", U.tx("", 0, 15, "See pricing  &rarr;", { fs: 21, fw: 510 })) +
    U.card(`${p}-pc`, 30, 372, 430, 196,
      U.tx("", 24, 22, "Flat pricing", { fs: 25, fw: 510, c: C.paper }) + U.tx("", 24, 62, "One price for the team,", { fs: 20, c: C.fog }) + U.tx("", 24, 90, "not per seat", { fs: 20, c: C.fog }) +
      U.badge("", 24, 134, "Set against the original's page", "iris")) +
    U.card(`${p}-sl`, 494, 372, 435, 196,
      U.tx("", 24, 22, "Store listing", { fs: 25, fw: 510, c: C.paper }) + U.tx("", 24, 62, "Store limits checked", { fs: 20, c: C.fog }) + U.tx("", 24, 90, "No trace of the original", { fs: 20, c: C.fog }) +
      U.badge(`${p}-slt`, 24, 134, "Checked", "green"));
  const title = `<span id="${p}-ta">localhost:3000</span><span id="${p}-tb" style="opacity:0;position:absolute;left:0;right:0">your-domain.com</span>`;
  const pf = ["Tests", "Parity", "Sweep", "Listing"];
  const html = U.win(`${p}-lw`, ...LW, title, inner) +
    U.win(`${p}-pf`, 58, 1006, 964, 66, null,
      U.tx("", 24, 19, "Preflight", { fs: 21, fw: 510, c: C.fog }) +
      pf.map((t, i) => U.box(`${p}-pf${i}`, 180 + i * 196, 0, 180, 66, "", U.status(`${p}-pt${i}`, 0, 19, "done", 28) + U.tx("", 40, 19, t, { fs: 21, fw: 510 }))).join("")) +
    plate(`${p}-lv`, ...LV.slice(0, 3), "Live on your domain", "check");
  void lw;
  const tX = r2(h.at - 0.3), pfs = pf.map((_, i) => `#${p}-pf${i}`).join(", ");
  L.hold(tOwn - 0.1, h.at - 0.18, 0.3, "launch: live tag");
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-lw`)}
      wipeIn("#${p}-lw-c", ${hin.inDur}, 0.36);
      // brand: a new mark and a name of its own
      pop("#${p}-mk", ${r2(tBrand - 0.08)}); type("#${p}-nm", ${r2(tBrand)}, 0.035); wipeIn("#${p}-nv", ${r2(tBrand + 0.1)}, 0.3);
      // launch: the page round the angle, the pricing and the store listing
      wipeIn(q("#${p}-h1, #${p}-h2, #${p}-bt, #${p}-bl"), ${r2(tLaunch - 0.12)}, 0.4, 0.07);
      wipeIn(q("#${p}-pc, #${p}-sl"), ${r2(tLaunch + 0.2)}, 0.4, 0.1); pop("#${p}-slt", ${r2(tLaunch + 0.5)});
      // deploy: the preflight, then your own domain
      wipeIn("#${p}-pf", ${r2(tDeploy - 0.22)}, 0.36);
      wipeIn(q("${pfs}"), ${r2(tDeploy - 0.1)}, 0.3, 0.06);
      ${pf.map((_, i) => `pop("#${p}-pt${i}", ${r2(tDeploy + 0.12 + i * 0.08)});`).join(" ")}
      tl.set("#${p}-ta", { opacity: 0 }, ${r2(tYour)}); tl.set("#${p}-tb", { opacity: 1 }, ${r2(tYour)});
      plateIn("#${p}-lv", ${r2(tYour - 0.06)}); pop("#${p}-lv-tag", ${r2(tOwn - 0.1)});
      // clear for the cut: the plate's frame is the last thing standing
      wipeOut("#${p}-lw", ${tX}, 0.24); wipeOut("#${p}-pf", ${tX}, 0.24);
      unpop("#${p}-lv-tag", ${r2(h.at - 0.18)});
      tl.fromTo("#${p}-lv .pw", { yPercent: 0 }, { yPercent: -110, duration: 0.16, ease: E.in, immediateRender: false }, ${r2(h.at - 0.18)});
      tl.set("#${p}-lv", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  const boxes = [{ id: "win", r: LW }, { id: "pf", r: [58, 1006, 964, 66], t: [tDeploy - 0.22, h.at] }, { id: "lv", r: LV, t: [tYour, h.at] }];
  return { lift: P.lift.launch, cam: P.cam("launch"), fade: false, html, svg: "", over: U.mframeL(`${p}-mf`) + mframe(`${p}-mf2`), anim, boxes };
};
