# SCRIPT.md: how to write the narration

Every reel uses the same voice, length and beat flow as the v3 MultiPath reel. Only the tool changes (and the visuals designed for it).
The script is written **before** anything is built and needs the user's approval (WORKFLOW.md step 2, gate 1).

---

## 1. The voice

- **A friend showing a friend a cool tool.** Calm, plain, a bit excited, never salesy.
- **Simple English.** Use words a 12-year-old knows. If a technical term is needed ("virtual network adapter"), say it once and let the visual explain it.
- **Short sentences**, about 6–14 words each. One idea per sentence.
- **Use contractions:** it's, here's, you're, don't.
- **Talk to "you":** "on your PC", "your phone", "you get".
- **No hype words:** game-changer, insane, revolutionary, mind-blowing, crazy, ultimate, supercharge, unlock, seamless, leverage, "in this video".
- **No filler:** "So basically", "Let's dive in", "Hey guys", "Make sure to".
- **Never invent anything.** Every claim (features, platforms, numbers, licence, "free") must trace back to the README, the docs or the repo metadata. If you can't confirm it, leave it out.

## 2. Length and pace

| | Target | v3 reference |
|---|---|---|
| Total words | **120–135** typical, **at most about 235** | 132 |
| Voice length | **44–48 s** typical, **at most 87.5 s** | 46.66 s |
| Speaking rate | about **2.8 words/s** (Kokoro `af_heart` at 1.14 speed) | 2.83 |
| Lines (beats) | **8** (7–12 is fine) | 8 |

Estimate the seconds as words ÷ 2.8 plus 0.3 s between lines. **The reel is at most 1.5 min (90 s):** keep the voice at or under 87.5 s (the reel adds a 2.04 s tail). About 50 s is still the sweet spot; go longer only when the repo has more real, sourced content worth showing, never to pad.
A longer reel keeps the same flow: add beats between 3 and 7 (another how step, a second proof, one more feature), each with its own visual idea.

## 3. The beat flow

The order is fixed. The content of each beat changes from tool to tool.

| # | Beat | Job | Words | About | Shape | v3 line |
|---|---|---|---|---|---|---|
| 1 | **hook** | Stop the scroll with the result, as a question | 12–15 | ≤ 4 s | "Did you know you can **[surprising result]**, **[where]**?" | Did you know you can use Wi-Fi and mobile data together, on your PC? |
| 2 | **meet** | Name it, say what kind of thing it is and what it does | 20–25 | 8–9 s | "Meet **X**. A free, open-source **[kind of tool]** for **[platforms/who]** that **[core job]**, **[key twist]**." | Meet MultiPath. A free, open-source app for Windows and Linux that combines Wi-Fi, Ethernet, and your USB-tethered phone, all at the same time. |
| 3 | **how 1** | The core mechanism in one image | 15–20 | 6–7 s | "Here's how it works. **X [does A]**, so **[B happens]**." | Here's how it works. MultiPath adds a virtual network adapter, so all of your PC's traffic flows through it. |
| 4 | **how 2** | The smart step (the decision it makes) | 10–14 | about 4 s | "For every **[unit]**, it **[decision]**." | For every new connection, it picks the network that gives the most speed. |
| 5 | **proof** | A tiny, concrete example with simple numbers | 10–14 | about 4 s | "So **[small input]**, **[doing X]**, give you **[result]**." | So two ten megabit networks, sharing the load, give you about twenty. |
| 6 | **trust** | Reliability, safety or the edge case people worry about | 15–18 | 6–7 s | "Every **[interval]**, it **[checks]**. If **[problem]**, **[it handles it]**." | Every five seconds, it checks each network. If one drops, new connections simply go to the others. |
| 7 | **use** | Where it helps: 4–5 real, named uses, then a summary line | 17–20 | 8–9 s | "It's perfect for **A, B, C, D, and E**. Anything that **[pattern]**, **[gets better]**." | It's perfect for speed tests, YouTube, Steam, torrents, and download managers. Anything that opens lots of connections, gets faster. |
| 8 | **cta** | Two or three short trust points, then the fixed sign-off | 14–16 | about 3–4 s | "No **X**. No **Y**. **[it runs where]**. Follow for more useful tools." | No server. No account. It all runs on your PC. Follow for more useful tools. |

