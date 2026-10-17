# WORKFLOW.md: /repo-reel end to end

Run the steps in order and tick each one. Steps marked **[script]** are done by a deterministic file in `scripts/` (section 9). Run the script; don't redo its work by hand. Every script prints what it did and exits non-zero with a clear message when something is wrong.
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
node $S/audio.mjs $P                  # tts → transcribe → align → timing → captions → assemble
node $S/audio.mjs $P --from align     # re-run from a later step (tts | transcribe | align | timing | captions | assemble)
```
What each step does (each one can also be run alone as `node $S/<step>.mjs $P` or `python $S/tts.py $P`):

| Step | Does |
|---|---|
| `tts.py` | Kokoro per line, trim, 0.3 s gaps → `narration-raw.wav`; loudnorm → `assets/audio/narration.wav`; writes `narration.json` (sample-exact line starts). **Fails if the voice is over 87.5 s** (the reel is at most 90 s): shorten the script and get it re-approved; never speed up the voice. Warns under 44 s. |
| `transcribe.mjs` | Parakeet → `assets/audio/transcript.json`. It judges by the file, not the exit code (the CLI can exit 1 after a good write). If the HyperFrames cache is missing or broken it refills it from `models/parakeet/`; if those files are missing too it prints the download links and stops. **It never downloads.** Fails if the word count is >15% off the script. |
| `align.mjs` | Character-level alignment of the script's words onto ASR timings, so ASR splits and merges ("open source", "10" for "ten", "checks." swallowing "each network") resolve without hand fixes. It clamps every line to its TTS span, because Parakeet word ends run into the next word and eat the line gaps. → `assets/audio/words.json` `[{text,start,end,line,li}]` in script spelling. Prints weak matches: listen to those words. |
| `timing.mjs` | → `script/timing.json`: scene `NN-<id>` (`p` = `fNN`) starts **0.10 s before its line's first word**, snapped to 0.05 (scene 1 at 0); duration = next start − start; **total = voice length + 2.04 s** (v3: 46.82 + 2.04 = 48.86), and fails over 90 s (`timing.maxReelSeconds`). `beats`: one `[from, bpm, phase]` per music clip for `L.beatGrid(timing.beats)`, or null with a warning when `music.bpm` isn't set. Music: one clip if the bed covers the reel; otherwise the next clip (media-start 0.27) restarts the bed in the latest speech pause before the bed runs out (v3: at or before 42.4 s), repeated as often as needed. |
| `captions.mjs` | Dark v3 captions (DESIGN.md section 8). Groups of at most 4 words / 24 chars; breaks at `,.?!` or a pause > 0.35 s; hold 0.6 s; active word lime. Groups appear with a 0.14 s clip-wipe rise; the opacity fade was replaced because it failed contrast mid-fade. |
| `assemble.mjs` | `index.html` (bg track 0, scenes 1, captions 5, voice 10, music 12) and `compositions/bg.html` (grid), both with the right total. |

(v3 lags the voice by about 0.3 s by accident; new reels lead by 0.1 s. Expect scene starts a few tenths earlier than v3 for the same lines.)

## 4. Screenshots (Chrome DevTools MCP) **[script: `crop.mjs` for post-processing]**

Capture what the script's visual ideas need. That's always **`repo-header.png`** (the CTA needs it; `check` fails without it). **Product images and screenshots can be used in any beat wherever they help**: real UI, diagrams or images from the README or docs, demo frames, starter kits or example outputs. Use as many as the reel needs, as long as each one shows something real and the frame stays readable. Files the user drops in `$P/assets/shots/` count too; use them as they are.

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
5. Optional `app-icon.png`: `curl` it from the repo's icon path (it's in `images.json`).
6. Never recolour, add shadows to, or add a title bar to a screenshot. In the scene it gets a 2.5 px ink outline only (DESIGN.md section 5.7).
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

## 5. Build the scenes (creative step: follow DESIGN.md's locked identity exactly; the layout and motion are yours to design)

Write one file per scene: `$P/scripts/scenes/NN-<id>.cjs` (ids from `timing.json`).
```js
// scripts/scenes/02-meet.cjs
module.exports = (L, s, reel) => {
  const { T, make, plate, appWin, ph } = L;   // everything from scripts/lib/reel-lib.cjs
  const t1 = s.at("Wi-Fi"), t2 = s.at("Ethernet");   // local seconds of spoken words (nth match: s.at("Wi-Fi", 2))
  return { lift: 0, svg: `...`, html: `...`, anim: `...` };   // optional: over, cam, fade (below)
};
```
- `s` = `{id, p, n, line, start, dur, words, at(word, nth)}`. **Every cue time comes from `s.at()`**: the object appears on the word that names it, and the tag pops on the word that confirms it. `s.at` throws if the word isn't in that line.
- Prefix every element id with `s.p` (e.g. `${s.p}-cube`) so ids stay unique.
- Reuse the lib: `make().box`, `tube`, `dtube`, `cube`, `laptop(id, x, y, glyph)`, `phone`, `router`, `adapter(id, x, y, mark)` (chip text, e.g. a 2-letter product mark), `workspace` (sealed per-session container), `appWin`, `plate` (kind `"x"`, `"plus"`, `"none"` for a name plate with no tag, default check), `stag`, `gauge`, `stopwatch`, `icoTile`/`ICONS` (speed, video, game, magnet, download, file, slides, sheet, chart, more, image, mic, pen, figure), `mediaCard(id, ox, oy, "video"|"voice"|"image")`, `layer` (version sheet), `slider`/`sliderAnim`, `hlBox` (highlight over a screenshot region), `ph` (screenshot), `lead`, `barrow`, `limeEdges`, and the crafted objects `selector(id, ox, oy, u)` (rotary selector) and `board(id, ox, oy, mark, u)` (router board), plus `anat(ox, oy, u)` to build new ones (DESIGN.md 5.8, worked example `kit/examples/crafted/`). See `kit/examples/v3/build-scenes.cjs` for how v3 used each one.
- **v4 motion (default for new reels; DESIGN.md section 7 "v4 motion layer", worked example `kit/examples/v4/`):**
  - Start from `kit/examples/v4/_plan.cjs`: set each scene's `lift` and `camEnd`, the rects `R` the cuts connect, and one `hand(from, to, A, B, t0, cut, land)` per cut. `cut` must equal the next scene's start from `timing.json`, and `land` sits on a music beat: `const beat = L.beatGrid(timing.beats)` (from `timing.json`; it follows the bed across restarts). If `beats` is null, the track's tempo isn't set: ask the user for it, or land cuts on words only. Plan the cuts after `timing.json` exists, and rebuild the plan if timing changes.
  - A scene returns `cam: P.cam(key)`. It also returns `fade: false` and `over: mframe(...)` when it hands off, and uses `morphCode` / `L.carry` on both sides of each cut. The extra return keys are `over` (HTML in the screen layer above the camera), `cam` (`{s, x, y, t0, t1}`) and `fade` (false = no end fade).
  - Timeline helpers available in `anim`: `E.*` eases, `seg`, `slide`, `fadeUp`, `draw`/`untrim`, `wipe`/`unwipe`, `wipeIn`/`wipeOut`, `pop`/`unpop`, `lead`/`unlead`, `kin`/`kout`, `type`/`untype`, `plateIn`, `away`, `drift`, `run`, `mfSet`/`morph`, `flow`. Lib objects: `appWinC`, `mframe`, `trimRect`, `hlTrim`, `pulse`, `klabel`, `typed`, `MB()`.
  - Gotchas (each one cost a debug round): a later `fromTo` on the same property needs `immediateRender: false`. Tween trims with `attr: {"stroke-dashoffset"}`, never the CSS property. Motion-blurred elements whose contents animate are carried by static flyers. No camera or drift longer than `L.SETTLE` (the outlines shimmer). Every element appears on its own word, so land a handoff on whatever is spoken at the cut. `data-layout-allow-overlap` is not inherited, so put it on the children that are meant to overlap too. Don't run `hyperframes add motion-blur`: the runtime already ships as `assets/js/motion-blur.js`, and the registry component (a paste-in snippet under `compositions/components/`) fails Studio's lint (no `data-composition-id`, too many lines).
- If a new object is needed (terminal, DB, cloud…), build it from iso boxes (or the Anatomy kit, DESIGN.md 5.8) and the `T` tokens **in this project's `scripts/lib/reel-lib.cjs`**. Never edit the skill's `kit/` or docs while making the reel: it moves into the skill only by SKILL.md rule 8.
- The **CTA layout is fixed** (DESIGN.md section 6.1) and comes from `_cta.cjs` + `reel.json` → `cta`. Don't write `08-cta.cjs` unless the CTA truly can't be expressed through that config, or the reel uses v4 match cuts. In that case copy `kit/examples/v4/08-cta.cjs` (same layout and config, v4 motion, the inbound cut lands on the first trust plate).
- Run `node $P/scripts/build-scenes.cjs`. It writes `compositions/scenes/*.html` and lists each scene's source. A missing file renders a "TODO" placeholder, so a full preview works at any time. Edit the `.cjs` files, never the generated HTML.

## 6. Validate **[script: `verify.mjs`]**

```bash
node $S/verify.mjs $P        # build-scenes → check --strict → snapshots in snaps/review/
```
1. It fails on any check error **or warning**. Known fixes:
   - `missing_local_asset … repo-header.png`: step 4 isn't done yet.
   - `gsap_timeline_set_initial_hide`: move the hides to `gsap.set` outside the timeline.
   - `negative_z_index`: restructure the elements; don't use z-index −1.
   - A contrast failure on a dark-filled element fading in: use a clipPath wipe or a `tl.set` swap instead of an opacity fade.
2. Snapshots are taken at each scene's mid-point plus total − 0.4 (the CTA end). `GEMINI_API_KEY` is removed from the environment, so nothing leaves the machine.
3. **Visual self-review (judgement):** open `snaps/review/contact-sheet.jpg` next to `references/golden/contact-sheet-*.jpg` and go through the DESIGN.md section 9 checklist. Check for: no overlaps; art centred in the grid field; at most 10% lime; no header or hero word; captions readable; screenshot outlines; CTA cursor not over the text. Fix and run verify again.

## 7. Preview → **GATE 2**

1. `npx --yes hyperframes@0.8.156 preview --background` (from `$P`), then `preview --status`. Give the user the Studio URL (`http://localhost:<port>/#project/<slug>`).
2. Tell them they can edit directly in Studio. **Stop and wait for their approval.** Apply feedback in the scene files or the script, rebuild, re-verify and refresh. (If the script text changes, re-run `audio.mjs` from `tts`.)

## 8. Render (only after an explicit "render it") **[script: `render.mjs`]**

- `node $S/render.mjs $P` → `renders/<slug>.mp4` at 30 fps / standard, then checks 1080×1920, length = total, an audio stream and integrated loudness (−22…−12 LUFS).
- The user can also export from Studio (that's how v3 was made: 30 fps, mp4, standard).
- `preview --stop` when finished.

---

## 9. Deterministic scripts (`scripts/`)

All of them take the project dir as the first argument (except `setup` and `scaffold`) and read `scripts/config.json` merged with `scripts/config.local.json` (`_common.mjs` helpers; model checks in `models.mjs`, pinned files in `models.json`).

| Script | Does | In → Out |
|---|---|---|
| `setup.mjs [--quick] [--install-runtime]` | Doctor: tools, Python packages, models (size + sha256), Parakeet cache + runtime, music bed. Prints download links for anything missing; never downloads a model | machine → ready / numbered fix list |
| `scaffold.mjs <url> [--slug]` | Copies `kit/` (minus `examples/`) and the music bed into `<videosDir>/<slug>/`; meta, package, `reel.json`, folders | URL → project skeleton |
| `intake.mjs` | `gh api` metadata, raw README, image list (badges removed, stack logos split out), releases, languages, `facts.md` skeleton | `reel.json` → `research/*` |
| `tts.py` | Kokoro af_heart 1.14, trim, 0.3 s gaps, loudnorm −16 LUFS / 48 kHz, 87.5 s voice limit | `lines.json` → `narration.wav`, `narration.json` |
| `transcribe.mjs` | Parakeet; cache filled from `models/parakeet/` (links printed if missing), word-count check | wav → `transcript.json` |
| `align.mjs` | Character-level script↔ASR alignment, line clamping, weak-word report | → `words.json` |
| `timing.mjs` | Scene slots, total, music split, loudness-matched bed volume, beat grid | → `timing.json` |
| `captions.mjs` | Dark caption groups | → `compositions/captions.html` |
| `assemble.mjs` | Root index + bg grid | → `index.html`, `compositions/bg.html` |
| `audio.mjs [--from step]` | Runs the six above in order | `lines.json` → assembled project |
| `crop.mjs <spec> [--clean]` | Bounds-checked ffmpeg crops, size report | `_raw-*.png` → `assets/shots/*.png` |
| `verify.mjs [--no-snap]` | `build-scenes` → `check --strict` → snapshots | project → pass/fail + `snaps/review/` |
| `render.mjs [--quality q]` | Render + ffprobe/ebur128 checks | project → `renders/<slug>.mp4` |

In the project (from the kit): `scripts/build-scenes.cjs` (driver), `scripts/lib/reel-lib.cjs` (v3 objects plus the v4 motion layer; the v3 helpers now use the `E` eases and a settling camera, so output is no longer byte-identical to v3's generator), `scripts/scenes/_cta.cjs` (fixed CTA).

**Still judgement (Claude does these, guided by the docs):** reading the repo and picking facts, writing the script (SCRIPT.md), choosing which screenshots to take and how to crop them, writing each `scenes/NN-<id>.cjs` (DESIGN.md), and the visual review against the golden frames.
