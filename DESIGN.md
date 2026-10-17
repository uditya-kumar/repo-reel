# DESIGN.md: the repo-reel frame style ("Editorial Isometric Line", dark)

This file defines how every frame of a repo reel looks and moves. It is the v3 MultiPath reel turned into rules.
It has two parts:
- **Locked identity** (sections 1–3, the frame anatomy rules in 4, the line work and screenshot rules in 5, the CTA in 6.1, the bans in 7, and 8 captions). This is the brand. It never changes between reels.
- **Open: motion and layout.** The scene patterns in 6 and the motion primitives in 7 are proven examples, not a closed list. Each reel should design the scenes its content needs, as long as every frame stays inside the locked identity.
Visual references: `references/style-reference-dark.png` (target look) and `references/golden/` (v3 frames, the quality bar).

**Contents:** 1 Style · 2 Palette · 3 Type · 4 Frame anatomy · 5 Building blocks (5.1 Projection, 5.2 Line, 5.3 Fills, 5.4 Objects, 5.5 Tags, 5.6 Plate, 5.7 Screenshots, 5.8 Crafted objects) · 6 Scene patterns (6.1 CTA) · 7 Motion (eases, primitives, v4 motion layer, bans) · 8 Captions · 9 Checklist

---

## 1. The style in one paragraph

This is a calm, technical, editorial product illustration on a near-black page.
Dark-grey **isometric objects** are drawn with **thin, even, off-white outlines** and flat fills. They sit on a faint **column grid**.
A single **acid-lime accent** marks the meaningful parts: data flow, check tags, progress and the active caption word. Everything else stays neutral.
Text uses **Inter**, laid out like a printed spec sheet: small all-caps callout labels with leader lines. There is **no header block and no hero word** (no title, kicker, subtitle or big per-frame heading). The illustration carries each frame, and the captions carry the words.
There are no gradients, drop shadows, glows, rounded "app UI" chrome or hand-drawn wobble. It should feel like a diagram from a well-designed hardware manual.

**Keywords:** isometric, line art, technical manual, editorial, quiet, precise, monochrome plus one accent.

---

## 2. Colour palette

| Token | Hex | Role |
|---|---|---|
| `paper` | `#0E0F11` | Page background, the dominant colour. Near-black with a faint cool cast. |
| `hi` (paper-hi) | `#18191C` | Raised flat surfaces: label plates, caption plates, app windows and title bars, keys, LEDs. |
| `sheet` | `#16171A` | Paper sheets and document faces. |
| `grid` | `#24252A` | Column-grid rules and the mid horizontal rule. |
| `rule` | `#34363B` | Hairline at the bottom edge of the grid field. |
| `g100` | `#3A3C40` | Lit top faces of hardware (the lightest object tone); empty gauge cells. |
| `g300` | `#2C2D31` | Mid fills: placeholder blocks, left side faces. |
| `g500` | `#202124` | Shaded right side faces, antenna cores. |
| `g700` | `#111214` | Recesses: port slots, circuit traces. |
| `g900` | `#0A0B0C` | Screens and dark insets (phone screen, laptop screen, chip top). |
| `dark` | `#4A4C51` | Neutral fill: the dark block arrow and the "X" (failed/no) tag. |
| `ink` | `#ECEBE6` | All outlines and all text. A warm off-white; never pure `#FFF`. Also used for marks on dark screens ("5G", signal bars, chip text). |
| `lime` | `#D3F654` | **The only accent.** Shaded cube faces use `limeL #B9DC3A` and `limeR #9DBF2B`. |
| `on` (on-lime) | `#0E0F11` | Anything drawn *on* lime: check marks, the plus, lime outlines, the progress-fill edge and the active caption word's text. |

Rules:
- **60 / 30 / 10 split:** page (60%), greys and off-white line art (30%), lime (at most 10%, usually under 5%).
- Lime shapes are outlined in `on` (dark), never in ink, so they read as solid accents. This covers lime tubes, cubes, gauge cells, block arrows and tags. Marks on lime are always `on`.
- Never put lime text on the page. Lime is a fill, never a text colour.
- Light falls from the top: top faces are the lightest (`g100`), left faces one step darker (`g300`), right faces darkest (`g500`).
- Use only one accent colour. Status is shown with lime versus grey: a lime check tag means good, a `dark` X tag means no or failed. Never red or green.
- Small-text contrast: ink on paper is about 16:1, and every text check must pass WCAG AA.
- The tokens live in one place, `kit/assets/js/iso.js` (`T`). Generated CSS and SVG read from `T`, so never hard-code a hex value in a scene.

