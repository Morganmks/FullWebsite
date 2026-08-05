# Google Sheet: the Apps Script

## Why your columns are shifted

Your sheet shows the email under `name`, the archetype under `email`, and every
answer one column to the left of its header. Nothing is corrupted — the Apps
Script is simply an older version that writes six fewer things than the webhook
now sends.

It currently appends:

```
timestamp | email | archetype | fitPreference | q1 … q9
```

while your header row reads:

```
timestamp | name | email | archetype | fit_preference | repeat | Q1 … Q9
```

`name` and `repeat` were added later, so every value lands one cell early and
the last two answers fall off the end.

**Nothing in the quiz needs changing.** It's already sending all eight keys —
the script just isn't reading them.

---

## The fix

**Extensions → Apps Script**, delete everything in the editor, paste this:

```javascript
const QUESTION_COUNT = 9;

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  const answers = data.answers || [];

  // Order here must match the header row exactly.
  const row = [
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.archetype || '',
    data.fitPreference || '',   // camelCase from the API, snake_case in the header
    data.repeat || '',
  ];

  // Pad to a fixed width so a short answer set can never shift later columns.
  for (let i = 0; i < QUESTION_COUNT; i++) {
    row.push(answers[i] || '');
  }

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Then redeploy — this is the step people miss

Saving the script does **nothing** on its own. The live web app keeps running the
old code until you publish a new version.

**Deploy → Manage deployments → the pencil icon → Version: New version → Deploy.**

Use *Manage deployments*, not *New deployment*. A new deployment gives you a new
URL and you'd have to update `GOOGLE_SHEETS_WEBHOOK_URL` in Vercel. Editing the
existing one keeps the URL you already have.

---

## Clean up the bad rows

The rows already written are shifted and can't be repaired by re-running
anything. Delete them and take the quiz once to confirm the mapping.

---

## Your header row

```
timestamp | name | email | archetype | fit_preference | repeat | Q1: who calling | Q2: snack | Q3: handwrap | Q4: glove color | Q5: playlist | Q6: setback | Q7: fit | Q8: style | Q9: rest days
```

That's 15 columns, A through O, and it matches the script above.

## If you change the question count

`QUESTION_COUNT` at the top of the script is the one number to update, and you'll
need to add or remove header columns to match. The padding loop is what stops a
missing answer from dragging every later column out of alignment — the failure
you just saw, but silent.

---

# Updating the webhook URL in Vercel

Only needed if the Apps Script URL changed — which happens when you use
*New deployment* instead of *Manage deployments*.

## Part 1 — Copy the URL from Apps Script

1. In your Sheet: **Extensions → Apps Script**
2. **Deploy → Manage deployments**
3. Copy the **Web app URL**

It must end in **`/exec`**. A URL ending in `/dev` is the test version — it only
works while you're logged in, so the server's request will fail.

If there's no deployment listed: **Deploy → New deployment → gear icon → Web
app**, set **Execute as: Me** and **Who has access: Anyone**, then Deploy and
copy the URL. "Anyone" is required — Vercel calls this anonymously, and
"Anyone with a Google account" will reject it.

## Part 2 — Update the variable

1. Go to **vercel.com** and log in
2. Click your project
3. **Settings** (top nav)
4. **Environment Variables** (left sidebar)
5. Find `GOOGLE_SHEETS_WEBHOOK_URL`
6. Click the **⋯** at the right of its row → **Edit**
7. Replace the value with the new URL — check for no trailing space
8. Leave **Production**, **Preview** and **Development** all ticked
9. **Save**

## Part 3 — Redeploy (the step that actually applies it)

Environment variables are read at build time. Saving one changes nothing about
the site that's currently live.

1. **Deployments** tab
2. On the newest deployment, click **⋯ → Redeploy**
3. Confirm **Redeploy**
4. Wait for the status to reach **Ready**

## Part 4 — Confirm it worked

Take the quiz once and watch for a new row in the Sheet.

If no row appears, the answer is in the logs rather than the browser — the quiz
deliberately swallows this error so a visitor still sees their result:

**Deployments → click the deployment → Logs**, then submit the quiz again and
watch for `/api/submit-quiz`. The three failures you'll actually see:

| Log line | Cause |
|---|---|
| `Missing GOOGLE_SHEETS_WEBHOOK_URL` | variable not saved, or you didn't redeploy |
| `Sheet webhook responded with 401` / `403` | Apps Script access isn't set to "Anyone" |
| `Sheet webhook responded with 302` | URL ends in `/dev`, or points at an old deployment |
