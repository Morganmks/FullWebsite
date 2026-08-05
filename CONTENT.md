# Longuard site — content template

Every piece of copy on the site, in one place. Everything below is **current
placeholder text**. Fill in the `NEW:` lines, send this document back, and it
all goes in without you touching any code.

**How to use it**
- Leave a `NEW:` blank to keep what's there.
- Write `NEW: CUT` to delete that item entirely.
- Add items by copying a block and numbering it (`Quest 4`, `Product 7`, …).
- Character counts are guidance, not limits — they're where the design starts
  to strain, so if you go long, say so and the layout gets adjusted to fit.

**One thing to decide first (affects several sections):** the FAQ, the store
and the quest board all reference a launch date, a contact route and a
referral mechanic that don't exist yet. Where you don't have an answer, write
`NEW: TBD` and it'll be written as an honest "not yet" rather than invented.

---

## 0. Global

| What | Where it shows | Current | |
|---|---|---|---|
| Brand mark | Top-left, every screen | `LONGUARD` | NEW: |
| Legal line | Bottom of attract screen | `© 2026 Longuard LLC` · `All Rights Reserved` | NEW: |
| Attract prompt | Over the hero video | `Press to Start` | NEW: |

### Top navigation labels

These are the six links across the top. Each opens the matching guide's panel.

| Current label | Goes to | |
|---|---|---|
| `Main Menu` | the menu | NEW: |
| `Quest` | Training Area (Slasher) | NEW: |
| `Shop` | Gym Store (Joker) | NEW: |
| `Lab` | The Lab (Sleeper) | NEW: |
| `Film Room` | Film Room (Stoic) | NEW: |
| `Guide` | Cornerwoman / FAQ | NEW: |

### Main menu (after Press to Start)

Stacked list on the left over the video. Order matters.

| # | Current | |
|---|---|---|
| 1 | `Continue Training` → walks onto the gym floor | NEW: |
| 2 | `Gym Store` | NEW: |
| 3 | `The Lab` | NEW: |
| 4 | `Film Room` | NEW: |
| 5 | `Cornerwoman` | NEW: |

*Training Area is deliberately not in this list — Slasher on the floor and
`Quest` in the nav both reach it. Say if you want it added.*

---

## 1. The five guides

Shown on hover on the gym floor, on the phone card list, and as the header of
each panel. Keep names short — they're set in caps at display size.

### Slasher → Training Area
| Field | Current | |
|---|---|---|
| Name | `Slasher` | NEW: |
| Section title | `Training Area` | NEW: |
| One-line blurb (~40 chars, phone list only) | `Runs the training floor.` | NEW: |

### Cornerwoman → FAQ
| Field | Current | |
|---|---|---|
| Name | `Cornerwoman` | NEW: |
| Section title | `Cornerwoman / FAQ` | NEW: |
| Blurb | `Answers what you're afraid to ask.` | NEW: |

### Stoic → Film Room
| Field | Current | |
|---|---|---|
| Name | `Stoic` | NEW: |
| Section title | `Film Room` | NEW: |
| Blurb | `Sits with the tape.` | NEW: |

### Sleeper → The Lab
| Field | Current | |
|---|---|---|
| Name | `Sleeper` | NEW: |
| Section title | `Lab` | NEW: |
| Blurb | `Half asleep, taking notes.` | NEW: |

### Joker → Gym Store
| Field | Current | |
|---|---|---|
| Name | `Joker` | NEW: |
| Section title | `Gym Store` | NEW: |
| Blurb | `Sells you the fit.` | NEW: |

---

## 2. Training Area (Slasher)

Every section has the same three-part header: a small **kicker**, a big
**title**, and a **lede** of one or two sentences.

| Field | Current | |
|---|---|---|
| Kicker (~24 chars) | `Slasher — Heavy bags` | NEW: |
| Title (~18 chars) | `Training Area` | NEW: |
| Lede (~140 chars) | `Everybody starts the same way: find out who you fight like. Then the board tells you what to do about it.` | NEW: |

### Block 1 — the quiz

