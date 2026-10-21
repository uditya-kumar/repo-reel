# WORKFLOW.md: /repo-reel end to end

Run the steps in order and tick each one. Steps marked **[script]** are done by a deterministic file in `scripts/` (section 10). Run the script; don't redo its work by hand. Every script prints what it did and exits non-zero with a clear message when something is wrong.
The output must match `references/golden/` (the v3 frames) in look, pace and sound.

In the commands below, `S=~/.claude/skills/repo-reel/scripts` and `P=<videosDir>/<slug>` (the path `scaffold.mjs` prints).

---

## 0. Setup and fixed resources (run `setup.mjs` first, never auto-download)

**Before every reel, run `node $S/setup.mjs --quick`.** Run it without `--quick` (adds the sha256 pass) on first use and after the models or the music change. It checks node, ffmpeg/ffprobe, `gh auth`, the pinned HyperFrames CLI, Python with its packages, both models (size + sha256 against `scripts/models.json`), the Parakeet runtime and the music bed. It prints a numbered fix list and exits 1 if anything is missing. **If it fails, show the user its fix list (the links included) and stop.** Downloads follow SKILL.md rule 4.

Settings: `scripts/config.json` holds the public defaults. `scripts/config.local.json` (gitignored, optional, see `config.local.example.json`) holds this machine's overrides: `python`, `videosDir`, `modelsDir`, `music.file`. Both are deep-merged by every script. Set the bed's tempo there too (`music.bpm`, `music.beatPhase` = the time in seconds of any beat in the file) so `timing.mjs` can write a beat grid; garten is 143.55 BPM, phase 0.184.

| What | Where / value |
|---|---|
| New reel project | `<videosDir>/<slug>/` (default `~/repo-reels/`; lowercase repo name, e.g. `multipath`) |
| Quality reference | `references/golden/` (v3 frames), `kit/examples/v3/` (v3 scenes), `kit/examples/v4/` (HarnessRouter: the v4 motion layer, match cuts, `_plan.cjs`) and `kit/examples/crafted/` (crafted objects, DESIGN.md 5.8). v1/v2 are obsolete; never copy from them. |
| Project template | `kit/` (fonts, `iso.js`, `motion-blur.js`, `scripts/lib/reel-lib.cjs`, `scripts/build-scenes.cjs`, `scripts/scenes/_cta.cjs`; `kit/examples/` is reference only and is not copied) |
| **TTS model (Kokoro v1.0)** | `models/kokoro/` → `kokoro-v1.0.onnx`, `voices-v1.0.bin`. The user downloads these; links are in `models/kokoro/README.md` and `models.json`. |
| TTS settings | voice `af_heart`, `speed=1.14`, `lang="en-us"`, 24 kHz out, **0.3 s** gap between lines, silence trim threshold 0.01 (keep 0.03 s before, 0.08 s after) |
| Voice loudness | `loudnorm=I=-16:TP=-1.5:LRA=11`, 48 kHz mono → about −16 LUFS |
| **ASR model (Parakeet TDT 0.6B v3 int8)** | `models/parakeet/` → `encoder/decoder/joiner.int8.onnx`, `tokens.txt` (the HyperFrames-pinned revision; links in `models/parakeet/README.md`). HyperFrames reads them from `~/.cache/hyperframes/parakeet/parakeet-tdt-0.6b-v3-int8/`, and `setup.mjs`/`transcribe.mjs` fill that cache from `models/parakeet/` (hard links, `tokens.txt` normalised to LF). Whisper is not used. |
| **Background music** | bring your own: the first audio file in `music/`, or `music.file` in `config.local.json`. Ideally 40–60 s and licensed for social media. `scaffold` copies it into each project root. No track ships with the skill. |
| **Music volume** | computed per track from its loudness: `volume = 0.134896 · 10^((−7.0 − LUFS)/20)`, the v3 reference (garten at −7.0 LUFS → 0.134896, about 8 dB under the voice). `data-fade-in="0.3"`, no ducking, the same on every clip. |
| Python | `python` from config (3.10+), with `kokoro-onnx==0.6.1 soundfile numpy` |
| HyperFrames | pinned `hyperframes@0.8.156` (`npx --yes hyperframes@0.8.156 …`). Don't bump the pin mid-reel; it would change the v3 look baseline. |
| Render settings | 1080×1920, 30 fps, mp4, quality `standard` (h264, AAC 48 k) |

---

## 1. Scaffold + intake **[script: `scaffold.mjs`, `intake.mjs`]**

```bash
node $S/scaffold.mjs <github-url> [--slug name]   # → videos/<slug>/ (refuses to overwrite)
node $S/intake.mjs $P                             # → research/repo.json, README.md, images.json, facts.md skeleton
```
- `scaffold` copies the kit and the music, and writes `meta.json`, `package.json` (pinned) and `script/reel.json` (`owner, repo, slug, title, repoUrl, url, cta`).
- Project layout (`scaffold` creates every folder):
  ```
  <slug>/
    research/      repo.json, README.md, images.json, facts.md (step 1)
    script/        reel.json, lines.json (steps 1–2)
    assets/        audio/ (step 3), shots/ + shots/site/ (step 4), logos/ (step 4), fonts, js
    storyboard/    storyboard-lib.cjs (kit) + make-storyboard.cjs → storyboard.htm → storyboard.png (step 5)
    scripts/       lib/reel-lib.cjs, build-scenes.cjs, scenes/*.cjs (step 6)
    compositions/  scenes/*.html, captions.html, bg.html (generated: never edit)
    snaps/         review/ and dense/ snapshots and contact sheets (step 7)
    renders/       <slug>.mp4 (step 9)
  ```
