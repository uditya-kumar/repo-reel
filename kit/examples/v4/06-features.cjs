// features: "Each session gets its own workspace. You can track progress, work with files, and get results through the same API."
// Beat A: the API window lands as Session 1 (H5); Sessions 2 and 3 split down out of it, each gets an arrow into its
// own sealed workspace, checked on "own". Beat B: the sessions merge back into Session 1, whose outline grows into
// the session window (a morph within the scene): progress fills, files arrive, results check, the same API below.
// The window's outline then opens into the use-case screenshots (H6).
module.exports = (L, s) => {
  const { T, plate, appWinC, ph, barrow, workspace, stag, icoTile, klabel, lead, mframe, morphCode, MB } = L;
  const P = require("./_plan.cjs"), hin = P.H.h5, h = P.H.h6;
  const p = s.p;
  const [SX, SY, SW, SH] = P.R.session1, [WX, WY, WW, WH] = P.R.featuresWin;
  const rows = [0, 1, 2].map((i) => SY + i * 210);
  const tSes = s.at("session"), tGets = s.at("gets"), tOwn = s.at("own"), tYou = s.at("you"),
    tTrack = s.at("track"), tWork = s.at("work"), tFiles = s.at("files"), tGet = s.at("get"), tRes = s.at("results"),
    tSame = s.at("same"), tAPI = s.at("API");
  const fileRow = (id, top) => `<div id="${id}" class="row" style="left:24px;top:${top}px;width:592px">${icoTile("file")}${ph(88, 20, 320, 28, 1)}</div>`;
  const sess = (i) => plate(`${p}-s${i}`, SX, SY, SW, `Session ${i + 1}`, "none")
    .replace(`class="plate"`, `class="plate" ${i ? MB() : ""} data-layout-allow-overlap`).replace(/class="(pt|pw)"/g, `class="$1" data-layout-allow-overlap`);
  const html =
    // Session 1 last, so it covers the two that split out of it
    sess(2) + sess(1) + sess(0) +
    `<div id="${p}-la" class="plane">${klabel(`${p}-lw`, 540, 510, ["OWN WORKSPACE"], { a: "middle" })}</div>` +
    appWinC(`${p}-win`, WX, WY, WW, WH, "Session",
      ph(24, 70, 592, 28) +
      `<div id="${p}-pb" class="pbar" style="left:24px;top:118px;width:592px;height:34px"><div id="${p}-fill" class="pfill"></div></div>` +
      fileRow(`${p}-f0`, 176) + fileRow(`${p}-f1`, 256) +
      plate(`${p}-res`, 24, 336, 592, "Results")) +
    plate(`${p}-api`, 290, WY + 570, 500, "Same API") +
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lf`, 1022, WY + 160, ["FILES"], { a: "end" })}</div>` +
    // the in-scene morph: Session 1's outline grows into the session window
    mframe(`${p}-mi`);
  const svg =
    rows.map((y, i) => barrow(`${p}-ar${i}`, 525, y + 34, 130, 0, T.dark) + `<g id="${p}-wg${i}">${workspace(`${p}-w${i}`, 775, y + 16, 0.6)}</g>` + stag(`${p}-k${i}`, 915, y + 34)).join("") +
    barrow(`${p}-arB`, 540, WY + 450, 100, 90, T.dark) +
    `<g id="${p}-lg">${lead(`${p}-ld`, [[1004, WY + 178], [1004, WY + 214], [876, WY + 214]])}</g>`;
  const land = hin.inDur;
  const tSplit = L.r2(Math.max(land + 0.12, tSes + 0.12)), tMerge = L.r2(tYou - 0.26), tGrow = L.r2(tMerge + 0.4), gDur = 0.45;
  const tWin = L.r2(tGrow + gDur), x0 = L.r2(h.at - 0.38);
  const I = [0, 1, 2];
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-s0`)}
      tl.fromTo("#${p}-s0 .pw", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: E.out }, ${land});
      // "each session": Sessions 2 and 3 split down out of Session 1
      gsap.set(q("#${p}-s1, #${p}-s2"), { opacity: 0 });
      tl.set(q("#${p}-s1, #${p}-s2"), { opacity: 1 }, ${tSplit});
      tl.fromTo("#${p}-s1", { y: 0 }, { y: 210, duration: 0.55, ease: E.inOut }, ${tSplit});
      tl.fromTo("#${p}-s2", { y: 0 }, { y: 420, duration: 0.62, ease: E.inOut }, ${L.r2(tSplit + 0.05)});
      // "gets its own workspace": an arrow into each sealed box, each checked on "own"
      ${I.map((i) => `wipe("#${p}-ar${i}", ${L.r2(tGets - 0.05 + i * 0.07)}, 0.32);`).join(" ")}
      ${I.map((i) => `tl.fromTo("#${p}-wg${i}", { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E.out }, ${L.r2(tGets + 0.1 + i * 0.08)});`).join(" ")}
      ${I.map((i) => `pop("#${p}-k${i}", ${L.r2(tOwn + i * 0.07)});`).join(" ")}
      kin("#${p}-lw", ${L.r2(tOwn - 0.04)}, 0.16, 0.5);
      // "you can": everything folds back into Session 1
      kout("#${p}-lw", ${L.r2(tMerge - 0.1)});
      ${I.map((i) => `unpop("#${p}-k${i}", ${L.r2(tMerge - 0.1 + i * 0.03)});`).join(" ")}
      away(q("#${p}-wg0, #${p}-wg1, #${p}-wg2"), ${L.r2(tMerge - 0.06)}, -20, 0.26, 0.04);
      ${I.map((i) => `unwipe("#${p}-ar${i}", ${L.r2(tMerge + i * 0.04)}, 0.26);`).join(" ")}
      tl.fromTo("#${p}-s2", { y: 420 }, { y: 0, duration: 0.42, ease: E.inOut, immediateRender: false }, ${tMerge});
      tl.fromTo("#${p}-s1", { y: 210 }, { y: 0, duration: 0.38, ease: E.inOut, immediateRender: false }, ${L.r2(tMerge + 0.04)});
      tl.set(q("#${p}-s1, #${p}-s2"), { opacity: 0 }, ${L.r2(tMerge + 0.42)});
      // Session 1's text drops out, its outline grows into the session window
      tl.fromTo("#${p}-s0 .pw", { yPercent: 0 }, { yPercent: -110, duration: 0.24, ease: E.in, immediateRender: false }, ${L.r2(tGrow - 0.24)});
      mfSet("${p}-mi", ${L.js([SX, SY, SW, SH])}); gsap.set("#${p}-mi", { opacity: 0 });
      tl.set("#${p}-s0", { opacity: 0 }, ${tGrow}); tl.set("#${p}-mi", { opacity: 1 }, ${tGrow});
      morph("${p}-mi", ${L.js([SX, SY, SW, SH])}, ${L.js(P.R.featuresWin)}, ${tGrow}, ${gDur}, E.inOut);
      gsap.set("#${p}-win", { opacity: 0 });
      tl.set("#${p}-mi", { opacity: 0 }, ${tWin}); tl.set("#${p}-win", { opacity: 1 }, ${tWin});
      wipeIn(q("#${p}-win .win-ph:not(.lt), #${p}-pb"), ${L.r2(tWin + 0.02)}, 0.42, 0.06);
      // "track progress", "work with files", "get results"
      tl.fromTo("#${p}-fill", { scaleX: 0 }, { scaleX: 0.6, duration: 0.7, ease: E.outQ }, ${L.r2(Math.max(tTrack, tWin + 0.12))});
      wipeIn("#${p}-f0", ${L.r2(tWork - 0.1)}, 0.42); wipeIn("#${p}-f1", ${L.r2(tFiles - 0.1)}, 0.42);
      kin("#${p}-lf", ${L.r2(tFiles - 0.04)}); lead("${p}-ld", ${L.r2(tFiles + 0.06)});
      drift(q("#${p}-lp, #${p}-lg"), ${tWin}, ${L.r2(h.at - tWin)}, -8);
      plateIn("#${p}-res", ${L.r2(tGet - 0.15)});
      tl.fromTo("#${p}-fill", { scaleX: 0.6 }, { scaleX: 1, duration: 0.4, ease: E.outQ, immediateRender: false }, ${L.r2(tRes - 0.2)});
      pop("#${p}-res-tag", ${L.r2(tRes + 0.1)});
      // "through the same API"
      wipe("#${p}-arB", ${L.r2(tSame - 0.15)}, 0.3);
      plateIn("#${p}-api", ${L.r2(tSame - 0.05)}); pop("#${p}-api-tag", ${tAPI});
      // clear for the cut
      kout("#${p}-lf", ${x0}); unlead("${p}-ld", ${x0});
      unwipe("#${p}-arB", ${L.r2(x0 + 0.03)}, 0.24); wipeOut("#${p}-api", ${L.r2(x0 + 0.06)}, 0.26);
      wipeOut("#${p}-win-c", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.features, cam: P.cam("features"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