| Field | Current | |
|---|---|---|
| Heading | `Start here` | NEW: |
| Sub-note | `Nine questions, one day of fight camp.` | NEW: |
| Card title | `What Kind of Fighter Are You?` | NEW: |
| Card body (~220 chars) | `One ordinary day of camp, start to finish. No right answers. At the end you get a full read — how you train, your strengths, your weaknesses, and who you're compatible with.` | NEW: |
| Button | `Take the quiz` | NEW: |

### Block 2 — quest board

| Field | Current | |
|---|---|---|
| Heading | `Quest board` | NEW: |
| Sub-note | `Ways to earn your way further in.` | NEW: |

**Quest 1**
| Field | Current | |
|---|---|---|
| Name | `Bring someone into the gym` | NEW: |
| Description | `Send your referral link to a training partner. When they finish the quiz, you both move up.` | NEW: |
| Reward | `early access to the next drop` | NEW: |
| Live yet? | No — marked "Not wired yet" | NEW: |

**Quest 2**
| Field | Current | |
|---|---|---|
| Name | `Post your fighter` | NEW: |
| Description | `Share your result card and tag us. We repost the ones that land.` | NEW: |
| Reward | `feature on the Longuard feed` | NEW: |
| Live yet? | No | NEW: |

**Quest 3**
| Field | Current | |
|---|---|---|
| Name | `Vote the next colorway` | NEW: |
| Description | `Members pick what gets made. One vote each, results shown when the poll closes.` | NEW: |
| Reward | `your pick actually gets produced` | NEW: |
| Live yet? | No | NEW: |

> Each quest currently shows a grey **"Not wired yet"** tag, because none of
> them do anything when clicked. Tell me which of the three you actually want
> functional and I'll scope it — the referral one needs a code + attribution,
> the vote needs somewhere to store votes.

---

## 3. Gym Store (Joker)

| Field | Current | |
|---|---|---|
| Kicker | `Joker — The rack` | NEW: |
| Title | `Gym Store` | NEW: |
| Lede | `Nothing here is for sale yet. This is the shape of the shelf.` | NEW: |
| Grid heading | `The rack` | NEW: |
| Grid sub-note | `Six slots, filled with placeholders.` | NEW: |

**Products** — six placeholder slots. For each: name, a short meta word, and a
price. Prices currently show as `—`.

| # | Current name | Meta | Price | |
|---|---|---|---|---|
| 1 | `Longuard Tee — Bone` | `Cotton` | `—` | NEW: |
| 2 | `Longuard Tee — Void` | `Cotton` | `—` | NEW: |
| 3 | `Camp Hoodie` | `Heavyweight` | `—` | NEW: |
| 4 | `Fight Shorts` | `Training` | `—` | NEW: |
| 5 | `Hand Wraps` | `180"` | `—` | NEW: |
| 6 | `Archetype Card Set` | `Four fighters` | `—` | NEW: |

**Closing card**
| Field | Current | |
|---|---|---|
| Heading | `Get told when it drops` | NEW: |
| Body | `The list hears first, and members vote on what gets made.` | NEW: |
| Button | `Join the list` | NEW: |

> **Decide:** is this a real shop or a lookbook? There's no checkout wired.
> The three realistic routes, cheapest first: Shopify Buy Buttons (paste a
> snippet per product), Stripe Payment Links (one link each, no cart), or the
> Shopify Storefront API (real cart on the page). Tell me which and I'll build
> it; until then it stays marked as not for sale.

---

## 4. The Lab (Sleeper)

| Field | Current | |
|---|---|---|
| Kicker | `Sleeper — The couch` | NEW: |
| Title | `The Lab` | NEW: |
| Lede | `Where the next thing gets figured out in the open. Prototypes, dead ends, and what the gym decides to make.` | NEW: |

**Signup form** — this one is genuinely live; it posts to MailerLite.

| Field | Current | |
|---|---|---|
| Heading | `Get the notes` | NEW: |
| Sub-note | `Goes to the same MailerLite list the quiz feeds.` | NEW: |
| Name placeholder | `Your name` | NEW: |
| Email placeholder | `you@email.com` | NEW: |
| Button | `Join the list` | NEW: |
| Success message | `You're in. Check your inbox.` | NEW: |
| Error message | `That didn't go through. Try again in a moment.` | NEW: |
| Fine print | `Free community access, a say in where the brand goes, and first word on anything that gets made. No spam, leave whenever.` | NEW: |

**On the bench** — three cards of what's in progress.

