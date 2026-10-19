# SCRIPT.md: how to write the narration

Every reel uses the same voice, length and beat flow. Only the tool changes (and the visuals designed for it).
The script is written **before** anything is built and needs the user's approval (WORKFLOW.md step 2, gate 1).
**Reference script: Paseo** (section 3). The user wrote it after rejecting a template-shaped draft; it is the tone and flow to match. The v3 MultiPath lines are no longer the model for wording.

---

## 1. The voice

- **A friend telling a friend about a tool they love.** Calm, plain, a bit excited, never salesy. It should sound like someone talking, not like eight slide captions read in a row.
- **Benefit first, mechanism second.** Every line says what *you* can do or what you get. Only explain how it works when the "how" is itself the reason to care, and then explain it by its effect.
- **Explain jargon by what it stops or allows.** Say the real term once if it matters, then say what it means for you in the same sentence: "with separate Git worktrees, they can work on different branches *without stepping on each other's changes*." If the viewer doesn't need a term to get the point, leave it out (internal parts like "daemon", "relay", "adapter", "middleware" usually go).
- **Simple English.** Use words a 12-year-old knows. Short sentences, about 6–16 words each, one idea per sentence.
- **Use contractions:** it's, that's, you're, don't.
- **Talk to "you":** "you can give", "your phone", "you get".
- **No hype words:** game-changer, insane, revolutionary, mind-blowing, crazy, ultimate, supercharge, unlock, seamless, leverage, "in this video".
- **No filler:** "So basically", "Let's dive in", "Hey guys", "Make sure to".
- **Never invent anything.** Every claim (features, platforms, numbers, licence, "free") must trace back to the README, the docs or the repo metadata. If you can't confirm it, leave it out.

### The one-listen test
Read the script aloud once to someone who has never seen the repo, in your head. After one listen they must be able to say, in their own words: **what it is, what they'd use it for, and why it's better than what they do now.** If any of the three is missing, or a line needs a second listen, rewrite it.

## 2. Length and pace

| | Target | Paseo reference |
|---|---|---|
| Total words | **130–160** typical, **at most about 235** | 157 |
| Voice length | **48–58 s** typical, **at most 87.5 s** | ≈ 58 s |
| Speaking rate | about **2.8 words/s** (Kokoro `af_heart` at 1.14 speed) | |
| Lines (beats) | **8** (7–12 is fine) | 8 |

Estimate the seconds as words ÷ 2.8 plus 0.3 s between lines. **The reel is at most 1.5 min (90 s):** keep the voice at or under 87.5 s (the reel adds a 2.04 s tail). Go longer only when the repo has more real, sourced content worth showing, never to pad.
A longer reel keeps the same flow: add "what you can do" beats between 3 and 7, each with its own visual idea.

## 3. The beat flow

The order is fixed. The content of each beat changes from tool to tool. Each beat is one line in `lines.json` (one scene); a line may hold 2–3 sentences.

| # | Beat | Job | Words | Shape | Paseo line |
|---|---|---|---|---|---|
| 1 | **hook** | Stop the scroll with the result the viewer wants, as a question | 12–18 | "What if you could **[result]**, and **[twist]**?" (or "Did you know you can…?") | What if you could run multiple AI coding agents at once, and manage them all from your phone? |
| 2 | **reveal** | Answer the hook with the name, then say plainly what it is | 18–25 | "That's exactly what **X** lets you do. It's a free, open-source **[kind of tool]** that **[core job in everyday words]**." | That's exactly what Paseo lets you do. It's a free, open-source tool that brings Claude Code, Codex, Copilot, and more into one place. |
| 3 | **core use** | The main thing you do with it, in one picture | 12–16 | "You can **[do the main thing]**, and **[result]**." | You can give different agents different tasks and let them work at the same time. |
| 4 | **how it holds** | The one mechanism worth naming, explained by what it prevents or allows | 14–18 | "And with **[real term]**, **[they/you] can [benefit] without [the problem]**." | And with separate Git worktrees, they can work on different branches without stepping on each other's changes. |
| 5 | **wow example** | One concrete, sourced example that makes it real (a number, a before/after, a workflow from the README) | 12–18 | "You can even **[specific example]**." / "So **[small input]** gives you **[result]**." | You can even have Claude plan a feature, then hand that plan over to Codex to build it. |
| 6 | **best part** | Re-hook mid-reel with the twist from the hook, plus the reassurance people need | 18–26 | "The best part? **[reassurance]**, but **[the twist, delivered]**." | The best part? Your agents run on your own machine, but you can check their progress and manage them from your phone, even when you're away. |
| 7 | **plus** | The rest of the toolbox: 3–5 real, named features or uses, then a summary | 14–20 | "Plus, you get **A, B, C, and D**, all in one **[place]**." (or "It's perfect for A, B, C, and D.") | Plus, you get a built-in editor, terminal, code diffs, and pull request tools, all in one interface. |
| 8 | **trust + CTA** | Two or three short trust points, the name once more, then the fixed sign-off | 18–24 | "No **X**, no **Y**, and **[Z]**. That's **X**. Check out the GitHub repo, and follow for more useful **[developer]** tools." | No forced logins, no tracking, and completely open source. That's Paseo. Check out the GitHub repo, and follow for more useful developer tools. |

