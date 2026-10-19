// Paseo reel storyboard: 8 scene cards, two key frames each, drawn at real 1080x1920 coordinates with the real assets.
// node storyboard/make-storyboard.cjs  ->  storyboard/storyboard.htm (screenshot it to storyboard.png)
const SB = require("./storyboard-lib.cjs");
const { L, PINK, grid, caption, shotWin, shot, agentWin, logoTile, hl, klab, shift, svg, ltube, ntube, lpulse, cubeAt, mk, marr, zoomRect, ann } = SB;
const { T, make, tube, plate, stag, workspace, stopwatch, lead, txt, POINTER } = L;

const SH = SB.SHOTS + "site/", LG = SB.LOGOS;

// ---------- the eight scenes ----------
const scenes = [];

// 01 HOOK
{
  const wins = [["Claude Code", "claude-code", 58], ["Codex", "codex", 395], ["Copilot", "copilot", 732]];
  const top = (fills, y = 400, h = 230) => wins.map(([t, l, x], i) => agentWin(x, y, 290, h, t, l, fills[i], { lines: [0.9, 0.6, 0.75, 0.5, 0.82] })).join("");
  const tubes = [[203, 630], [540, 630], [877, 630]].map(([x, y]) => `M${x} ${y} C${x} ${y + 80} 540 ${y + 40} 540 ${y + 130}`);
  scenes.push({
    n: "01", name: "HOOK", t: "0.00 – 5.15", vo: "What if you could run multiple AI coding agents at once, and manage them all from your phone?",
    a: { k: "A", t: "2.8", cap: "AI coding agents at once", act: "once", body: top([72, 48, 60], 590, 330),
      ann: mk(58, 560, 1) + marr("M120 970 H960") + mk(1000, 970, 2) + marr("M540 580 V430") + mk(600, 470, 3) },
    b: { k: "B", t: "4.6", cap: "them all from your phone", act: "phone",
      body: top([100, 100, 100]) + svg(tubes.map(ntube).join("") + tubes.map((d, i) => lpulse(d, 0.3 + i * 0.12, 0.5 + i * 0.12)).join("") + lead("l1", [[720, 1000], [690, 1000]])) +
        shot(406, 760, 267, SH + "phone-chat.png", 992 / 2120) + klab(732, 1010, "YOUR PHONE"),
      ann: mk(330, 1120, 4) + marr("M340 1300 V1200") + mk(760, 1250, 5) },
    steps: [
      "Three agent windows wipe in left → right on <i>multiple · AI · agents</i> (0.96 – 2.24), each with its real logo.",
      "On <i>at once</i> (2.80) all three lime progress bars fill together. Camera push 1 → 1.03.",
      "Carry: on <i>manage</i> (3.44) the row of windows glides up and shrinks to make room (E.inOut).",
      "On <i>phone</i> (4.56) the real phone screenshot rises in from below (E.out, motion blur on the rise only).",
      "Tubes draw from each window into the phone; lime pulses run down them (data flowing to your phone). Leader label YOUR PHONE.",
    ],
    out: "Phone outline becomes a morph frame and shrinks into the Paseo logo tile (match cut).",
    assets: "site/phone-chat.png · logos: claude-code, codex, copilot",
  });
}