| Field | Current | |
|---|---|---|
| Heading | `On the bench` | NEW: |
| Sub-note | `What's currently being worked out.` | NEW: |
| Card 1 title / body | `Colorway 03` / `Three candidates cut, one gets produced. The list votes.` | NEW: |
| Card 2 title / body | `Fit revisions` / `Second sample round on the training shorts — length and waistband.` | NEW: |
| Card 3 title / body | `Fabric trials` / `Testing what survives a real camp and what pills in two weeks.` | NEW: |

---

## 5. Film Room (Stoic)

| Field | Current | |
|---|---|---|
| Kicker | `Stoic — The TV` | NEW: |
| Title | `Film Room` | NEW: |
| Lede | `Newest at the top. Every entry is a piece of tape and what it was worth watching for.` | NEW: |
| Log heading | `The log` | NEW: |
| Log sub-note | `Three stand-in entries.` | NEW: |

**Entries** — reverse chronological, newest first. For each I need a **YouTube
URL or video ID**, a date, a title, and 2–3 sentences.

**Entry 1 (newest)**
| Field | Current | |
|---|---|---|
| YouTube link/ID | *none* | NEW: |
| Date | `Date` | NEW: |
| Title | `Placeholder title` | NEW: |
| Body (~200 chars) | `A short note on what this tape is and the one thing to take from it. Two or three sentences, no more — the video is the point, this is the caption.` | NEW: |

**Entry 2**
| Field | Current | |
|---|---|---|
| YouTube link/ID | *none* | NEW: |
| Date / Title / Body | placeholder | NEW: |

**Entry 3**
| Field | Current | |
|---|---|---|
| YouTube link/ID | *none* | NEW: |
| Date / Title / Body | placeholder | NEW: |

> Send as many entries as you have — the layout takes any number. Also decide
> whether entries are numbered (`Entry 003`) or just dated; numbering means
> renumbering every time you add one at the top, so dates are lower
> maintenance.

---

## 6. Cornerwoman / FAQ

| Field | Current | |
|---|---|---|
| Kicker | `Cornerwoman — The ring` | NEW: |
| Title | `Cornerwoman` | NEW: |
| Lede | `Sixty seconds between rounds. Ask the thing you were going to be embarrassed about.` | NEW: |
| Section heading | `Between rounds` | NEW: |
| Sub-note | `Placeholder questions — swap the copy, keep the shape.` | NEW: |

**Questions** — the first one is open by default. Add or cut freely.

| # | Question | Answer | |
|---|---|---|---|
| 1 | `What is Longuard?` | `A sentence on what the brand is, who it's for, and what it isn't.` | NEW: |
| 2 | `What does the fighter quiz actually do?` | `Nine questions, one of four archetypes, and a full read on how you train. It's free and it takes about three minutes.` (links to the quiz) | NEW: |
| 3 | `Do I have to train to be part of this?` | *placeholder* | NEW: |
| 4 | `When does the store open?` | *placeholder — points at the list* | NEW: |
| 5 | `How do I get my colorway made?` | *placeholder — the vote* | NEW: |
| 6 | `Where do I ask something that isn't here?` | *placeholder — contact route undecided* | NEW: |

> **Q6 needs a real answer**: an email address, a DM handle, or a form. Right
> now it promises a contact route that doesn't exist.

---

## 7. The quiz

The quiz at `/quiz/` is fully written and live — nine questions, four
archetype results, the email gate, the whole result readout. **It is not in
this document** because it's finished copy rather than placeholder, and it's a
lot of text. If you want to revise it, say so and I'll pull it into its own
template.

| Field | Current | |
|---|---|---|
| Exit link (top-left of quiz) | `← The Gym` | NEW: |

---

## 8. Still unwritten anywhere

Things the site currently has no copy for at all. Worth deciding whether they
should exist:

- **A short "what is this" line for the gym floor.** Right now the floor has no
  text at all — you pick a character with no explanation. That was deliberate
  (Hound Archives does the same), but if first-time visitors need a nudge,
  one line is the place for it. NEW:
- **Empty/error states.** What the Film Room says with no entries, what the
  store says when nothing's in stock. NEW:
- **Page titles / social share text.** What shows in a browser tab and when a
  link is pasted into a chat. Currently just `Longuard`. NEW:
