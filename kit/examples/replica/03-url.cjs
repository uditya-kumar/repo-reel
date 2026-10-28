// url: "Here is how it works. Give Claude the app's URL."
// The README's frame lands as a Claude Code session (H2), centred in the frame, drawn in InterfaceDesignGuideline.md.
// On "Give" the prompt types "/replica-recon" and the autocomplete names it; the app's URL types after it and an iris
// selection wash lands on it on "URL". The card empties, and its frame shrinks into the next scene's session (H3).
module.exports = (L, s) => {
  const { typed, morphCode } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs"), hin = P.H.h2, h = P.H.h3;
  const p = s.p, r2 = L.r2, at = s.at;
  const TM = P.R.urlTerm, IW = TM[2];
  const tGive = at("Give"), tUrl = at("URL");
  const url = "https://app.example.com";
  const input = typed(`${p}-tc`, "/replica-recon ") +
    `<span style="position:relative;display:inline-block">` +
    `<i id="${p}-ul" style="position:absolute;left:-4px;right:-4px;top:-3px;bottom:-3px;background:${U.rgba(C.iris, 0.32)};border-radius:4px;transform-origin:0% 50%"></i>` +
    `<span style="position:relative">${typed(`${p}-tu`, url)}</span></span>`;
  const inner =
    U.ccWelcome(`${p}-wl`, 22, 64, IW - 44) +
    U.ccInput(`${p}-in`, 22, 146, IW - 44, input) +
    U.box(`${p}-hn`, 22, 220, IW - 44, 40, `background:${U.rgba("#ffffff", 0.05)};border-radius:${U.R.btn}px;`,
      U.tx("", 22, 8, "/replica-recon", { fs: 20, mono: true, c: C.paper }) + U.tx("", 270, 8, "Reverse-engineers any app", { fs: 20, c: C.fog })) +
    U.box(`${p}-ft`, 22, 280, 400, 30, "", U.kbd(0, 0, "?") + U.tx("", 40, 2, "for shortcuts", { fs: 19, c: C.fog }));
  const html = U.win(`${p}-t`, ...TM, "Claude Code", inner);
  const anim = `${morphCode(`${p}-mf`, hin, "in", 0, `#${p}-t`)}
      wipeIn("#${p}-t-c", ${hin.inDur}, 0.4);
      // "Give Claude the app's URL"
      type("#${p}-tc", ${r2(tGive - 0.04)}, 0.035);
      wipeIn("#${p}-hn", ${r2(tGive + 0.3)}, 0.36);
      type("#${p}-tu", ${r2(tGive + 0.56)}, 0.033);
      wipe("#${p}-ul", ${r2(tUrl - 0.02)}, 0.3);
      // clear for the cut
      wipeOut("#${p}-t-c", ${r2(h.at - 0.18)}, 0.18);
      tl.set("#${p}-t", { opacity: 0 }, ${h.at});${morphCode(`${p}-mf2`, h, "out", h.at)}`;
  const boxes = [{ id: "term", r: TM }];
  return { lift: P.lift.url, cam: P.cam("url"), fade: false, svg: "", html, over: U.mframeL(`${p}-mf`) + U.mframeL(`${p}-mf2`), anim, boxes };
};