// 02 MEET
{
  const tiles = [["claude-code", 210], ["codex", 480], ["copilot", 750]];
  const more = ["opencode", "pi", "antigravity", "muse-code"];
  scenes.push({
    n: "02", name: "MEET PASEO", t: "5.15 – 13.55", vo: "That's exactly what Paseo lets you do. It's a free, open-source tool that brings Claude Code, Codex, Copilot, and more into one place.",
    a: { k: "A", t: "8.6", cap: "a free, open-source tool", act: "open-source",
      body: logoTile(430, 420, 220, "paseo-logo-ink", 0.2) + klab(540, 710, "PASEO", "middle") +
        plate("p1", 290, 800, 500, "FREE", "check") + plate("p2", 290, 890, 500, "OPEN SOURCE", "check"),
      ann: mk(380, 440, 1) + mk(240, 834, 2) + mk(240, 924, 3) },
    b: { k: "B", t: "12.9", cap: "and more into one place", act: "place",
      body: tiles.map(([l, x]) => logoTile(x, 360, 120, l)).join("") +
        more.map((l, i) => logoTile(330 + i * 110, 515, 80, l)).join("") +
        svg([270, 540, 810].map((x) => ltube(`M${x} 480 C${x} 600 540 560 540 660`)).join("") + [270, 540, 810].map((x) => lpulse(`M${x} 480 C${x} 600 540 560 540 660`, 0.5, 0.75)).join("")) +
        shotWin(58, 736, 964, SH + "desk-build.png", 2432 / 1396) + hl(236, 768, 312, 38),
      ann: marr("M270 470 Q300 600 520 680") + marr("M810 470 Q780 600 560 680") + mk(140, 420, 4) + mk(1000, 560, 5) + mk(620, 760, 6) },
    steps: [
      "Phone morph frame lands as the Paseo logo tile on <i>Paseo</i> (5.92); PASEO kinetic label rises under it.",
      "FREE ✓ plate wipes in on <i>free</i> (7.84) …",
      "… OPEN SOURCE ✓ on <i>open-source</i> (8.32).",
      "Plates exit up; agent logo tiles pop on their own words: Claude Code (9.60), Codex (10.56), Copilot (11.20), then the small “and more” row on <i>more</i> (12.24).",
      "<b>NEW: converge-into-window.</b> On <i>one place</i> (12.72) every tile funnels down lime tubes and the real Paseo desktop window wipes open under them.",
      "Lime trim box draws around the real tab strip “Codex · Claude Code” (they're really side by side).",
    ],
    out: "Desktop window morphs (frame resize) into the MCP fan-out window.",
    assets: "logos: paseo-logo-ink, claude-code, codex, copilot, opencode, pi, antigravity, muse-code · site/desk-build.png",
  });
}

// 03 PARALLEL
{
  const MW = shotWin(58, 426, 964, SH + "mcp-fanout.png", 1248 / 832);
  scenes.push({
    n: "03", name: "PARALLEL AGENTS", t: "13.55 – 17.70", vo: "You can give different agents different tasks and let them work at the same time.",
    a: { k: "A", t: "15.3", cap: "different agents different tasks", act: "tasks",
      body: shotWin(58, 426, 964, SH + "mcp-fanout.png", 1248 / 832, { z: [1.5, "263px", "236px"] }) + hl(70, 664, 940, 80) + hl(70, 760, 940, 80),
      ann: `<text x="58" y="290" font-family="Inter" font-size="30" font-weight="700" fill="${PINK}">SCREEN PUSHED 1.5 INSIDE THE WINDOW</text>` + mk(1040, 704, 1) + mk(1040, 800, 2) },
    b: { k: "B", t: "16.9", cap: "work at the same time", act: "same",
      body: shotWin(58, 376, 964, SH + "mcp-fanout.png", 1248 / 832, { h: 424 }) + hl(139, 614, 844, 56) + hl(139, 678, 844, 56) +
        svg(ltube("M300 800 C300 870 258 870 258 940") + ltube("M780 800 C780 870 822 870 822 940") + lpulse("M300 800 C300 870 258 870 258 940", 0.3, 0.6) + lpulse("M780 800 C780 870 822 870 822 940", 0.3, 0.6) +
          stopwatch("sw", 540, 1090, 60)) +
        agentWin(58, 940, 400, 300, "Claude Code", "claude-code", 64) + agentWin(622, 940, 400, 300, "Codex", "codex", 64) +
        klab(540, 1290, "SAME TIME", "middle"),
      ann: mk(140, 870, 3) + mk(640, 1000, 4) },
    steps: [
      "Window morphs in showing the real prompt “fan them out to separate worktree agents”; the screen pushes 1.5× inside the window onto the tool calls (window frame stays put).",
      "On <i>different tasks</i> (15.28) trim boxes draw around <code>create_agent #412 claude</code> and <code>#417 codex</code>, one per row.",
      "On <i>work</i> (16.40) the push eases back out, the window shortens upward; lime tubes drop from each row into two agent windows (Claude Code / Codex).",
      "On <i>same time</i> (16.88) both progress bars fill in sync while one shared stopwatch sweeps between them.",
    ],
    out: "Carry: the two agent windows shrink and carry into the heads of the two branch rails.",
    assets: "site/mcp-fanout.png · logos: claude-code, codex",
  });
}

