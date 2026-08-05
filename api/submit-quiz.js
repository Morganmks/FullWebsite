// Vercel serverless function
// Receives { email, archetype, fitPreference, answers[] } from the quiz frontend.
//
// Fans out to two places:
//   1. MailerLite — adds the subscriber to the main quiz group AND to their
//      archetype's own group, which is what an automation triggers on.
//   2. Google Sheets (via Apps Script webhook) — logs the raw response row.
//
// One-result-per-email: MailerLite's POST /subscribers is an upsert, so a repeat
// email never creates a duplicate subscriber. What a repeat WOULD do is
// overwrite their fighter_type and re-add them to a group, which can fire a
// second, contradictory archetype email. So we look them up first and treat the
// FIRST result as the real one — repeats are logged for analytics and otherwise
// ignored.

const ARCHETYPE_GROUP_ENV = {
  "The Slasher": "MAILERLITE_GROUP_SLASHER",
  "The Stoic": "MAILERLITE_GROUP_STOIC",
  "The Joker": "MAILERLITE_GROUP_JOKER",
  "The Sleeper": "MAILERLITE_GROUP_SLEEPER",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, archetype, fitPreference, answers } = req.body || {};

  if (!email || !archetype) {
    return res.status(400).json({ error: "Missing email or archetype" });
  }

  const clean = String(email).trim().toLowerCase();
  const person = String(name || "").trim().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  let alreadyPlayed = false;
  try {
    alreadyPlayed = await subscriberExists(clean);
  } catch (err) {
    // A lookup failure shouldn't cost us the signup — fall through and upsert.
    console.error("Lookup failed, treating as new:", err);
  }

  const tasks = [sendToSheet(person, clean, archetype, fitPreference, answers, alreadyPlayed)];
  if (!alreadyPlayed) tasks.push(sendToMailerLite(person, clean, archetype, fitPreference));

  const results = await Promise.allSettled(tasks);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("Submission step failed:", r.reason);
  });

  // Even if an integration fails, don't block the user from seeing their result —
  // the frontend reveals it regardless of this response.
  return res.status(200).json({
    success: true,
    repeat: alreadyPlayed,
  });
}

// 404 from MailerLite means "no such subscriber", which is the answer we want.
async function subscriberExists(email) {
  const API_KEY = process.env.MAILERLITE_API_KEY;
  if (!API_KEY) throw new Error("Missing MAILERLITE_API_KEY");

  const response = await fetch(
    `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" } },
  );

  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Lookup returned ${response.status}`);

  const data = await response.json();
  // Someone can exist from another signup without having played — only count
  // them as a repeat if they already carry a result.
  return Boolean(data?.data?.fields?.fighter_type);
}

async function sendToMailerLite(name, email, archetype, fitPreference) {
  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_QUIZ_GROUP_ID;

  if (!API_KEY || !GROUP_ID) {
    throw new Error("Missing MAILERLITE_API_KEY or MAILERLITE_QUIZ_GROUP_ID env vars");
  }

  // The archetype group is what the per-fighter automation triggers on. If it
  // isn't configured yet, the main group still works and nothing breaks.
  const archetypeGroup = process.env[ARCHETYPE_GROUP_ENV[archetype] || ""];
  const groups = archetypeGroup ? [GROUP_ID, archetypeGroup] : [GROUP_ID];

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: {
        // `name` is a MailerLite built-in, so it powers {$name} in the emails
        name,
        fighter_type: archetype,
        fit_preference: fitPreference || "",
      },
      groups,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "MailerLite request failed");
  }
  return data;
}

async function sendToSheet(name, email, archetype, fitPreference, answers, repeat) {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    throw new Error("Missing GOOGLE_SHEETS_WEBHOOK_URL env var");
  }

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      name,
      email,
      archetype,
      fitPreference: fitPreference || "",
      // logged, not dropped — retakes are worth seeing, just not worth emailing
      repeat: repeat ? "repeat" : "first",
      answers: answers || [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Sheet webhook responded with ${response.status}`);
  }
  return true;
}
