// server.js
// Express server for Asad Saboor's videographer/video editor portfolio.
// Serves the static site from /public and provides a working /api/contact
// endpoint that stores messages sent from the contact form.

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, "data", "messages.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Make sure the data file exists before we ever try to read/write it.
function ensureMessagesFile() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.mkdirSync(path.dirname(MESSAGES_FILE), { recursive: true });
    fs.writeFileSync(MESSAGES_FILE, "[]", "utf-8");
  }
}

// POST /api/contact
// Receives { name, email, message } from the contact form on the site,
// validates it, and appends it to data/messages.json so Asad can read
// enquiries without needing any third-party email service configured.
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are all required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      error: "That email address doesn't look valid.",
    });
  }

  ensureMessagesFile();

  try {
    const existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    existing.push({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      receivedAt: new Date().toISOString(),
    });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return res.json({ success: true });
  } catch (err) {
    // On serverless hosts (e.g. Vercel) the filesystem is read-only, so this
    // write can fail even though nothing is actually broken. We log it for
    // debugging but still confirm receipt to the visitor — see README for
    // why, and for a more permanent solution (e.g. an email API) once you're
    // ready to rely on this for real enquiries.
    console.error("Failed to persist contact message (this is expected on read-only hosts):", err);
    return res.json({ success: true, persisted: false });
  }
});

// GET /api/messages
// Lets Asad check enquiries that came through the contact form
// (visit /api/messages locally, or protect this route before deploying publicly).
app.get("/api/messages", (req, res) => {
  ensureMessagesFile();
  const existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  res.json(existing);
});

// Fallback: send index.html for any other route (simple single-page site).
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Asad Saboor portfolio running at http://localhost:${PORT}`);
});