// 04 WORKTREE
{
  const trunk = "M120 470 H960";
  const b1 = "M300 470 C300 600 250 640 250 760", b2 = "M640 470 C640 600 800 640 800 760";
  const base = (lit) => svg(ntube(trunk) + (lit ? ltube(b1) + ltube(b2) : ntube(b1) + ntube(b2)) +
    [180, 300, 420, 540, 640, 760, 880].map((x) => `<circle cx="${x}" cy="470" r="14" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>`).join("") +
    workspace("w1", 250, 800, 1.3) + workspace("w2", 800, 800, 1.3)) +
    klab(120, 430, "MAIN") +
    plate("pa", 92, 1030, 316, "#412", "none") + plate("pb", 642, 1030, 316, "#417", "none") +
    `<img src="${LG}claude-code.svg" style="position:absolute;left:340px;top:1042px;width:44px;height:44px">` +
    `<img src="${LG}codex.svg" style="position:absolute;left:890px;top:1042px;width:44px;height:44px">`;
  scenes.push({
    n: "04", name: "GIT WORKTREES", t: "17.70 – 23.20", vo: "And with separate Git worktrees, they can work on different branches without stepping on each other's changes.",
    a: { k: "A", t: "19.0", cap: "separate Git worktrees", act: "worktrees",
      body: shift(80, base(false)),
      ann: marr("M140 600 H500") + mk(100, 600, 1) + mk(200, 720, 2) + mk(990, 1144, 3) },
    b: { k: "B", t: "22.5", cap: "stepping on each other's changes", act: "changes",
      body: shift(80, base(true) + svg(cubeAt(275, 600) + cubeAt(730, 640) +
        `<path d="M300 690 C450 640 600 640 740 690" fill="none" stroke="${T.dark}" stroke-width="4" stroke-dasharray="14 10"/>` +
        stag("x1", 520, 655, "x") + stag("c1", 250, 940, "check") + stag("c2", 800, 940, "check"))),
      ann: mk(560, 670, 4) + mk(130, 1020, 5) + marr("M240 640 Q252 720 255 800") },
    steps: [
      "<b>NEW: branch rails.</b> Carried agent windows become the heads; a MAIN rail with commit nodes trims on left → right.",
      "On <i>separate</i> (18.00) two branch rails fork off MAIN, each trimming down into an isolated worktree container (iso box) on <i>worktrees</i> (18.72).",
      "Containers get their real issue numbers #412 / #417 with the Claude / Codex badge on <i>different branches</i> (20.16).",
      "On <i>without stepping</i> (20.96) a dashed bridge tries to cross between the rails and gets an ✕ tag; it never connects.",
      "On <i>changes</i> (22.40) lime change cubes flow down each rail into its own container; a ✓ tag pops on each.",
    ],
    out: "Assembly exit: things leave top first (rails untrim, containers lift), then a clean cut.",
    assets: "drawn (kit workspace(), tubes, cubes, tags) · logos: claude-code, codex",
  });
}

