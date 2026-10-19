---
name: repo-reel
description: Turn a GitHub repo link into a faceless (about 50 s, at most 90 s) "underrated tools" Instagram Reel (1080x1920) in the fixed v3 dark Editorial Isometric Line style. Use when the user runs /repo-reel <github url> or asks for a reel/short about a GitHub repo or open-source tool.
argument-hint: <github repo url>
---

# /repo-reel <github link>

This skill makes a reel about the repo at `$ARGUMENTS`, at **exactly the quality of the v3 MultiPath reel** (frames in `references/golden/`, scenes in `kit/examples/v3/`). The look, voice, music and pace stay the same every time (DESIGN.md's locked identity). The scenes and their motion are designed fresh for each repo: v3 sets the quality bar, not the ceiling. The **v4 motion layer** (HarnessRouter, `kit/examples/v4/`) is the default motion standard: match cuts planned in `_plan.cjs`, custom Bézier eases, morph frames, kinetic type, trims, data pulses and motion blur (DESIGN.md section 7). **v5** (UncensoredAi) adds the frame chrome on every reel (registration marks, a rolling `FIG. NN / NN` readout and scene bars; DESIGN.md 4) and the implode-to-a-seed cut for a turn in the argument (DESIGN.md 6, 7; `kit/examples/uncensored/`).

Read these before doing anything:

| File | What it fixes |
|---|---|
| `WORKFLOW.md` | The step-by-step pipeline: paths, models, music, volumes, commands, approval gates and the deterministic scripts. **Follow it in order.** |
| `SCRIPT.md` | How to write the narration: voice, word budget, the 8-beat flow and the approval table. |
| `DESIGN.md` | How every frame looks and moves: palette, grid, type, objects, scene types, motion and captions. |
| `references/` | `style-reference-dark.png` (target look), `golden/` (v3 frames to compare against). |
| `scripts/` | The deterministic pipeline (WORKFLOW.md section 10): `setup`, `scaffold`, `intake`, `audio` (tts → transcribe → align → timing → captions → assemble), `crop`, `verify`, `render`. Always run these; never redo their work by hand. Values live in `scripts/config.json`; per-machine overrides in `scripts/config.local.json`. |
| `models/`, `music/` | User-supplied files: Kokoro and Parakeet (READMEs list the exact files, links and sha256) and one background track. Nothing here ships with the skill. |
| `kit/` | The project template copied by `scaffold`: fonts, `iso.js`, `motion-blur.js`, `scripts/lib/reel-lib.cjs` (v3 objects, the v4 motion layer, the Paseo screenshot objects and motion, and v5: `implode`/`seed`/`seedIn`, `spark`/`sdraw`, `odo`/`roll`, `chrome`), `scripts/build-scenes.cjs` (also writes the bg grid + frame chrome), `scripts/scenes/_cta.cjs`, `storyboard/storyboard-lib.cjs` (the step 5 storyboard page, frame pieces and pink annotation layer). `kit/scripts/lib/anat.cjs` + `anatomy/` (the Anatomy geometry kit, MIT, for crafted objects: DESIGN.md 5.8). `kit/examples/v3/` (MultiPath), `kit/examples/v4/` (HarnessRouter: `_plan.cjs`, eight match-cut scenes, the v4 CTA) and `kit/examples/crafted/` (v4's solution and switch scenes rebuilt with `board()` and `selector()`) and `kit/examples/paseo/` (Paseo: a screenshot-heavy match-cut reel with screens that push, zoom and lens inside windows, its `_plan.cjs` and its `make-storyboard.cjs`) and `kit/examples/uncensored/` (the implode cut: 08 implodes into a seed, 09 grows its model from it) are examples to learn from, not content to reuse. |

Also load `/hyperframes-core` before writing composition HTML.

**Step 0, every time:** run `setup.mjs` as WORKFLOW.md section 0 says. If it exits non-zero, show the user its numbered fix list, download links included, and stop until they've fixed it.

## Hard rules
1. There are **two approval gates**: (a) the script, before TTS; (b) the Studio preview, before render. Never skip either, and never render without an explicit "render it".
2. Never invent facts. Each claim must come from the README, docs or repo metadata.
3. Don't change the style: the locked identity in DESIGN.md (palette, line, type, grid, captions, CTA, voice, music and the motion bans) never changes. Scene layouts and motion are open: design what the content needs within that identity.
4. Never download models, music or other large files: they're large, licensed per user, and the user decides what lands on their machine. The user downloads the models into `models/` from the links `setup.mjs` prints and supplies the music in `music/` (WORKFLOW.md section 0). The only exception is the small Parakeet runtime, via `setup.mjs --install-runtime`, and only after the user says yes.
5. `verify.mjs` (check --strict) must pass with 0 errors and 0 warnings before the preview. A warning left in now (contrast, layout, a timeline hide) shows up in the user's review or in the render, and costs a round trip.
6. v1 and v2 are obsolete (the user rejected their look). Learn from v3, v4 and the `kit/`, never from v1/v2.
7. **Each reel adds at least one new object, scene pattern or motion primitive.** Build it inside the reel project (its own `scripts/lib/reel-lib.cjs` and scenes), never in this skill.
8. **The skill changes only on the user's word.** Don't edit anything in `~/.claude/skills/repo-reel/` (kit, examples, DESIGN, WORKFLOW, SCRIPT, SKILL, scripts) until the user has watched the Studio preview **and** explicitly says "add it to repo-reel". A working build, a clean verify, or "looks good" / "I like it" is not that instruction. When they say it, copy only what they approved into the kit, document it (DESIGN.md 5.4, 5.8, 6 or 7) and report the exact files changed.