Flow logic: **the result you want → that's this tool, here's what it is → what you do with it → why it doesn't go wrong → a real example → the best part (the hook paid off) → everything else you get → why you can trust it, its name, follow.**

### Make it one conversation
- **Connect every line to the one before it.** Open lines with a spoken hand-off: "That's exactly what…", "You can…", "And with…", "You can even…", "The best part?", "Plus,". A line that could be swapped with another in any order is a slide caption; rewrite it.
- **The hook asks, the reveal answers.** The name lands as the answer to the hook's question, not as a cold "Meet X."
- **Pay the hook off twice:** once in the reveal and again in "The best part?", which delivers the hook's twist in full (Paseo: "from your phone").
- **Escalate:** core use → safety → "You can even…" (the surprising one) → best part. Save the most surprising true thing for beats 5–6.
- **Close on the name.** "That's X." just before the sign-off, so the last thing heard is the name and where to find it.

Fitting other kinds of tools:
- **CLI or dev tool:** the hook names the painful task it removes ("What if you could turn any website into an API, with one command?"). Beat 4 explains the one step that makes it safe or fast.
- **Library:** "It's a free, open-source **Python library** that…". Beat 5 can be a before/after line count or a speed number from the README.
- **No numbers in the README:** beat 5 is a tiny before → after or a workflow the README itself describes ("plan with Claude, then hand off to Codex").
- **Not free or not open source:** drop "free, open-source" and say what's true ("an MIT-licensed…", "a self-hosted…").
- **Not for developers:** the sign-off ends "follow for more useful tools." For developer tools it's "follow for more useful developer tools."
- The sign-off **"Check out the GitHub repo, and follow for more useful [developer] tools."** is fixed and is always the last sentence. The CTA's trust points (`reel.json` → `cta.trust`) are taken from beat 8's first sentence.

## 4. Writing for TTS (Kokoro)

- **Numbers as words:** "ten megabit", "five seconds", "twenty". Write "two point five x", not "2.5x".
- **No symbols:** no `+ & / % → ~ #`, emoji or URLs in the narration. Write "and", "percent", "about".
- **Names the way they're said:** spell product names so they're pronounced right ("Wi-Fi", "Ethernet", "YouTube"). For odd names add a pronunciation in the approval table (e.g. `yt-dlp → "Y T D L P"`) and use that spelling in `lines.json`.
- **Punctuation is timing:** commas give short pauses; full stops give longer ones; a short question ("The best part?") gives a beat of suspense. Use commas to pace lists. Avoid semicolons, dashes and brackets.
- Hyphenated compounds are fine ("open-source", "built-in"). The captions step merges them back into one word.
- Each line is one TTS call. Keep a line to at most 2–3 sentences.

## 5. Every beat must be drawable

Before you send the script, write a one-line **visual idea** for each beat. Start from the objects, patterns and motion in DESIGN.md (sections 5.4, 6 and 7), but a visual idea may propose a new object or motion as long as it fits the locked identity. Aim for at least one idea earlier reels didn't have.
If a line can't be shown inside the locked identity, rewrite the line, not the style.
Name the screenshots and product images you'll need (app UI, README images or diagrams, a docs page, example outputs, the repo header for the CTA). Any beat can use one wherever it shows the point better than a drawing.

## 6. Approval format (show the user exactly this)

```
**Tool:** <name> — <repo url>
**Facts used:** <3–6 bullet facts from the README, each with where it came from>

| # | Beat | Line | Words | ≈ s | Visual idea |
|---|------|------|-------|-----|-------------|
| 1 | hook | … | 18 | 6.4 | Phone at the bottom, three agent windows above it, lime pulses up |
| … |
| **Total** | | | **157** | **≈ 58 s** | |

Screenshots needed: <list>
Pronunciations: <name → spoken form, if any>
```

Wait for the user to say "approved" (or to edit it). If they send their own script, check every claim against `research/facts.md`, fit it to the beats (merge paragraphs into lines, keep their wording) and show what you changed. Don't run TTS until then. After approval, save the lines **exactly** as approved to `script/lines.json`:

```json
[
  { "id": "hook", "text": "What if you could …?" },
  { "id": "meet", "text": "That's exactly what …" }
]
```

## 7. Self-check before sending

- [ ] 130–160 words and 8 beats in the fixed order (a longer reel: up to about 235 words and 12 beats, the extra beats between 3 and 7, each with sourced content)
- [ ] The hook is a question about a result the viewer wants, under 18 words
- [ ] The reveal answers the hook with the name ("That's exactly what X lets you do.")
- [ ] It passes the one-listen test: what it is, what you'd use it for, why it's better
- [ ] Every jargon term is explained by its effect in the same sentence, or cut
- [ ] Every line hands off from the one before it; "The best part?" pays off the hook
- [ ] Every fact is in the README, the docs or the repo
- [ ] No hype words, symbols or digits
- [ ] Sounds natural read aloud in one breath per sentence
- [ ] Every beat has a drawable visual idea
- [ ] Ends with "That's X. Check out the GitHub repo, and follow for more useful [developer] tools."