// 05 HANDOFF
{
  const plan = (x, y, w, h, n = 5) => `<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${T.g500}">` +
    `<div style="position:absolute;left:20px;top:14px;font-size:26px;font-weight:600;letter-spacing:0.04em">PLAN</div>` +
    [0.86, 0.7, 0.78, 0.55, 0.66].slice(0, n).map((f, i) => `<div style="position:absolute;left:20px;top:${62 + i * 40}px;width:22px;height:22px;border:2px solid ${T.ink};background:${i < 3 ? T.lime : T.hi}"></div><div class="win-ph" style="left:58px;top:${66 + i * 40}px;width:${Math.round((w - 90) * f)}px;height:14px"></div>`).join("") + `</div>`;
  const code = (x, y, w, n) => [0.9, 0.6, 0.8, 0.45, 0.7, 0.85, 0.5].slice(0, n).map((f, i) => `<div class="win-ph lt" style="left:${x + (i % 3 === 1 ? 28 : 0)}px;top:${y + i * 34}px;width:${Math.round(w * f)}px;height:16px"></div>`).join("");
  const arc = "M290 650 C290 820 420 860 560 860";
  scenes.push({
    n: "05", name: "PLAN → HANDOFF → BUILD", t: "23.20 – 27.85", vo: "You can even have Claude plan a feature, then hand that plan over to Codex to build it.",
    a: { k: "A", t: "24.9", cap: "have Claude plan a feature", act: "feature",
      body: agentWin(58, 420, 964, 560, "Claude Code", "claude-code", 80, { lines: [0.4], extra: plan(96, 120, 560, 280) + code(700, 140, 230, 7) }) +
        svg(lead("l5", [[620, 1040], [380, 1040], [380, 1000]])) + klab(640, 1050, "PLAN"),
      ann: mk(58, 390, 1) + mk(820, 1040, 2) + marr("M128 560 V700") },
    b: { k: "B", t: "27.4", cap: "over to Codex to build it", act: "build",
      body: `<div style="position:absolute;inset:0;opacity:0.45">` + agentWin(58, 340, 460, 310, "Claude Code", "claude-code", 100, { lines: [0.6, 0.4] }) + `</div>` +
        svg(ltube(arc) + lpulse(arc, 0.55, 0.85)) +
        agentWin(400, 760, 622, 520, "Codex", "codex", 62, { lines: [0.4], extra: plan(36, 120, 250, 300, 5) + code(310, 130, 280, 7) }) +
        `<div class="plate" style="left:500px;top:500px;width:430px;text-transform:none;letter-spacing:0">/paseo-handoff</div>`,
      ann: marr("M240 560 C200 760 300 900 420 960") + mk(560, 470, 3) + mk(1000, 1250, 4) },
    steps: [
      "The Claude Code window fills the field; on <i>plan</i> (24.40) a PLAN card types in and its rows tick ✓ one by one on <i>feature</i> (24.80).",
      "Leader label PLAN trims on to the card.",
      "On <i>hand that plan over</i> (25.60 – 26.24) the Claude window shrinks to the corner and dims; the PLAN card lifts and rides a lime handoff tube (E.ramp, motion blur only while it moves) down into the Codex window that opens on <i>Codex</i> (26.56). The real skill name <code>/paseo-handoff</code> types into a plate beside the arc (README Skills).",
      "On <i>build</i> (27.36) code lines write into Codex next to the plan and its progress bar fills.",
    ],
    out: "Codex window morph frame grows into the Paseo desktop window of scene 6.",
    assets: "drawn windows · logos: claude-code, codex · /paseo-handoff (README)",
  });
}

