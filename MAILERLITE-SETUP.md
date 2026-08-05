# MailerLite: archetype emails + one result per person

## The short version

**Repeat emails were never inflating your subscriber count.** MailerLite's
`POST /subscribers` is an *upsert* — same address, same subscriber record,
updated rather than duplicated. Your list total was always correct.

What repeats actually did was worse and quieter: overwrite that person's
`fighter_type` and re-add them to a group, which can fire a second, contradictory
archetype email. The backend now looks the address up first and treats the
**first** result as the real one.

---

## Step 1 — Custom fields

**Subscribers → Fields → Create field.** Two text fields, exact names:

| Field name | Content |
|---|---|
| `fighter_type` | `The Slasher` / `The Stoic` / `The Joker` / `The Sleeper` |
| `fit_preference` | the answer to the shirt-fit question |

`name` is a MailerLite built-in — you don't create it. The gate collects it and
the API sets it, so `{$name}` works in your emails: *"Morgan, you're The Joker."*

---

## Step 2 — Groups

**Subscribers → Groups.** Create five:

| Group | Purpose |
|---|---|
| Quiz Takers | everyone who finishes — your master list |
| Fighter — Slasher | Slashers only |
| Fighter — Stoic | Stoics only |
| Fighter — Joker | Jokers only |
| Fighter — Sleeper | Sleepers only |

Open each group and copy its **ID** — it's the long number in the URL
(`.../groups/123456789/subscribers`).

Every finisher is added to **Quiz Takers plus their own fighter group**. The
archetype group is what makes the per-fighter automation trivial to trigger.

---

## Step 3 — Environment variables in Vercel

**Project → Settings → Environment Variables.**

```
MAILERLITE_API_KEY          your API key
MAILERLITE_QUIZ_GROUP_ID    Quiz Takers group ID
MAILERLITE_GROUP_SLASHER    Fighter — Slasher group ID
MAILERLITE_GROUP_STOIC      Fighter — Stoic group ID
MAILERLITE_GROUP_JOKER      Fighter — Joker group ID
MAILERLITE_GROUP_SLEEPER    Fighter — Sleeper group ID
MAILERLITE_LAB_GROUP_ID     Lab signups group ID (optional)
GOOGLE_SHEETS_WEBHOOK_URL   your Apps Script web app URL
```

`MAILERLITE_LAB_GROUP_ID` is used by `/api/subscribe`, which is the plain
newsletter form on the Lab page — people who joined the list without taking the
quiz. Leave it unset and those signups fall back to Quiz Takers, so nobody is
lost; you just can't tell the two entry points apart. Either way they arrive
carrying a `signup_source` field.

**Redeploy after adding them** — Vercel only picks up env vars on a fresh build.

The four archetype variables are optional. Leave them out and everyone still
lands in Quiz Takers with their `fighter_type` set; you just won't get the
per-fighter trigger.

---

## Step 4 — The automations

**Automations → Create → Trigger: "When subscriber joins a group."**

Build four, one per fighter group. Each sends that archetype's result email.

- **Trigger:** joins `Fighter — Slasher`
- **Action:** send email — *"You're The Slasher"*
- Repeat for Stoic, Joker, Sleeper

In each automation's settings, leave **"Allow subscribers to re-enter this
automation" OFF.** That's your second line of defence against duplicate sends.

### Why four automations and not one

You *can* do it with a single automation triggered by Quiz Takers and a
condition step branching on `fighter_type`. It works. But four separate ones are
easier to debug, let you edit one fighter's email without touching the others,
and give you clean segments for later ("email every Joker about the oversized
drop"). The duplication is four trigger configs, which is cheap.

---

## What a repeat looks like now

| | First time | Repeat |
|---|---|---|
| MailerLite | added, fields set, groups joined | **untouched** |
| Automation | fires | does not fire |
| Google Sheet | row marked `first` | row marked `repeat` |
| The visitor | sees their result | sees their result |

Repeats are still logged, so you can see how often people replay — it just
doesn't cost you a subscriber event or a second email.

### Sheet columns

The webhook now posts these keys, in this order:

```
timestamp | name | email | archetype | fit_preference | repeat | q1 … q9
```

Add **`name`** after `timestamp` and **`repeat`** after `fit_preference` to your
header row — and update the Apps Script to write them, or every value lands one
column early. Full script and redeploy steps: **`GOOGLE-SHEET-SCRIPT.md`**.

---

## What this does not stop

Someone determined can use a different address, or open incognito, and play
again. There is no way to prevent that without asking people to create accounts,
which for a top-of-funnel quiz would cost you far more signups than it saves.

What it does stop is the realistic case: the same person replaying to see the
other fighters, and each replay looking like fresh activity.
