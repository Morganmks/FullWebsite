# Claude Code build prompt — Longuard "What Kind of Fighter Are You?" quiz

Paste everything below into Claude Code as your prompt.

---

## Project context

This is a personality quiz used as a newsletter lead magnet for Longuard, a Muay Thai apparel brand built in public. It's a "Training Day" narrative-driven BuzzFeed-style quiz that reveals one of four fighter archetypes. There is already a working codebase at `longuard-quiz/` (index.html, style.css, script.js, api/submit-quiz.js, package.json) built for Vercel. Read that existing code first, this prompt extends and upgrades it, it does not start from scratch. Keep the existing MailerLite + Google Sheets backend integration in `api/submit-quiz.js` intact.

Four avatar illustration files will be provided separately: `slasher.png`, `stoic.png`, `joker.png`, `sleeper.png`, painterly Valorant-splash-art-style character portraits, one per archetype. Integrate them into the result screen and (optionally, smaller/faded) into an archetype-select strip on the intro screen. If the files aren't present yet, build with placeholder colored blocks in their place so the layout is ready to drop them in later.

## Visual design system (already locked, do not deviate)

- Background: `#0B0B0D` (near-black)
- Surface/card: `#161618`
- Border/hairline: `#2A2A2E`
- Primary text: `#F2F0EC`, dim text: `#8A8A8E`
- Archetype accent colors, used ONLY on that archetype's own result screen, never as shared UI chrome: Slasher `#C1272D` (red), Stoic `#D8CBB8` (beige/marble, needs dark text `#2A241C` on it), Joker `#D4AF37` (gold), Sleeper `#3A3A40` (graphite, not pure black, needs to stay visible against the near-black bg)
- Typography: Rajdhani (600/700 weight, uppercase, letter-spacing) for headers/archetype names/labels, Inter for body copy. Both load from Google Fonts.
- Corners: sharp angled clip-path cuts on panels, cards, and buttons, NOT rounded corners. This is the single most important visual signature, don't let it slip back to border-radius.
- Overall aesthetic direction: "tactical minimalism", think Valorant's menu screens or a modern esports broadcast overlay, not a retro arcade fighting game's character select. Dark, one accent color live on screen at a time, restrained, nothing decorative that isn't also functional. Avoid bold multi-color palettes, pixel fonts, or chunky retro borders.

## Animation requirements (new, this is the main upgrade)

Keep everything snappy, under 300ms per transition, nothing should feel sluggish.

- **Screen transitions**: replace the current simple fade with a sharp slide + quick "impact flash" (a brief white/accent-colored flash overlay that fades out fast, like a hit landing) between screens.
- **Progress bar**: each segment should "charge up" with a quick flash/glow when it fills, not just an instant color swap.
- **Option buttons**: on hover, a subtle scale-up (1.02x) plus the accent-colored left border glowing in. On click/select, a brief impact flash and slight shake before transitioning to the next question, reinforcing the "hit landing" feel.
- **Result reveal**: this is the money moment, make it feel earned. Sequence: brief "calculating" beat (a short pulsing loader, under 1 second), then the archetype name punches in with a scale-and-settle animation (starts slightly oversized, snaps to final size), the accent color washes into the UI, the avatar image fades/scales in alongside the name, then strengths and weaknesses animate in one line at a time in sequence (staggered fade-up), like a fighting game stat reveal.
- **Micro-interactions**: buttons get a scale-down press effect on click, cursor clicks get a subtle ripple.
- **Performance**: use CSS transitions/animations where possible over JS-driven animation for smoothness, keep it lightweight, this needs to run well on mobile.

## Full question set (12 questions, narrative "Training Day" framing)

The quiz opens with a short scene-setting sequence before Q1: "It's training day." → "You wake up. The gym doesn't check if you're ready, it just starts." → "First stop, the kitchen." Then questions proceed with light one-line narrative bridges between them (see notes below). Each question has exactly 4 answers, always in this order: Slasher, Stoic, Joker, Sleeper. Scoring: one point per answer to its archetype, highest total wins, tie-break priority Slasher > Stoic > Joker > Sleeper.

1. **Pre-training fuel?** (bridge: "First stop, the kitchen.")
   Fruits & protein shake / Nothing / Whatever I can find / Doesn't really have one, never thought about it

2. **How do you wrap your hands?** (bridge: "You get to the gym. Time to wrap up.")
   Right hand first, always / Left hand first, always / Doesn't matter, whatever I feel like / "You use hand wraps?"

3. **Coach throws a new technique at you mid-session. You:**
   Just try it, figure it out as I go / Run it through once in my head, then commit, no hesitation / Try it the way that looks coolest / Watch someone else try it first