// 06 PHONE
{
  const desk = shotWin(230, 446, 620, SH + "desk-build.png", 2432 / 1396);
  const PW = 210, PH = Math.round(PW * 2120 / 992);
  const inS = 592 / 892, lens = `<div style="position:absolute;left:430px;top:960px;width:592px;height:${Math.round(254 * inS)}px;overflow:hidden;outline:2.5px solid ${T.ink};outline-offset:-1.25px">` +
    `<img src="${SH}phone-drawer.png" style="position:absolute;width:${Math.round(992 * inS)}px;left:${-Math.round(50 * inS)}px;top:${-Math.round(1272 * inS)}px"></div>`;
  scenes.push({
    n: "06", name: "THE BEST PART: YOUR PHONE", t: "27.85 – 35.10", vo: "The best part? Your agents run on your own machine, but you can check their progress and manage them from your phone, even when you're away.",
    a: { k: "A", t: "31.9", cap: "check their progress", act: "progress",
      body: desk + klab(230, 384, "YOUR MACHINE") +
        svg(ltube("M540 810 C540 860 225 800 225 856") + lpulse("M540 810 C540 860 225 800 225 856", 0.5, 0.8) +
          lead("l6", [[330, 1145], [400, 1060], [424, 1060]])) +
        shot(120, 856, PW, SH + "phone-drawer.png", 992 / 2120) + hl(122, 1112, 206, 66) + lens + klab(430, 1200, "PROGRESS"),
      ann: mk(860, 420, 1) + mk(80, 820, 2) + mk(1000, 940, 3) },
    b: { k: "B", t: "34.5", cap: "even when you're away", act: "away",
      body: desk + klab(230, 384, "YOUR MACHINE") +
        svg(ltube("M540 810 C540 880 895 790 895 856") + lpulse("M540 810 C540 880 895 790 895 856", 0.55, 0.8) +
          `<path d="M232 1140 H780 M232 1120 V1160 M780 1120 V1160" stroke="${T.ink}" stroke-width="2.5" fill="none"/>`) +
        shot(790, 856, PW, SH + "phone-chat.png", 992 / 2120) + klab(506, 1090, "AWAY FROM/YOUR DESK", "middle").replace("top:1061px", "top:1025px"),
      ann: marr("M330 1300 H760") + mk(300, 1300, 4) + mk(506, 1220, 5) },
    steps: [
      "Codex frame grows into the real desktop window; label YOUR MACHINE trims on with <i>machine</i> (30.24). Agents stay on your machine.",
      "On <i>check</i> (31.28) a lime tube runs from the machine down to the real phone app (sessions list), pulses running.",
      "<b>NEW: detail lens.</b> On <i>progress</i> (31.76) a lime lens box lands on the phone's “Working” rows and a leader pulls out a magnified inset of the real rows (Fix commit safe area… 4m · Improve editor typing latency 18m).",
      "On <i>manage · phone</i> (32.40 – 33.36) the lens retracts and the phone screen swaps to the agent chat; on <i>even · away</i> (33.84 – 34.48) the phone slides right, the tube stretches but keeps pulsing.",
      "<b>NEW: stretch tether + dimension line.</b> A dimension line draws between desk and phone: AWAY FROM / YOUR DESK.",
    ],
    out: "Phone outline morph frame grows into the wide interface window of scene 7.",
    assets: "site/desk-build.png · site/phone-drawer.png · site/phone-chat.png",
  });
}

// 07 WORKFLOW
{
  const grid4 = (n) => [["EDITOR", 58, 1030], ["TERMINAL", 552, 1030], ["CODE DIFFS", 58, 1120], ["PULL REQUESTS", 552, 1120]]
    .map(([t, x, y], i) => plate("q" + i, x, y, 470, t, i < n ? "check" : "none")).join("");
  scenes.push({
    n: "07", name: "EVERYTHING ELSE", t: "35.10 – 40.80", vo: "Plus, you get a built-in editor, terminal, code diffs, and pull request tools, all in one interface.",
    a: { k: "A", t: "37.6", cap: "terminal, code diffs", act: "diffs",
      body: shotWin(58, 426, 964, SH + "desk-review.png", 2432 / 1396, { z: [1.6, "44%", "30%"] }) + grid4(3),
      ann: mk(1000, 420, 1) + mk(1040, 1240, 2) },
    b: { k: "B", t: "40.1", cap: "all in one interface", act: "interface",
      body: shotWin(58, 426, 964, SH + "desk-ship.png", 2432 / 1396) +
        hl(66, 434, 170, 540) + hl(244, 434, 488, 540) + hl(740, 434, 274, 540) + grid4(4),
      ann: mk(150, 700, 3) + mk(490, 700, 4) + mk(876, 700, 5) },
    steps: [
      "One window, the screen changes on each word (camera push inside the window, ≤1.6): <i>editor</i> 36.24 → your editor shot · <i>terminal</i> 36.72 → <code>paseo run / paseo ls</code> · <i>code diffs</i> 37.20 → zoom into the real Diff pane · <i>pull request</i> 38.16 → zoom into “All checks have passed”.",
      "A 2×2 checklist under it ticks ✓ on the same words.",
      "On <i>all</i> (39.36) the zoom pulls out to the whole app; trim boxes draw around sidebar …",
      "… agent chat …",
      "… and PR panel on <i>one interface</i> (39.76 – 40.00). All in one window.",
    ],
    out: "Window morph frame shrinks into the first trust plate.",
    assets: "site/app-editor.png → cli-run.png → desk-review.png → desk-ship.png",
    strip: [["site/app-editor.png", "editor"], ["site/cli-run.png", "terminal"], ["site/desk-review.png", "code diffs"], ["site/desk-ship.png", "pull request"]],
  });
}