---

## 3. Typography

**Inter only** (`assets/fonts/Inter-var.woff2`, weights 400/500/600, declared with `@font-face` in every composition). No monospace, italics, outlined text or text on lime. For numbers, use `font-variant-numeric: tabular-nums`.

| Role | Size | Weight | Case and tracking | Where |
|---|---|---|---|---|
| Callout label ("NEW / CONNECTION", "SPARE SPEED") | **30px**, 36px line step | 400 | ALL CAPS, `0.04em` | SVG text in the margins, joined to its object by a leader. Wrap to two short lines. |
| Object caption ("WI-FI", "PHONE") | 30px | 400 | ALL CAPS, `0.04em` | Centred under an object. |
| Label plate ("FREE + OPEN-SOURCE") | 30px | 600 | ALL CAPS, `0.04em` | Inside a plate (section 5.6). |
| Window title ("Browser") | 26px | 500 | Sentence case | Drawn window title bars only. |
| Data readout ("9.6 MB/s", "10 Mbps") | 30–56px | 600 | As written, tabular numbers | Inside windows and above bars. |
| CTA line ("Follow for more useful tools") | 56px | 600 | Sentence case, `-0.01em` | The CTA frame only. |
| URL plate | 34px | 500 | As written, `0.01em` | The CTA frame only. |
| Captions | 54px | 600 | Sentence case, `-0.01em` | Section 8. |

Text is always ink, on the page or on a dark plate. Labels never sit on top of objects.

---

## 4. Frame anatomy (1080 × 1920)

| Zone | Position | Contents |
|---|---|---|
| Top safe area | y 0 → 305 | Empty page. The Instagram UI sits here. |
| **Grid field** | x 58 → 1022, y 305 → 1305 | All illustration, labels and screenshots. |
| Caption band | y 1420 → 1540 | The caption plate, centred. |
| Bottom safe area | y 1540 → 1920 | Empty. The Instagram UI sits here. |

- **Grid:** 11 vertical rules at x = 58 + 96.4·i (i = 0…10) from y 305 to 1305, plus a horizontal rule at y 800, all `grid` 1.5px. A bottom hairline at y 1305 in `rule`. The grid is a persistent background composition: it never moves, fades or changes between scenes.
- **Margins:** 58px left and right. Nothing goes past x 58 or x 1022.
- **Centring:** each scene's art is vertically centred in the field (art spans about y 400 → 1200). A scene is drawn at natural coordinates and shifted with a per-scene **lift** (the `.lift` wrapper's `top`, e.g. -140px), never by moving every object.
- **Lots of empty page:** about 40–45% of the field stays empty. Don't fill gaps with decoration.
- **One vertical story per frame:** objects zig-zag down the page (top → middle → bottom left/right), joined by tubes or arrows, so the eye reads top to bottom like a flowchart.
- **No overlaps:** objects never overlap each other, and labels never overlap objects. Element ids are unique within a scene.

---

## 5. Building blocks

These exist as helpers in the kit. Reuse a kit object first. When a beat needs one that doesn't exist yet (terminal, database, cloud, queue…), build it from iso boxes and the `T` tokens with the same line work, in the reel project's own `scripts/lib/reel-lib.cjs`. It moves into the skill's kit (listed in 5.4 or 5.8) only by SKILL.md rule 8.

### 5.1 Projection
- **30° true isometric** for every 3D object (`make(ox, oy)` in `iso.js`: x runs down-right, y down-left, z up). The same viewpoint and scale family is used across the whole reel.
- **UI is flat and frontal:** app windows, screenshots, plates, icons, the stopwatch and gauges are not projected.

### 5.2 Line work
| Stroke | Width | Use |
|---|---|---|
| Primary outline | **2.5px** | Silhouette and every face edge of every object, plates, windows and screenshots. |
| Detail line | **1.25–2px** | Keys, slots, seams, gauge cells, small LEDs. |
| Leader line | **2px** | Label leaders, with orthogonal elbows and a solid triangular arrowhead (13 × 12). |
| Grid | **1.5px** | Background only. |

Use round caps and joins. Line weight never changes with depth.

