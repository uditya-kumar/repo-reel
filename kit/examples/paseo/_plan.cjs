// Shared cut plan: every scene's lift and camera move, and every match-cut handoff, so both sides of a cut read
// the same numbers. Handoff times are global seconds; each `land` is snapped to a music beat (143.55 BPM grid).
const L = require("../lib/reel-lib.cjs");
const timing = require("../../script/timing.json");

const KEYS = ["hook", "meet", "parallel", "worktree", "handoff", "phone", "workflow", "cta"];
const start = Object.fromEntries(timing.scenes.map((s, i) => [KEYS[i], s.start]));
const dur = Object.fromEntries(timing.scenes.map((s, i) => [KEYS[i], s.dur]));
const snap = L.beatGrid(timing.beats);
const lift = { hook: 0, meet: 0, parallel: 0, worktree: 80, handoff: 0, phone: 0, workflow: 0, cta: 0 };
// where each scene's camera ends up (it eases there from its landing and holds through the next handoff)
const camEnd = {
  hook: { s: 1.03, x: 0, y: -10 }, meet: { s: 1.02, x: 0, y: -6 }, parallel: { s: 1.02, x: 0, y: -6 },
  worktree: { s: 1.03, x: 0, y: -8 }, handoff: { s: 1.03, x: 0, y: -8 }, phone: { s: 1.02, x: 0, y: -6 },
  workflow: { s: 1.02, x: 0, y: -6 }, cta: { s: 1.03, x: 0, y: 0 },
};
// the rects ([x, y, w, h] in each scene's .lift) that the handoffs connect
const PH = Math.round((267 * 2120) / 992), PH6 = Math.round((210 * 2120) / 992);
const R = {
  hookPhone: [406, 760, 267, PH],          // phone-chat.png 992 x 2120 at 267 wide
  meetLogo: [430, 420, 220, 220],          // the Paseo logo tile
  meetWin: [58, 736, 964, 556],            // desk-build.png 2432 x 1396 -> 959 x 551 in a bare frame
  parWin: [58, 426, 964, 424],             // mcp-fanout.png 1248 x 832 at 959 wide, cropped under its content
  parA: [58, 940, 400, 300], parB: [622, 940, 400, 300],      // the Claude Code / Codex agent windows
  wtA: [92, 1030, 316, 68], wtB: [642, 1030, 316, 68],        // the two worktree plates (#412 / #417)
  hoCodex: [400, 760, 622, 520],           // the Codex window that builds the plan
  phDesk: [230, 446, 620, 358],            // desk-build.png at 615 wide in a bare frame
  phPhone: [790, 856, 210, PH6],           // the phone after it moves away (phone-chat.png)
  wfWin: [58, 426, 964, 556],              // the interface frame (959 x 551 screens)
  ctaN1: [290, 400, 500, 68],              // the CTA's first trust plate
};
const scr = (key, r, settled = true) => L.toScreen(settled ? camEnd[key] : null, lift[key], r);
const hand = (from, to, A, B, t0, cut, land) => {
  if (Math.abs(cut - start[to]) > 1e-6) throw new Error(`handoff ${from}->${to}: cut ${cut} is not the scene start ${start[to]}`);
  return { ...L.handoff({ A: scr(from, A), B: scr(to, B, false), t0, cut, land: snap(land) }), from, to, at: L.r3(t0 - start[from]) };
};
const H = {
  h1: hand("hook", "meet", R.hookPhone, R.meetLogo, 4.95, start.meet, 5.7),
  h2: hand("meet", "parallel", R.meetWin, R.parWin, 13.3, start.parallel, 14.1),
  h3a: hand("parallel", "worktree", R.parA, R.wtA, 17.5, start.worktree, 18.25),
  h3b: hand("parallel", "worktree", R.parB, R.wtB, 17.5, start.worktree, 18.25),
  h5: hand("handoff", "phone", R.hoCodex, R.phDesk, 27.65, start.phone, 28.3),
  h6: hand("phone", "workflow", R.phPhone, R.wfWin, 34.9, start.workflow, 35.4),
  h7: hand("workflow", "cta", R.wfWin, R.ctaN1, 40.55, start.cta, 41.07),
};
const inbound = (key) => Object.values(H).find((h) => h.to === key);
const outbound = (key) => Object.values(H).find((h) => h.from === key);
// the scene's camera move: from its landing (inbound handoff settled), settling within L.SETTLE s and holding still
// through its outbound handoff
const cam = (key) => {
  const i = inbound(key), o = outbound(key), t0 = i ? i.inDur : 0;
  return { ...camEnd[key], t0, t1: Math.min(o ? o.at : dur[key], t0 + L.SETTLE) };
};
const side = (key, r, sideName) => ({ lx: r[0], ly: r[1], lift: lift[key], cam: sideName === "out" ? camEnd[key] : null });

module.exports = { KEYS, start, dur, lift, camEnd, R, H, cam, side, inbound, outbound };