// 08 CTA
{
  const RW = 959, RH = Math.round(RW * 1300 / 2560), urlTop = 370 + RH + 5 + 48;
  scenes.push({
    n: "08", name: "TRUST + CTA", t: "40.80 – 51.78", vo: "No forced logins, no tracking, and completely open source. That's Paseo. Check out the GitHub repo, and follow for more useful developer tools.",
    a: { k: "A", t: "45.0", cap: "That's Paseo.", act: "Paseo.",
      body: plate("t1", 290, 400, 500, "NO FORCED LOGINS", "x") + plate("t2", 290, 490, 500, "NO TRACKING", "x") + plate("t3", 290, 580, 500, "OPEN SOURCE", "check") +
        logoTile(440, 760, 200, "paseo-logo-ink", 0.2) + klab(540, 1030, "PASEO", "middle"),
      ann: mk(240, 434, 1) + mk(240, 614, 2) + mk(400, 780, 3) },
    b: { k: "B", t: "49.6", cap: "useful developer tools", act: "tools",
      body: shot(58, 370, 964, "../assets/shots/repo-header.png", 2560 / 1300) +
        `<div class="ctr" style="top:${urlTop}px"><div class="url">github.com/getpaseo/paseo</div></div>` +
        `<div class="ctr" style="top:${urlTop + 102}px"><div class="ftxt">Follow for more <span class="hl"><i></i><b>useful tools</b></span></div></div>` +
        `<div class="btn" style="left:330px;top:${urlTop + 214}px"><div class="bst on">FOLLOWING <svg width="34" height="26" viewBox="0 0 34 26"><path d="M3 13 L12 22 L31 3" fill="none" stroke="${T.hi}" stroke-width="4.5"/></svg></div></div>` +
        `<svg class="art" viewBox="0 0 1080 1920"><g transform="translate(700 ${urlTop + 270})">${POINTER}</g></svg>`,
      ann: mk(1000, 400, 4) + mk(200, urlTop + 30, 5) + mk(800, urlTop + 330, 6) },
    steps: [
      "Interface frame shrinks into the trust plates: NO FORCED LOGINS ✕ on <i>logins</i> (41.44), NO TRACKING ✕ on <i>tracking</i> (42.32) …",
      "… OPEN SOURCE ✓ on <i>source</i> (44.00).",
      "Plates clear; the Paseo logo tile lands on <i>Paseo</i> (44.96) with the PASEO label.",
      "On <i>GitHub repo</i> (46.40) the logo tile grows into the real repo header (morph frame, 964 wide).",
      "URL plate github.com/getpaseo/paseo, then “Follow for more useful tools” with the lime underline wiping on <i>useful</i> (48.32).",
      "Cursor glides in, clicks Follow → FOLLOWING ✓ on <i>tools</i> (49.28). Hold to the end.",
    ],
    out: "End (2 s tail).",
    assets: "repo-header.png · logos: paseo-logo-ink",
  });
}

SB.write(__dirname, {
  name: "PASEO",
  meta: "51.78 s · 1080×1920 · v3 identity · v4 motion · 8 scenes · two key frames each, drawn at real coordinates with the real assets · captions show the word that is lit at that frame",
  chainTitle: "TRANSITION CHAIN (every cut is a match cut except 04 → 05)",
  chain: [["01", "phone → logo tile"], ["02", "app window → MCP window"], ["03", "agent windows carry → branch heads"], ["04", "assembly exit"],
    ["05", "Codex window → desktop window"], ["06", "phone → interface window"], ["07", "window → trust plate"], ["08", "logo → repo header → Follow"]],
  news: [
    ["Detail lens", "lens box + leader + magnified inset of a real screenshot region (06)"],
    ["Branch rails", "git-graph trunk that forks into isolated worktree containers (04)"],
    ["Converge-into-window", "logo tiles funnel down lime tubes into a window (02)"],
    ["Stretch tether + dimension line", "a live tube that stretches as a device moves away (06)"],
    ["Screen-per-word push", "one window, zoom-in to a different real screen on each word (07)"],
  ],
  scenes,
});
