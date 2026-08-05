# Longuard Quiz — Full Spec

## 1. Overview
A "What Kind of Fighter Are You?" personality quiz, BuzzFeed-style, used as a newsletter lead magnet for Longuard. Captures email + a fun personality result, plus one real product-preference data point (training gear fit), logs every response for Morgan to review, and routes each subscriber into a MailerLite automation tagged by their result.

**Goals:** grow the newsletter list, segment subscribers by archetype for future content/CTAs, and collect early signal on training-gear fit preference to inform Drop 2 production decisions.

**Non-goals (for v1):** no phone number capture (deferred to drop 2 launch, contextual ask), no custom generated share-image cards (native share/copy-link only for now).

---

## 2. User flow
1. Visitor lands on the quiz page (linked from YouTube description, IG bio, newsletter).
2. Intro screen → "Start the quiz."
3. 7 questions, one at a time, progress bar, no email required yet.
4. After Q7, email gate: "Enter your email to see your fighter type."
5. On submit: response data sent to backend, which (a) adds/updates the subscriber in MailerLite, (b) logs the full response row to a Google Sheet.
6. Result screen reveals: archetype name, tagline, description, strengths, weaknesses, fit rec.
7. Share button: native share sheet or copy-to-clipboard with pre-filled caption + quiz link.
8. Retake option available.

---

## 3. Archetypes

**The Slasher** — *"Let the results speak."*
Hard work over hype. Shows up every day, head down, no interest in praise. Doesn't talk about the work, just does it, the work no one else wants to.
- Strengths: unmatched consistency, reliable in any condition, builds real skill because they never skip the boring reps, doesn't get rattled since showing up tomorrow is always the plan.
- Weaknesses: workaholic to a fault, social life takes the hit, often single or socially awkward because training and eating became the whole personality, doesn't know when to stop, and when burnout hits it lasts a while.
- Fit: tight upper body/arms, looser at the waist.

**The Stoic** — *"Wait for the opening."*
Calm, analytical, always two steps ahead. Doesn't waste energy or movement, watches and strikes only when it counts.
- Strengths: rarely repeats a mistake, exceptional under pressure, sees patterns others miss, conserves energy better than almost anyone.
- Weaknesses: overthinks everything, overanalyzes until they've psyched themselves out, waits too long for the perfect moment, a maximizer always convinced there's a better option out there so never quite satisfied, can come across cold, so locked into logic that other people's feelings get missed.
- Fit: true compression, 2nd skin.

**The Joker** — *"Go big or go home."*
Unpredictable on purpose, high risk and high reward. Not the most disciplined, but gets it done anyway, natural talent covers for what structure lacks. Wacko outside, prodigy inside. Feeds off attention.
- Strengths: explosive natural athleticism, thrives under pressure and an audience, pulls off things others wouldn't attempt, brings real energy to a room.
- Weaknesses: gets distracted easily, especially by pleasure, alcohol, the opposite sex, whatever feels good right now, motivation drops hard if no one's watching, makes big risky calls on impulse, puts things off to the last minute, bad at planning ahead.
- Fit: oversized.

**The Sleeper** — *"Underestimated exactly once."*
Quiet, doesn't talk much about training or goals, prefers to let people find out the hard way. Calm exterior, real intensity underneath.
- Strengths: hard to read, thrives on being underestimated, doesn't need external validation, dangerous specifically because no one sees it coming.
- Weaknesses: leaves bad first impressions, often seen as weaker or not taken seriously before anyone sees what they can do, too humble, undersells themselves constantly, trouble putting feelings or thoughts into words even when it matters.
- Fit: standard athletic fit.

---

## 4. Questions (all 7, answer → archetype mapping)

| # | Question | Slasher | Stoic | Joker | Sleeper |
|---|---|---|---|---|---|
| 1 | Pre-training snack | Protein shake, fruits | Nothing | Whatever I can find | Doesn't really have one, never thought about it |
| 2 | Wrapping up before training | Dominant hand first | Left hand first | Doesn't matter | "You guys use hand wraps?" |
| 3 | A setback happens, you | Get back up immediately, no time to think | Analyze what went wrong first | Get mad, then move on fast | Laugh it off, wasn't that deep |
| 4 | Pick a color for your energy | Red | Beige, like Greek statue marble | Gold | Black |
| 5 | Training playlist | Hip-hop/trap, same playlist every session | Classical or instrumental | K-pop | Silence, no music, just focus |
| 6 | Rest day | Mobility work, stretching, can't fully sit still | Ice bath and sauna, a real recovery protocol | Whatever feels right that day, no fixed plan | Sleep the whole day, conserve everything |
| 7 | Training gear fit | Tight upper body/arms, looser at the waist | True compression, 2nd skin | Oversized | Standard athletic fit |

**Scoring:** one point per answer to its archetype. Highest total wins. Tie-break priority order: Slasher > Stoic > Joker > Sleeper.

Note: Q7 doubles as real product data, its answer is scored toward the archetype AND saved as its own raw field (`fit_preference`) so it can be analyzed independently of the personality result.

---

## 5. Data & integrations

**MailerLite** (email capture + segmentation)
- New/updated subscriber on quiz completion.
- Group: "Quiz Takers" (triggers the result-email automation).
- Custom field `fighter_type`: final archetype name.
- Custom field `fit_preference`: raw Q7 answer.
- Automation: triggered by group join, sends result + fit rec as a follow-up, folds into the main newsletter sequence after 1-2 emails.

**Google Sheet** (raw response logging, for Morgan to review directly, no dashboard needed)
- One row per completed quiz.
- Columns: timestamp, email, Q1–Q7 raw answers, final archetype, fit_preference.
- Delivery method: a Google Apps Script bound to the Sheet, deployed as a web app with its own URL. The backend posts the full response to that URL; the script appends the row. No service account or credentials file needed, lowest-setup option for this scale.

---

## 6. Technical architecture
- **Frontend:** static HTML/CSS/JS, no framework, single page with screen-switching (intro → quiz → email → result).
- **Backend:** one serverless function, receives `{ email, answers[], archetype, fit_preference }`, calls MailerLite's API and the Apps Script webhook in parallel.
- **Hosting: open decision.** Vercel (already built and tested against this function format) or Netlify (equivalent, but the function needs rewriting for Netlify's handler signature). No functional difference to the end user either way, purely a "which do you want to deploy from" call.

---

## 7. Deferred to later
- Phone number capture, ask contextually at Drop 2 launch instead of on the quiz.
- Custom generated share-image cards, native share/copy-link is enough for v1.
