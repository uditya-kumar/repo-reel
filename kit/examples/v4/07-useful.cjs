// useful: "You can build tools for creating slides, spreadsheets, dashboards, and more."
// The session window opens into the repo's starter-kit screenshots (H6). The label lands word by word; the screenshots
// push through the window on each word (Slides -> Sheets -> Dashboards, motion-blurred) while a 2x2 checklist fills in
// below. The window's outline then shrinks into the CTA's terminal (H7).
module.exports = (L, s) => {
  const { plate, icoTile, klabel, mframe, morphCode, MB } = L;
  const P = require("./_plan.cjs"), hin = P.H.h6, h = P.H.h7;
  const p = s.p;
  // kit-*.png are 3200x2000, shown 959 wide inside a 2.5px ink outline
  const [X, Y, W, WH] = P.R.usefulWin, IW = W - 5, IH = WH - 5;
  const shots = ["kit-slides", "kit-sheets", "kit-dashboard"];
  const items = [["slides", "Slides", "slides"], ["sheet", "Spreadsheets", "spreadsheets"], ["chart", "Dashboards", "dashboards"], ["more", "And more", "and", "plus"]];
  const RY = Y + WH + 40;
  const html =
    `<div id="${p}-lp" class="plane">${klabel(`${p}-lb`, 540, 400, ["BUILD TOOLS FOR"], { a: "middle" })}</div>` +
    `<div id="${p}-win" class="win" style="left:${X}px;top:${Y}px;width:${W}px;height:${WH}px"><div id="${p}-sw" class="wc">` +
    shots.map((f, i) => `<img id="${p}-s${i}" src="assets/shots/${f}.png" alt="" ${MB()} data-layout-allow-overlap style="position:absolute;left:0;top:0;width:${IW}px;height:${IH}px">`).join("") + `</div></div>` +
    `<div id="${p}-rp" class="plane">` +
    items.map(([k, t, , kind], i) =>
      `<div id="${p}-r${i}" class="row" style="left:${58 + (i % 2) * 494}px;top:${RY + Math.floor(i / 2) * 88}px;width:470px">${icoTile(k)}${plate(`${p}-r${i}p`, 84, 0, 386, t, kind)}</div>`).join("") +
    `</div>`;
  const at = items.map(([, , w]) => s.at(w));
  const land = hin.inDur, x0 = L.r2(h.at - 0.08);
  // a screenshot push: the current one leaves left as the next enters from the right (one eased move, blurred)
  const push = (a, b, t) => `
      tl.fromTo("#${p}-s${a}", { x: 0 }, { x: ${-IW}, duration: 0.6, ease: E.inOut, immediateRender: false }, ${L.r2(t)});
      tl.fromTo("#${p}-s${b}", { x: ${IW} }, { x: 0, duration: 0.6, ease: E.inOut, immediateRender: false }, ${L.r2(t)});`;
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-win`)}
      gsap.set(q("#${p}-s1, #${p}-s2"), { x: ${IW} });
      wipeIn("#${p}-sw", ${L.r2(land)}, 0.55);
      kin("#${p}-lb", ${L.r2(s.at("build") - 0.04)}, 0.3, 0.5);
      drift("#${p}-lp", 0, ${L.r2(h.at)}, -12);
      drift("#${p}-rp", ${land}, ${L.r2(h.at - land)}, -8);
      // each tool on its word: the screenshot pushes through, its row checks in below${push(0, 1, at[1] - 0.3)}${push(1, 2, at[2] - 0.3)}
      ${at.map((t, i) => `plateIn("#${p}-r${i}", ${L.r2(t - 0.3)}); pop("#${p}-r${i}p-tag", ${L.r2(t + (i === 3 ? 0.2 : 0))});`).join("\n      ")}
      // clear for the cut
      kout("#${p}-lb", ${L.r2(x0 - 0.25)});
      wipeOut(q("${items.map((_, i) => `#${p}-r${i}`).join(", ")}"), ${x0}, 0.22, 0.03);
      wipeOut("#${p}-sw", ${L.r2(h.at - 0.16)}, 0.16);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.useful, cam: P.cam("useful"), fade: false, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