Flow logic: **what you get → what it is → how it works (2 steps) → proof → why you can trust it → where you'd use it → it's safe/simple → follow.**
Each line should lead naturally into the next. Read the whole thing aloud: it should sound like one person talking, not eight slides.

Fitting other kinds of tools:
- **CLI or dev tool:** hook = the painful task it removes ("Did you know you can turn any website into an API, with one command?"). The mechanism beats show the input → tool → output pipeline.
- **Library:** "Meet X. A free, open-source **Python library** that…". The proof beat can be a before/after line count or a speed number from the README.
- **No numbers in the README:** the proof beat becomes a tiny before → after example ("So a two-hour video becomes a five-minute summary.").
- **Not free or not open source:** drop "free, open-source" and say what's true ("an MIT-licensed…", "a self-hosted…").
- The **"Follow for more useful tools."** line is fixed and is always the last sentence.

## 4. Writing for TTS (Kokoro)

- **Numbers as words:** "ten megabit", "five seconds", "twenty". Write "two point five x", not "2.5x".
- **No symbols:** no `+ & / % → ~ #`, emoji or URLs in the narration. Write "and", "percent", "about".
- **Names the way they're said:** spell product names so they're pronounced right ("Wi-Fi", "Ethernet", "YouTube"). For odd names add a pronunciation in the approval table (e.g. `yt-dlp → "Y T D L P"`) and use that spelling in `lines.json`.
- **Punctuation is timing:** commas give short pauses; full stops give longer ones. Use commas to pace lists. Avoid semicolons, dashes and brackets.
- Hyphenated compounds are fine ("open-source", "USB-tethered"). The captions step merges them back into one word.
- Each line is one TTS call. Keep a line to at most 2–3 sentences.

## 5. Every beat must be drawable

Before you send the script, write a one-line **visual idea** for each beat. Start from the objects, patterns and motion in DESIGN.md (sections 5.4, 6 and 7), but a visual idea may propose a new object or motion as long as it fits the locked identity. Aim for at least one idea v3 didn't have.
If a line can't be shown inside the locked identity, rewrite the line, not the style.
Name the screenshots and product images you'll need (app UI, README images or diagrams, a docs page, example outputs, the repo header for the CTA). Any beat can use one wherever it shows the point better than a drawing.

## 6. Approval format (show the user exactly this)

```
**Tool:** <name> — <repo url>
**Facts used:** <3–6 bullet facts from the README, each with where it came from>

| # | Beat | Line | Words | ≈ s | Visual idea |
|---|------|------|-------|-----|-------------|
| 1 | hook | … | 14 | 3.8 | Wi-Fi router + phone → laptop, lime arrows |
| … |
| **Total** | | | **132** | **≈ 47 s** | |

Screenshots needed: <list>
Pronunciations: <name → spoken form, if any>
```

Wait for the user to say "approved" (or to edit it). Don't run TTS until then. After approval, save the lines **exactly** as approved to `script/lines.json`:

```json
[
  { "id": "hook", "text": "Did you know you can …?" },
  { "id": "meet", "text": "Meet …" }
]
```

## 7. Self-check before sending

- [ ] 120–135 words and 8 beats in the fixed order (a longer reel: up to about 235 words and 12 beats, the extra beats between 3 and 7, each with sourced content)
- [ ] The hook is a question with a concrete result, under 15 words
- [ ] Every fact is in the README or the repo
- [ ] No hype words, symbols or digits
- [ ] Sounds natural read aloud in one breath per sentence
- [ ] Every beat has a drawable visual idea
- [ ] Ends with "Follow for more useful tools."
