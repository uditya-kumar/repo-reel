// worktree: "And with separate Git worktrees, they can work on different branches without stepping on each other's changes."
// The two agent windows land as two name plates (H3a / H3b). A MAIN rail trims on left to right, its commit dots popping
// as the trim passes, and two branch rails fork off it into two isolated worktree boxes (new: branch rails). The plates
// get their real issue numbers (#412 Claude, #417 Codex) on "different branches". A dashed bridge tries to cross between
// the branches and gets an x tag; then lime changes flow down each branch into its own box and each gets a check.
// Ends on the default quick clear (no match cut into the next scene).
module.exports = (L, s) => {
  const { T, plate, klabel, rails, workspace, cube, stag, samples, mframe, morphCode } = L;
  const P = require("./_plan.cjs"), ha = P.H.h3a, hb = P.H.h3b;
  const p = s.p, r2 = L.r2;
  const trunk = "M120 470 H960";
  const BR = [[[300, 470], [300, 600], [250, 640], [250, 760]], [[640, 470], [640, 600], [800, 640], [800, 760]]];
  const NX = [180, 300, 420, 540, 640, 760, 880];
  const bridge = "M300 690 C450 640 600 640 740 690";
  const tSep = s.at("separate"), tWt = s.at("worktrees"), tDiff = s.at("different"), tBr = s.at("branches"),
    tWo = s.at("without"), tStep = s.at("stepping"), tEach = s.at("each"), tCh = s.at("changes");
  // the trunk draws with E.flow: a node pops when the trim's head (eased) reaches it
  const T0 = 0.1, TD = 0.9, inv = (f) => { let a = 0, b = 1; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (L.E.flow(m) < f) a = m; else b = m; } return a; };
  const nodeT = NX.map((x) => r2(T0 + TD * inv((x - 120) / 840)));
  const plateL = (id, r, text, logo) => plate(id, r[0], r[1], r[2], text, "none").replace(/<\/div>$/,
    `<img id="${id}-lg" src="assets/logos/${logo}.svg" alt="" style="position:absolute;left:${r[2] - 70}px;top:9.5px;width:44px;height:44px"></div>`);
  const html =
    klabel(`${p}-lb`, 120, 430, ["MAIN"]) +
    plateL(`${p}-pa`, P.R.wtA, "#412", "claude-code") + plateL(`${p}-pb`, P.R.wtB, "#417", "codex");
  const svg =
    `<defs><mask id="${p}-bm" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><rect id="${p}-bmr" x="290" y="600" width="0" height="120" fill="#fff"/></mask></defs>` +
    rails(`${p}-r`, trunk, BR.map(L.bpath), NX.map((x) => [x, 470])) +
    `<g id="${p}-w0">${workspace(`${p}-ws0`, 250, 800, 1.3)}</g><g id="${p}-w1">${workspace(`${p}-ws1`, 800, 800, 1.3)}</g>` +
    `<g id="${p}-br"><path d="${bridge}" mask="url(#${p}-bm)" fill="none" stroke="${T.dark}" stroke-width="4" stroke-dasharray="14 10"/></g>` +
    stag(`${p}-x`, 520, 655, "x") +
    [0, 1, 2, 3].map((i) => cube(`${p}-c${i}`)).join("") +
    stag(`${p}-k0`, 250, 940) + stag(`${p}-k1`, 800, 940);
  const rp = (sel) => `#${p}-r-${sel} path`;
  const flows = [0, 1, 2, 3].map((i) => {
    const b = i % 2, t = r2(tEach - 0.08 + (i >> 1) * 0.2 + b * 0.06), pts = L.js(samples(BR[b], 0, 1, 16));
    return `
      flow("#${p}-c${i}", ${pts}, ${t}, 0.55, 0); tl.set("#${p}-c${i}", { opacity: 0 }, ${r2(t + 0.55)});`;
  }).join("");
  const x0 = r2(s.dur - 0.52);
  const anim = `${morphCode(`${p}-mfa`, ha, "in", 0, `#${p}-pa`)}${morphCode(`${p}-mfb`, hb, "in", 0, `#${p}-pb`)}
      gsap.set(q("#${p}-pa .pw, #${p}-pb .pw"), { yPercent: 110 }); gsap.set(q("#${p}-pa-lg, #${p}-pb-lg"), { opacity: 0 });
      // MAIN trims on, commit dots pop as it passes, two branches fork off into their own worktree boxes
      draw(q("${rp("t")}"), ${T0}, ${TD});
      ${nodeT.map((t, k) => `pop("#${p}-r-n${k}", ${t});`).join(" ")}
      kin("#${p}-lb", 0.2, 0.05, 0.5);
      draw(q("${rp("b0")}"), ${r2(tSep + 0.02)}, 0.6); draw(q("${rp("b1")}"), ${r2(tSep + 0.14)}, 0.6);
      ${[0, 1].map((i) => `tl.fromTo("#${p}-w${i}", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E.out }, ${r2(tWt - 0.04 + i * 0.1)});`).join(" ")}
      // "different branches": each plate gets its real issue number and agent
      tl.fromTo("#${p}-pa .pw", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: E.out, immediateRender: false }, ${r2(tDiff - 0.05)});
      pop("#${p}-pa-lg", ${r2(tDiff + 0.1)});
      tl.fromTo("#${p}-pb .pw", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: E.out, immediateRender: false }, ${r2(tBr - 0.05)});
      pop("#${p}-pb-lg", ${r2(tBr + 0.1)});
      // "without stepping": a dashed bridge reaches across and is crossed out; it never connects
      tl.fromTo("#${p}-bmr", { attr: { width: 0 } }, { attr: { width: 470 }, duration: 0.5, ease: E.flow }, ${r2(tWo - 0.05)});
      pop("#${p}-x", ${r2(tStep)});
      // "each other's changes": lime changes flow down each branch into its own box${flows}
      draw(q("${rp("g0")}"), ${r2(tEach - 0.08)}, 0.6); draw(q("${rp("g1")}"), ${r2(tEach - 0.02)}, 0.6);
      pop("#${p}-k0", ${r2(tCh)}); pop("#${p}-k1", ${r2(tCh + 0.1)});
      // exit: the top leaves first, then the boxes and plates
      kout("#${p}-lb", ${x0});
      untrim(q("${["t", "b0", "b1", "g0", "g1"].map(rp).join(", ")}"), ${x0}, 0.24);
      tl.to(q("${NX.map((_, k) => `#${p}-r-n${k}`).join(", ")}, #${p}-br, #${p}-x"), { opacity: 0, duration: 0.2, ease: E.in }, ${r2(x0 + 0.04)});
      away(q("#${p}-w0, #${p}-w1, #${p}-k0, #${p}-k1"), ${r2(x0 + 0.1)}, -24, 0.26);
      wipeOut(q("#${p}-pa, #${p}-pb"), ${r2(x0 + 0.14)}, 0.24, 0.04);`;
  return { lift: P.lift.worktree, cam: P.cam("worktree"), svg, html, over: mframe(`${p}-mfa`) + mframe(`${p}-mfb`), anim };
};
