// reviews: "But here's the interesting part. It also analyzes real user reviews to discover what people hate about the
// original app — so you can build something better."
// v5 implode in: test imploded into a lime seed at the top edge of this card. The seed pings and two sparks draw the
// card's rounded outline away from it, both ways round, meeting at the bottom; replica-entrepreneur opens inside it on
// "interesting part", short at first. 140 real reviews count up and the four sources pop on "real user reviews"
// (README). On "what people hate" the card grows open and the top three complaints rise in, ranked, each marked as a
// complaint; every quote linked. On "so you can build something better" the section becomes the fix plan: each
// complaint rolls into its fix and its badge turns to Fix. The card empties to its frame (H7).
// All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, s) => {
  const { spark, sdraw, seed, seedIn, morphCode } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs"), h = P.H.h7;
  const p = s.p, r2 = L.r2, at = s.at;
  const RW = P.R.reviews, [X, Y, W, Hh] = RW, VW = W, SD = P.SEED7;
  const tInt = at("interesting"), tAn = at("analyzes"), tReal = at("real"), tRev = at("reviews"), tWhat = at("what"),
    tHate = at("hate"), tOrig = at("original"), tSo = at("so"), tBuild = at("build");
  // the card opens short (header, count, sources) and grows to its full height when the complaints come in
  const H0 = 400, R0 = [X, Y, W, H0];
  const hl = U.rrHalves(X + 0.75, Y + 0.75, W - 1.5, H0 - 1.5, U.R.card);
  if (Math.abs(SD[1] - (Y + 0.75)) > 0.01 || Math.abs(SD[0] - (X + W / 2)) > 0.01) throw new Error("reviews: the seed must sit on the card's top-edge centre");
  const svg = hl.map((dd, k) => U.trimPath(`${p}-o${k}`, dd, C.mist, 1.5)).join("") + spark(`${p}-k0`) + spark(`${p}-k1`);
  const src = ["App Store", "G2", "Capterra", "Reddit"];
  let cx = 30;
  const rows = [["Per-seat price jumps", "Flat pricing"], ["No text reminders", "SMS reminders"], ["Guests confused by time zones", "A time zone confirm step"]];
  const cw = U.badgeW("Complaint", 19, true), fw = U.badgeW("Fix", 19, true);
  // a list row whose text rolls to a new value (ids -a / -b / -tag, the same ones swapName drives) and whose badge turns
  const row = (id, y, i, from, to) => U.card(id, 30, y, VW - 60, 70,
    U.tx("", 22, 21, String(i + 1).padStart(2, "0"), { fs: 20, mono: true, c: C.fog }) +
    `<div style="position:absolute;left:72px;top:20px;width:${VW - 60 - 72 - cw - 40}px;height:31px;overflow:hidden" data-layout-allow-overflow>` +
    U.tx(`${id}-a`, 0, 0, from, { fs: 23, fw: 510, c: C.paper }) + U.tx(`${id}-b`, 0, 0, to, { fs: 23, fw: 510, c: C.paper }) + `</div>` +
    U.badge(`${id}-tag`, VW - 60 - 20 - cw, 18, "Complaint", "coral") + U.badge(`${id}-ck`, VW - 60 - 20 - fw, 18, "Fix", "green"), { r: U.R.btn });
  const inner =
    U.box(`${p}-hd`, 30, 66, 800, 90, "", U.tx("", 0, 0, "The Entrepreneur", { fs: 34, fw: 510, c: C.paper }) + U.tx("", 0, 48, "Reads what the app's users hate in real reviews", { fs: 21, c: C.fog })) +
    U.divider(30, 176, VW - 60) +
    U.box(`${p}-ct`, 30, 196, 500, 80, "", U.tx(`${p}-cn`, 0, 0, "140", { fs: 64, fw: 510, c: C.paper }) + U.tx("", 128, 34, "real reviews", { fs: 22, c: C.fog })) +
    src.map((t, i) => { const ch = U.pill(`${p}-sc${i}`, cx, 296, t, { dot: C.fog }); cx += U.pillW(t, 20, true) + 12; return ch; }).join("") +
    U.divider(30, 370, VW - 60) +
    U.box(`${p}-sh`, 30, 392, 400, 32, "overflow:hidden;",
      U.tx(`${p}-sha`, 0, 0, "What users hate", { fs: 21, fw: 510, c: C.fog }) + U.tx(`${p}-shb`, 0, 34, "Fix plan", { fs: 21, fw: 510, c: C.fog })) +
    rows.map(([f, t], i) => row(`${p}-r${i}`, 440 + i * 86, i, f, t)).join("") +
    U.tx(`${p}-ft`, 30, 712, "Every quote linked, the sample size stated", { fs: 20, c: C.fog });
  // a bare layer over the growing chrome (the chrome grows, the layer unclips with it)
  const html = U.chrome(`${p}-ch`, R0) + U.win(`${p}-rw`, ...RW, "replica-entrepreneur", inner, { bare: true });
  const count = (id, n, t, dd) => `
      document.querySelector("#${id}").textContent = "0";
      tl.fromTo({ v: 0 }, { v: 0 }, { v: ${n}, duration: ${dd}, ease: E.outQ, immediateRender: false, onUpdate: function () { document.querySelector("#${id}").textContent = Math.round(this.targets()[0].v); } }, ${t});`;
  const tOpen = 0.92, tX = r2(h.at - 0.24), tG = r2(tWhat - 0.4);
  L.hold(tBuild, tX, 0.4, "reviews: fix plan");
  const anim = `${seedIn(p, SD)}
      // the seed's sparks draw the card's outline both ways round; the card opens inside it
      ${sdraw(`${p}-k0`, `#${p}-o0`, hl[0], 0.06, 0.8, { ping: false })}
      ${sdraw(`${p}-k1`, `#${p}-o1`, hl[1], 0.06, 0.8)}
      gsap.set(q("#${p}-rw, #${p}-ch"), { opacity: 0 });
      tl.set(q("#${p}-rw, #${p}-ch"), { opacity: 1 }, ${tOpen}); tl.to(q("#${p}-o0, #${p}-o1"), { opacity: 0, duration: 0.25, ease: E.in }, ${r2(tOpen + 0.01)});
      gsap.set("#${p}-rw", { clipPath: "inset(0px 0px ${Hh - H0}px 0px round 12px)" });
      wipeIn("#${p}-rw .tbar", ${tOpen}, 0.36);
      wipeIn("#${p}-hd", ${r2(Math.max(tOpen + 0.1, tInt))}, 0.45);
      // "analyzes real user reviews": the count, then the sources
      wipeIn("#${p}-ct", ${r2(tAn - 0.1)}, 0.36);${count(`${p}-cn`, 140, r2(tAn), r2(tRev - tAn))}
      tl.fromTo(q("${src.map((_, i) => `#${p}-sc${i}`).join(", ")}"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", stagger: 0.1 }, ${r2(tReal - 0.04)});
      // "what people hate": the card grows open, the top complaints rise in, ranked
      ${U.grow(`${p}-ch`, R0, RW, tG, 0.5)}
      tl.fromTo("#${p}-rw", { clipPath: "inset(0px 0px ${Hh - H0}px 0px round 12px)" }, { clipPath: "inset(0px 0px 0px 0px round 12px)", duration: 0.5, ease: E.inOut, immediateRender: false }, ${tG});
      wipeIn("#${p}-sh", ${r2(tWhat - 0.2)}, 0.3);
      ${rows.map((_, i) => `wipeIn("#${p}-r${i}", ${r2(tWhat - 0.1 + i * 0.14)}, 0.45);`).join(" ")}
      ${rows.map((_, i) => `pop("#${p}-r${i}-tag", ${r2(tHate + i * 0.1)});`).join(" ")}
      gsap.set(q("${rows.map((_, i) => `#${p}-r${i}-ck`).join(", ")}"), { opacity: 0 });
      fadeUp("#${p}-ft", ${r2(tOrig - 0.1)});
      // "so you can build something better": the fix plan, each complaint rolls into its fix
      tl.fromTo(q("#${p}-sha, #${p}-shb"), { y: 0 }, { y: -34, duration: 0.36, ease: E.inOut }, ${r2(tSo)});
      ${rows.map((_, i) => `swapName("${p}-r${i}", ${r2(tSo + 0.06 + i * 0.12)}); pop("#${p}-r${i}-ck", ${r2(tSo + 0.3 + i * 0.12)});`).join(" ")}
      // clear for the cut
      wipeOut("#${p}-rw-c", ${tX}, 0.24);
      tl.set(q("#${p}-rw, #${p}-ch"), { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  const boxes = [{ id: "win", r: RW, t: [tG, h.at] }, { id: "win0", r: R0, t: [0, tG] }];
  return { lift: P.lift.reviews, cam: P.cam("reviews", { t0: tOpen }), fade: false, svg, html, over: seed(p) + U.mframeL(`${p}-mf`), anim, boxes };
};