### 5.3 Fills (3-tone, flat)
Top = `g100` (or `hi` for small parts), left = `g300`, right = `g500`. Recesses and screens = `g700` / `g900`. There are no gradients, soft shadows, highlights or glare. Depth comes only from face tone and outlines.

### 5.4 Objects (library)
- **Hardware:** router (box, two antennae, three LEDs with one lime), phone (slab, dark screen with "5G" and signal bars), laptop (open lid, key grid, dark screen with a lime glyph), adapter or chip board (slab, port row, traces, "MP"-style chip), Ethernet box (two ports, lime LED), workspace (closed container, lid seam, folder mark, lime LED), stopwatch (flat dial, lime pie sweep).
- **Data:** packet cube (lime, 22px, or 18px when there are many lanes), cable tube (double line: ink outline, `paper` core, w 10, or 8 when there are many lanes), lime flow tube (same, with a lime core and dark edge), gauge (10 cells, lime = available), progress bar (`hi` track, lime fill wiping left to right).
- **Arrows:** chunky lime block arrow for the main "this becomes that" step; `dark` block arrow for a neutral flow.
- **Drawn app window:** flat rectangle with a 46px title bar, three 12px ring dots and a centred title, holding grey placeholder blocks (`g300`, light ones `g100`). Use it for generic apps ("Browser", "Steam", "Download").
- **Icon tile:** a 68px flat square (`hi` fill, ink outline) with a simple line icon, used in checklist rows.
- **Cursor:** a flat arrow pointer in ink with a dark edge.
- **Media card** (`mediaCard(id, ox, oy, kind)`): a thin iso slab standing on its edge with a dark screen showing the medium: `video` (play mark + lime subtitle bar), `voice` (waveform bars, centre ones lime), `image` (mountains + lime sun). Use it for content types (videos, voiceovers, images) rather than devices.
- **Version layer** (`layer(id, ox, oy, z, "V1")`): a thin iso sheet with its name on the top face. Stack several at rising z for a version history or a layered build; wrap each in its own group so the stack can explode (section 7).
- **Settings slider** (`slider` + `sliderAnim`): flat track, lime fill and a square knob inside a window; the knob glides and the fill grows with it. Use it for "adjust the settings", tuning, or a manual change.
- **Highlight box** (`hlBox(id, x, y, w, h)`): a 4px lime outline with dark edges on both sides, laid over a screenshot region and popped on the word that names that region (a tab, a row, a tool grid).
- **More icon tiles:** `image` (thumbnail), `mic` (voice), `pen` (scripts/writing), `figure` (stick figure).
- **v4 motion objects (HarnessRouter):**
  - **Layered app window** (`appWinC(id, x, y, w, h, title, inner, {attr})`): an `appWin` whose chrome and contents sit in one layer (`#id-c`), so the contents can wipe out and leave the bare outline. That outline is what a morph frame picks up at a match cut.
  - **Morph frame** (`mframe(id)`): a window outline built from five transform-only parts (fill and four 2.5px edges), each motion-blurred. It changes size and place without distortion: the edges stay 2.5px at any size.
  - **Trim rect** (`trimRect`) and **trim highlight box** (`hlTrim(id, x, y, w, h)`, HTML inside a window): an outline or a lime 4px box with dark edges that draws on as a trim path, instead of popping.
  - **Data pulse** (`pulse(id, d, {lime, len, w})`): a short segment that runs inside a tube's core (`dark`, or lime with a dark edge). Use it for traffic where cubes would crowd the frame.
  - **Kinetic label** (`klabel(id, x, y, lines, {a})`): a callout label (same type as section 3) with each word in a mask, so it can rise in word by word.
  - **Typed value** (`typed(id, text)`): text whose characters rise in one by one inside a mask. Use it for field values and terminal lines. `--` stays one unit.
  - **Label plate mask:** a plate's name sits in `.pt > .pw`, so `plateIn()` can wipe the frame and rise the name. It looks the same at rest.
- New tools often need new objects (terminal, database cylinder, server rack, cloud, file stack, Git branch, container box, lock, API block). Build each one from `make().box()` (or the Anatomy kit, 5.8) and the same tones in the reel project. It joins the kit library by SKILL.md rule 8.

### 5.5 Tags
A small parallelogram (`14,2 56,2 44,38 2,38`, 58 × 40):
- **check** = lime fill with a dark check (good, yes, supported).
- **x** = `dark` fill with an ink X (no, failed, not needed).
- **plus** = lime fill with a dark plus (add, follow).

