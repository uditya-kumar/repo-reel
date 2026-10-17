// Shared cut plan: every scene's lift and camera move, and every match-cut handoff, so both sides of a cut read
// the same numbers. Handoff times are global seconds; each `land` sits on a music beat (143.55 BPM grid).
const L = require("../lib/reel-lib.cjs");
const timing = require("../../script/timing.json");

const KEYS = ["hook", "meet", "problem", "solution", "switch", "features", "useful", "cta"];
const start = Object.fromEntries(timing.scenes.map((s, i) => [KEYS[i], s.start]));
const dur = Object.fromEntries(timing.scenes.map((s, i) => [KEYS[i], s.dur]));
const lift = { hook: 35, meet: 125, problem: 25, solution: 30, switch: 20, features: 0, useful: 0, cta: 0 };
// where each scene's camera ends up (it eases there from its landing and holds through the next handoff)
const camEnd = {
  hook: { s: 1.03, x: 0, y: -10 }, meet: { s: 1.02, x: 0, y: -6 }, problem: { s: 1.03, x: 0, y: -14 },
  solution: { s: 1.03, x: 0, y: -18 }, switch: { s: 1.03, x: -10, y: -6 }, features: { s: 1.025, x: 0, y: -6 },
  useful: { s: 1.02, x: 0, y: -6 }, cta: { s: 1.03, x: 0, y: 0 },
};
// the rects ([x, y, w, h] in each scene's .lift) that the handoffs connect
const R = {
  hookWin: [300, 700, 480, 400],
  meetWin: [58, 520, 964, 299],          // harnessRouter.png 959 x 294 + outline
  problemWin: [600, 420, 420, 180],
  solutionWin: [330, 380, 420, 180],
  switchWin: [240, 400, 600, 250],
  session1: [135, 600, 360, 68],
  featuresWin: [220, 486, 640, 430],
  usefulWin: [58, 430, 964, 604],        // kit-*.png 959 x 599 + outline
  ctaTerm: [190, 826, 700, 236],         // the CTA's Terminal window (4 code lines, no device)
  ctaN1: [290, 548, 500, 68],            // the CTA's first trust plate (H7 lands on it; the Terminal waits for "Docker")
  // H4 also carries two agent plates from the solution's branches to the switch's lanes
  solCodex: [58, 1000, 340, 68], solClaude: [370, 1100, 340, 68],
  swCodex: [58, 1100, 340, 68], swClaude: [682, 1100, 340, 68],
};
const scr = (key, r, settled = true) => L.toScreen(settled ? camEnd[key] : null, lift[key], r);
const hand = (from, to, A, B, t0, cut, land) => {
  if (Math.abs(cut - start[to]) > 1e-6) throw new Error(`handoff ${from}->${to}: cut ${cut} is not the scene start ${start[to]}`);
  return { ...L.handoff({ A: scr(from, A), B: scr(to, B, false), t0, cut, land }), from, to, at: L.r3(t0 - start[from]) };
};
const H = {
  h1: hand("hook", "meet", R.hookWin, R.meetWin, 4.22, 4.45, 4.9),
  h2: hand("meet", "problem", R.meetWin, R.problemWin, 11.25, 11.55, 12.005),
  h3: hand("problem", "solution", R.problemWin, R.solutionWin, 16.75, 17.15, 17.44),
  h4: hand("solution", "switch", R.solutionWin, R.switchWin, 22.45, 22.8, 23.292),
  h4a: hand("solution", "switch", R.solCodex, R.swCodex, 22.45, 22.8, 23.292),
  h4b: hand("solution", "switch", R.solClaude, R.swClaude, 22.45, 22.8, 23.292),
  h5: hand("switch", "features", R.switchWin, R.session1, 28.05, 28.45, 28.72),
  h6: hand("features", "useful", R.featuresWin, R.usefulWin, 35.0, 35.35, 35.832),
  h7: hand("useful", "cta", R.usefulWin, R.ctaN1, 40.6, 40.85, 41.142),
};
const inbound = (key) => Object.values(H).find((h) => h.to === key);
const outbound = (key) => Object.values(H).find((h) => h.from === key);
// the scene's camera move: from its landing (inbound handoff settled), settling within L.SETTLE s and holding still
// through its outbound handoff
const cam = (key) => {
  const i = inbound(key), o = outbound(key), t0 = i ? i.inDur : 0;
  return { ...camEnd[key], t0, t1: Math.min(o ? o.at : dur[key], t0 + L.SETTLE) };
};
// a carried element's options for L.carry on either side of a handoff
const side = (key, r, sideName) => ({ lx: r[0], ly: r[1], lift: lift[key], cam: sideName === "out" ? camEnd[key] : null });

module.exports = { KEYS, start, dur, lift, camEnd, R, H, cam, side, inbound, outbound };
