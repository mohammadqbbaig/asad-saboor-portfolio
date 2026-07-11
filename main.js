// main.js — portfolio interactivity
// 1. Scrubber (scroll-progress timeline bar)
// 2. Mobile menu toggle
// 3. Reel grid: renders video cards, gracefully falling back to a
//    "drop your footage here" placeholder if the file isn't present yet.
// 4. Contact form: posts to /api/contact (Express backend).

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Scrubber ---------- */
const scrubberFill = document.getElementById("scrubberFill");
const scrubberPlayhead = document.getElementById("scrubberPlayhead");

function updateScrubber() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrubberFill.style.width = progress + "%";
  scrubberPlayhead.style.left = progress + "%";
}
window.addEventListener("scroll", updateScrubber, { passive: true });
updateScrubber();

/* ---------- Mobile menu ---------- */
const navBurger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");
navBurger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  navBurger.setAttribute("aria-expanded", String(isOpen));
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navBurger.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Reel grid ----------
   Add real projects here as you shoot & edit them. Each item points at a
   file expected in /public/videos/. If that file doesn't exist yet, the
   card automatically shows a placeholder instead of a broken player —
   so the site always looks intentional, never broken. */
const REEL_ITEMS = [
  { file: "reel-1.mp4", title: "Your Project Title 1", tag: "Event" },
  { file: "reel-2.mp4", title: "Your Project Title 2", tag: "Business Promo" },
  { file: "reel-3.mp4", title: "Your Project Title 3", tag: "Event" },
  { file: "reel-4.mp4", title: "Your Project Title 4", tag: "Business Promo" },
  { file: "reel-5.mp4", title: "Your Project Title 5", tag: "Event" },
  { file: "reel-6.mp4", title: "Your Project Title 6", tag: "Business Promo" },
];

const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

function buildReelCard(item) {
  const card = document.createElement("article");
  card.className = "reel-card";

  const frame = document.createElement("div");
  frame.className = "reel-card__frame";

  const video = document.createElement("video");
  video.src = `/videos/${encodeURIComponent(item.file)}`;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.controls = true;

  const placeholder = document.createElement("div");
  placeholder.className = "reel-card__placeholder";
  placeholder.innerHTML = `
    <span class="reel-card__play">${playIcon}</span>
    <span class="reel-card__hint">/public/videos/${item.file}</span>
  `;

  // If the video file isn't there yet, swap in the placeholder instead.
  video.addEventListener("error", () => {
    frame.innerHTML = "";
    frame.appendChild(placeholder);
  }, { once: true });

  frame.appendChild(video);

  const body = document.createElement("div");
  body.className = "reel-card__body";
  body.innerHTML = `
    <span class="reel-card__tag">${item.tag}</span>
    <h3 class="reel-card__title">${item.title}</h3>
  `;

  card.appendChild(frame);
  card.appendChild(body);
  return card;
}

const reelGrid = document.getElementById("reelGrid");
REEL_ITEMS.forEach((item) => reelGrid.appendChild(buildReelCard(item)));

/* ---------- Contact form ---------- */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      formStatus.textContent = "Message sent — thanks, I'll get back to you soon.";
      formStatus.className = "form-status success";
      contactForm.reset();
    } else {
      formStatus.textContent = data.error || "Something went wrong. Please try WhatsApp or email instead.";
      formStatus.className = "form-status error";
    }
  } catch (err) {
    formStatus.textContent = "Couldn't reach the server. Please try WhatsApp or email instead.";
    formStatus.className = "form-status error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});
