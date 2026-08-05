// Vercel serverless function — plain newsletter signup (the Lab page).
//
// Deliberately thinner than submit-quiz.js: no archetype, no Google Sheet, no
// first-result-wins rule. MailerLite's POST /subscribers is an upsert, so a
// repeat signup is harmless here — it updates the record and re-adds the group
// rather than creating a duplicate.
//
// Reuses MAILERLITE_API_KEY. Set MAILERLITE_LAB_GROUP_ID to give the Lab its
// own group; without it, signups land in the main quiz group so nobody is ever
// dropped on the floor because an env var wasn't set yet.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, source } = req.body || {};

  const clean = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const person = String(name || "").trim().slice(0, 80);

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID =
    process.env.MAILERLITE_LAB_GROUP_ID || process.env.MAILERLITE_QUIZ_GROUP_ID;

  if (!API_KEY || !GROUP_ID) {
    console.error("Missing MAILERLITE_API_KEY or a group id");
    return res.status(500).json({ error: "Signup is not configured" });
  }

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email: clean,
        fields: {
          // built-in field, so it powers {$name} in the emails
          name: person,
          signup_source: source || "site",
        },
        groups: [GROUP_ID],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("MailerLite rejected the signup:", data);
      return res.status(502).json({ error: data.message || "Signup failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return res.status(502).json({ error: "Signup failed" });
  }
}