4. **A setback happens. You:** (bridge: "Ten minutes in, it happens.")
   Get back up immediately / Analyze what went wrong first / Get mad, then forget about it / Laugh it off

5. **Right after a hard session, what's the first thing you think?**
   Not good enough, gotta do more tomorrow / That went exactly like I planned / That was fun, let's do it again / Nothing really, already onto the next thing

6. **A training partner asks how you're actually doing. You:**
   Deflect, get back to training / Give a short, honest answer, then move on / Make a joke, keep it light / Say "I'm good" and change the subject

7. **Pick a color that matches your energy:** (bridge: "You catch yourself in the mirror.")
   Red / Beige, like Greek statue marble / Gold / Black

8. **In the ring, what's your style?**
   Clinch and knees, overwhelm them, nonstop aggression, wear them down / Heavy hands, tank their shots, keep coming / Kicks, the flashier the better / Technical, counter fighter, precise and accurate with timing

9. **What's your training playlist like?** (bridge: "Headphones in. One more round.")
   Hip-hop or trap / Classical / K-pop / Silence, no music

10. **How do you spend your rest days?** (bridge: "Training's done. The gym empties out.")
    "What's a rest day?" / Light jog and stretching, ice bath and sauna / Whatever I feel like / Sleep the whole day

11. **It's training day. Who're you calling?**
    The whole group, I feed off the energy / One training partner I actually trust / Nobody, don't need anyone to push myself / Just me, always have been

12. **How do you like your training shirts to fit?** (bridge: "Next session's already on your mind." This answer is the data question, save it separately as `fit_preference` in addition to scoring.)
    Tight upper body, looser at the waist / True compression, like 2nd skin / Oversized / Standard athletic fit

Note: question 11 has some thematic overlap risk with earlier questions, if it feels redundant during testing, it's the safest one to cut to bring the total down to 11.

Right before the result reveals: "By the time you walk out, this is who you've become."

## The four archetypes

**The Slasher** — accent `#C1272D`
Tagline: "Let the results speak."
Description: Gets things done, no matter what it costs. Chooses the hardest path on purpose because easy never felt like enough, and if he's honest, nothing ever quite feels like enough. Gets knocked down constantly and gets up every time, rest doesn't come easy when slowing down means sitting with that feeling.
Strengths: Relentless, doesn't stay down. Real empathy earned through real hardship. Walks the path less traveled without needing anyone's approval.
Weaknesses: Never feels good enough no matter what he accomplishes. Can't take a rest day without guilt. Burnout hits hard when it hits.
Fit: Tight upper body/arms, looser at the waist.

**The Stoic** — accent `#D8CBB8`
Tagline: "Wait for the opening."
Description: Analytical to the core, runs the cost-benefit on everything before it happens. Never second-guesses a call once it's made, moves with total confidence. Doesn't talk much, but when he does, the room listens. That confidence is only on the outside, bottles every emotion, suffers in complete silence.
Strengths: Rare and impactful communication. Makes hard calls without flinching. Absolute confidence in his own decisions.
Weaknesses: Never processes his own emotions. Suffers in silence behind the confidence. Puts everyone before himself until there's nothing left.
Fit: True compression, 2nd skin.

**The Joker** — accent `#D4AF37`
Tagline: "Go big or go home."
Description: Naturally charismatic, effortless, his own style. Incredible social skills, always good for a laugh, always has people around him. Underneath it, he's never really found anyone who gets him, looks like the most popular person in the room, still isn't sure anyone there actually knows him.
Strengths: Effortless charisma. Genuinely talented. Brings energy everywhere he goes.
Weaknesses: Feeds off the crowd so much that being alone feels unbearable. Surrounded by people yet still searching for someone who understands him.
Fit: Oversized.

**The Sleeper** — accent `#3A3A40`
Tagline: "Underestimated exactly once."
Description: Doesn't need anyone's validation, a lone wolf, tunnel-visioned on his own growth. Most people don't notice he's there until it's too late. Been burned before, so trust doesn't come easy or fast.
Strengths: Self-sufficient to a fault. Dangerous because no one's paying attention. Once trust is earned it's real and it lasts.
Weaknesses: Trust issues from past hurt. Takes so long to open up that most people give up first. Gets written off or misjudged constantly.
Fit: Standard athletic fit.

## Deliverable
Update `index.html`, `style.css`, `script.js` in the existing `longuard-quiz/` folder to reflect all of the above: the full 12-question narrative flow, the animation upgrades, and the avatar image integration. Leave `api/submit-quiz.js`, `package.json`, and the MailerLite/Google Sheets integration untouched unless the new question set changes what raw answer data gets logged (it should still log all question answers plus the separate `fit_preference` field).
