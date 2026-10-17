// Scenes 4 (pick), 6 (check), 7 (useful), 8 (cta). Loaded by build-scenes.cjs, which passes its helpers in.
module.exports = function (H) {
  const { fs, path, OUT, T, make, r1, nsv, label, lead, dtube, cube, bpath, samples, adapter, router, phone, laptop, appWin, plate, stag, tagInner, scene } = H;

  // ---------- objects ----------
  function ethBox(id, ox, oy, s = 1) {
    const m = make(ox, oy), w = 160 * s, d = 90 * s, h = 52 * s;
    let g = m.box(0, 0, 0, w, d, h, { top: T.g100, left: T.g300, right: T.g500 });
    const port = (x) => {
      const y = 12 * s, pw = 40 * s, ph = 26 * s;
      return `<path d="M${r1(x)} ${r1(y)} h${r1(pw)} v${r1(ph * 0.7)} h${r1(-pw * 0.2)} v${r1(ph * 0.3)} h${r1(-pw * 0.6)} v${r1(-ph * 0.3)} h${r1(-pw * 0.2)} z" fill="${T.g900}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`;
    };
    g += `<g transform="${m.yFace(0, d, 0, w, h)}">${port(22 * s)}${port(76 * s)}` +
      `<circle cx="${r1(w - 18 * s)}" cy="${r1(h / 2)}" r="${r1(5 * s)}" fill="${T.lime}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/></g>`;
    g += `<g transform="${m.xFace(w, 0, 0, d, h)}">` +
      [0, 1, 2].map((i) => `<line x1="${r1(22 * s + i * 16 * s)}" y1="${r1(14 * s)}" x2="${r1(22 * s + i * 16 * s)}" y2="${r1(h - 14 * s)}" stroke="${T.ink}" stroke-width="1.75" ${nsv}/>`).join("") + `</g>`;
    return `<g id="${id}">${g}</g>`;
  }
  // flat frontal stopwatch; a lime pie (thick dashed stroke) sweeps clockwise under the hand
  function stopwatch(id, cx, cy, r) {
    const pr = r * 0.42;
    let g = `<rect x="${cx - 14}" y="${cy - r - 22}" width="28" height="16" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/>` +
      `<rect x="${cx - 5}" y="${cy - r - 8}" width="10" height="10" fill="${T.g500}" stroke="${T.ink}" stroke-width="2"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>` +
      `<circle id="${id}-pie" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" cx="${cx}" cy="${cy}" r="${r1(pr)}" fill="none" stroke="${T.lime}" stroke-width="${r1(pr * 2)}" transform="rotate(-90 ${cx} ${cy})"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r1(pr * 2)}" fill="none" stroke="${T.ink}" stroke-width="1.75"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, r0 = r - (i % 3 ? 8 : 14);
      g += `<line x1="${r1(cx + Math.sin(a) * r0)}" y1="${r1(cy - Math.cos(a) * r0)}" x2="${r1(cx + Math.sin(a) * (r - 3))}" y2="${r1(cy - Math.cos(a) * (r - 3))}" stroke="${T.ink}" stroke-width="2" stroke-linecap="round"/>`;
    }
    g += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r1(cy - pr * 2)}" stroke="${T.ink}" stroke-width="1.75"/>` +
      `<g id="${id}-hand"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r1(cy - pr * 2)}" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/></g>` +
      `<circle cx="${cx}" cy="${cy}" r="7" fill="${T.ink}"/>`;
    return `<g id="${id}">${g}</g>`;
  }
  // spec-sheet gauge: n of 10 cells lime (spare speed), the rest light grey
  const gauge = (id, x, y, n) =>
    `<g id="${id}">` + Array.from({ length: 10 }, (_, i) =>
      `<rect id="${id}-c${i}" x="${x + i * 26}" y="${y}" width="22" height="30" fill="${i < n ? T.lime : T.g100}" stroke="${T.ink}" stroke-width="2"/>`).join("") + `</g>`;
  // 68px flat icon tiles for the use-case checklist
  const ICONS = {
    speed: `<path d="M14 46 A20 20 0 0 1 54 46" fill="none" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/><line x1="34" y1="46" x2="45" y2="30" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round"/><circle cx="34" cy="46" r="4.5" fill="${T.ink}"/>`,
    video: `<rect x="12" y="19" width="44" height="30" rx="7" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><polygon points="29,26 29,42 42,34" fill="${T.ink}"/>`,
    game: `<rect x="9" y="24" width="50" height="24" rx="11" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5"/><path d="M22 30 V42 M16 36 H28" stroke="${T.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="33" r="3.2" fill="${T.ink}"/><circle cx="49" cy="39" r="3.2" fill="${T.ink}"/>`,
    magnet: `<path d="M20 16 V34 A14 14 0 0 0 48 34 V16" fill="none" stroke="${T.ink}" stroke-width="13"/><path d="M20 16 V34 A14 14 0 0 0 48 34 V16" fill="none" stroke="${T.g300}" stroke-width="8"/><rect x="13.5" y="12" width="13" height="10" fill="${T.hi}" stroke="${T.ink}" stroke-width="2"/><rect x="41.5" y="12" width="13" height="10" fill="${T.hi}" stroke="${T.ink}" stroke-width="2"/>`,
    download: `<polygon points="28,12 40,12 40,28 48,28 34,42 20,28 28,28" fill="${T.g300}" stroke="${T.ink}" stroke-width="2.5" stroke-linejoin="round"/><polyline points="14,42 14,54 54,54 54,42" fill="none" stroke="${T.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  const icoTile = (k) =>
    `<svg class="ico" width="68" height="68" viewBox="0 0 68 68"><rect x="1.25" y="1.25" width="65.5" height="65.5" fill="${T.hi}" stroke="${T.ink}" stroke-width="2.5"/>${ICONS[k]}</svg>`;
  const POINTER = `<path d="M3 3 L3 50 L15 39 L24 58 L33 54 L24 35 L41 35 Z" fill="${T.ink}" stroke="${T.on}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const ph = (x, y, w, h, lt) => `<div class="win-ph${lt ? " lt" : ""}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
  const js = (o) => JSON.stringify(o);

  // ===== Scene 4: pick =====
  {
    const inT = [[540, 482], [540, 540], [540, 600], [540, 660]];
    const brL = [[470, 740], [400, 820], [250, 860], [235, 985]];
    const brR = [[644, 760], [740, 790], [850, 840], [856, 950]];
    let cubes = "";
    for (let k = 0; k < 3; k++) cubes += cube(`f04-q${k}`);
    const html = appWin("f04-win", 390, 330, 300, 150, "Browser", ph(18, 64, 262, 28) + ph(18, 102, 78, 30, 1) + ph(110, 102, 78, 30, 1) + ph(202, 102, 78, 30, 1));
    const svg =
      dtube("f04-tin", bpath(inT), { w: 10, fill: T.lime }) +
      dtube("f04-tl", bpath(brL), { w: 10, fill: T.paper }) +
      dtube("f04-tr", bpath(brR), { w: 10, fill: T.paper }) +
      dtube("f04-hl", bpath(brL), { w: 10, fill: T.lime }) +
      dtube("f04-hr", bpath(brR), { w: 10, fill: T.lime }) +
      cubes +
      adapter("f04-adapter", 505, 600) +
      router("f04-router", 200, 980, 0.9) +
      phone("f04-phone", 820, 1040, 0.8) +
      gauge("f04-gl", 97, 1135, 4) + gauge("f04-gr", 726, 1135, 9) +
      label("f04-sp", 541, 1161, ["SPARE SPEED"], { a: "middle" }) +
      label("f04-c1", 227, 1222, ["WI-FI"], { a: "middle" }) +
      label("f04-c2", 856, 1222, ["PHONE"], { a: "middle" }) +
      stag("f04-kl", 227, 1270) + stag("f04-kr", 856, 1270) +
      label("f04-lb", 58, 420, ["NEW", "CONNECTION"]) + lead("f04-ld", [[76, 472], [76, 560], [515, 560]]);
    const anim = `
      const IN = ${js(samples(inT, 0, 1, 8))}, L = ${js(samples(brL, 0, 0.97, 12))}, R = ${js(samples(brR, 0, 0.97, 12))};
      const send = (k, out, at) => { flow("#f04-q" + k, IN.concat(out), at, 0.9, 0); tl.to("#f04-q" + k, { opacity: 0, duration: 0.1 }, at + 0.86); };
      tl.fromTo("#f04-win", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.1);
      slide("#f04-adapter", 0.25, 0, -60);
      fadeUp("#f04-lb", 0.35); lead("f04-ld", 0.4);
      slide("#f04-router", 0.45); slide("#f04-phone", 0.55, -40, -23);
      draw(q("#f04-tin path"), 0.55, 0.4);
      draw(q("#f04-tl path, #f04-tr path"), 0.7, 0.45);
      tl.fromTo(q("#f04-gl rect, #f04-gr rect"), { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: 0.015 }, 0.75);
      fadeUp("#f04-c1", 0.8); fadeUp("#f04-c2", 0.85); fadeUp("#f04-sp", 0.95);
      gsap.set(q("#f04-hl path, #f04-hr path"), { opacity: 0 });
      gsap.set(q("#f04-kl, #f04-kr"), { opacity: 0 });
      // connection 1: the phone has more spare speed
      send(0, R, 1.0);
      pop("#f04-kr", 1.3); draw(q("#f04-hr path"), 1.35, 0.4);
      tl.to(q("#f04-gr-c8, #f04-gr-c7, #f04-gr-c6, #f04-gr-c5, #f04-gr-c4, #f04-gr-c3"), { attr: { fill: "${T.g100}" }, duration: 0.12, stagger: 0.04 }, 1.9);
      tl.to(q("#f04-kr, #f04-hr"), { opacity: 0, duration: 0.2 }, 2.05);
      // connections 2 and 3: now Wi-Fi has more to give
      send(1, L, 2.05);
      pop("#f04-kl", 2.35); draw(q("#f04-hl path"), 2.4, 0.4);
      send(2, L, 2.8);`;
    fs.writeFileSync(path.join(OUT, "04-pick.html"), scene({ id: "04-pick", p: "f04", dur: 4.01, lift: 0, svg, html, anim }));
  }

  // ===== Scene 6: check =====
  {
    const T3 = [
      [[427, 515], [427, 700], [176, 700], [176, 905]],
      [[540, 580], [540, 700], [530, 780], [530, 905]],
      [[652, 555], [760, 620], [876, 640], [876, 830]],
    ];
    let cubes = "";
    for (let t = 0; t < 3; t++) for (let k = 0; k < 3; k++) cubes += cube(`f06-p${t}${k}`);
    const svg =
      T3.map((p, i) => dtube(`f06-t${i}`, bpath(p), { w: 10, fill: T.paper })).join("") +
      T3.map((p, i) => dtube(`f06-h${i}`, bpath(p), { w: 10, fill: T.lime })).join("") +
      cubes +
      adapter("f06-adapter", 505, 400) +
      router("f06-router", 150, 930, 0.85) +
      ethBox("f06-eth", 500, 930) +
      phone("f06-phone", 840, 975, 0.8) +
      stopwatch("f06-sw", 900, 470, 72) +
      label("f06-sl", 900, 600, ["EVERY 5 S"], { a: "middle" }) +
      label("f06-lb", 58, 380, ["VIRTUAL", "ADAPTER"]) + lead("f06-ld", [[76, 432], [76, 470], [356, 470]]) +
      stag("f06-k0", 176, 1110) + stag("f06-x0", 176, 1110, "x") + stag("f06-k1", 530, 1110) + stag("f06-k2", 876, 1110) +
      label("f06-c0", 176, 1180, ["WI-FI"], { a: "middle" }) +
      label("f06-c1", 530, 1180, ["ETHERNET"], { a: "middle" }) +
      label("f06-c2", 876, 1180, ["PHONE"], { a: "middle" });
    const anim = `
      const P3 = ${js(T3.map((p) => samples(p, 0.06, 0.95)))};
      slide("#f06-adapter", 0.1, 0, -60);
      fadeUp("#f06-lb", 0.3); lead("f06-ld", 0.35);
      tl.fromTo("#f06-sw", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.05);
      fadeUp("#f06-sl", 0.2);
      // "every five seconds": the pie sweeps once, the hand follows
      draw("#f06-sw-pie", 0.3, 0.75);
      tl.fromTo("#f06-sw-hand", { rotation: 0, svgOrigin: "900 470" }, { rotation: 360, svgOrigin: "900 470", duration: 0.75, ease: "power2.inOut" }, 0.3);
      slide("#f06-router", 0.3); slide("#f06-eth", 0.4); slide("#f06-phone", 0.5, -40, -23);
      fadeUp("#f06-c0", 0.5); fadeUp("#f06-c1", 0.58); fadeUp("#f06-c2", 0.66);
      draw(q("#f06-t0 path, #f06-t1 path, #f06-t2 path"), 0.5, 0.5);
      gsap.set(q("#f06-h0 path, #f06-h1 path, #f06-h2 path"), { opacity: 0 });
      gsap.set(q("#f06-k0, #f06-k1, #f06-k2, #f06-x0"), { opacity: 0 });
      // "checks each network": a lime probe runs down each lane, then its tag pops
      [0, 1, 2].forEach((i) => { draw(q("#f06-h" + i + " path"), 1.05 + i * 0.22, 0.35); pop("#f06-k" + i, 1.4 + i * 0.22); });
      // the next five-second cycle sweeps slowly through the rest of the scene
      tl.fromTo("#f06-sw-pie", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 4.3, ease: "none", immediateRender: false }, 1.2);
      tl.fromTo("#f06-sw-hand", { rotation: 0, svgOrigin: "900 470" }, { rotation: 360, svgOrigin: "900 470", duration: 4.3, ease: "none", immediateRender: false }, 1.2);
      // traffic on all three lanes
      for (let t = 0; t < 3; t++) for (let k = 0; k < 3; k++) flow("#f06-p" + t + k, P3[t], 1.9 + k * 0.3 + t * 0.07, 0.9, Math.floor((D - 0.3 - 1.9 - k * 0.3 - t * 0.07) / 0.9) - 1);
      // "if one drops": Wi-Fi greys out, its tag flips to a dark X, its packets stop
      tl.to(q("#f06-p00, #f06-p01, #f06-p02"), { opacity: 0, duration: 0.15 }, 2.7);
      tl.to("#f06-h0", { opacity: 0, duration: 0.3 }, 2.7);
      tl.to(q("#f06-router, #f06-t0, #f06-c0"), { opacity: 0.3, duration: 0.3 }, 2.7);
      tl.to("#f06-k0", { opacity: 0, duration: 0.12 }, 2.7);
      pop("#f06-x0", 2.78);`;
    fs.writeFileSync(path.join(OUT, "06-check.html"), scene({ id: "06-check", p: "f06", dur: 5.75, lift: 0, svg, html: "", anim }));
  }

  // ===== Scene 7: useful =====
  {
    const items = [["speed", "Speed tests"], ["video", "YouTube"], ["game", "Steam"], ["magnet", "Torrents"], ["download", "Download managers"]];
    const rowsHtml = items.map(([k, t], i) =>
      `<div id="f07-r${i}" class="row" style="left:190px;top:${590 + i * 90}px">${icoTile(k)}${plate(`f07-r${i}p`, 84, 0, 616, t)}</div>`).join("");
    const lanes = [
      [[350, 552], [350, 700], [230, 760], [215, 985]],
      [[430, 552], [430, 720], [260, 780], [245, 985]],
      [[510, 552], [510, 740], [290, 800], [275, 985]],
      [[570, 552], [570, 740], [820, 770], [835, 950]],
      [[650, 552], [650, 720], [845, 760], [855, 950]],
      [[730, 552], [730, 700], [870, 740], [875, 950]],
    ];
    let cubes = "";
    for (let t = 0; t < 6; t++) for (let k = 0; k < 2; k++) cubes += cube(`f07-p${t}${k}`, 18);
    const dl = appWin("f07-dl", 270, 360, 540, 192, "Download",
      ph(20, 66, 300, 26) +
      `<div class="rate" id="f07-ra" style="right:20px;top:60px">2.4 MB/s</div><div class="rate" id="f07-rb" data-layout-allow-overlap style="right:20px;top:60px">9.6 MB/s</div>` +
      `<div class="pbar" style="left:20px;top:118px;width:496px;height:34px"><div id="f07-fill" class="pfill"></div></div>`);
    const html =
      `<div id="f07-a">${rowsHtml}</div>` +
      `<div id="f07-b">${dl}${plate("f07-fast", 290, 1170, 500, "Gets faster")}</div>`;
    const svg =
      `<g id="f07-bs">` +
      lanes.map((p, i) => dtube(`f07-t${i}`, bpath(p), { w: 8, fill: T.lime })).join("") +
      cubes +
      router("f07-router", 200, 980, 0.9) +
      phone("f07-phone", 820, 1040, 0.8) +
      label("f07-lb", 1022, 640, ["LOTS OF", "CONNECTIONS"], { a: "end" }) + lead("f07-ld", [[1004, 692], [1004, 790], [800, 790]]) +
      label("f07-c1", 236, 1135, ["WI-FI"], { a: "middle" }) +
      label("f07-c2", 856, 1135, ["PHONE"], { a: "middle" }) +
      `</g>`;
    const anim = `
      const LN = ${js(lanes.map((p) => samples(p, 0.04, 0.95, 12)))};
      // beat A: the checklist, one row per spoken use case
      [0.4, 1.35, 2.0, 2.55, 3.3].forEach((t, i) => { slide("#f07-r" + i, t, -40, 0); pop("#f07-r" + i + "p-tag", t + 0.3); });
      tl.to(q("#f07-a .row"), { y: -24, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.in" }, 4.35);
      // beat B: one download opens many connections across both networks
      gsap.set(q("#f07-b, #f07-bs"), { opacity: 0 });
      tl.set(q("#f07-b, #f07-bs"), { opacity: 1 }, 4.6);
      tl.fromTo("#f07-dl", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 4.65);
      slide("#f07-router", 4.85); slide("#f07-phone", 4.95, -40, -23);
      fadeUp("#f07-c1", 5.0); fadeUp("#f07-c2", 5.05);
      for (let i = 0; i < 6; i++) draw(q("#f07-t" + i + " path"), 5.1 + i * 0.07, 0.5);
      fadeUp("#f07-lb", 5.8); lead("f07-ld", 5.85);
      for (let t = 0; t < 6; t++) for (let k = 0; k < 2; k++) flow("#f07-p" + t + k, LN[t], 5.6 + k * 0.4 + t * 0.06, 0.8, Math.floor((D - 0.3 - 5.6 - k * 0.4 - t * 0.06) / 0.8) - 1);
      tl.fromTo("#f07-fill", { scaleX: 0 }, { scaleX: 0.18, duration: 2.2, ease: "none" }, 4.8);
      tl.to("#f07-fill", { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 7.0);
      gsap.set("#f07-rb", { opacity: 0 });
      tl.to("#f07-ra", { opacity: 0, duration: 0.15 }, 6.95);
      fadeUp("#f07-rb", 6.97, 8, 0.2);
      slide("#f07-fast", 6.95, -40, 0); pop("#f07-fast-tag", 7.3);`;
    fs.writeFileSync(path.join(OUT, "07-useful.html"), scene({ id: "07-useful", p: "f07", dur: 8.25, lift: 0, svg, html, anim }));
  }

  // ===== Scene 8: cta =====
  {
    const htmlA =
      plate("f08-n1", 290, 400, 500, "No server", "x") +
      plate("f08-n2", 290, 490, 500, "No account", "x") +
      plate("f08-pc", 290, 1090, 500, "Runs on your PC");
    // beat B: the repo, its URL, the follow line and a Follow button that gets clicked
    const RW = 964 - 5, RH = Math.round(RW * 1300 / 2560);
    const htmlB =
      `<div id="f08-repo" class="win" style="left:58px;top:370px;width:964px;height:${RH + 5}px">` +
      `<img src="assets/shots/repo-header.png" alt="" style="position:absolute;left:0;top:0;width:${RW}px;height:${RH}px"></div>` +
      `<div class="ctr" style="top:910px"><div id="f08-url" class="url">github.com/uditya-kumar/MultiPath</div></div>` +
      `<div class="ctr" style="top:1012px"><div id="f08-ft" class="ftxt">Follow for more <span class="hl"><i id="f08-ul"></i><b>useful tools</b></span></div></div>` +
      `<div id="f08-btn" class="btn" style="left:330px;top:1124px">` +
      `<div id="f08-bA" class="bst on">${`<svg width="58" height="40" viewBox="0 0 58 40">${tagInner("plus")}</svg>`}<span>Follow</span></div>` +
      `<div id="f08-bB" class="bst off">${`<svg width="58" height="40" viewBox="0 0 58 40">${tagInner()}</svg>`}<span>Following</span></div></div>` +
      `<svg id="f08-cur" class="cursor" width="46" height="62" viewBox="0 0 46 62" style="left:700px;top:1186px">${POINTER}</svg>`;
    const svgA = `<g id="f08-ga">${laptop("f08-laptop", 470, 800)}</g>`;
    const anim = `
      // beat A: nothing leaves your PC
      slide("#f08-n1", 0.05, -40, 0); pop("#f08-n1-tag", 0.35);
      slide("#f08-n2", 0.65, -40, 0); pop("#f08-n2-tag", 0.95);
      slide("#f08-laptop", 1.35);
      draw("#f08-laptop-gl", 1.75, 0.6);
      slide("#f08-pc", 2.2, -40, 0); pop("#f08-pc-tag", 2.48);
      tl.to(q("#f08-a, #f08-ga"), { opacity: 0, duration: 0.25, ease: "power1.in" }, 2.9);
      // beat B: follow for more useful tools
      gsap.set(q("#f08-b, #f08-gb"), { opacity: 0 });
      tl.set(q("#f08-b, #f08-gb"), { opacity: 1 }, 3.12);
      tl.fromTo("#f08-repo", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 3.15);
      fadeUp("#f08-url", 3.4, 14, 0.35);
      fadeUp("#f08-ft", 3.6, 16, 0.4);
      wipe("#f08-ul", 4.0, 0.4);
      tl.fromTo("#f08-btn", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.out" }, 4.15);
      // cursor glides in and clicks: the button presses and flips to "Following"
      tl.fromTo("#f08-cur", { x: 170, y: 140, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 4.45);
      tl.to("#f08-cur", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", transformOrigin: "0% 0%" }, 5.1);
      tl.to("#f08-btn", { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, 5.1);
      tl.set("#f08-bA", { opacity: 0 }, 5.16);
      tl.set("#f08-bB", { opacity: 1 }, 5.16);
      pop("#f08-bB svg", 5.2);`;
    fs.writeFileSync(path.join(OUT, "08-cta.html"), scene({
      id: "08-cta", p: "f08", dur: 6.9, lift: 0, svg: svgA,
      html: `<div id="f08-a">${htmlA}</div><div id="f08-b">${htmlB}</div>`, anim,
    }));
  }
};