Tags pop on the spoken key word.

### 5.6 Label plate
A flat bar 68px tall: `hi` fill, 2.5px ink outline, square corners, Inter 600 30px all caps with 22px left padding, and a tag on the right. Use it for feature lists, checklist rows and trust points ("NO SERVER ✕", "RUNS ON YOUR PC ✓"). Standard widths are 500px (centred at x 290) or 616px in checklist rows.

### 5.7 Screenshots and product images
- Real product images and screenshots (app UI, README diagrams, docs pages, demo frames, example outputs) can appear in any scene wherever they explain the beat better than a drawing, alone or combined with iso objects, plates and labels. They're part of the open layout, not limited to the meet beat.
- Show the real UI, flat and frontal, inside a plain **2.5px ink outline**. Don't add a title bar or three-dot chrome; the app's own UI is the frame. No shadow, rotation, perspective or rounded corners.
- Pages are captured light or dark as they appear; never recolour a screenshot.
- Size them to read on a phone: at least 420px wide for an app panel and the full field width (964px) for a web page.

### 5.8 Crafted objects (Anatomy kit)
For the one object a beat is *about* (the product's engine, the thing that routes, stores or switches), draw a crafted object instead of plain boxes: a real piece of hardware made of parts, whose mechanism shows the idea. First used in the HarnessRouter reel: the router board (solution) and the rotary selector (switch). Worked example: `kit/examples/crafted/` (drop-in replacements for v4's 04/05 scenes; they read `kit/examples/v4/_plan.cjs`).
- **Geometry:** `kit/scripts/lib/anatomy/iso-kit.mjs` (from the Anatomy skill, MIT, `LICENSE` beside it) through the adapter `anat.cjs`. `L.anat(ox, oy, u)` returns `{at, slab, cyl, gland, screw, tick, circ, topM, ink, solid, K}`. Its camera is set so `at([x, y, z])` equals `make(ox, oy).P(x, y, z)` exactly at u = 1, so crafted objects, boxes and tubes share one projection. `u` scales the object; strokes stay at the identity weights.
- **Parts vocabulary:** rounded-plan slabs with a 3px bevel, feet or standoffs, a side seam, screws, vent slots, top-face traces, glands (port nozzles with a dark bore), lamps, detent ticks, a knob with grip ring and pointer, a chip with pins and the product mark (Inter 600). Keep it to what a manual drawing would show; every part should be explainable.
- **Tones (flat, 3-tone, as 5.3):** the lit side `g300`, the shade side `g500`, tops `g100` (`g500`/`g900` for small dark parts), recesses `g900`. Outline and creases in ink at 2.5px, bevel and detail lines at 1.25–1.5px. Each flat layer is stroked in its own fill at 0.6px so no seam shows.
- **The object is the explanation:** every tube starts or ends on one of its ports (`ports`, `top`, `sock` points), never on a blank face. **One lit part:** each port has a lamp (dark well + lime cap at opacity 0); only the active route's lamp lights, on its word. It is the frame's one accent with the lime tube.
- **Library:**
  - **Rotary selector** (`selector(id, ox, oy, u = 1.3)`): base on feet, housing with two output glands (port 0 lower-left on +y, port 1 lower-right on +x), a lamp each, detent ticks, collar, knob with pointer, input coupling on the axis. Returns `{svg, parts (5, bottom-up), top, ports}`; pointer `#id-ptr` (`gsap.set(svgOrigin "0 0")`, rotation 0 = port 0, −90 = port 1), lamps `#id-lp0/1`. Use it for a choice, a switch, a config value that picks a route.
  - **Router board** (`board(id, ox, oy, mark, u = 1)`): standoffs, bevelled board, vents, screws, traces, a marked chip, capacitors and an input socket, three output glands with lamps (two on +y, one on +x). Same footprint as `adapter()`; `(ox, oy)` is the back corner. Returns `{svg, parts (3), sock, ports}`; lamps `#id-lmp0..2`. Use it for an engine, gateway or router that fans one input out.
- **Motion:**
  - **Assemble bottom-up:** the parts drop in order (y −34…−40 → 0, 0.36–0.5s `E.out`, stagger 0.045–0.07s), each with a **short** opacity fade (0.08–0.1s). A long fade shows the parts beneath through it.
  - **Mechanism:** a knob turns one detent (−90°, 0.55s `E.inOut`, no overshoot); the old lamp goes out as it leaves, the new lamp and lane light as it arrives.
  - **Packets** drop into the input (socket or cap), hide, then a new cube leaves by the selected port.
  - **Exit:** the parts lift top-first (`stagger from: "end"`, y 0 → −24, `E.in`) while the object's wrapper group fades as one, so it never goes see-through.
