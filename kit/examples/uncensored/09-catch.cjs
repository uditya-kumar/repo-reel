// Worked example of the v5 implode-to-a-seed cut (UncensoredAi reel, scenes 08 -> 09). Reference only: it reads that
// reel's _plan.cjs (P.SEED9 = scene 9's silhouette start in screen coords: L.make(...MODEL.catch).P(MW + 14, MW + 14, 0))
// and its project objects (_x.cjs, _drawer.cjs, modelStack). The kit pieces it uses: implode / seed (08), seedIn,
// spark, sdraw (09).
// catch: "But here's the catch. Uncensored doesn't mean smarter, more accurate, or completely unrestricted."
// v5: scene 8 imploded into a lime seed at the front-bottom corner of this model's silhouette. The seed pings and two
// sparks draw the silhouette away from it (up the right side and up the left, meeting at the back corner); the model
// assembles inside it on "catch". UNCENSORED rises into its plate on its word. Three rows build on their words, each
// with a dark X: SMARTER, MORE ACCURATE, UNRESTRICTED. The rows and
// plate clear and the model carries into scene 10 (M9: same place, the camera eases back to rest under it).
module.exports = (L, s) => {
  const { T, plate, icoTile, spark, sdraw, seed, seedIn } = L;
  const X = require("./_x.cjs")(L), P = X.P, ho = P.H.m9;
  const p = s.p, at = s.at, r2 = L.r2;
  const [OX, OY] = P.MODEL.catch, mp = `${p}-mp`;
  const [PX, PY, PW] = P.R.catchPlate;
  const tCatch = at("catch"), tUnc = at("uncensored"), tSm = at("smarter"), tMore = at("more"), tAcc = at("accurate"), tComp = at("completely"), tUnr = at("unrestricted");
  const live = X.plane(mp, OX, OY, { layers: P.TOP5() });
  const flyO = X.out(p, ho, mp, { layers: P.TOP5() });
  // the silhouette in two halves from the seed (front-bottom corner) to the back-top corner
  const m = L.make(OX, OY), a = -14, b = L.MW + 14, z1 = L.stackTop(5), f = (q) => q.map(L.r1).join(" ");
  const hl = [`M${f(m.P(b, b, 0))} L${f(m.P(b, a, 0))} L${f(m.P(b, a, z1))} L${f(m.P(a, a, z1))}`,
    `M${f(m.P(b, b, 0))} L${f(m.P(a, b, 0))} L${f(m.P(a, b, z1))} L${f(m.P(a, a, z1))}`];
  if (f(m.P(b, b, 0)) !== P.SEED9.join(" ")) throw new Error("catch: silhouette start drifted from the plan's seed");
  const svg = hl.map((d, k) => `<path id="${p}-h${k}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${d}" fill="none" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/>`).join("") +
    spark(`${p}-s0`) + spark(`${p}-s1`);
  const rows = [["brain", "SMARTER", tSm - 0.14, tSm + 0.1], ["target", "MORE ACCURATE", tMore - 0.06, tAcc + 0.1], ["unlock", "UNRESTRICTED", tComp + 0.05, tUnr + 0.12]];
  const html = live +
    plate(`${p}-pl`, PX, PY, PW, "UNCENSORED", "none") +
    rows.map(([ico, t], k) => `<div id="${p}-ri${k}" style="position:absolute;left:190px;top:${950 + k * 90}px;width:68px;height:68px">${icoTile(ico)}</div>` +
      plate(`${p}-rp${k}`, 274, 950 + k * 90, 616, t, "x")).join("") +
    flyO.html;
  const tGo = r2(ho.at - 0.3), tBuild = r2(Math.min(tCatch - 0.15, 0.55));
  X.hold(rows[2][2], tGo, 0.8, "catch: last row");
  const anim = `${seedIn(p, P.SEED9)}
      // the seed's sparks draw the silhouette; the model assembles inside it on "catch", the outline gives way
      ${sdraw(`${p}-s0`, `#${p}-h0`, hl[0], 0.08, 0.6, { ping: false })}
      ${sdraw(`${p}-s1`, `#${p}-h1`, hl[1], 0.08, 0.6)}
      ${X.hideParts(mp, 5)}
      ${X.assemble(mp, tBuild)}
      tl.to(q("#${p}-h0, #${p}-h1"), { opacity: 0, duration: 0.25, ease: E.in }, ${r2(tBuild + 0.9)});
      plateIn("#${p}-pl", ${r2(Math.max(tUnc - 0.12, tBuild + 0.6))});
      // each row on its word, its X on the word that rejects it
      ${rows.map(([, , tin, ttag], k) => `pop("#${p}-ri${k}", ${r2(tin - 0.04)}); plateIn("#${p}-rp${k}", ${r2(tin)}); pop("#${p}-rp${k}-tag", ${r2(Math.max(ttag, tin + 0.35))});`).join("\n      ")}
      // clear for the carry
      wipeOut(q("${rows.map((_, k) => `#${p}-rp${k}`).join(", ")}, #${p}-pl"), ${r2(tGo)}, 0.24, 0.04);
      unpop(q("${rows.map((_, k) => `#${p}-ri${k}`).join(", ")}"), ${r2(tGo)});
      ${flyO.anim}`;
  return { lift: P.lift.catch, cam: P.cam("catch"), fade: false, svg, html, over: seed(p), anim };
};
