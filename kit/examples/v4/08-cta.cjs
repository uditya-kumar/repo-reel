// cta: "It's self-hosted, uses your own keys, and starts with one Docker command. Follow for more useful tools."
// The fixed CTA layout (DESIGN.md 6.1, device: false) with v4 motion: the screenshot window shrinks into the first
// trust plate (H7, on "self-hosted"); the others wipe in on their words, and the Terminal only wipes in on "Docker",
// its command typing out under "One Docker command". On
// "Follow" the terminal's outline grows into the repo window (a morph within the scene), then the URL, the kinetic
// follow line and the Follow click. Ends on the usual quick clear.
module.exports = (L, s, reel) => {
  const { T, plate, appWinC, tagInner, POINTER, typed, mframe, morphCode } = L;
  const P = require("./_plan.cjs"), hin = P.H.h7;
  const p = s.p, at = s.at, cfg = reel.cta;
  const items = cfg.trust, top = items.slice(0, -1), bottom = items[items.length - 1], code = bottom.code;
  // same geometry as L.ctaScene with device: false
  const RW = 964 - 5, RH = Math.round((RW * (cfg.shotH || 1300)) / 2560);
  const urlTop = 370 + RH + 5 + 48, ftTop = urlTop + 102, btnTop = urlTop + 214;
  const FS = 28, LH = 40, codeH = 46 + 30 + code.length * LH;
  const stackH = items.length * 90 - 22 + 30 + codeH, y0 = Math.round(805 - stackH / 2);
  const pcY = y0 + top.length * 90, codeY = pcY + 98;
  const [TX, TY, TW, TH] = P.R.ctaTerm, REPO = [58, 370, 964, RH + 5];
  if (TY !== codeY || TH !== codeH) throw new Error(`cta: plan's ctaTerm ${P.R.ctaTerm} != terminal ${TX},${codeY},${TW},${codeH}`);
  if (P.R.ctaN1.join() !== [290, y0, 500, 68].join()) throw new Error(`cta: plan's ctaN1 ${P.R.ctaN1} != plate 290,${y0},500,68`);
  const kw = (w) => `<span class="km"><span class="kw">${w}</span></span>`;
  const htmlA =
    top.map((it, i) => plate(`${p}-n${i + 1}`, 290, y0 + i * 90, 500, it.text, it.kind)).join("") +
    plate(`${p}-pc`, 290, pcY, 500, bottom.text, bottom.kind) +
    appWinC(`${p}-code`, TX, TY, TW, TH, "Terminal",
      code.map((l, i) => `<div class="code" style="left:26px;top:${62 + i * LH}px;font-size:${FS}px">${typed(`${p}-cl${i}`, l)}</div>`).join(""));
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
      drift("#${p}-a", ${land}, 4, -8);`;
  let prev = land - 0.25;
  top.forEach((it, i) => {
    const t = L.r2(Math.max(land + 0.02, at(it.word) - 0.3, prev + 0.3));
    anim += i === 0 ? `
      tl.fromTo("#${p}-n1 .pw", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: E.out }, ${t});` : `
      plateIn("#${p}-n${i + 1}", ${t});`;
    anim += ` pop("#${p}-n${i + 1}-tag", ${L.r2(Math.max(t + 0.3, at(it.word)))});`;
    prev = t;
  });
  const tPc = L.r2(Math.max(at(bottom.word) - 0.3, prev + 0.3));
  anim += `
      plateIn("#${p}-pc", ${tPc}); pop("#${p}-pc-tag", ${L.r2(Math.max(tPc + 0.3, at(bottom.word)))});`;
  // the Terminal waits for "Docker", then the command prints fast, done before "Follow"
  const tTerm = L.r2(at(bottom.word) - 0.02), tCode = L.r2(tTerm + 0.2);
  anim += `
      wipeIn("#${p}-code", ${tTerm}, 0.45);`;
  code.forEach((l, i) => { anim += `
      type("#${p}-cl${i}", ${L.r2(tCode + i * 0.1)}, 0.006);`; });
  // beat B: on "Follow" everything clears and the terminal's outline grows into the repo window
  const B = L.r2(at(cfg.follow || "follow") + 0.02), gDur = 0.5, tRepo = L.r2(B + gDur);
  const b = (d) => L.r2(B + d);
  if (s.dur < B + 2.8) throw new Error(`${s.id}: scene too short for the follow click`);
  anim += `
      wipeOut(q("#${p}-n1, #${p}-n2, #${p}-pc"), ${b(-0.36)}, 0.26, 0.05);
      wipeOut("#${p}-code-c", ${b(-0.14)}, 0.14);
      mfSet("${p}-mi", ${L.js(P.R.ctaTerm)}); gsap.set(q("#${p}-mi, #${p}-b"), { opacity: 0 });
      tl.set("#${p}-code", { opacity: 0 }, ${B}); tl.set("#${p}-mi", { opacity: 1 }, ${B});
      morph("${p}-mi", ${L.js(P.R.ctaTerm)}, ${L.js(REPO)}, ${B}, ${gDur}, E.inOut);
      tl.set("#${p}-mi", { opacity: 0 }, ${tRepo}); tl.set("#${p}-b", { opacity: 1 }, ${tRepo});
      gsap.set("#${p}-cur", { opacity: 0 });
      wipeIn("#${p}-shot", ${tRepo}, 0.55);
      wipeIn("#${p}-url", ${b(0.6)}, 0.45);
      kin("#${p}-ft", ${b(0.72)}, 0.09, 0.55);
      wipe("#${p}-ul", ${b(1.1)}, 0.42);
      wipeIn("#${p}-btn", ${b(1.2)}, 0.42);
      // the cursor glides in on a gentle arc and clicks Follow
      tl.set("#${p}-cur", { opacity: 1 }, ${b(1.5)});
      tl.fromTo("#${p}-cur", { x: 170 }, { x: 0, duration: 0.7, ease: E.out }, ${b(1.5)});
      tl.fromTo("#${p}-cur", { y: 150 }, { y: 0, duration: 0.7, ease: E.outQ }, ${b(1.5)});
      tl.to("#${p}-cur", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1, ease: E.inOut, transformOrigin: "0% 0%" }, ${b(2.2)});
      tl.to("#${p}-btn", { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1, ease: E.inOut }, ${b(2.2)});
      tl.set("#${p}-bA", { opacity: 0 }, ${b(2.26)}); tl.set("#${p}-bB", { opacity: 1 }, ${b(2.26)});
      pop("#${p}-bB svg", ${b(2.3)});`;
  return {
    lift: 0, cam: P.cam("cta"), svg: "",
    html: `<div id="${p}-a">${htmlA}</div><div id="${p}-b">${htmlB}</div>` + mframe(`${p}-mi`),
    over: mframe(`${p}-mf`), anim,
  };
};