- **Never take from Anatomy:** its halo or blur, its CSS classes, its mono font, its cards and labels, `lathe.mjs` (not shipped). The identity stays ours.

---

## 6. Scene patterns (examples, not a mapping)

These are proven patterns from v3. A beat may use one, combine two, or use a new layout entirely, as long as it keeps the grid, the centring, the empty space and the no-overlap rules (section 4). A pattern a reel invents joins this table by SKILL.md rule 8.

| Type | v3 example | Layout |
|---|---|---|
| **hook** | "Wi-Fi + mobile data on your PC" | Two source objects at the top (left/right), a "+" between, lime block arrows converging on the user's device below. Margin labels with leaders. |
| **meet** | MultiPath tray app | Real app screenshot on one side, 2–3 feature plates with check tags on the other, one margin label pointing into the screenshot. |
| **mechanism** | virtual adapter catches all traffic | 2–3 app windows at the top, a central "engine" object (board or chip), tubes from the apps into the engine, packets flowing, then outputs to the destinations below. |
| **decision** | picks the network with the most speed | Input window → engine → two branches; gauges under each destination; packets go to the better branch and its tag pops; the gauges update. |
| **math / compare** | 10 + 10 ≈ 20 Mbps | Two isometric bars with numbers above, a "+", a lime block arrow, then the combined result bar in lime. |
| **reliability** | checks every 5 s, one drops | Engine at the top, three lanes with probes, a stopwatch sweep, check tags per lane; the failing lane greys to 30% opacity and its tag flips to X. |
| **checklist** | speed tests, YouTube, Steam… | Rows of icon tile + plate, one row per spoken item, check tags popping on the word. |
| **payoff** | download gets faster | Download window with a rate readout and progress bar, many lime lanes fanning to the sources, a "GETS FASTER" plate. |
| **two ways in** (OpenCreator) | pick tools yourself, or tell the agent | Split / compare across the centre grid rule (x 540): left a Workspace window (tool picked with a highlight box, sliders move), right an Agent chat (request types in, reply ticks). One caps label under each column. |
| **input → real result** (OpenCreator) | upload a video, choose a language → subtitles, dubbing | Inputs at the top (media card, a window whose value flips), tubes merging into the real product screenshot below, packets flowing in, highlight boxes landing on the result tabs on their words. |
| **two-way sync** (OpenCreator) | agent and workspace stay in sync | Real agent panel above, drawn Workspace window below, two tubes between them: packets run down one (the agent's change moves a slider) and up the other (a cursor drags a slider by hand); on "sync" the panel's synced rows get highlight boxes and an "In sync" plate ticks. |
| **version history** (OpenCreator) | every change saves a new version | Version layers drop onto a stack one per change, the new one gets a tag; on "compare" the stack explodes along z so each version is visible, with NEW / EARLIER leaders. |
| **trust + CTA** | no server, no account / follow | Beat A: 2 X-plates + device + 1 check-plate. Beat B: CTA frame (section 6.1). |
| **match-cut chain** (HarnessRouter) | the whole reel | No scene fades out: each scene's main window shrinks or grows into the next scene's first object (window → window, window → plate, plate → lane end). The cuts are planned in one place (`_plan.cjs`, section 7 "Handoffs"). |
| **value switch** (HarnessRouter) | change `codex` to `claude-code` | The real request field types the first value and traffic runs down its lane. On "change" the value backspaces and retypes, the lime lane retracts and redraws to the new target, its tag moves, and a trim box rings the field on the word that names it. |
| **split → merge → grow** (HarnessRouter) | each session gets its own workspace | One plate splits into three (y steps of 210) that each get an arrow and a sealed workspace. On the next clause they merge back, and the survivor's outline grows into a window (an in-scene morph) that then fills on its words. |
| **screenshot push** (HarnessRouter) | slides, spreadsheets, dashboards | One window holds several screenshots. On each spoken item the current one pushes out left as the next enters from the right (one 0.6s `E.inOut` move, motion-blurred), while a 2×2 checklist fills in below. |

A scene can hold two beats (A then B). The outgoing beat fades over 0.25–0.3s while the grid stays, then the next beat builds. In a match-cut reel the outgoing beat clears with exits instead (`kout`, `wipeOut`, `untrim`, `away`), so the morph frame is the last thing standing.

### 6.1 CTA frame (fixed layout, last scene)
- Repo page screenshot, full field width (x 58, 964px wide, top ≈ 370), ink outline only.
- URL plate centred below it (top ≈ 910): `github.com/<owner>/<repo>`, sentence case.
- "Follow for more **useful tools**" (top ≈ 1012), with a lime underline bar (dark edge) wiping in under "useful tools".
- Follow button (420 × 92, top ≈ 1124, centred): state A has an ink fill, dark "FOLLOW" text and a lime plus tag. A cursor glides in from the bottom right and clicks (button scales to 0.95 and back). State B has a dark fill, ink "FOLLOWING" text and a lime check tag. The cursor rests on the button's bottom-right corner, never over the text.
- **v4 CTA motion** (`kit/examples/v4/08-cta.cjs`, same layout as `L.ctaScene` with `device: false`): the previous scene's window lands as the first trust plate (it rises its name in). Each later plate wipes in on its word, and the Terminal wipes in only on "Docker", with its command typing out under it. Nothing appears before its word. On "Follow" the plates and the code wipe out, and the Terminal's outline grows into the repo window (an in-scene morph). Then the URL wipes in, the follow line rises word by word, the underline wipes, and the cursor arrives on an arc (x `E.out`, y `E.outQ`) and clicks.

---

## 7. Motion language

- **Easing set (v4, `E` in every scene timeline, `EZ` in the lib).** These are custom cubic Béziers whose y stays inside 0..1, so nothing overshoots. Use them instead of GSAP presets.

  | Ease | Control points | Use |
  |---|---|---|
  | `E.out` | 0.16, 1, 0.3, 1 | UI entrances (slides, wipes, pops, kinetic words) |
  | `E.outQ` | 0.22, 1, 0.36, 1 | softer settles (fills, the cursor's y) |
  | `E.inOut` | 0.65, 0, 0.35, 1 | parts moving between two rests (splits, merges, pushes, in-scene morphs) |
  | `E.in` | 0.55, 0, 1, 0.45 | exits (they accelerate away) |
  | `E.ramp` | 0.8, 0, 0.2, 1 | speed-ramped match cuts (slow, fast, slow; the cut sits near peak speed) |
  | `E.cam` | 0.45, 0, 0.55, 1 | camera and parallax |
  | `E.flow` | 0.4, 0, 0.2, 1 | trim paths and tubes drawing on |
- **Build, don't bounce.** Objects assemble the way a manual would show them.
  - **Isometric slide-in:** from x +40, y −23 (or along the matching axis), opacity 0 → 1, 0.55s `E.out`.
  - **Windows and screenshots:** a clip wipe (`wipeIn`, 0.5s `E.out`), or a rise y 40 → 0 with opacity.
  - **Labels:** kinetic labels rise word by word in their masks (`kin`, 0.5–0.6s `E.out`, a stagger of 0.05s, or the gap between the spoken words), or fade up 10px over 0.35s. Leaders draw on in 0.32s and their arrowhead pops at the end. They leave with `kout` / `unlead`.
  - **Plates:** `plateIn`: the frame wipes in and the name rises in its mask 0.1s later.
  - **Tubes:** both strokes draw on together, 0.4–0.5s `E.flow`, and retract with `untrim`.
  - **Tags:** pop scale 0.6 → 1 with opacity, 0.22s `E.out`, **on the spoken key word**. They leave with `unpop`.
  - **Block arrows and underline bars:** wipe in from the tail (scaleX 0 → 1), 0.35–0.4s, and leave with `unwipe`.
- **Packets** travel along sampled tube paths at an even pace (`ease: "none"`, keyframes with `easeEach: "none"`), looping a finite number of times. No infinite repeats.
- **Camera:** each scene makes one short eased move (default scale 1 → 1.03, origin 50% 45%, `E.cam`) that **settles within `L.SETTLE` (1.1s) and then holds still**. In a match-cut reel it starts when the inbound handoff lands and goes to that scene's `camEnd` (`P.cam(key)`). A scene without an outbound match cut clears with a 0.25s opacity fade at the end. The grid stays fixed underneath.
  - **Never crawl:** a slow push or drift across a whole scene moves every 2.5px outline a fraction of a pixel per frame. The antialiasing shifts frame to frame, so the lines shimmer between ink and grey, and it is worst in Studio's scaled-down player. Measured: a still frame is pixel-identical frame to frame, while a full-scene push varies a border's brightness by about 8%. Parallax `drift()` is capped at `SETTLE` for the same reason.
- **More approved primitives** (all calm, eased with the `E` set, seek-safe; use whichever the beat needs):
  - **Typing / terminal reveal:** a line of text appears character by character or line by line (stepped `tl.set` or a clip wipe), with an optional block cursor in ink.
  - **Count-up:** a number in a plate or readout counts to its value (tween a proxy object and write the rounded value in `onUpdate`), ending on the word.
  - **Clip or mask reveal:** a shape or screenshot reveals behind a moving clipPath edge (left → right or bottom → top).
  - **Screenshot zoom and pan:** a slow push into one region of a screenshot inside its window (scale ≤ 1.6, `power2.inOut`), with a highlight box (2.5px lime outline with a dark edge, or an ink box) drawing on around the UI element being named.
  - **Value or state swap:** a field, chip or label flips from one value to another on the word (old fades out, new pops in), like the `harness_id` flip.
  - **Morph:** one diagram becomes another by moving its parts (positions, lengths, a path's points); no shape-tweening blobs.
  - **Split or compare:** the field splits into two columns (before / after, with / without) divided by a grid rule, built side by side on their words.
  - **Stagger grid:** many small identical items (tiles, cubes, rows) build in a short, even stagger (0.04–0.08s each).
  - **Split and merge:** one object divides into several (or several join into one) along tubes or arrows.
  - **Image swap:** screenshots in one window replace each other with a short slide (x 60 → 0), one per spoken item.
  - **Exploded view:** a stack of layers separates along z (bottom moves down, top moves up, the middle stays, so the stack's centre never moves), 0.7s `power2.inOut`, with leaders riding along with their layers. Open the gap far enough that no layer overlaps another (for a 300 × 200 layer, 266px of z apart).
  - **Drop-on:** a layer or part drops onto a stack from above (y −60 → 0 with opacity, 0.5s `power3.out`), one per spoken change.
  - **Drag:** the cursor appears on a slider knob and drags it; the knob, fill and cursor move together (one `x` tween each, same ease).
  New primitives are welcome if they meet the same bar. They join this list by SKILL.md rule 8.
- **v4 motion layer (HarnessRouter; the scenes are in `kit/examples/v4/`):**
  - **Handoffs (object-based match cuts).** One object travels from screen rect A in scene N to rect B in scene N+1 as **one** eased curve (`E.ramp`) from `t0` to `land`. `L.handoff()` splits that curve at the cut fraction f, so scene N plays `seg(E.ramp, 0, f)` and scene N+1 plays `seg(E.ramp, f, 1)`, and position and speed match across the cut. Snap `land` to a music beat (`L.beatGrid(timing.beats)`, the grid `timing.mjs` writes from the track's `music.bpm`). Put the cut near peak speed (f ≈ 0.35–0.6) and keep each side 0.23–0.5s long.
  - **The plan.** All lifts, camera end states, handoff rects and times live in one file, `scripts/scenes/_plan.cjs` (`P.H.hN`, `P.R`, `P.cam(key)`, `P.side(...)`), so both sides of a cut read the same numbers. A scene asserts that its real layout equals the plan's rect and throws if it drifts.
  - **Morph frames.** For window → window (or window → plate) cuts, the outline itself travels: `morphCode(id, h, "out", at)` swaps the source for a morph frame in the stage's screen layer (`over`, above the camera). `morphCode(id, h, "in", 0, "#target")` lands it and swaps the real target in on the landing frame. Before the cut, the source's contents wipe out (`wipeOut("#win-c")`) so only the outline is left to pick up. A morph within one scene uses an `mframe` inside `.lift` with `mfSet` + `morph(id, A, B, at, dur, E.inOut)`.
  - **Carried elements.** A real element (a plate, a window) crosses the cut with `L.carry(sel, h, side, P.side(key, rect, side), at)`, which compensates for the camera so its screen path is exact. The cutting scene returns `fade: false`.
  - **Motion blur** (`MB()`, the `data-hf-motion-blur` attribute, runtime `assets/js/motion-blur.js`): 360° shutter, 12 samples, only on things that actually travel (morph-frame parts, carried elements, pushed screenshots, split sessions). It is never a static look. Its copies freeze the element's subtree when they attach and are hidden at rest. So an element whose contents animate is carried by a **static flyer**: an identical copy marked `MB()` that swaps in (`tl.set` opacity) at the handoff while the live one hides.
  - **Trim paths:** draw on with `draw()`, retract with `untrim()` (from start toward end, then hidden: a round cap still paints a dot at a zero-length dash). Always tween the `stroke-dashoffset` **attribute** (`attr: {"stroke-dashoffset"}`). The CSS property snaps to whole numbers under `pathLength="1"`, so the line jumps.
  - **Kinetic type:** `klabel` + `kin` / `kout`. Words rise in their masks on (or just before) their spoken words, and leave upward before the cut. Labels sit in their own plane, which can drift a few px (parallax, settling within `SETTLE`).
  - **Typing:** `typed` + `type(sel, at, secondsPerChar)` / `untype`. For a value switch: untype, then retype the new value 0.2s later.
  - **Data pulses:** `pulse` + `run(sel, at, dur, reps, gap)`, an even pace and finite repeats.
  - **Staggered reveals:** `wipeIn(q(...), at, dur, stagger)` across a window's placeholder rows, plates or checklist rows (a stagger of 0.03–0.1s).
  - **Exits:** clear a beat with the reverse helpers (`kout`, `unlead`, `untrim`, `unpop`, `unwipe`, `wipeOut`, `away`), staggered over 0.2–0.4s before the cut, never a blanket fade.
  - **Show it on its word.** An object never waits on screen for its line: a window, terminal or plate appears on the word that names it. If a handoff would land on something before its word, land it on the first object that *is* spoken at the cut instead (v4: the CTA's window lands on "Self-hosted", and the Terminal waits for "Docker").
- **Sync:** every visual event lands on its word in `transcript.json`. Objects appear just before or on the word that names them, and tags pop on the word that confirms them.
- **Banned (locked, these break the calm style):** `back.out`, elastic, bounce, overshoot, rotation entrances, shakes, whip pans, glitches, spins and infinite loops.
- **Seek-safe GSAP only:** use one paused timeline per scene and `fromTo` tweens. Hide initial states with `gsap.set` outside the timeline. A later tween on the same property needs `immediateRender: false`; without it, the later `fromTo` writes its start value at build time and hides the element before its turn. No `Math.random` and no clocks.

---

## 8. Captions

- **Plate:** Inter 600 54px, ink text, on an `hi` plate with a 3px ink outline, radius 3px, padding 12/20/14px. No shadow.
- **Active word:** a lime block behind the word, with the word switching to `on` (dark) while it's spoken.
- **Position:** centred in y 1420–1540.
- **Grouping:** at most 4 words and 24 characters per group. Break at `, . ? !` or at a pause longer than 0.35s. A group stays up until the next group starts, or 0.6s after its last word.
- **Entrance:** rise 10px over 0.14s with a bottom-up clip wipe (v3 used an opacity fade; the wipe looks the same and never fails contrast mid-fade). The exit is instant, so the next group replaces it.

---

## 9. Do / Don't checklist (run on every contact sheet)

**Do**
- Use a near-black page, a faint grid and off-white 2.5px outlines.
- Keep to one lime accent with dark edges, popped on key words.
- Use Inter only: small caps labels and plates, no big headings.
- Use leader lines with orthogonal elbows and unboxed caps labels.
- Leave generous empty space and keep a top-to-bottom flow.
- Keep all content inside x 58–1022 and y 305–1305, with captions at y 1420–1540.
- Make every object appear on its own word, and hold still between moves (no scene-long camera crawl; the outlines must not shimmer in the Studio player).
- Hold new objects, patterns and motion to the same bar: verify.mjs clean (0 errors, 0 warnings) and side by side with `references/golden/` they read as the same reel.

**Don't**
- Use gradients, shadows, glows, blur as a look (motion blur only on moving parts), 3D renders or photo textures.
- Use rounded SaaS cards, pills, emoji, stickers or rotated stamps.
- Use a header, hero word, title bar on screenshots, or text on lime.
- Use more than one accent colour, red/green status, or pure white lines.
- Overlap objects, crowd a frame or leave objects floating unconnected.
- Use bouncy easing, shakes, spins or anything that loops forever.
