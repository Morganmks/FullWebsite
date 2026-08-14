# Quiz handoff — state as of 13 Aug 2026

Paste this file into a fresh chat to pick up without replaying the history.

## What this is

`/quiz/` — a game-styled personality quiz for Longuard. Nine questions framed as
one day of fight camp, gated on email, revealing one of five fighter archetypes
with a long-form profile. Vanilla HTML/CSS/JS, no build step, deployed on Vercel.

## Files that ARE the quiz

```
quiz/index.html      screens + markup
quiz/script.js       all logic, questions and archetype content (~1500 lines)
quiz/style.css       everything visual
api/submit-quiz.js   Vercel function: MailerLite + Google Sheet
assets/fighters/     five portraits
assets/hero/         title-screen stills + menu video
assets/audio/        select.mp3 (Press to Start sound)
```

**Everything else in this repo is the wider website** — `index.html`, `site.css`,
`site.js`, `lab/`, `training/`, `store/`, `film-room/`, `tools/`, `cornerwoman/`.
Don't touch those when the request is about the quiz.

## The five fighters

| Fighter | Style | Class | Colour |
|---|---|---|---|
| The Slasher | Muay Khao | Warrior | `#C1272D` red |
| The Stoic | Muay Mat | Tank | `#FFFFFF` white |
| The Joker | Muay Tae | Bard | `#D4AF37` gold |
| The Sleeper | Muay Femur | Assassin | `#4A90D9` blue |
| The Cornerwoman | Muay Sok | Support | `#3FA88C` jade |

Each entry in `RESULTS` (script.js) carries: title, style, cls, blurb, accent,
tag, intro[3], attributes[5], radarNote, spectra[5], gym[], pressure[], people[],
strengths[3], weaknesses[3], work[3], matchups{pairs,clashes}, fit.

Attribute and spectrum numbers are **authored characterisation, not measurement**
— they aren't derived from answers and shouldn't be presented as real data.

## Open items

1. **Name collision.** `/cornerwoman/` is the site's FAQ page ("Cornerwoman —
   The ring"). A fighter with the same name may confuse. Renaming the fighter is
   a one-line change in `RESULTS`.
2. **Not every fighter answers every question.** Sleeper is absent from Q2
   (snack) and Q7 (shirt fit); Cornerwoman from Q3 (wraps) and Q7. Both sit at
   ceiling 7 vs 9 for the rest. Handled by normalised scoring, not a bug.
3. **Scoring is normalised per archetype** because questions offer uneven option
   counts — score ÷ that archetype's own ceiling. Don't switch to raw totals.

Resolved 13 Aug 2026: the Cornerwoman now has an option in all nine questions
(ceiling 9) and is reachable as a result.

## Flow

attract (Press to Start) → title menu → roster / how it works → chapter card →
brief → 9 questions → email gate (name + email) → card reveal → profile

## Conventions worth keeping

- **Backdrops are mutually exclusive modes**, never stacked: `stage-still`
  (attract), `stage-video` (menus), `stage-none` (questions — no imagery behind
  a decision), `stage-photo` (profile, held still).
- **Audio: two independent channels.** The speaker toggle governs the video's
  audio only. UI sounds always play. There is no music track by design.
- **Assets are extension-agnostic** — `resolveImage()` probes jpg/jpeg/png/webp,
  so filenames matter but extensions don't. Filenames must match the archetype
  key exactly (`cornerwoman`, not `corner-woman`).
- **Every file must stay under 25 MB.** GitHub rejects >100 MB outright and a
  single oversized file blocks the whole push. Masters live outside the repo in
  `~/Documents/Claude/longuard-video-sources/`.
- Portraits: 3:4, ~1200px tall, JPG, 175–315 KB.

## Other docs

- `assets/ASSETS.md` — what media goes where, with encoding commands
- `MAILERLITE-SETUP.md` — groups, automations, env vars, repeat handling
- `GOOGLE-SHEET-SCRIPT.md` — the Apps Script + Vercel env var steps

## Deploy state

Emails only save once the Vercel env vars are set and the project redeployed.
Required: `MAILERLITE_API_KEY`, `MAILERLITE_QUIZ_GROUP_ID`,
`GOOGLE_SHEETS_WEBHOOK_URL`. Optional per-fighter groups:
`MAILERLITE_GROUP_SLASHER` / `_STOIC` / `_JOKER` / `_SLEEPER` / `_CORNERWOMAN`.