- `intake` uses `gh api` (no browser). `images.json` = `{screenshots, stackLogos}`, with badges removed and relative paths resolved to raw URLs.

Then the judgement part:
1. Use **Chrome DevTools MCP** to see what the tool *looks like*: `new_page https://github.com/<owner>/<repo>` (plus the homepage or docs if there is one), `take_snapshot`, scroll the README and note which images show the **real product UI**. These become the "meet" screenshot.
2. Fill in `research/facts.md`: what it is, who it's for, how it works (2 steps), one concrete number or example, reliability or safety, 4–5 real use cases, trust points and platforms. **Each fact must cite its README line or page.** This file is the only source for the script.

## 2. Script draft (SCRIPT.md rules) → **GATE 1**

1. Write the 8 beats using SCRIPT.md, with only facts from `research/facts.md`.
2. Show the approval table (SCRIPT.md section 6) with word counts, estimated seconds, a visual idea per beat, the screenshots needed and any pronunciations.
3. **Stop and wait for the user's approval.** Apply their edits and show the table again if anything changed.
4. Once approved:
   - write `script/lines.json` (`[{id, text}]`, the approved text exactly; ids are short lowercase words like `hook`, `meet`, `cta`)
   - set `script/reel.json` → `cta.trust` to the CTA's trust plates. Each `word` must appear in the CTA line; the last item sits under the device:
     `[{"text":"No server","kind":"x","word":"server"},{"text":"No account","kind":"x","word":"account"},{"text":"Runs on your PC","word":"PC"}]`
     Optional CTA keys: `device` (default laptop; `false` = no device, the plates stack centred), the last trust item may add `code: ["line", ...]` (a real command from the README, typed into a Terminal window under its plate), `glyph` (laptop screen art: `"merge"` default, or `"fan"` for one-to-many; names live in `L.GLYPHS`), `shotH` (repo-header height, default 1300) and `follow` (default `"follow"`).

## 3. Audio, timing, captions, index **[script: `audio.mjs`]**

```bash
node $S/audio.mjs $P                  # tts → transcribe → align → timing → captions → assemble → plan
node $S/audio.mjs $P --from align     # re-run from a later step (tts | transcribe | align | timing | captions | assemble | plan)
```
What each step does (each one can also be run alone as `node $S/<step>.mjs $P` or `python $S/tts.py $P`):

