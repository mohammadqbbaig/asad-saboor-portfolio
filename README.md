# Asad Saboor — Portfolio

A functional videographer/video editor portfolio: HTML + CSS on the front end,
a small Node.js/Express server on the back end (static hosting + a working
contact form). Built to run locally in VS Code and deploy straight to Vercel.

## 1. Run it locally in VS Code

1. Open this folder in VS Code.
2. Open a terminal (``Ctrl/Cmd + ` ``) and install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open **http://localhost:3000** in your browser. Any code change needs a
   server restart (`Ctrl+C` then `npm start` again) — or install the
   `nodemon` package if you want auto-reload while editing.

## 2. Add your real showreel videos

The reel section is already wired up — it just needs video files. Export
your clips as `.mp4` and drop them into `public/videos/` using these exact
names:

```
public/videos/reel-1.mp4
public/videos/reel-2.mp4
public/videos/reel-3.mp4
public/videos/reel-4.mp4
public/videos/reel-5.mp4
public/videos/reel-6.mp4
```

Until a file exists, that card automatically shows a clean "drop your
footage here" placeholder instead of a broken video player — so the site
never looks broken while you're filling it in.

Want more or fewer than 6 videos, or real titles instead of "Add your
project title"? Edit the `REEL_ITEMS` list near the top of
`public/js/main.js`:

```js
const REEL_ITEMS = [
  { file: "reel-1.mp4", title: "Ahmed & Sara — Wedding Highlights", tag: "Event" },
  // add or remove rows here
];
```

## 3. Customize content

- **Text content**: edit `public/index.html` directly (About bio, services,
  contact details).
- **Colors/fonts**: all defined as CSS variables at the top of
  `public/css/style.css` under `:root`.
- **Contact details**: currently set to the phone/WhatsApp/email you
  provided. Update the `tel:`, `https://wa.me/`, and `mailto:` links in
  `index.html` if any of these change.

## 4. The contact form — how it works, and its one limitation

The form posts to `/api/contact` (in `server.js`), which saves messages to
`data/messages.json`. Locally, this works out of the box — no email service
or API key needed. You can check messages any time by visiting
**http://localhost:3000/api/messages**.

**Once deployed to Vercel:** Vercel's servers are "serverless" and their
filesystem is read-only, so messages won't actually persist there — the
form will still confirm "message sent" to visitors (so nothing looks
broken), but you won't be able to read submissions back later. For a
real deployed site, you have two solid options:
- Point the WhatsApp/email/call buttons as the primary contact method
  (already live and fully reliable regardless of hosting), or
- Wire up a proper email service (e.g. [Resend](https://resend.com) or
  [EmailJS](https://www.emailjs.com)) in `server.js` — ask me and I can
  add this for you once you've picked one.

## 5. Deploy to Vercel

1. Install the Vercel CLI if you don't have it:
   ```
   npm install -g vercel
   ```
2. From this project folder, run:
   ```
   vercel
   ```
3. Follow the prompts (link/create a project, accept the defaults). Vercel
   will detect `vercel.json` and deploy the Express server automatically.
4. For future updates, run `vercel --prod` to push to your live URL.

Alternatively, push this folder to a GitHub repo and import it directly at
[vercel.com/new](https://vercel.com/new) — same result, with automatic
redeploys on every push.

## 6. Project structure

```
asad-portfolio/
├── server.js              Express server (static files + /api/contact)
├── package.json
├── vercel.json             Vercel deployment config
├── data/
│   └── messages.json       Contact form submissions (local only)
└── public/
    ├── index.html
    ├── css/style.css
    ├── js/main.js
    └── videos/              ← put your reel-1.mp4 … reel-6.mp4 here
```
