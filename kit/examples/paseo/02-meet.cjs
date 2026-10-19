// meet: "That's exactly what Paseo lets you do. It's a free, open-source tool that brings Claude Code, Codex, Copilot,
// and more into one place."
// The phone's frame lands as the Paseo logo tile (H1); the name rises under it and FREE / OPEN SOURCE plates wipe in
// on their words. Then the tile's frame grows into the real Paseo desktop window (a morph within the scene). Agent
// logo tiles pop on their names, each dropping a lime tube into the window, the small "and more" row follows, and on
// "into one place" every tile converges into the window (new: converge). A trim box lands on the real tab strip
// (Codex and Claude Code side by side). The window's frame leaves as H2.
module.exports = (L, s) => {
  const { plate, klabel, shotBox, screenWin, fitShot, hlTrim, dtube, pulse, mframe, morphCode, converge, MB, T } = L;
  const P = require("./_plan.cjs"), hin = P.H.h1, h = P.H.h2;
  const p = s.p, r2 = L.r2;
  const LOGO = P.R.meetLogo, WIN = P.R.meetWin, [X, Y, W, Hh] = WIN;
  const [sw, sh] = fitShot(2432 / 1396, W - 5, Hh - 5);
  const big = [["claude-code", 210, "Claude"], ["codex", 480, "Codex"], ["copilot", 750, "Copilot"]], BY = 350, BS = 120;
  const more = [["opencode", 330], ["pi", 425], ["antigravity", 575], ["muse-code", 670]], MY = 540, MS = 80;
  const tubes = big.map(([, x]) => `M${x + BS / 2} ${BY + BS} V${Y}`);
  const tPaseo = s.at("Paseo"), tFree = s.at("free"), tOS = s.at("open-source"), tMore = s.at("more"),
    tInto = s.at("into"), tOne = s.at("one");
  const tile = (id, x, y, sz, logo) => shotBox(id, x, y, sz, sz, `assets/logos/${logo}.svg`, { pad: 0.18, attr: `${MB()} data-layout-allow-overlap` });
  const html =
    shotBox(`${p}-logo`, LOGO[0], LOGO[1], LOGO[2], LOGO[3], "assets/logos/paseo-logo-ink.svg", { pad: 0.2 }) +
    `<div id="${p}-pl" class="plane">` + klabel(`${p}-lb`, 540, 710, ["PASEO"], { a: "middle" }) +
    plate(`${p}-p1`, 290, 800, 500, "Free") + plate(`${p}-p2`, 290, 890, 500, "Open source") + `</div>` +
    big.map(([l, x], i) => tile(`${p}-b${i}`, x, BY, BS, l)).join("") +
    more.map(([l, x], i) => tile(`${p}-m${i}`, x, MY, MS, l)).join("") +
    screenWin(`${p}-win`, X, Y, W, Hh, [{ id: `${p}-s0`, src: "assets/shots/site/desk-build.png", w: sw, h: sh }],
      { over: hlTrim(`${p}-tab`, 175.5, 27, 312, 38) }) +
    mframe(`${p}-mi`);
  const svg =
    tubes.map((d, i) => dtube(`${p}-t${i}`, d, { w: 12, fill: T.lime })).join("") +
    tubes.map((d, i) => pulse(`${p}-u${i}`, d, { lime: true, len: 0.3 })).join("");
  const tOut = r2(tOS + 0.45), tGrow = r2(tOut + 0.3), gDur = 0.5, tWin = r2(tGrow + gDur);
  const pops = big.map(([, , w], i) => {
    const t = r2(Math.max(s.at(w) - 0.06, tWin + 0.02));
    return `
      pop("#${p}-b${i}", ${t}); draw(q("#${p}-t${i} path"), ${r2(t + 0.12)}, 0.36); run("#${p}-u${i}", ${r2(t + 0.4)}, 0.5, 4, 0.12);`;
  }).join("");
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-logo`)}
      wipeIn("#${p}-logo-i", ${hin.inDur}, 0.45);
      kin("#${p}-lb", ${r2(Math.max(hin.inDur + 0.05, tPaseo - 0.05))}, 0.05, 0.55);
      drift("#${p}-pl", ${hin.inDur}, ${L.SETTLE}, -8);
      plateIn("#${p}-p1", ${r2(tFree - 0.14)}); pop("#${p}-p1-tag", ${r2(tFree + 0.08)});
      plateIn("#${p}-p2", ${r2(tOS - 0.12)}); pop("#${p}-p2-tag", ${r2(tOS + 0.16)});
      // the plates leave, the tile's frame grows into the real desktop window
      kout("#${p}-lb", ${tOut}); wipeOut(q("#${p}-p1, #${p}-p2"), ${tOut}, 0.26, 0.05);
      wipeOut("#${p}-logo-c", ${r2(tGrow - 0.16)}, 0.16);
      mfSet("${p}-mi", ${L.js(LOGO)}); gsap.set(q("#${p}-mi, #${p}-win"), { opacity: 0 });
      tl.set("#${p}-logo", { opacity: 0 }, ${tGrow}); tl.set("#${p}-mi", { opacity: 1 }, ${tGrow});
      morph("${p}-mi", ${L.js(LOGO)}, ${L.js(WIN)}, ${tGrow}, ${gDur}, E.inOut);
      tl.set("#${p}-mi", { opacity: 0 }, ${tWin}); tl.set("#${p}-win", { opacity: 1 }, ${tWin});
      wipeIn("#${p}-win-c", ${tWin}, 0.5);
      // agent tiles pop on their names, each tubed into the window${pops}
      ${more.map((_, i) => `pop("#${p}-m${i}", ${r2(tMore - 0.08 + i * 0.05)});`).join(" ")}
      // "into one place": every tile converges into the window${converge(
        [...big.map(([, x], i) => [`#${p}-b${i}`, x, BY, BS]), ...more.map(([, x], i) => [`#${p}-m${i}`, x, MY, MS])],
        [540, Y + 30], r2(tInto - 0.08), 0.4, 0.035, 0.2)}
      ${big.map((_, i) => `tl.set("#${p}-u${i}", { opacity: 0 }, ${r2(tInto + 0.3)});`).join(" ")}
      untrim(q("${big.map((_, i) => `#${p}-t${i} path`).join(", ")}"), ${r2(tInto + 0.28)}, 0.3);
      draw(q("#${p}-tab path"), ${r2(tOne - 0.02)}, 0.4);
      // clear for the cut
      untrim(q("#${p}-tab path"), ${r2(h.at - 0.24)}, 0.2);
      wipeOut("#${p}-win-c", ${r2(h.at - 0.2)}, 0.2);
      tl.set("#${p}-win", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  return { lift: P.lift.meet, cam: P.cam("meet"), fade: false, svg, html, over: mframe(`${p}-mf`) + mframe(`${p}-mf2`), anim };
};
