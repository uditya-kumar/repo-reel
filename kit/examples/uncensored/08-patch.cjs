// Worked example of the v5 implode-to-a-seed cut (UncensoredAi reel, scenes 08 -> 09). Reference only: it reads that
// reel's _plan.cjs (P.SEED9 = scene 9's silhouette start in screen coords: L.make(...MODEL.catch).P(MW + 14, MW + 14, 0))
// and its project objects (_x.cjs, _drawer.cjs, modelStack). The kit pieces it uses: implode / seed (08), seedIn,
// spark, sdraw (09).
// patch: "By modifying these patterns, developers can reduce refusals without fully retraining the model."
// Hold cut from scene 7: the same plate, bubble, label and pulled-out drawer, unmoved. The camera pushes in on
// "modifying" while the lime jumper is lifted off the board: one specific part removed, the rest untouched. On
// "reduce" the refusal's X goes and the bubble's rows change to an answer. On "without" a FULL RETRAINING plate
// lands with an X on "retraining". The drawer slides home, then the whole
// frame implodes into one lime seed (P.SEED9) that scene 9 grows its model from ("But here's the catch").
module.exports = (L, s) => {
  const { plate, typed, klabel, seed, implode } = L;
  const X = require("./_x.cjs")(L), P = X.P, D = require("./_drawer.cjs")(L);
  const p = s.p, at = s.at, r2 = L.r2;
  const [OX, OY] = P.MODEL.patch, mp = `${p}-mp`, m = `#${mp}-m`, x2 = `${m}-L2`;
  const [PX, PY, PW] = P.R.tunePlate, [FX, FY, FW] = P.R.retrain;
  const tMod = at("modifying"), tPat = at("patterns"), tReduce = at("reduce"), tRefs = at("refusals"),
    tWithout = at("without"), tRetr = at("retraining"), tModel = at("model");
  const live = X.plane(mp, OX, OY, D.spec(true));
  const html = live +
    plate(`${p}-pa`, PX, PY, PW, typed(`${p}-pt`, "ABLITERATION"), "none") +
    D.bubble(`${p}-rb`, true, [[120, 0], [70, 1]]) +
    `<div id="${p}-rb2" data-layout-allow-overlap style="position:absolute;left:800px;top:478px;width:156px;height:72px">` +
    `<div id="${p}-rb2-r0" class="win-ph" data-layout-allow-overlap style="left:16.5px;top:18.5px;width:124px;height:14px"></div>` +
    `<div id="${p}-rb2-r1" class="win-ph lt" data-layout-allow-overlap style="left:16.5px;top:42.5px;width:100px;height:14px"></div></div>` +
    klabel(`${p}-kr`, 878, 600, ["REFUSAL"], { a: "middle" }) +
    plate(`${p}-pf`, FX, FY, FW, "FULL RETRAINING", "x");
  const tImp = r2(s.dur - 0.42), tSlide = r2(Math.max(tRetr + 0.45, tImp - 0.8));
  X.hold(tRetr + 0.1, tImp, 0.5, "patch: retraining X");
  const anim = `
      // the drawer is out, as scene 7 left it
      gsap.set("${x2}-d", { x: ${D.sx}, y: ${D.sy} });
      // "modifying these patterns": the jumper is lifted straight off the board, gone by "patterns"
      tl.fromTo("${x2}-pat", { y: 0 }, { y: -46, duration: 0.55, ease: E.in }, ${r2(tMod + 0.12)});
      tl.fromTo("${x2}-pat", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: E.in, immediateRender: false }, ${r2(Math.min(tMod + 0.42, tPat - 0.2))});
      // "reduce refusals": the refusal turns into an answer
      unpop("#${p}-rb-tag", ${r2(tReduce)});
      wipeOut(q("#${p}-rb-r0, #${p}-rb-r1"), ${r2(tReduce + 0.05)}, 0.2, 0.05);
      wipeIn(q("#${p}-rb2-r0, #${p}-rb2-r1"), ${r2(tReduce + 0.3)}, 0.35, 0.08);
      kout("#${p}-kr", ${r2(tRefs + 0.1)});
      // "without fully retraining"
      plateIn("#${p}-pf", ${r2(tWithout - 0.12)}); pop("#${p}-pf-tag", ${r2(tRetr + 0.1)});
      // the drawer slides home (as scene 7 left it, it starts out)
      ${D.slide(`${x2}-d`, 1, 0, tSlide, 0.55)}
      // the implode: the whole frame collapses into the seed scene 9 grows from
      ${implode(p, tImp, P.SEED9, P.lift.patch, P.camEnd.patch)}`;
  return { lift: P.lift.patch, cam: P.cam("patch", { t0: L.r2(tMod - 0.15) }), fade: false, svg: "", html, over: seed(p), anim };
};
