// cta: "No forced logins, no tracking, and it's completely open source. That's Paseo. Check out the GitHub repo, and
// follow for more useful developer tools."
// The fixed CTA (DESIGN.md 6.1) with v4 motion: the interface window shrinks into the first trust plate (H7); the other
// plates wipe in on their words. On "That's Paseo" the logo tile wipes in with its name; on "Check out the GitHub repo"
// the tile's outline grows into the repo window (a morph within the scene), then the URL, the kinetic follow line and
// the Follow click. Ends on the usual quick clear.
module.exports = (L, s, reel) => {
  const { T, plate, klabel, shotBox, tagInner, POINTER, mframe, morphCode } = L;
  const P = require("./_plan.cjs"), hin = P.H.h7;
  const p = s.p, at = s.at, cfg = reel.cta, r2 = L.r2;
  const RW = 964 - 5, RH = Math.round((RW * (cfg.shotH || 1300)) / 2560);
  const urlTop = 370 + RH + 5 + 48, ftTop = urlTop + 102, btnTop = urlTop + 214;
  const LOGO = [440, 760, 200, 200], REPO = [58, 370, 964, RH + 5];
  const y0 = P.R.ctaN1[1];
  if (P.R.ctaN1.join() !== [290, y0, 500, 68].join()) throw new Error(`cta: plan's ctaN1 ${P.R.ctaN1} is not a 500-wide plate at x 290`);
  const kw = L.kword;   // a masked word (kin / kout move it)
  const htmlA =
    cfg.trust.map((it, i) => plate(`${p}-n${i + 1}`, 290, y0 + i * 90, 500, it.text, it.kind)).join("") +
    shotBox(`${p}-logo`, ...LOGO, "assets/logos/paseo-logo-ink.svg", { pad: 0.2 }) +
    klabel(`${p}-lb`, 540, 1030, ["PASEO"], { a: "middle" });
  const htmlB =
    `<div id="${p}-repo" class="win" style="left:58px;top:370px;width:964px;height:${RH + 5}px">` +
    `<img id="${p}-shot" src="${cfg.shot || "assets/shots/repo-header.png"}" alt="" style="position:absolute;left:0;top:0;width:${RW}px;height:${RH}px"></div>` +
    `<div class="ctr" style="top:${urlTop}px"><div id="${p}-url" class="url">${reel.url}</div></div>` +
    `<div class="ctr" style="top:${ftTop}px"><div id="${p}-ft" class="ftxt">${["Follow", "for", "more"].map(kw).join(" ")} <span class="hl"><i id="${p}-ul"></i><b>${kw("useful")} ${kw("tools")}</b></span></div></div>` +
    `<div id="${p}-btn" class="btn" style="left:330px;top:${btnTop}px">` +
    `<div id="${p}-bA" class="bst on"><svg width="58" height="40" viewBox="0 0 58 40">${tagInner("plus")}</svg><span>Follow</span></div>` +
    `<div id="${p}-bB" class="bst off"><svg width="58" height="40" viewBox="0 0 58 40">${tagInner()}</svg><span>Following</span></div></div>` +
    `<svg id="${p}-cur" class="cursor" width="46" height="62" viewBox="0 0 46 62" style="left:700px;top:${btnTop + 62}px">${POINTER}</svg>`;
  const land = hin.inDur;
  // beat A: the first plate is H7's landing (its name rises in), the rest wipe in on their words
  let anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-n1`)}
      drift("#${p}-a", ${land}, ${L.SETTLE}, -8);`;
  let prev = land - 0.25;
  cfg.trust.forEach((it, i) => {
    const t = r2(Math.max(land + 0.02, at(it.word) - 0.3, prev + 0.3));
    anim += i === 0 ? `
      tl.fromTo("#${p}-n1 .pw", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: E.out }, ${t});` : `
      plateIn("#${p}-n${i + 1}", ${t});`;
    anim += ` pop("#${p}-n${i + 1}-tag", ${r2(Math.max(t + 0.3, at(it.word)))});`;
    prev = t;
  });
  // "That's Paseo": the logo tile and its name
  const tThats = at("That's"), tPaseo = at("Paseo");
  anim += `
      wipeIn("#${p}-logo", ${r2(tThats + 0.06)}, 0.45);
      kin("#${p}-lb", ${r2(tPaseo - 0.02)}, 0.05, 0.5);`;
  // beat B: on "Check" everything clears and the tile's outline grows into the repo window
  const B = r2(at("Check") + 0.05), gDur = 0.5, tRepo = r2(B + gDur), tF = at("follow");
  if (s.dur < tF + 2.6) throw new Error(`${s.id}: scene too short for the follow click`);
  const n = cfg.trust.map((_, i) => `#${p}-n${i + 1}`).join(", ");
  anim += `
      wipeOut(q("${n}"), ${r2(B - 0.4)}, 0.26, 0.05); kout("#${p}-lb", ${r2(B - 0.32)});
      wipeOut("#${p}-logo-c", ${r2(B - 0.14)}, 0.14);
      mfSet("${p}-mi", ${L.js(LOGO)}); gsap.set(q("#${p}-mi, #${p}-b"), { opacity: 0 });
      tl.set("#${p}-logo", { opacity: 0 }, ${B}); tl.set("#${p}-mi", { opacity: 1 }, ${B});
      morph("${p}-mi", ${L.js(LOGO)}, ${L.js(REPO)}, ${B}, ${gDur}, E.inOut);
      tl.set("#${p}-mi", { opacity: 0 }, ${tRepo}); tl.set("#${p}-b", { opacity: 1 }, ${tRepo});
      gsap.set("#${p}-cur", { opacity: 0 });
      wipeIn("#${p}-shot", ${tRepo}, 0.55);
      wipeIn("#${p}-url", ${r2(Math.max(tRepo + 0.15, at("GitHub") - 0.05))}, 0.45);
      // "follow for more useful developer tools", then the Follow click
      kin("#${p}-ft", ${r2(tF - 0.05)}, 0.09, 0.55);
      wipe("#${p}-ul", ${r2(at("useful") + 0.05)}, 0.42);
      wipeIn("#${p}-btn", ${r2(at("useful") + 0.15)}, 0.42);
      tl.set("#${p}-cur", { opacity: 1 }, ${r2(tF + 1.0)});
      tl.fromTo("#${p}-cur", { x: 170 }, { x: 0, duration: 0.7, ease: E.out }, ${r2(tF + 1.0)});
      tl.fromTo("#${p}-cur", { y: 150 }, { y: 0, duration: 0.7, ease: E.outQ }, ${r2(tF + 1.0)});
      tl.to("#${p}-cur", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1, ease: E.inOut, transformOrigin: "0% 0%" }, ${r2(tF + 1.7)});
      tl.to("#${p}-btn", { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1, ease: E.inOut }, ${r2(tF + 1.7)});
      tl.set("#${p}-bA", { opacity: 0 }, ${r2(tF + 1.76)}); tl.set("#${p}-bB", { opacity: 1 }, ${r2(tF + 1.76)});
      pop("#${p}-bB svg", ${r2(tF + 1.8)});`;
  return {
    lift: 0, cam: P.cam("cta"), svg: "",
    html: `<div id="${p}-a">${htmlA}</div><div id="${p}-b">${htmlB}</div>` + mframe(`${p}-mi`),
    over: mframe(`${p}-mf`), anim,
  };
};
