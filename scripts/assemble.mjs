// Step 7b. Root index.html + bg.html from script/timing.json (v3 layout: bg track 0, scenes 1, captions 5, voice 10, music 12).
// Usage: node assemble.mjs <projectDir>
import fs from "node:fs";
import path from "node:path";
import { CFG, projectDir, need, rd, ok, fail } from "./_common.mjs";

const dir = projectDir(process.argv[2]);
const T = rd(need(path.join(dir, "script/timing.json"), "run timing.mjs first"));
const reel = rd(path.join(dir, "script/reel.json"));
if (!T.bed) fail("timing.json is from an older version; run timing.mjs again");
const music = T.bed.src;
need(path.join(dir, music), "music bed missing from the project root");
const D = T.total;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const scenes = T.scenes.map((s) =>
  `      <div id="sc-${String(s.n).padStart(2, "0")}" data-composition-id="${s.id}" data-composition-src="compositions/scenes/${s.id}.html" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1" data-width="1080" data-height="1920"></div>`);
const bgm = T.music.map((m) =>
  `      <audio id="${m.id}" src="${music}" data-start="${m.start}" data-duration="${m.dur}" data-track-index="12" data-volume="${T.bed.volume}" data-fade-in="${CFG.music.fadeIn}" data-media-start="${m.mediaStart}"></audio>`);

const index = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1080, height=1920">
    <title>${esc(reel.title || reel.repo)} — Tool of the day</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #0e0f11; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="1080" data-height="1920">
      <div id="sc-bg" data-composition-id="bg" data-composition-src="compositions/bg.html" data-start="0" data-duration="${D}" data-track-index="0" data-width="1080" data-height="1920"></div>

      <!-- scenes -->
${scenes.join("\n")}

      <!-- captions -->
      <div id="sc-captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${D}" data-track-index="5" data-track-kind="captions" data-width="1080" data-height="1920"></div>

      <!-- audio -->
      <audio id="el-voice" src="${T.voice.file}" data-start="0" data-duration="${T.voice.duration}" data-track-index="10" data-volume="1"></audio>
${bgm.join("\n")}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

const vx = Array.from({ length: 11 }, (_, i) => (58 + 96.4 * i).toFixed(1));
const grid = vx.map((x) => `<line x1="${x}" y1="305" x2="${x}" y2="1305" stroke="#24252A" stroke-width="1.5" />`).join("")
  + `<line x1="58" y1="800" x2="1022" y2="800" stroke="#24252A" stroke-width="1.5" /><line x1="58" y1="1305" x2="1022" y2="1305" stroke="#34363B" stroke-width="1.5" />`;
const bg = `<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; }
    #bg-paper { position: absolute; inset: 0; background: #0e0f11; }
    #bg-grid { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
  </style>
  <div id="root" data-composition-id="bg" data-start="0" data-duration="${D}" data-width="1080" data-height="1920">
    <div id="bg-paper" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
      <svg id="bg-grid" viewBox="0 0 1080 1920">${grid}</svg>
    </div>
  </div>
  <script>
    window.__timelines["bg"] = gsap.timeline({ paused: true });
  </script>
</template>
`;
fs.mkdirSync(path.join(dir, "compositions/scenes"), { recursive: true });
fs.writeFileSync(path.join(dir, "index.html"), index);
fs.writeFileSync(path.join(dir, "compositions/bg.html"), bg);
ok(`index.html + bg.html: ${D}s, ${T.scenes.length} scenes, ${T.music.length} music clip(s)`);
