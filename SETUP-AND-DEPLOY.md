# Longuard Quiz — Setup & Deploy Guide

## What's in this folder
- `index.html` / `style.css` / `script.js` — the quiz itself: 7 questions, 4 archetypes (Slasher, Stoic, Joker, Sleeper), scoring, email capture, share button. Design system is locked, see `design-reference.html` for the color/typography reference.
- `api/submit-quiz.js` — a serverless function that fans out to MailerLite (email + archetype + fit preference) and a Google Sheet (full raw responses), keeps both credentials private, never exposed in the browser.
- `package.json` — tells Vercel these are ES modules

Colors and fonts are locked per `design-reference.html`, no need to change `style.css` unless the brand palette changes.

---

## Step 1 — MailerLite setup

1. In MailerLite, go to **Subscribers > Groups** and create a new group called **"Quiz Takers"**. Copy its Group ID (visible in the URL or group settings).
2. Go to **Subscribers > Custom Fields** and create two text fields: **`fighter_type`** and **`fit_preference`**.
3. Go to **Integrations > MailerLite API** and generate an API key. Copy it somewhere safe, you won't be able to see it again.
4. Build your automation: **Automations > New automation**, trigger = "Subscriber joins group: Quiz Takers." First email = confirm their result + fit rec (copy straight from `script.js`'s `RESULTS` object). After 1-2 emails, fold them into your main newsletter sequence, don't run two permanent parallel tracks.

---

## Step 1b — Google Sheet setup (for raw response logging)

1. Create a new Google Sheet, name the first row headers: `timestamp, email, archetype, fit_preference, q1, q2, q3, q4, q5, q6, q7`.
2. In the Sheet, go to **Extensions > Apps Script**, delete the placeholder code, and paste in a function that reads the POST body and appends a row (ask me for this script if you want it written out, it's about 15 lines).
3. Deploy it: **Deploy > New deployment > type: Web app**, execute as you, access to anyone. Copy the resulting web app URL, that's your `GOOGLE_SHEETS_WEBHOOK_URL`.

---

## Step 2 — Test locally in VS Code

1. Open this folder in VS Code.
2. Install the **Live Server** extension (or run `python3 -m http.server 8000` from the terminal) to preview `index.html` in your browser and click through the quiz.
3. The email step will fail locally unless you're also running the API function, that's expected, the frontend still works fine for checking questions/flow/design.

---

## Step 3 — Deploy on Vercel

1. Push this folder to a GitHub repo (`git init`, `git add .`, `git commit -m "longuard quiz"`, create a repo on GitHub, push).
2. Go to [vercel.com](https://vercel.com), sign in, **Add New Project**, import that repo. Vercel auto-detects the `/api` folder as serverless functions, no config needed.
3. Before deploying, add three environment variables in Vercel's project settings (**Settings > Environment Variables**):
   - `MAILERLITE_API_KEY` — the key from Step 1.3
   - `MAILERLITE_QUIZ_GROUP_ID` — the group ID from Step 1.1
   - `GOOGLE_SHEETS_WEBHOOK_URL` — the web app URL from Step 1b.3
4. Deploy. Vercel gives you a live URL immediately, and redeploys automatically every time you push to GitHub.

---

## Step 4 — Go live
Drop the Vercel URL into your YouTube description, IG bio, and newsletter. That's the whole funnel: link → quiz → email gate → result → MailerLite tags them by archetype → your automation takes over.

## Later, not now
- Phone number collection: hold off, per the earlier call, ask for it contextually at drop 2 launch instead of on the quiz itself.
- Custom shareable image cards: current share button uses native share/copy-link, which is fine for v1. A generated image card is a real upgrade but adds build complexity, revisit once the quiz proves itself.
