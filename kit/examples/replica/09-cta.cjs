// cta: 'Comment "REPLICA" and I'll DM you the GitHub repo link!'
// The fixed CTA frame (L.ctaScene, reel.json -> cta: no trust plates, no device): the LIVE plate's frame grows straight
// into the repo window (H8) and lands as the repo page, then the URL, the line and the click follow. The approved
// narration asks for a comment instead of a follow, so the line reads "Comment REPLICA" (the keyword under the lime
// underline) and the button reads Comment -> Commented. Everything else is ctaScene's.
module.exports = (L, s, reel) => {
  const P = require("./_plan.cjs"), h = P.inbound("cta");
  const out = L.ctaScene(s, { url: reel.url, ...(reel.cta || {}) });
  const swap = (x, a, b) => { if (!x.includes(a)) throw new Error(`cta: "${a}" is not in the CTA markup; update 09-cta.cjs`); return x.replace(a, b); };
  let html = out.html;
  html = swap(html, `>Follow for more <span class="hl">`, `>Comment <span class="hl">`);
  html = swap(html, `<b>useful tools</b>`, `<b>REPLICA</b>`);
  html = swap(html, `<span>Follow</span>`, `<span>Comment</span>`);
  html = swap(html, `<span>Following</span>`, `<span>Commented</span>`);
  // the repo window arrives as the handoff's frame instead of rising in
  const p = s.p, rise = new RegExp(`\\n\\s*tl\\.fromTo\\("#${p}-repo"[^\\n]*`);
  if (!rise.test(out.anim)) throw new Error("cta: the repo window's entrance is not in ctaScene's anim; update 09-cta.cjs");
  const anim = out.anim.replace(rise, "") + L.morphCode(`${p}-mf`, h, "in", 0, `#${p}-repo`);
  if (Math.abs(h.B[0] - 58) > 0.5 || Math.abs(h.B[1] - 370) > 0.5) throw new Error("cta: H8 must land on the repo window (P.R.ctaRepo)");
  return { ...out, html, anim, over: L.mframe(`${p}-mf`), cam: P.cam("cta") };
};
