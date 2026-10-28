// build: "Then it plans the architecture, recreates the design, builds the frontend, and connects the backend."
// Hold cut from study: the session and replica/recon.md, unmoved. The session clears and recon.md's card grows open
// into the build window (an svg chrome that grows, with its layer unclipping), with a tab strip (Architecture,
// Design, Frontend, Backend) whose acid-lime indicator slides to each tab on its word while the panes push through:
// the schema (users, event types, availability, bookings, with the no-double-booking constraint) on the README's
// stack; the design tokens; the booking page rebuilt part by part next to its screen list; the backend's services
// connecting one by one. features.csv fills underneath. The window empties to its frame (H5).
// All app UI follows InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, s) => {
  const { klabel, morphCode } = L;
  const S = require("./_study.cjs")(L, s.p), U = S.U, C = U.C, P = require("./_plan.cjs"), h = P.H.h5;
  const p = s.p, r2 = L.r2, at = s.at;
  const RC = P.R.recon, BW = P.R.build, VW = BW[2], TOP = 104, VH = BW[3] - TOP;
  const tArch = at("architecture"), tDes = at("design"), tBuilds = at("builds"),
    tFront = at("frontend"), tConn = at("connects"), tBack = at("backend");
  // tabs
  const tabs = [["Architecture", 30, 146], ["Design", 222, 78], ["Frontend", 346, 102], ["Backend", 494, 96]];
  const UW = 64, ux = (i) => tabs[i][1] + tabs[i][2] / 2 - UW / 2;
  const tabHtml = U.box(`${p}-tb`, 0, 48, VW, 56, `border-bottom:1.5px solid ${C.graphite};`,
    tabs.map(([t, x], i) => U.tx(`${p}-tt${i}`, x, 15, t, { fs: 22, fw: 510, c: i ? C.fog : C.paper })).join("") +
    U.box(`${p}-ti`, ux(0), 52, UW, 3, `background:${C.lime};border-radius:2px;`));
  // pane 1: architecture (the README's stack and data model)
  const table = (id, x, y, name, fields) => U.card(id, x, y, 400, 46 + fields.length * 30 + 12,
    U.box("", 0, 0, 400, 44, `border-bottom:1.5px solid ${C.graphite};`, U.tx("", 18, 10, name, { fs: 20, mono: true, c: C.paper }) + U.badge("", 400 - 18 - U.badgeW("table", 17), 7, "table", "neutral", { fs: 17, h: 30 })) +
    fields.map((f, k) => U.tx("", 18, 54 + k * 30, f, { fs: 18, mono: true, c: C.mist })).join(""));
  const tbls = [
    [`${p}-db0`, 30, 70, "users", ["id", "email", "name"]],
    [`${p}-db1`, 528, 70, "event_types", ["id", "user_id", "title", "minutes"]],
    [`${p}-db2`, 30, 276, "availability", ["id", "user_id", "weekday", "start, end"]],
    [`${p}-db3`, 528, 276, "bookings", ["id", "event_type_id", "guest_email", "starts_at"]],
  ];
  const rel = (id, d) => `<path id="${id}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${d}" fill="none" stroke="${C.fog}" stroke-width="2"/>`;
  const stack = ["Next.js", "Postgres", "Stripe", "Resend"];
  let sx = 110;
  const pane1 = U.box(`${p}-q0`, 0, TOP, VW, VH, "",
    U.tx("", 30, 22, "Stack", { fs: 20, fw: 510, c: C.fog }) +
    stack.map((t, i) => { const c = U.pill(`${p}-sk${i}`, sx, 14, t); sx += U.pillW(t) + 10; return c; }).join("") +
    tbls.map((a) => table(...a)).join("") +
    `<svg width="${VW}" height="${VH}" viewBox="0 0 ${VW} ${VH}" style="position:absolute;left:0;top:0">` +
    rel(`${p}-rl0`, "M430 140 H528") + rel(`${p}-rl1`, "M230 228 V276") + rel(`${p}-rl2`, "M728 258 V276") + `</svg>` +
    U.box(`${p}-uq`, 528, 482, 420, 34, "", U.status("", 0, 3, "done", 26) + U.tx("", 38, 4, "unique (event_type_id, starts_at)", { fs: 18, mono: true, c: C.mist })));
  // pane 2: design tokens
  const sw = [["Canvas", C.void], ["Surface", C.obsidian], ["Text", C.mist], ["Heading", C.paper], ["Action", C.lime]];
  const pane2 = U.box(`${p}-q1`, 0, TOP, VW, VH, "",
    U.tx("", 30, 22, "Colour roles", { fs: 20, fw: 510, c: C.fog }) +
    sw.map(([n, c], i) => U.box(`${p}-sw${i}`, 30 + i * 150, 62, 120, 110, "",
      U.box("", 0, 0, 120, 72, `background:${c};border-radius:${U.R.btn}px;${U.hair(C.smoke)}`) + U.tx("", 0, 82, n, { fs: 19, fw: 510 }))).join("") +
    U.tx("", 30, 206, "Type scale", { fs: 20, fw: 510, c: C.fog }) +
    [[64, "Heading", 510], [46, "Title", 400], [30, "Body", 400]].map(([f, n, w], i) => U.box(`${p}-ty${i}`, 30 + i * 200, 240, 190, 116, "",
      U.tx("", 0, 0, "Aa", { fs: f, fw: w, c: C.paper }) + U.tx("", 0, 86, n, { fs: 19, c: C.fog }))).join("") +
    U.tx("", 640, 206, "Spacing", { fs: 20, fw: 510, c: C.fog }) +
    U.box(`${p}-sp`, 640, 248, 300, 100, "", [8, 16, 24, 32].map((v, i) => U.box("", i * 64, 40 - v / 2, v, v, `background:${C.graphite};border-radius:4px;${U.hair(C.smoke)}`) +
      U.tx("", i * 64, 72, String(v), { fs: 18, mono: true, c: C.fog })).join("")) +
    U.tx("", 30, 392, "Components", { fs: 20, fw: 510, c: C.fog }) +
    U.box(`${p}-cp0`, 30, 432, 200, 110, "", U.box("", 0, 0, 44, 44, `background:${C.bone};border-radius:${U.R.btn}px;`, U.tx("", 0, 9, "15", { fs: 21, fw: 590, c: C.void, w: 44, align: "center" })) +
      U.tx("", 0, 62, "Date picker", { fs: 19, fw: 510 })) +
    U.box(`${p}-cp1`, 250, 432, 220, 110, "", U.btn("", 0, 0, 122, 46, "9:30", "ghost", 21) + U.tx("", 0, 62, "Slot button", { fs: 19, fw: 510 })));
  // pane 3: the frontend, rebuilt screen by screen
  const bk = U.booking(`${p}-bk`, 440, 0);
  const scr = ["App shell", "Booking flow", "Every screen + states"];
  const pane3 = U.box(`${p}-q2`, 0, TOP, VW, VH, "",
    U.tx("", 30, 22, "Screens", { fs: 20, fw: 510, c: C.fog }) +
    scr.map((t, i) => U.card(`${p}-sr${i}`, 30, 66 + i * 64, 410, 52, U.status(`${p}-st${i}`, 16, 12, "done", 28) + U.tx("", 56, 13, t, { fs: 21, fw: 510 }), { r: U.R.btn })).join("") +
    U.card(`${p}-bf`, 486, 14, 440, bk.h + 16, bk.html + U.wireSvg(`${p}-w`, 440, bk.h + 16, bk.rects)));
  // pane 4: backend services (README: sign up, Google Calendar, Stripe, reminder emails)
  const svc = [["Auth", "Sign up and log in"], ["Database", "Postgres"], ["Payments", "Stripe, for paid bookings"], ["Calendar", "Google Calendar, your keys"], ["Email", "Reminder emails"]];
  const bw = U.badgeW("Connected", 19, true);
  const pane4 = U.box(`${p}-q3`, 0, TOP, VW, VH, "",
    svc.map(([n, d], i) => U.card(`${p}-sv${i}`, 30, 22 + i * 104, VW - 60, 88,
      U.tx("", 22, 14, n, { fs: 23, fw: 510, c: C.paper }) + U.tx("", 22, 48, d, { fs: 19, c: C.fog }) +
      U.badge(`${p}-ok${i}`, VW - 60 - 22 - bw, 27, "Connected", "green"))).join(""));
  // the build window: recon.md's card (same frame) as an svg chrome under a bare layer at the build window's size
  const html = S.term + U.chrome(`${p}-ch`, RC) +
    U.win(`${p}-bw`, ...BW, `<span id="${p}-tl">replica/recon.md</span><span id="${p}-tl2" style="opacity:0;position:absolute;left:0;right:0">replica</span>`,
      `<div id="${p}-rcx" class="wc">${S.reconInner}</div>` + tabHtml +
      `<div id="${p}-vp" style="position:absolute;left:0;top:0;width:${VW}px;height:${BW[3]}px;overflow:hidden">${pane1 + pane2 + pane3 + pane4}</div>`,
      { bare: true }) +
    klabel(`${p}-fl`, 58, 1150, ["FEATURES.CSV"]) +
    `<div id="${p}-pb" class="pbar" style="left:400px;top:1122px;width:622px;height:36px"><div id="${p}-pf" class="pfill"></div></div>`;
  const tGrow = 0.42, gDur = 0.55, tTabs = r2(tGrow + gDur - 0.2), DY = RC[1] - BW[1], CB = BW[3] - RC[3];
  const slideTab = (i, t) => `tl.fromTo("#${p}-ti", { x: ${r2(ux(i - 1) - ux(0))} }, { x: ${r2(ux(i) - ux(0))}, duration: 0.45, ease: E.inOut, immediateRender: false }, ${r2(t)});` +
    ` tl.set("#${p}-tt${i - 1}", { color: "${C.fog}" }, ${r2(t + 0.2)}); tl.set("#${p}-tt${i}", { color: "${C.paper}" }, ${r2(t + 0.2)});`;
  const push = (a, b, t) => L.pushScreens(`${p}-q${a}`, `${p}-q${b}`, VW, t, 0.55);
  const tX = r2(h.at - 0.3);
  const anim = `
      // hold: the session leaves, recon.md's card grows open into the build window
      gsap.set(q("#${p}-q1, #${p}-q2, #${p}-q3"), { x: ${VW} }); gsap.set("#${p}-q0", { x: 0 });
      wipeOut("#${p}-st", 0.22, 0.28);
      wipeOut("#${p}-rcx", ${r2(tGrow - 0.1)}, 0.3);
      ${U.grow(`${p}-ch`, RC, BW, tGrow, gDur)}
      tl.fromTo("#${p}-bw", { y: ${DY}, clipPath: "inset(0px 0px ${CB}px 0px round 12px)" }, { y: 0, clipPath: "inset(0px 0px 0px 0px round 12px)", duration: ${gDur}, ease: E.inOut }, ${tGrow});
      tl.set("#${p}-tl", { opacity: 0 }, ${r2(tGrow + 0.2)}); tl.set("#${p}-tl2", { opacity: 1 }, ${r2(tGrow + 0.2)});
      wipeIn("#${p}-tb", ${tTabs}, 0.4);
      wipeIn("#${p}-q0", ${r2(tArch - 0.36)}, 0.4);
      // architecture: the stack, the tables, their relations, the constraint
      tl.fromTo(q("${stack.map((_, i) => `#${p}-sk${i}`).join(", ")}"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", stagger: 0.06 }, ${r2(tArch - 0.24)});
      wipeIn(q("${tbls.map((t) => "#" + t[0]).join(", ")}"), ${r2(tArch - 0.08)}, 0.4, 0.08);
      draw(q("#${p}-rl0, #${p}-rl1, #${p}-rl2"), ${r2(tArch + 0.3)}, 0.3);
      wipeIn("#${p}-uq", ${r2(tArch + 0.42)}, 0.36);
      // design
      ${push(0, 1, r2(tDes - 0.5))} ${slideTab(1, r2(tDes - 0.5))}
      tl.fromTo(q("${sw.map((_, i) => `#${p}-sw${i}`).join(", ")}"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", stagger: 0.05 }, ${r2(tDes - 0.04)});
      wipeIn(q("#${p}-ty0, #${p}-ty1, #${p}-ty2, #${p}-sp, #${p}-cp0, #${p}-cp1"), ${r2(tDes + 0.1)}, 0.32, 0.05);
      // frontend: the screens tick, the booking page rebuilds part by part
      ${push(1, 2, r2(tBuilds - 0.12))} ${slideTab(2, r2(tBuilds - 0.12))}
      ${U.rebuild(`${p}-w`, bk.parts, bk.parts.length, r2(tFront - 0.34), 0.07)}
      wipeIn(q("#${p}-sr0, #${p}-sr1, #${p}-sr2"), ${r2(tFront - 0.2)}, 0.3, 0.1);
      ${[0, 1, 2].map((i) => `pop("#${p}-st${i}", ${r2(tFront + 0.1 + i * 0.12)});`).join(" ")}
      kin("#${p}-fl", ${r2(tBuilds)}, 0.05, 0.5); wipeIn("#${p}-pb", ${r2(tBuilds)}, 0.4);
      gsap.set("#${p}-pf", { scaleX: 0 });
      tl.fromTo("#${p}-pf", { scaleX: 0 }, { scaleX: 1, duration: ${r2(tBack - tFront)}, ease: E.inOut, immediateRender: false }, ${r2(tFront)});
      // backend: each service connects
      ${push(2, 3, r2(tConn - 0.3))} ${slideTab(3, r2(tConn - 0.3))}
      wipeIn(q("${svc.map((_, i) => `#${p}-sv${i}`).join(", ")}"), ${r2(tConn - 0.05)}, 0.32, 0.05);
      tl.fromTo(q("${svc.map((_, i) => `#${p}-ok${i}`).join(", ")}"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: E.out, transformOrigin: "50% 50%", stagger: 0.07 }, ${r2(tConn + 0.2)});
      // clear for the cut
      kout("#${p}-fl", ${tX}); wipeOut("#${p}-pb", ${tX}, 0.24);
      wipeOut("#${p}-bw-c", ${r2(h.at - 0.18)}, 0.18);
      tl.set(q("#${p}-bw, #${p}-ch"), { opacity: 0 }, ${h.at});${morphCode(`${p}-mf`, h, "out", h.at)}`;
  const boxes = [
    { id: "term", r: P.R.studyTerm, t: [0, 0.5] },
    { id: "win", r: BW, t: [tGrow + gDur, h.at] },
    { id: "fl", r: [58, 1120, 260, 40], t: [tBuilds, tX] }, { id: "pb", r: [400, 1122, 622, 36], t: [tBuilds, tX] },
  ];
  return { lift: P.lift.build, cam: P.cam("build"), fade: false, html, svg: "", over: U.mframeL(`${p}-mf`), anim, boxes };
};