| Step | Does |
|---|---|
| `tts.py` | Kokoro per line, trim, 0.3 s gaps → `narration-raw.wav`; loudnorm → `assets/audio/narration.wav`; writes `narration.json` (sample-exact line starts). **Fails if the voice is over 87.5 s** (the reel is at most 90 s): shorten the script and get it re-approved; never speed up the voice. Warns under 44 s. |
| `transcribe.mjs` | Parakeet → `assets/audio/transcript.json`. It judges by the file, not the exit code (the CLI can exit 1 after a good write). If the HyperFrames cache is missing or broken it refills it from `models/parakeet/`; if those files are missing too it prints the download links and stops. **It never downloads.** Fails if the word count is >15% off the script. |
| `align.mjs` | Character-level alignment of the script's words onto ASR timings, so ASR splits and merges ("open source", "10" for "ten", "checks." swallowing "each network") resolve without hand fixes. It clamps every line to its TTS span, because Parakeet word ends run into the next word and eat the line gaps. → `assets/audio/words.json` `[{text,start,end,line,li}]` in script spelling. Prints weak matches: listen to those words. |
| `timing.mjs` | → `script/timing.json`: scene `NN-<id>` (`p` = `fNN`) starts **0.10 s before its line's first word**, snapped to 0.05 (scene 1 at 0); duration = next start − start; **total = voice length + 2.04 s** (v3: 46.82 + 2.04 = 48.86), and fails over 90 s (`timing.maxReelSeconds`). `beats`: one `[from, bpm, phase]` per music clip for `L.beatGrid(timing.beats)`, or null with a warning when `music.bpm` isn't set. Music: one clip if the bed covers the reel; otherwise the next clip (media-start 0.27) restarts the bed in the latest speech pause before the bed runs out (v3: at or before 42.4 s), repeated as often as needed. Also writes **`script/cues.md`**: every scene's words at their scene-local times (what `s.at()` returns; a repeated word shows its index, `AI#1` = `s.at("AI", 1)`) and the music beats in local time. Write scenes from it. |
| `captions.mjs` | Dark v3 captions (DESIGN.md section 8). Breaks at `,.?!` or a pause > 0.35 s, then splits each phrase into the fewest groups that fit **4 words and 24 characters**, balanced by width (so long words can't build a group that runs off the frame); hold 0.6 s; active word lime. Groups appear with a 0.14 s clip-wipe rise; the opacity fade was replaced because it failed contrast mid-fade. One reel can override the settings in `script/reel.json` → `"captions": { "maxChars": 20 }` (same keys as `config.json`). |
| `assemble.mjs` | `index.html` (bg track 0, scenes 1, captions 5, voice 10, music 12) and `compositions/bg.html` (plain grid), both with the right total. `build-scenes.cjs` (step 6) rewrites `bg.html` with the grid plus the frame chrome (DESIGN.md 4). |
| `plan.mjs` | Writes the cut-plan stub `scripts/scenes/_plan.cjs` (every scene key with its start and duration, `lift`, `camEnd`, empty `R` / `hands` / `holds`) as a call to `L.plan()`. Never overwrites an existing plan (`--force` does). |

(v3 lags the voice by about 0.3 s by accident; new reels lead by 0.1 s. Expect scene starts a few tenths earlier than v3 for the same lines.)

## 4. Visual assets: repo, product website, logos (Chrome DevTools MCP) **[script: `crop.mjs` for post-processing]**

Run this right after the narration (step 3): the approved lines and their timings tell you which beats need which picture. Capture what the script's visual ideas need. That's always **`repo-header.png`** (the CTA needs it; `check` fails without it). **Product images and screenshots can be used in any beat wherever they help**: real UI, diagrams or images from the README or docs, demo frames, starter kits or example outputs. Use as many as the reel needs, as long as each one shows something real and the frame stays readable. Files the user drops in `$P/assets/shots/` count too; use them as they are.

Where things go: `assets/shots/` (repo header, README images as `_src-<name>.png`), `assets/shots/site/` (product website shots), `assets/logos/` (SVG logos), `renders/<slug>-readme-9x16.png`. Raw captures are `_raw-*.png` and are deleted by `crop.mjs --clean`; `_src-*` files are kept.

### 4.1 Repo page and README

1. `new_page <url>` → `emulate` viewport `1280x1400x2` (DPR 2, so shots are 2560 px wide), `colorScheme: "dark"`. Dark matches the reel; use light only if the app's own UI is light-only.
2. Clean the page with `evaluate_script`: hide the GitHub `header`, set sticky elements to `position: static`, close cookie or sign-in banners, and widen small README images (`img.style.width='640px'`). Scroll the target into view (`scrollIntoView(); scrollBy(0,-20)`) and wait 600–800 ms.
3. `take_screenshot` (viewport) → `$P/assets/shots/_raw-<name>.png`.
4. Write a crop spec and run it:
   ```json
   [{ "in": "_raw-repo.png", "out": "repo-header.png", "crop": "2560:1300:0:0" },
    { "in": "_raw-ui.png",   "out": "tray-panel.png",  "crop": "W:H:X:Y" }]
   ```
   `node $S/crop.mjs $P crops.json --clean`. It bounds-checks every crop, prints the sizes and deletes the raws.
   - `repo-header.png`: repo name, about/description, stars. It's shown in the CTA at 959 px wide. If it isn't 1300 tall, set `cta.shotH`.
   - Product panel: a tight crop of the real UI with no browser chrome, at least 420 px wide on screen.
5. Optional `app-icon.png`: `curl` it from the repo's icon path (it's in `images.json`). README product images (mockups, diagrams) from `images.json` are `curl`ed the same way to `assets/shots/_src-<name>.png`.
6. Never recolour or add shadows to a screenshot, and never draw a title bar above it (no drawn window bar, thin-line bar, fake dots or URL bar). The app's own title bar may stay in the crop. In the scene it gets a 2.5 px ink outline only (DESIGN.md section 5.7).
7. **README 9:16 screenshot** (always; to post alongside the reel, not used in the scenes): one portrait shot of the README top at exactly 1080×1920.
   - `new_page https://github.com/<owner>/<repo>#readme` → `emulate` viewport `540x960x2` (DPR 2 → 1080×1920; 540 px gives GitHub's narrow layout so the README text stays big), `colorScheme: "dark"`.
   - `evaluate_script`: hide the scrollbar, then scroll so the README box (its README / license tab bar) sits at the top edge:
     ```js
     () => { const s = document.createElement('style'); s.textContent = 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}'; document.head.appendChild(s);
       let box = [...document.querySelectorAll('a,span,h2')].find(e => e.textContent.trim() === 'README' && e.getBoundingClientRect().height > 0);
       for (let i = 0; i < 8 && box && box.getBoundingClientRect().width <= 500; i++) box = box.parentElement;
       window.scrollTo(0, box.getBoundingClientRect().top + window.scrollY); }
     ```
   - `take_screenshot` (viewport, not fullPage) → `$P/renders/<slug>-readme-9x16.png`. No crop step: it's already 9:16.
   - Check it: 1080×1920 (read the PNG header), the top edge is the README tab bar (no file list above it), no scrollbar, and the title, tagline and first lines are readable. If the README opens with a huge banner image, scroll down to where the name and description start instead.

### 4.2 Product website

Most tools have a site (the repo's `homepage` in `repo.json`, or the README's first link) whose live UI mock-ups are sharper and richer than the README images. If the user already has it open in Chrome, `list_pages` and reuse that page instead of opening a new one.

1. **Survey before capturing.** `emulate` `1280x1400x2`, dark. Scroll section by section, taking low-quality viewport previews (`format: "jpeg", quality: 50`, no file), and list each section with the beat it could serve. Keep real product UI: app mock-ups, tabbed demos, phone screens, terminal/CLI panels, before/after outputs. Skip text-and-icon cards (draw those in the reel's own style instead), testimonials, pricing and sponsor rows unless the script uses them.
2. **Clean the page** with `evaluate_script`: hide the scrollbar (`html{scrollbar-width:none}::-webkit-scrollbar{display:none}`), set the sticky/fixed nav to `position: static`, close banners.
3. **Tabbed or interactive mock-ups:** `take_snapshot` for the uids, `click` each tab, wait about 800 ms, then `take_screenshot` with the mock's `uid` and `filePath: $P/assets/shots/site/<name>.png`. An element shot needs no crop. If it times out (a looping animation), scroll the mock into view, take a viewport `_raw-<name>.png` and crop it (step 6).
4. **Flatten 3D mock-ups.** UI must be flat and frontal (DESIGN.md 5.1/5.7), but sites often tilt side devices with `perspective`/`matrix3d`. In `evaluate_script`, set `transform` and `perspective` to `none` on the tilted element and its parents, then spread the devices apart with `translateX(±N px)` so none overlap. Read back `getComputedStyle(e).transform` to confirm; a leftover `matrix3d` with only a small translate is fine.
5. **Small elements get a higher DPR.** Anything under 420 CSS px wide (a single phone) is too small at DPR 2: re-`emulate` at `1280x1400x4`. Page edits like the flattening survive the re-emulate; check with the same read-back. Return to DPR 2 afterwards.
6. **Crop from measured coordinates, never by eye.** Get the rect with `getBoundingClientRect()` in `evaluate_script`; crop = rect × DPR, plus about 4 CSS px of padding so device frames and panel borders stay whole. `out` may be a subfolder (`"out": "site/phone-chat.png"`). Write all crops into one spec and run `crop.mjs --clean` **once, at the end**, because `--clean` deletes every `_raw-*`.
7. **Look at every result.** `ffmpeg … hstack` the crops into a small `research/_peek.jpg`, `Read` it, and check: nothing cut off, frontal, sharp, no nav or scrollbar. Then delete the peek.
8. Anything the narration says about a screenshot still needs its line in `facts.md`; a screenshot shows the real product, it doesn't prove a claim on its own.

### 4.3 Logos

1. Every product or tool **named in the narration** needs a logo (the meet beat usually shows them). Take them from the product's own site or repo: the "works with" / "supports" row, the nav logo, or a sub-page (for example `/agents`, `/integrations`) when the home page lacks one.
2. Inline SVGs: read `outerHTML` with `evaluate_script`, or `curl` the page into `research/` and slice the `<svg>…</svg>` after its link with `node`. A logo that's an `<img src="/logo.svg">` is `curl`ed directly.
3. Save each one as `assets/logos/<name>.svg` with `currentColor` / `white` replaced by ink `#ECEBE6`. Keep the product's original as `<name>.svg` next to the ink copy `<name>-ink.svg`. Logos are vector marks drawn in the reel's ink, so this is allowed; screenshots are still never recoloured.

### 4.4 Inventory and clean-up

1. Delete the temp files (`research/_peek*.jpg`, saved HTML, snapshot dumps, crop specs).
2. Give the user a short inventory table: file → what it shows → the beat it suits. Add one line on what you skipped and why. Screenshots the user drops in (their own app windows) are welcome, but look at what's in them: name any personal data (their own code, folder or file names, emails, tokens) in the table and get an OK before a scene uses it.
3. Plan for motion while you capture: a screen that will zoom needs pixels to spare (capture at DPR 2–4 so a 1.6× zoom stays sharp), and a beat that tours several tools wants one real shot per tool, so they can push through one window (`fitShot` fills the window's width, or `"cover"` for a wide or short shot). Note the source-pixel rects of the regions a trim box or zoom will ring while you look at each image; `L.regionOf()` turns them into shot px later. Then go on to step 5, the storyboard (there's no gate here, unless the user asked you to stop after the assets).

## 5. Storyboard → `storyboard/storyboard.png` (check with the user before building)

Run this right after the assets (step 4): the timings, the word cues and the real pictures are all known now, so the whole reel can be planned on paper before any scene code exists. The storyboard is how the user and you agree on the reel; step 6 builds exactly what it shows.

1. Write `$P/storyboard/make-storyboard.cjs`. It `require`s `./storyboard-lib.cjs` (copied by `scaffold`; don't rewrite it). The lib gives you the whole page and its CSS (`write(dir, p)` builds the header, the scene cards and the legend from one data object, shapes documented at `card` and `page`), the frame pieces (`grid`, `caption`, `shotWin`, `shot`, `agentWin`, `logoTile`, `hl`, `klab`, `shift`, `svg`, `ltube`, `ntube`, `lpulse`, `cubeAt`) and the pink annotation layer (`mk`, `marr`, `zoomRect`). It re-exports `L` = `../scripts/lib/reel-lib.cjs` (the `T` tokens, `plate`, `stag`, `workspace`, `stopwatch`, `lead`, `hlBox`, `tube`…). Your generator only describes the scenes: `const SB = require("./storyboard-lib.cjs"); SB.write(__dirname, { name, meta, chain, news, scenes });`. If a reel needs a new frame piece, add it to `make-storyboard.cjs` (or to the project's lib copy), not to the kit. `write` saves `storyboard/storyboard.htm` (`.htm`, never `.html`: Studio lints every `.html` in the project as a composition, and the storyboard page fails that lint). Draw every frame at the reel's real coordinates (1080×1920, grid field, caption band, DESIGN.md) with the real screenshots and logos from step 4, then scale it down for the page (`transform: scale(0.5)`). Coordinates you draw here are the ones step 6 uses.
2. The page (dark, the reel's palette and Inter):
   - **Header:** the transition chain (every cut and the object that carries it, e.g. `phone → logo tile`), what's **new in this reel** (SKILL.md rule 7: name each new object, pattern or motion primitive and the scene that uses it), and a legend.
   - **One card per scene, in order, one per row:** two key frames **A** and **B**, each labelled with its local time and the word it lands on, the caption drawn in the caption band with the active word on lime. Beside them: the narration line, numbered motion steps that each name their cue word and time from `words.json` (`On "phone" (4.56) the real phone screenshot rises in…`), the transition out, and the assets used. Use a filmstrip for a scene that pushes several screens through one window.
   - **Annotations in pink (`#FF5FA2`) only:** numbered circles that match the steps, dashed arrows for motion, dashed boxes for zoom regions. Pink never appears in the reel; the legend says so.
3. Render it with Chrome DevTools MCP: `new_page file:///…/storyboard/storyboard.htm`, `emulate` the viewport to 2640×1400 at DPR 1, `take_screenshot` with `fullPage: true` and `filePath: $P/storyboard/storyboard.png`.
4. Read the PNG and check it the way step 7 checks the reel: nothing spills out of a frame or a card, no overlaps between objects, plates, labels or markers, screenshots at most 1.6× inside their window, lime under 10%, every step has a cue word. Fix the generator and render again; never patch the HTML.
5. Show the user the path, one line per scene (the key frames, the motion beats on their words), the transition chain, the new primitives, and anything they should OK (a screenshot with personal data, an upscaled image). **Wait for their go-ahead.** Apply their edits in the generator, re-render, and show it again. Then go on to step 6.

## 6. Build the scenes (creative step: follow DESIGN.md's locked identity exactly; the layout and motion are yours to design)

Write one file per scene: `$P/scripts/scenes/NN-<id>.cjs` (ids from `timing.json`).
```js
// scripts/scenes/02-meet.cjs
module.exports = (L, s, reel) => {
  const { T, make, plate, appWin, ph } = L;   // everything from scripts/lib/reel-lib.cjs
  const t1 = s.at("Wi-Fi"), t2 = s.at("Ethernet");   // local seconds of spoken words (nth match: s.at("Wi-Fi", 2))
  return { lift: 0, svg: `...`, html: `...`, anim: `...` };   // optional: over, cam, fade (below)
};
```
- `s` = `{id, p, n, line, start, dur, words, at(word, nth)}`. **Every cue time comes from `s.at()`**: the object appears on the word that names it, and the tag pops on the word that confirms it. `s.at` throws if the word isn't in that line. `script/cues.md` lists every scene's words and times.
- **What exists: `kit/API.md`** (also copied into the project). It lists every lib object and builder and every timeline helper with its signature, one line each; under each builder, the ids it creates and how it starts (visible, drawn or hidden, and which helper reveals it); and the scene shell's CSS classes (`.code`, `.plane`, `.ctr`, `.win`, ...). Read it instead of the whole lib, and open `reel-lib.cjs` or an example only for the piece you're reusing. In the kit lib, a builder's `// ids: ... · starts: ...` comment line is what feeds that line: add one for every new builder.
- Prefix every element id with `s.p` (e.g. `${s.p}-cube`) so ids stay unique. `build-scenes.cjs` **fails on a duplicate id** within a scene or across scenes; in Harness2 a spark and a screenshot both named `p-s0` silently moved the screenshot off-frame.
- **Declare the layout so the build checks it:** a scene may return `boxes: [{ id, r, t? }]` and `overlapOk: [[idA, idB]]`. `r` is a rect `[x, y, w, h]` or a convex outline `[[x, y], ...]` in `.lift` coords, and `t: [t0, t1]` is when it's on screen (default: the whole scene). Use `L.isoHull(ox, oy, x, y, z, w, d, h)` for iso objects: their rects overlap at the corners when the objects don't. Boxes that overlap while both are on screen fail the build, and so do boxes that leave the grid field after the lift. List intended overlaps (an object painted in front of another) in `overlapOk`. It's optional, but it replaces a snapshot round for every layout mistake it catches.
- Reuse the lib: `make().box`, `tube`, `dtube`, `cube`, `laptop(id, x, y, glyph)`, `phone`, `router`, `adapter(id, x, y, mark)` (chip text, e.g. a 2-letter product mark), `workspace` (sealed per-session container), `appWin`, `plate` (kind `"x"`, `"plus"`, `"none"` for a name plate with no tag, default check), `stag`, `gauge`, `stopwatch`, `icoTile`/`ICONS` (speed, video, game, magnet, download, file, slides, sheet, chart, more, image, mic, pen, figure), `mediaCard(id, ox, oy, "video"|"voice"|"image")`, `layer` (version sheet), `slider`/`sliderAnim`, `hlBox` (highlight over a screenshot region), `ph` (screenshot), `lead`, `barrow`, `limeEdges`, and the crafted objects `selector(id, ox, oy, u)` (rotary selector) and `board(id, ox, oy, mark, u)` (router board), plus `anat(ox, oy, u)` to build new ones (DESIGN.md 5.8, worked example `kit/examples/crafted/`). See `kit/examples/v3/build-scenes.cjs` for how v3 used each one.
- **v4 motion (default for new reels; DESIGN.md section 7 "v4 motion layer", worked example `kit/examples/v4/`):**
  - Fill in `scripts/scenes/_plan.cjs`, which `audio.mjs` wrote as a stub calling `L.plan(timing, { lift, camEnd, R, hands, holds })`:
    - each scene's `lift` and `camEnd`, and the rects `R` the cuts connect;
    - one `hands` entry per match cut: `h1: [from, to, rectA, rectB, t0, land]` (a rect is an `R` name or an array);
    - one `holds` entry per hold cut: `[from, to]`.

    `L.plan` takes the cut from the next scene's start and snaps `land` to the nearest music beat (`L.beatGrid(timing.beats)`, which follows the bed across restarts; `script/cues.md` lists the beats). It throws when a hold cut's source camera doesn't end at rest or the two lifts differ, so a hold cut can't jump. It returns `{ KEYS, start, dur, beat, lift, camEnd, R, H, cam, side, report, table, ... }` (the v4 shape; `kit/examples/v4/_plan.cjs` is the same machinery written out). Every `build-scenes.cjs` run prints the plan's handoff table: each hand's t0, cut, land (and the land you asked for, when the beat snap moved it), its out and in sides and f, with a ⚠ and a t0 / land that fits when a side is outside 0.23–0.5 s or f is outside 0.35–0.6. Fix those in the plan before reading any snapshot. Keep reel-specific shared numbers (implode seeds, shared geometry) next to it in the same file. If `beats` is null, the track's tempo isn't set: ask the user for it, or land cuts on words only (`snap: false`). Rebuild the plan if the timing changes.
  - A scene returns `cam: P.cam(key)`. It also returns `fade: false` and `over: mframe(...)` when it hands off, and uses `morphCode` / `L.carry` on both sides of each cut. The extra return keys are `over` (HTML in the screen layer above the camera), `cam` (`{s, x, y, t0, t1}`) and `fade` (false = no end fade).
  - Timeline helpers available in `anim`: `E.*` eases, `seg`, `slide`, `fadeUp`, `draw`/`untrim`, `wipe`/`unwipe`, `wipeIn`/`wipeOut`, `pop`/`unpop`, `lead`/`unlead`, `kin`/`kout`, `type`/`untype`, `plateIn`, `away`, `drift`, `run`, `mfSet`/`morph`, `flow`, `dropIn`/`assemble`, `swapName`. Lib objects: `appWinC`, `mframe`, `trimRect`, `hlTrim`, `pulse`, `klabel`, `typed`, `kword`, `swapPlate`, `MB()`.
  - **Guard helpers** (each prevents a warning or a visual bug that used to cost a verify round):
    - `dropIn(sel, at, { dy, dur, fade, stagger })` / `assemble(q(parts), at)`: the drop with a short fade (DESIGN.md 5.8). Hand-written as two `fromTo`s on one element, it trips `gsap_repeated_fromto_without_baseline`.
    - `L.kspan(sel, n, tin, tout, o)`: a kinetic label's `kin` and `kout` in one call. It throws at build time if the exit would start before the rise ends plus a hold (the cause of `gsap_tween_tail`).
    - `L.hold(tin, tout, min, what)`: the same guard for any in/out pair.
    - `L.swapPlate(id, x, y, w, from, to, kind)` + `swapName(id, at)`: a plate whose name rolls to a new value. Both names share one mask sized by the longer one, so neither is clipped.
    - `L.regionOf(rect, srcW, shownW, { zoom, origin })`: turns a region read off the source PNG into shot px (and zoomed px) for `hlTrim` boxes, instead of converting by hand.
  - **Implode cut (v5, worked example `kit/examples/uncensored/`, DESIGN.md 6 "implode to a seed" and 7 "v5 implode cut"):** `implode(p, at, pt, lift, cam)` on the out side and `seedIn(p, pt)` on the in side, both scenes returning `over: seed(p)`; the in side draws its first object out of the seed with `spark` + `sdraw(head, sel, d, at, dur)`. Keep `pt` in `_plan.cjs`. Use it for a turn in the argument, once or twice a reel.
  - **Frame chrome:** automatic. `build-scenes.cjs` writes `compositions/bg.html` with the grid, registration marks, the `FIG. NN / NN` odometer and the scene bars from `timing.json`; nothing to do per scene. Don't edit `bg.html` by hand (it is regenerated on every build).
  - **Screenshot-heavy reels** (worked example `kit/examples/paseo/`, DESIGN.md 5.4 "Screenshot objects" and 7 "Screenshot motion"): objects `screenWin` + `fitShot`, `shotBox`, `agentWin`, `rails`, `dimLine`; code builders that return `anim` strings `zoomIn`, `pushScreens`, `converge`, `lensIn`/`lensOut`, `stretch`. `kit/examples/paseo/make-storyboard.cjs` is the matching storyboard generator.
  - Gotchas (each one cost a debug round): a later `fromTo` on the same property needs `immediateRender: false`. Two tweens that move one element in different ways at the same moment (a drop and its fade) go through `dropIn`, not two `fromTo`s. Tween trims with `attr: {"stroke-dashoffset"}`, never the CSS property. Motion-blurred elements whose contents animate are carried by static flyers. No camera or drift longer than `L.SETTLE` (the outlines shimmer). Every element appears on its own word, so land a handoff on whatever is spoken at the cut. `data-layout-allow-overlap` is not inherited, so put it on the children that are meant to overlap too. Don't run `hyperframes add motion-blur`: the runtime already ships as `assets/js/motion-blur.js`, and the registry component (a paste-in snippet under `compositions/components/`) fails Studio's lint (no `data-composition-id`, too many lines).
  - More gotchas (Paseo):
    - `box-sizing: border-box` is global, so a `.win` (and a `screenWin` viewport) holds (w − 5) × (h − 5) inside its edges.
    - All tweens on one element's `scale` must share a `transformOrigin` (`pop` and `converge` both use 50% 50%), or scrubbing jumps when the second tween takes over.
    - When an in and an out time come from two close words, assert out > in + a minimum hold (about 0.6s), or a label sticks or flashes. Derive the out time with `Math.max(nextWord, in + hold)` and check it with `L.hold()` (labels: `L.kspan()`).
    - An in-scene `mframe` covers whatever comes after it in the DOM, so place it before the elements it must stay under.
    - Trims and dimension lines start hidden: build them with `stroke-dashoffset="1"` and bring them on with `draw()`.
    - Measure zoom origins in the screen's own px (the shot as sized by `fitShot`), not in frame coordinates. `L.regionOf()` converts a source-PNG region to those px (and to zoomed px).
    - The same image `src` twice in one composition trips `duplicate_media_discovery_risk`; draw the second copy as a CSS `background: url(...)`.
- If a new object is needed (terminal, DB, cloud…), build it from iso boxes (or the Anatomy kit, DESIGN.md 5.8) and the `T` tokens **in this project's `scripts/lib/reel-lib.cjs`**. Never edit the skill's `kit/` or docs while making the reel: it moves into the skill only by SKILL.md rule 8.
- The **CTA layout is fixed** (DESIGN.md section 6.1) and comes from `_cta.cjs` + `reel.json` → `cta`. Don't write your own CTA unless it truly can't be expressed through that config. When the reel cuts into the CTA with a match cut (v4/v5 reels), the last scene file is one line, `module.exports = (L, s, reel) => { const P = require("./_plan.cjs"); return L.ctaCut(s, reel, { inbound: P.inbound("cta"), cam: P.cam("cta") }); };`, and the plan's landing rect is `L.ctaRects(reel.cta).n1` (`require("../../script/reel.json").cta` in `_plan.cjs`), never a hand-copied rect: `ctaCut` throws if the handoff doesn't land on the first trust plate. Same config keys as `ctaScene` (`device`, `glyph`, the last item's `code`, `shotH`, `follow`); the follow line is always "Follow for more useful tools".
- Run `node $P/scripts/build-scenes.cjs`. It writes `compositions/scenes/*.html` and lists each scene's source, then fails (with the fix in each message) on duplicate ids and on declared `boxes` that overlap or leave the field. A missing file renders a "TODO" placeholder, so a full preview works at any time. Edit the `.cjs` files, never the generated HTML. Write them with the Write/Edit tools, not shell heredocs (SKILL.md working notes).

## 7. Validate **[script: `verify.mjs`]**

```bash
node $S/verify.mjs $P                        # build-scenes (+ its checks) → check --strict → snapshots in snaps/review/
node $S/verify.mjs $P --dense                # + one dense sheet per scene: snaps/dense/<scene-id>.jpg
node $S/verify.mjs $P --cuts                 # + one row of frames across every cut: snaps/cuts/NN-NN.jpg
node $S/verify.mjs $P --scenes 05,11 --dense # after a fix: snapshots of those scenes only (the check still covers all)
```
1. It fails on any build check, check error **or warning**. The check runs as JSON, and verify prints a one-line summary per section plus only the errors and warnings, each with its scene, time, selector, message and fix (`--infos` adds the info findings; the full report path is printed). A cold first load that hits `Navigation timeout` is retried once automatically with a longer timeout. Known fixes:
   - `missing_local_asset … repo-header.png`: step 4 isn't done yet.
   - `gsap_timeline_set_initial_hide`: move the hides to `gsap.set` outside the timeline.
   - `negative_z_index`: restructure the elements; don't use z-index −1.
   - A contrast failure on a dark-filled element fading in: use a clipPath wipe or a `tl.set` swap instead of an opacity fade.
   - `duplicate_media_discovery_risk` (the same img src with the same start and duration): draw the second copy as a CSS `background: url(...)` (the lens inset does this).
   - `overlapping_gsap_tweens`: two tweens on the same property of one element overlap in time (typically a zoom in and its zoom out). Retime them so one ends before the other starts.
   - `gsap_repeated_fromto_without_baseline` on a drop + fade pair: use `dropIn` / `assemble`.
   - `gsap_tween_tail` on `span.kw`: a label's exit starts before its rise ends; use `L.kspan()`.
   - `Navigation timeout of 10000 ms exceeded` on the first run after a build: a cold load of heavy screenshots, not a composition error. verify retries once with `--timeout=40000`; if that fails too, look for a genuinely broken asset.
2. Snapshots are taken at each scene's mid-point plus total − 0.4 (the CTA end). `GEMINI_API_KEY` is removed from the environment, so nothing leaves the machine. Run `verify.mjs $P --dense` before the preview too. It takes a frame every 0.6 s and builds **one contact sheet per scene**, `snaps/dense/<scene-id>.jpg` (frames left to right, top to bottom; `snaps/dense/index.md` lists each sheet's times). Midpoints miss what happens between them (a label that never leaves, a trim drawn too early, two objects crossing mid-move); in Paseo the dense sheets caught bugs the midpoints didn't. Read every sheet against the storyboard once. After a fix, re-run with `--scenes <the changed ones>` and read only their sheets.
   The 0.6 s grid skips straight over the cuts, and cuts are where morph, carry, implode and seed bugs show. `verify.mjs $P --cuts` adds **one row of 7 frames across every cut**, `snaps/cuts/NN-NN.jpg` (`index.md` lists the times): framed on the handoff (t0, mid-out, the cut, mid-in, land, land + 0.3) when `_plan.cjs` has one, else around the scene start (an implode, a hold cut or a fade). Read them once before the preview; with `--scenes` only the cuts into or out of those scenes are taken.
3. **Visual self-review (judgement):** open `snaps/review/contact-sheet.jpg` next to `references/golden/contact-sheet-*.jpg` and go through the DESIGN.md section 9 checklist. Check for: no overlaps; art centred in the grid field; at most 10% lime; no header or hero word; captions readable; screenshot outlines; CTA cursor not over the text. Fix and run verify again.

## 8. Preview → **GATE 2**

1. `npx --yes hyperframes@0.8.156 preview --background` (from `$P`), then `preview --status`. Give the user the Studio URL (`http://localhost:<port>/#project/<slug>`).
2. Tell them they can edit directly in Studio. **Stop and wait for their approval.** Apply feedback in the scene files or the script, rebuild, re-verify and refresh. (If the script text changes, re-run `audio.mjs` from `tts`.)

## 9. Render (only after an explicit "render it") **[script: `render.mjs`]**

- `node $S/render.mjs $P` → `renders/<slug>.mp4` at 30 fps / standard, then checks 1080×1920, length = total, an audio stream and integrated loudness (−22…−12 LUFS).
- The user can also export from Studio (that's how v3 was made: 30 fps, mp4, standard).
- `preview --stop` when finished.

---

## 10. Deterministic scripts (`scripts/`)

All of them take the project dir as the first argument (except `setup` and `scaffold`) and read `scripts/config.json` merged with `scripts/config.local.json` (`_common.mjs` helpers; model checks in `models.mjs`, pinned files in `models.json`).

| Script | Does | In → Out |
|---|---|---|
| `setup.mjs [--quick] [--install-runtime]` | Doctor: tools, Python packages, models (size + sha256), Parakeet cache + runtime, music bed, and `kit/API.md` in step with the kit lib. Prints download links for anything missing; never downloads a model | machine → ready / numbered fix list |
| `scaffold.mjs <url> [--slug]` | Copies `kit/` (minus `examples/`) and the music bed into `<videosDir>/<slug>/`; meta, package, `reel.json`, folders (incl. `storyboard/`) | URL → project skeleton |
| `intake.mjs` | `gh api` metadata, raw README, image list (badges removed, stack logos split out), releases, languages, `facts.md` skeleton | `reel.json` → `research/*` |
| `tts.py` | Kokoro af_heart 1.14, trim, 0.3 s gaps, loudnorm −16 LUFS / 48 kHz, 87.5 s voice limit | `lines.json` → `narration.wav`, `narration.json` |
| `transcribe.mjs` | Parakeet; cache filled from `models/parakeet/` (links printed if missing), word-count check | wav → `transcript.json` |
| `align.mjs` | Character-level script↔ASR alignment, line clamping, weak-word report | → `words.json` |
| `timing.mjs` | Scene slots, total, music split, loudness-matched bed volume, beat grid, word cues | → `timing.json`, `cues.md` |
| `captions.mjs` | Dark caption groups, balanced to fit 4 words / 24 chars (`reel.json` → `captions` overrides) | → `compositions/captions.html` |
| `assemble.mjs` | Root index + bg grid | → `index.html`, `compositions/bg.html` |
| `plan.mjs [--force]` | The `_plan.cjs` stub (a call to `L.plan`); never overwrites without `--force` | `timing.json` → `scripts/scenes/_plan.cjs` |
| `audio.mjs [--from step]` | Runs the seven above in order | `lines.json` → assembled project |
| `crop.mjs <spec> [--clean]` | Bounds-checked ffmpeg crops, size report | `_raw-*.png` → `assets/shots/*.png` (subfolders like `site/` allowed) |
| `verify.mjs [--no-snap] [--dense] [--cuts] [--scenes a,b] [--infos]` | `build-scenes` (+ id and box checks) → `check --strict --json` with a compact report → snapshots (`--dense`: a frame every 0.6 s, one sheet per scene; `--cuts`: one row of frames across every cut; `--scenes`: only those scenes) | project → pass/fail + `snaps/review/` (+ `snaps/dense/<scene-id>.jpg`, `snaps/cuts/NN-NN.jpg`) |
| `api.mjs [--check]` | Regenerates `kit/API.md` from the kit lib's comments (`--check`: fails when it's stale; `setup.mjs` runs that) | kit lib → `kit/API.md` |
| `render.mjs [--quality q]` | Render + ffprobe/ebur128 checks | project → `renders/<slug>.mp4` |

In the project (from the kit): `API.md` (the lib reference), `scripts/build-scenes.cjs` (driver; also writes `compositions/bg.html` with the frame chrome, and runs the duplicate-id and box checks), `scripts/lib/reel-lib.cjs` (v3 objects plus the v4 motion layer; the v3 helpers now use the `E` eases and a settling camera, so output is no longer byte-identical to v3's generator), `scripts/scenes/_cta.cjs` (fixed CTA).

**Still judgement (Claude does these, guided by the docs):** reading the repo and picking facts, writing the script (SCRIPT.md), choosing which screenshots to take and how to crop them, writing each `scenes/NN-<id>.cjs` (DESIGN.md), and the visual review against the golden frames.
