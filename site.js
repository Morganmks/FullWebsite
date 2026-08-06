/* ==========================================================================
   LONGUARD GYM — shared site script
   Loaded by every page except the quiz (which runs as its own full-screen app).

   Two config blocks live here and nothing else in the site hard-codes them:
     SECTIONS — the nav, in order
     GUIDES   — the five characters on the gym floor, and where they stand
   ========================================================================== */

/* ---------- 1. THE SECTIONS ---------------------------------------------
   Edit this list to change the nav everywhere at once. `id` must match the
   `data-section` on each page's <body> so the current page gets marked.      */

const SECTIONS = [
  { id: "home",      label: "Main Menu", href: "/" },
  { id: "training",  label: "Training",  href: "/training/" },
  { id: "store",     label: "Shop",      href: "/store/" },
  { id: "lab",       label: "The Lab",   href: "/lab/" },
  { id: "film-room", label: "Film Room", href: "/film-room/" },
  { id: "cornerwoman", label: "Guide",     href: "/cornerwoman/" },
];

/* ---------- 2. THE GUIDES ------------------------------------------------
   One entry per character on the gym floor.

   POSITIONING is in percentages of the scene box, so it survives any screen
   size — the hotspots ride the background image instead of drifting off it.

     x  → horizontal centre of the figure, 0 = left edge, 100 = right edge
     y  → the figure's FEET (its baseline), 0 = top, 100 = bottom
     h  → figure height as a % of the scene's height; width follows the art

   Because y is the baseline, a character always stands ON the floor line you
   measure — raising `h` makes them taller without sinking them into the mat.
   Height rather than width is the size lever because it's what you can judge
   by eye against the background ("he's half the frame tall"), and because it
   holds regardless of how tightly a given art file happens to be cropped.

   Sleeper is the exception to "standing": he's drawn reclining, for the couch,
   so his bottom edge is his lower body and his `y` seats him rather than
   standing him on the floor.

   TO RE-POSITION, open the home page with ?tune on the end of the URL (e.g.
   longuard.shop/?tune), which skips the attract beat and drops you straight
   onto the floor. Every hotspot gets an outline and a live readout, you drag
   them into place, and the panel prints the numbers to paste back here.

   ART: drop a file at assets/guides/<id>.png (or .webp/.jpg) and it replaces
   the black placeholder silhouette automatically. No code change. Export the
   figure on transparency, cropped tight, feet at the very bottom edge.

   Optional `fade: true` softens the bottom edge of a figure that ISN'T cropped
   to the feet — it was there for the old thigh-cropped stand-ins. None of the
   current five need it; keep the flag for the next file that arrives cropped. */

const GUIDES = [
  {
    id: "slasher",
    name: "Slasher",
    zone: "Back-left, by the heavy bags",
    blurb: "Owns the training floor.",
    href: "/training/",
    section: "Training Area",
    accent: "#C1272D",
    x: 30, y: 63.5, h: 22,
    side: "left", // avatar left, panel right — the overlay's default
  },
  {
    id: "cornerwoman",
    name: "Cornerwoman",
    zone: "Standing on the logo mat, centre",
    blurb: "Someone you can trust with any question you have.",
    href: "/cornerwoman/",
    section: "Cornerwoman / FAQ",
    accent: "#E0723A",
    x: 45, y: 70, h: 27,
    side: "right", // mirrored — avatar right, panel/info on the left
  },
  {
    id: "stoic",
    name: "Stoic",
    zone: "Left, in the gap between the photo and gear walls",
    blurb: "Reviews the training and fight footage.",
    href: "/film-room/",
    section: "Film Room",
    accent: "#FFFFFF",
    x: 14, y: 79, h: 46,
    side: "left",
  },
  {
    id: "sleeper",
    name: "Sleeper",
    zone: "Reclining on the daybed, right",
    blurb: "Manages the community.",
    href: "/lab/",
    section: "The Lab",
    accent: "#4A90D9",
    x: 79.5, y: 63.5, h: 14,
    side: "right", // mirrored, same reasoning as Cornerwoman
  },
  {
    id: "joker",
    name: "Joker",
    zone: "Right foreground, by the retail case",
    blurb: "Hand-picks the perfect pieces for your fighting style.",
    href: "/store/",
    section: "Gym Store",
    accent: "#D4AF37",
    x: 88, y: 86, h: 58,
    side: "left",
  },
];

/* ---------- Asset probing -------------------------------------------------
   Same trick the quiz uses: art arrives as .png, .webp or .jpg depending on
   how it was exported, so try each and take the first that decodes. Nothing
   found means the placeholder stays, which is a working state, not a broken
   one.                                                                       */

// Order matters only for speed: whatever is listed first is requested first,
// so each kind of asset leads with the format it's actually likely to be.
// Character cutouts need transparency (png/webp); the background is a photo-
// weight illustration (jpg).
const CUTOUT_EXTS = ["png", "webp", "jpg", "jpeg"];
const SCENE_EXTS = ["jpg", "webp", "png", "jpeg"];

function resolveImage(base, onFound, onMissing, exts = CUTOUT_EXTS) {
  let i = 0;
  const tryNext = () => {
    if (i >= exts.length) return onMissing && onMissing();
    const url = `${base}.${exts[i++]}`;
    const probe = new Image();
    probe.onload = () => onFound(url);
    probe.onerror = tryNext;
    probe.src = url;
  };
  tryNext();
}

// Resolved guide art, keyed by guide id. Filled the first time any surface
// (gym floor, phone cards, overlay) successfully probes a character's file.
// The overlay used to clone whatever markup the floor hotspot happened to hold
// at that instant, so opening a guide before its PNG had finished downloading
// showed the black placeholder silhouette and never recovered. Everything now
// reads from here instead of from each other's DOM.
const GUIDE_ART = {};

function resolveGuideArt(id, onReady) {
  if (GUIDE_ART[id]) { onReady(GUIDE_ART[id]); return; }
  resolveImage(`/assets/guides/${id}`, (url) => {
    GUIDE_ART[id] = url;
    onReady(url);
  });
}

/* ---------- Gym-floor tutorial hint ---------------------------------------
   First-time nudge: walks a new visitor through the five guides in order,
   one at a time. The hint text and a glow on the current target both point
   at the same guide; clicking that guide (from anywhere — the floor, the
   phone cards, the nav, or the title menu, since they all funnel through
   overlayApi.open()) advances to the next one. Progress is kept in
   sessionStorage so it doesn't repeat within a visit but does reset next
   time. Clicking a guide that ISN'T the current target doesn't advance or
   reset it — only the right one does. */

const TUTORIAL = [
  { id: "cornerwoman", hint: "Start by selecting the Cornerwoman — she'll explain how this works." },
  { id: "stoic", hint: "Now visit the Stoic to learn what Longuard is." },
  { id: "joker", hint: "Now check out the Joker — the Gym Store." },
  { id: "slasher", hint: "Now visit the Slasher — the Training Area." },
  { id: "sleeper", hint: "Now visit the Sleeper — the Lab." },
];

function tutorialStep() {
  let idx = 0;
  try { idx = parseInt(sessionStorage.getItem("longuard_tutorial_step") || "0", 10); } catch (e) { /* private mode */ }
  return Number.isNaN(idx) ? 0 : idx;
}

function setTutorialStep(idx) {
  try { sessionStorage.setItem("longuard_tutorial_step", String(idx)); } catch (e) { /* private mode */ }
}

function renderTutorial() {
  const hintEl = document.getElementById("gym-hint");
  if (!hintEl) return; // only the home page has the gym floor

  document.querySelectorAll(".guide.is-hint-target").forEach((g) => g.classList.remove("is-hint-target"));

  const step = TUTORIAL[tutorialStep()];
  if (!step) {
    hintEl.textContent = "";
    hintEl.classList.remove("is-shimmer");
    hintEl.style.display = "none";
    return;
  }

  hintEl.style.display = "";
  hintEl.textContent = step.hint;
  hintEl.classList.add("is-shimmer");

  const targetGuide = document.querySelector(`.guide[data-id="${step.id}"]`);
  if (targetGuide) targetGuide.classList.add("is-hint-target");
}

function advanceTutorialIfMatches(guideId) {
  const step = TUTORIAL[tutorialStep()];
  if (step && step.id === guideId) {
    setTutorialStep(tutorialStep() + 1);
    renderTutorial();
  }
}

/* ---------- Nav ----------------------------------------------------------
   Rendered into <div id="site-nav"> on every page, so the whole site is
   reachable without ever touching the illustrated scene.                     */

function mountNav() {
  const host = document.getElementById("site-nav");
  if (!host) return;

  const here = document.body.dataset.section || "";
  const links = SECTIONS.map(
    (s) =>
      `<a class="nav-link${s.id === here ? " is-here" : ""}" href="${s.href}"${
        s.id === here ? ' aria-current="page"' : ""
      }>${s.label}</a>`,
  ).join("");

  host.innerHTML = `
    <div class="nav-inner">
      <a class="nav-mark" href="/" aria-label="Longuard, home"><img src="/assets/home/wordmark-compact.svg" alt="Longuard" /></a>
      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-links">
        <span aria-hidden="true"></span><span class="sr-only">Menu</span>
      </button>
      <nav class="nav-links" id="nav-links" aria-label="Sections">${links}</nav>
    </div>`;

  const toggle = document.getElementById("nav-toggle");
  toggle.addEventListener("click", () => {
    const open = host.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Top nav no longer opens separate pages — it opens the same guide-on-the-
  // gym-floor experience as clicking a guide directly, from anywhere in the
  // site. On the home page that happens immediately. From any other page
  // there's no gym floor to pop the overlay onto, so it navigates home first
  // with a marker (?open=<guide id>) that mountHome() reads to auto-open the
  // same guide the instant it lands — same destination, just one hop through
  // a real page load to get the overlay DOM to exist in the first place.
  const navLinks = document.getElementById("nav-links");
  navLinks.addEventListener("click", (e) => {
    const link = e.target.closest("a.nav-link[href]");
    if (!link) return;
    const g = GUIDES.find((x) => x.href === link.getAttribute("href"));
    if (!g) return; // links with no matching guide (none currently) navigate as normal

    e.preventDefault();
    host.classList.remove("is-open"); // close the mobile nav drawer if it was open
    sfx.forward();
    if (overlayApi) {
      setStage("gym");
      const sourceEl = document.querySelector(`.guide[data-id="${g.id}"]`);
      overlayApi.open(g, sourceEl);
    } else {
      location.href = `/?open=${g.id}`;
    }
  });
}

/* ---------- The gym floor -------------------------------------------------
   Only runs on the home page. Builds a hotspot per guide, positioned from the
   percentages above.                                                         */

function mountScene() {
  const scene = document.getElementById("scene");
  const plate = document.getElementById("scene-plate");
  if (!scene || !plate) return;

  // The plate holds the art's 16:9 and is sized to overflow the viewport, so
  // percentages below always mean the same point on the illustration no matter
  // how the window is shaped. It exists whether or not the file has landed.
  resolveImage(
    "/assets/home/gym-floor",
    (url) => {
      plate.style.setProperty("--scene-img", `url("${url}")`);
      scene.classList.add("has-art");
    },
    null,
    SCENE_EXTS,
  );

  GUIDES.forEach((g) => {
    const a = document.createElement("a");
    a.className = "guide";
    a.href = g.href;
    a.dataset.id = g.id;
    a.style.setProperty("--x", `${g.x}%`);
    a.style.setProperty("--y", `${g.y}%`);
    a.style.setProperty("--h", `${g.h}%`);
    a.style.setProperty("--accent", g.accent);
    if (g.fade) a.classList.add("fade-bottom");
    a.setAttribute("aria-label", `${g.name} — ${g.section}`);

    a.innerHTML = `
      <span class="guide-art">${silhouette()}</span>
      <span class="guide-tag">
        <span class="guide-tag-name">${g.name}</span>
        <span class="guide-tag-section">${g.section}</span>
      </span>`;

    // Real art, if it's been dropped in, replaces the placeholder silhouette.
    resolveGuideArt(g.id, (url) => {
      const art = a.querySelector(".guide-art");
      const img = new Image();
      img.alt = "";
      // Pin the hotspot's aspect ratio to the art's own. Without this the box
      // is shrink-to-fit, and an absolutely-positioned box with `left: 88%`
      // can only be as wide as the space left to the right edge — which
      // squashed Joker (and would squash anyone else pushed near an edge),
      // and left his click target narrower than he looked.
      img.onload = () => {
        if (img.naturalHeight) a.style.setProperty("--ar", img.naturalWidth / img.naturalHeight);
        art.innerHTML = "";
        art.appendChild(img);
        a.classList.add("has-art");
      };
      img.src = url;
    });

    plate.appendChild(a);
  });

  renderTutorial();
  mountGuideCards();
  if (new URLSearchParams(location.search).has("tune")) mountTuner(plate);
}

/* A generic standing figure — deliberately plain, and deliberately the same
   for all five. It is a placeholder marking a position, not a character. */
function silhouette() {
  // Built from primitives rather than one path so it stays obviously editable,
  // and so the feet land exactly on the bottom of the viewBox — that edge is
  // the baseline the whole positioning model is measured from.
  return `
    <svg viewBox="0 0 100 256" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <circle cx="50" cy="26" r="20" />
      <rect x="30" y="48"  width="40" height="78"  rx="14" />
      <rect x="14" y="54"  width="15" height="72"  rx="7.5" />
      <rect x="71" y="54"  width="15" height="72"  rx="7.5" />
      <rect x="32" y="114" width="16" height="142" rx="8" />
      <rect x="52" y="114" width="16" height="142" rx="8" />
    </svg>`;
}

/* The scene is a wide 16:9 illustration; on a phone it would be a postage
   stamp with unhittable hotspots. Below the breakpoint the same GUIDES list
   renders as a stacked card menu instead. Same links, same order. */
function mountGuideCards() {
  const host = document.getElementById("guide-cards");
  if (!host) return;

  host.innerHTML = GUIDES.map(
    (g) => `
    <a class="guide-card" href="${g.href}" style="--accent:${g.accent}" aria-label="${g.name} — ${g.section}">
      <span class="guide-card-fig">${silhouette()}</span>
      <span class="guide-card-body">
        <span class="guide-card-name">${g.name}</span>
        <span class="guide-card-section">${g.section}</span>
        <span class="guide-card-blurb">${g.blurb}</span>
      </span>
    </a>`,
  ).join("");

  GUIDES.forEach((g) => {
    resolveGuideArt(g.id, (url) => {
      const fig = host.querySelector(`.guide-card[href="${g.href}"] .guide-card-fig`);
      if (fig) fig.innerHTML = `<img src="${url}" alt="" />`;
    });
  });
}

/* ---------- Tune mode (?tune) --------------------------------------------
   Drag each figure onto its mark, then copy the printed block back into
   GUIDES above. Never loads unless the query string asks for it.             */

function mountTuner(scene) {
  document.body.classList.add("tuning");

  const panel = document.createElement("div");
  panel.className = "tuner";
  panel.innerHTML = `
    <p class="tuner-head">Tune mode — drag a figure onto its mark.</p>
    <p class="tuner-hint">Shift-drag, or ↑↓ on a selected figure, resizes it. Copy the block below into GUIDES in site.js. Drag this panel's title bar if it's covering someone.</p>
    <pre class="tuner-out" id="tuner-out"></pre>`;
  document.body.appendChild(panel);

  // The panel parks over the right of the scene, which is where a foreground
  // character stands — so it has to be movable, by its title bar.
  (() => {
    const head = panel.querySelector(".tuner-head");
    let from = null;
    head.addEventListener("pointerdown", (e) => {
      const r = panel.getBoundingClientRect();
      from = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      head.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    head.addEventListener("pointermove", (e) => {
      if (!from) return;
      panel.style.left = `${e.clientX - from.dx}px`;
      panel.style.top = `${e.clientY - from.dy}px`;
    });
    head.addEventListener("pointerup", () => { from = null; });
  })();

  const out = document.getElementById("tuner-out");
  const live = {};
  GUIDES.forEach((g) => (live[g.id] = { x: g.x, y: g.y, h: g.h }));

  const print = () => {
    out.textContent = GUIDES.map((g) => {
      const v = live[g.id];
      return `  // ${g.name} — ${g.zone}\n  x: ${v.x.toFixed(1)}, y: ${v.y.toFixed(1)}, h: ${v.h.toFixed(1)},`;
    }).join("\n");
  };
  print();

  let dragging = null;

  const apply = (el, id) => {
    const v = live[id];
    el.style.setProperty("--x", `${v.x}%`);
    el.style.setProperty("--y", `${v.y}%`);
    el.style.setProperty("--h", `${v.h}%`);
    print();
  };

  scene.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".guide");
    if (!el) return;
    e.preventDefault();
    const box = scene.getBoundingClientRect();
    dragging = { el, id: el.dataset.id, box, resize: e.shiftKey, startY: e.clientY, startH: live[el.dataset.id].h };
    el.setPointerCapture(e.pointerId);
    scene.querySelectorAll(".guide").forEach((n) => n.classList.remove("is-selected"));
    el.classList.add("is-selected");
  });

  scene.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const { el, id, box } = dragging;
    if (dragging.resize) {
      // one screen-height of drag spans the full 5–140% size range
      const delta = ((dragging.startY - e.clientY) / box.height) * 140;
      live[id].h = Math.max(5, Math.min(140, dragging.startH + delta));
    } else {
      live[id].x = Math.max(0, Math.min(100, ((e.clientX - box.left) / box.width) * 100));
      live[id].y = Math.max(0, Math.min(100, ((e.clientY - box.top) / box.height) * 100));
    }
    apply(el, id);
  });

  const stop = () => { dragging = null; };
  scene.addEventListener("pointerup", stop);
  scene.addEventListener("pointercancel", stop);

  // Links would fire on mouse-up mid-drag, which makes tuning impossible.
  scene.addEventListener("click", (e) => {
    if (e.target.closest(".guide")) e.preventDefault();
  });

  window.addEventListener("keydown", (e) => {
    const el = scene.querySelector(".guide.is-selected");
    if (!el) return;
    const id = el.dataset.id;
    const step = e.shiftKey ? 2 : 0.5;
    if (e.key === "ArrowUp") live[id].h = Math.min(140, live[id].h + step);
    else if (e.key === "ArrowDown") live[id].h = Math.max(5, live[id].h - step);
    else return;
    e.preventDefault();
    apply(el, id);
  });
}

/* ---------- Audio ----------------------------------------------------
   Ties the speaker toggle + volume dial to the hero video's own audio
   track. Same pattern as the quiz: default is "on," but actual sound only
   plays once a real gesture has happened (autoplay policy), so intent is
   applied immediately for correctness and re-applied on first gesture to
   make sure it actually takes. Only runs on the home page — everywhere
   else this quietly no-ops since #hero-video / #audio-ctl don't exist.  */

let storedMusic = null;
try { storedMusic = sessionStorage.getItem("longuard_audio_music"); } catch (e) { /* private mode */ }
const audio = { music: storedMusic === null ? true : storedMusic === "1", volume: 0.5, ctx: null };

/* ---------- UI sound effects -------------------------------------------
   Short synthesised tones (oscillator -> lowpass -> gain), same technique
   as the quiz — the filter is what keeps these from sounding like raw
   beeps. Used for browsing the title menu and picking a guide; the video's
   own audio track is the only recorded sound on this page. */

function audioCtx() {
  if (!audio.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audio.ctx = new AC();
  }
  if (audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume();
  return audio.ctx;
}

function tone({ freq = 440, dur = 0.08, type = "triangle", gain = 0.2, slideTo = null, cutoff = 2600, delay = 0 }) {
  if (reducedMotion) return;
  const ctx = audioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff, t0);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * audio.volume), t0 + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(filter).connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

const sfx = {
  // browsing the title menu: one dry tick per item
  move: () => tone({ freq: 880, dur: 0.045, type: "triangle", gain: 0.14, cutoff: 3200 }),
  // picking a guide — going deeper into their section. Rises.
  forward: () => {
    tone({ freq: 300, dur: 0.1, type: "triangle", gain: 0.16, cutoff: 2800 });
    tone({ freq: 450, dur: 0.14, type: "triangle", gain: 0.14, slideTo: 600, cutoff: 3200, delay: 0.06 });
    tone({ freq: 140, dur: 0.18, type: "sine", gain: 0.14 });
  },
};

function mountAudio() {
  const video = document.getElementById("hero-video");
  const btn = document.getElementById("audio-btn");
  const range = document.getElementById("audio-range");
  const ctl = document.getElementById("audio-ctl");
  if (!video || !btn || !range || !ctl) return;

  let gestureHappened = false;

  function applyAudio() {
    document.body.classList.toggle("audio-on", audio.music);
    btn.setAttribute("aria-pressed", String(audio.music));
    btn.setAttribute("aria-label", audio.music ? "Mute" : "Unmute");
    video.volume = audio.volume;
    try { sessionStorage.setItem("longuard_audio_music", audio.music ? "1" : "0"); } catch (e) { /* private mode */ }

    // Only actually flip the video to unmuted after a real gesture has
    // happened on THIS page load — setting muted false before one is what
    // caused the video to only ever start playing once someone clicked into
    // Continue Training: browsers only allow autoplay muted, and unmuting an
    // already-autoplaying video with no user activation gets it silently
    // paused rather than just kept quiet. Muting is always safe immediately.
    if (audio.music && !gestureHappened) return;
    video.muted = !audio.music;
  }

  function unlock() {
    if (gestureHappened) return;
    gestureHappened = true;
    applyAudio();
  }
  ["pointerdown", "keydown", "touchstart"].forEach((evt) =>
    document.addEventListener(evt, unlock, { once: true, capture: true }));

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // the attract screen listens on document for "press start"
    audio.music = !audio.music;
    applyAudio();
    showDial();
  });

  let dialTimer = null;
  function showDial() {
    ctl.classList.add("open");
    clearTimeout(dialTimer);
    dialTimer = setTimeout(() => ctl.classList.remove("open"), 3200);
  }
  ctl.addEventListener("pointerenter", showDial);
  ctl.addEventListener("pointerleave", showDial);
  btn.addEventListener("click", showDial);

  range.addEventListener("input", (e) => {
    e.stopPropagation();
    showDial();
    audio.volume = Number(range.value) / 100;
    video.volume = audio.volume;
  });
  range.addEventListener("change", showDial);
  range.addEventListener("click", (e) => e.stopPropagation());

  // The video's own audio track is short (~15-29s) and `loop` restarts it
  // from zero every time — audible as the same clip hard-cutting back to the
  // start on repeat, which reads as broken rather than ambient. The visual
  // loop is the point; the audio isn't meant to loop with it. So: let it play
  // through once, and the moment the video wraps back to the start, quiet it
  // instead of letting it restart. The toggle still works normally after
  // that — turning it back on plays from wherever the video is now, through
  // to the next loop point, then goes quiet again the same way.
  let lastTime = 0;
  video.addEventListener("timeupdate", () => {
    if (video.currentTime < lastTime - 0.5 && audio.music) {
      audio.music = false;
      applyAudio();
    }
    lastTime = video.currentTime;
  });

  applyAudio();
}

/* ---------- Guide overlay -------------------------------------------------
   Clicking a figure on the gym floor no longer navigates away. Instead: the
   clicked avatar renders large in the overlay, and that section's own page
   is fetched and dropped into the panel beside it — same content, no page
   load. Direct links (and the top nav, for now) still work as real pages;
   this is purely the gym-floor interaction. History is kept in sync so the
   back button and reload behave, but a reload always lands on the real page,
   which is a fine fallback, not a broken one.                               */

let overlayOpen = false;
let overlayApi = null;
let avatarToken = 0; // newest overlay open wins the async art resolve

function mountOverlay() {
  const overlay = document.getElementById("overlay");
  if (!overlay) return; // only the home page has one

  const scrim = document.getElementById("overlay-scrim");
  const closeBtn = document.getElementById("overlay-close");
  const avatarHost = document.getElementById("overlay-avatar");
  const panelName = document.getElementById("overlay-panel-name");
  const panelSection = document.getElementById("overlay-panel-section");
  const panelBody = document.getElementById("overlay-panel-body");

  let unmountTimer = null;

  const close = (updateUrl = true) => {
    if (!overlayOpen) return;
    overlayOpen = false;
    overlay.classList.remove("is-open"); // starts the fade/scale-out
    overlay.setAttribute("aria-hidden", "true");
    document.querySelectorAll(".guide.is-active").forEach((g) => g.classList.remove("is-active"));
    document.body.classList.remove("overlay-open");
    // Wait for the close transition to actually finish before dropping back
    // to display:none — pulling the rug out mid-transition (or in the same
    // tick, which is what open() used to do) is what made the animation not
    // play at all.
    clearTimeout(unmountTimer);
    unmountTimer = setTimeout(() => overlay.classList.remove("is-mounted"), 550);
    if (updateUrl) history.pushState(null, "", "/");
  };

  const open = async (guide, sourceEl) => {
    advanceTutorialIfMatches(guide.id);
    overlayOpen = true;
    clearTimeout(unmountTimer);
    document.body.classList.add("overlay-open");
    overlay.setAttribute("aria-hidden", "false");
    overlay.style.setProperty("--accent", guide.accent);
    overlay.classList.toggle("side-right", guide.side === "right");
    overlay.classList.add("is-mounted"); // display:block, still visually closed

    document.querySelectorAll(".guide").forEach((g) => g.classList.toggle("is-active", g === sourceEl));

    // Resolve the avatar from the shared cache rather than cloning whatever
    // the floor hotspot currently holds. Cloning meant that opening a guide
    // before its PNG had downloaded — which is exactly what happens on a cold
    // load, or when you arrive via ?open= or a nav click — copied the black
    // placeholder silhouette and then never updated it.
    const token = ++avatarToken;
    avatarHost.innerHTML = silhouette();
    resolveGuideArt(guide.id, (url) => {
      if (token !== avatarToken) return; // a different guide was opened meanwhile
      const img = new Image();
      img.alt = "";
      img.onload = () => {
        if (token !== avatarToken) return;
        avatarHost.innerHTML = "";
        avatarHost.appendChild(img);
      };
      img.src = url;
    });

    panelName.textContent = guide.name;
    panelSection.textContent = guide.section;
    panelBody.innerHTML = `<p class="overlay-loading">Loading&hellip;</p>`;

    // Let the browser actually paint the closed-but-mounted state before
    // adding is-open on the next frame — otherwise display:none -> block and
    // opacity:0 -> 1 land in the same style recalculation and there's no
    // "before" frame for the transition to animate from; it just snaps
    // straight to visible with no motion at all.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add("is-open"));
    });

    // Deliberately NOT guide.href: pushing the real section path meant a
    // reload or a shared link landed on the bare page instead of back on
    // the floor with this guide open. ?open= is the same marker the nav
    // already uses, and mountHome() reopens from it.
    history.pushState(null, "", `/?open=${guide.id}`);

    try {
      const res = await fetch(guide.href);
      if (!res.ok) throw new Error(String(res.status));
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const main = doc.querySelector("main");
      panelBody.innerHTML = main ? main.innerHTML : "<p>Couldn't load this section.</p>";
      // The section pages mark their YouTube embeds loading="lazy", which is
      // right for a real page load. Injected into a panel that was display:none
      // a moment ago, the lazy trigger is unreliable and the player can end up
      // showing "Video unavailable". Force them to load now.
      panelBody.querySelectorAll("iframe[loading]").forEach((f) => f.removeAttribute("loading"));
    } catch (e) {
      panelBody.innerHTML = `<p>Couldn't load this section here. <a href="${guide.href}" style="color:var(--bone)">Open it directly</a> instead.</p>`;
    }
  };

  document.querySelectorAll(".guide").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (document.body.classList.contains("tuning")) return; // tune mode owns clicks
      const g = GUIDES.find((x) => x.id === el.dataset.id);
      if (!g) return;
      e.preventDefault();
      sfx.forward();
      open(g, el);
    });
  });

  // The phone fallback list is the same five guides, so it opens the same
  // overlay. Without this the cards were plain links and phones were the one
  // place that still hard-navigated to a bare section page.
  const cardHost = document.getElementById("guide-cards");
  if (cardHost) {
    cardHost.addEventListener("click", (e) => {
      const card = e.target.closest("a.guide-card[href]");
      if (!card) return;
      const g = GUIDES.find((x) => x.href === card.getAttribute("href"));
      if (!g) return;
      e.preventDefault();
      sfx.forward();
      open(g, document.querySelector(`.guide[data-id="${g.id}"]`));
    });
  }

  scrim.addEventListener("click", () => close());
  closeBtn.addEventListener("click", () => close());
  window.addEventListener("keydown", (e) => {
    // stopImmediatePropagation so the gym stage's own Escape handler (which
    // backs all the way out to the main menu) doesn't also fire — closing
    // the overlay should just return you to the gym floor, one step back.
    if (e.key === "Escape" && overlayOpen) { e.stopImmediatePropagation(); close(); }
  });
  window.addEventListener("popstate", () => {
    if (overlayOpen) close(false);
  });

  overlayApi = { open, close };
}

/* ---------- 3. THE MAIN MENU ---------------------------------------------
   Shown over the hero video once someone presses start. `action: "gym"` is the
   one item that doesn't navigate — it walks you onto the gym floor, where the
   five guides are the way into everything. Add or reorder freely.            */

const HOME_MENU = [
  { label: "Continue Training", action: "gym" },
  { label: "Gym Store", href: "/store/" },
  { label: "The Lab", href: "/lab/" },
  { label: "Film Room", href: "/film-room/" },
  { label: "Cornerwoman", href: "/cornerwoman/" },
];

/* ---------- Home stages ---------------------------------------------------
   attract → menu → gym, held as a class on <body>. Only the home page has the
   stage elements, so this is a no-op everywhere else.                        */

const STAGES = ["attract", "menu", "gym"];
let stage = null;

function setStage(next) {
  if (stage === next) return;
  stage = next;
  STAGES.forEach((s) => document.body.classList.toggle(`stage-${s}`, s === next));

  if (next !== "attract") {
    // Someone who has already started shouldn't be walked through the attract
    // beat again when they come back from a section.
    try { sessionStorage.setItem("longuard_started", "1"); } catch (e) { /* private mode */ }
  }

  window.scrollTo(0, 0);
}

/* The backdrop for the first two stages: the quiz's hero video, reused as-is.
   It's requested immediately on load (mountHero, below) and fades in the
   moment it has a frame — no static still standing in ahead of it anymore. */

const portrait = window.matchMedia("(max-width: 759px)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let videoRequested = false;

function mountHero() {
  const video = document.getElementById("hero-video");
  if (!video) return;

  // Which event means "there's a frame" depends on cache and connection, so
  // react to all of them.
  ["loadeddata", "canplay", "canplaythrough"].forEach((evt) =>
    video.addEventListener(evt, () => document.body.classList.add("hero-video-ready")),
  );

  // No more static still to hold the screen — the video is requested straight
  // away so it's already looping behind the Press to Start screen.
  requestHeroVideo();
}

function requestHeroVideo() {
  const video = document.getElementById("hero-video");
  if (!video || reducedMotion) return;

  // Sources only ever get added and loaded once — repeating that would
  // restart the fetch. But `videoRequested` used to also gate play(), so if
  // that very first play() attempt raced ahead of load() and got rejected
  // (very possible now that this fires immediately on page load instead of
  // waiting for a stage change), nothing ever tried again and the video sat
  // frozen on its first frame forever. play() is cheap to retry — calling it
  // on an already-playing video is a harmless no-op — so it's no longer
  // behind the once-only guard.
  if (!videoRequested) {
    videoRequested = true;
    const sources = portrait
      ? ["/assets/hero/hero-mobile.mp4", "/assets/hero/hero.mp4"]
      : ["/assets/hero/hero.mp4"];

    sources.forEach((src) => {
      const el = document.createElement("source");
      el.src = src;
      el.type = "video/mp4";
      video.appendChild(el);
    });
    video.preload = "auto";
    video.load();

    // Retry once more the moment there's actually enough buffered to play
    // through without stalling — covers the case where the very first
    // attempt below fires before any frames have decoded yet.
    video.addEventListener("canplay", () => {
      const retry = video.play();
      if (retry && retry.catch) retry.catch(() => {});
    }, { once: true });
  }

  const attempt = video.play();
  if (attempt && attempt.catch) attempt.catch(() => {});
}

function mountHome() {
  const menuHost = document.getElementById("home-menu");
  if (!menuHost) return; // not the home page

  mountHero();

  menuHost.innerHTML = HOME_MENU.map((m) =>
    m.action
      ? `<button class="home-menu-item" data-action="${m.action}"><span>${m.label}</span></button>`
      : `<a class="home-menu-item" href="${m.href}"><span>${m.label}</span></a>`,
  ).join("");

  // One tick per item as focus/hover moves across the list — browsing, not
  // selecting.
  menuHost.querySelectorAll(".home-menu-item").forEach((item) => {
    item.addEventListener("pointerenter", () => sfx.move());
    item.addEventListener("focus", () => sfx.move());
  });

  menuHost.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (btn && btn.dataset.action === "gym") { sfx.forward(); setStage("gym"); return; }

    const link = e.target.closest("a.home-menu-item[href]");
    if (link && overlayApi) {
      const g = GUIDES.find((x) => x.href === link.getAttribute("href"));
      if (g) {
        e.preventDefault();
        sfx.forward();
        // Land on the gym floor first (same as Continue Training), then pop
        // the section straight open on top of it — the fast way to the same
        // place someone would land picking the guide themselves, not a
        // shortcut that skips the room.
        setStage("gym");
        const sourceEl = document.querySelector(`.guide[data-id="${g.id}"]`);
        overlayApi.open(g, sourceEl);
      }
    }
  });

  // Anything counts as "press start" — click, tap, or any key.
  const start = (e) => {
    if (stage !== "attract") return;
    e.preventDefault();
    setStage("menu");
  };
  document.getElementById("stage-attract").addEventListener("click", start);
  window.addEventListener("keydown", (e) => {
    if (stage === "attract" && !e.metaKey && !e.ctrlKey && !e.altKey) start(e);
    else if (stage === "gym" && e.key === "Escape") setStage("menu");
  });

  let resumed = false;
  try { resumed = sessionStorage.getItem("longuard_started") === "1"; } catch (e) { /* private mode */ }

  // ?tune is for positioning the guides, so it opens straight onto the floor
  // rather than making you click through the attract beat every reload.
  // ?open=<guide id> is the marker a nav click from another page leaves
  // behind — same idea, plus it pops that guide's overlay open the instant
  // the floor is up.
  const params = new URLSearchParams(location.search);
  const openGuide = GUIDES.find((x) => x.id === params.get("open"));
  const straightToGym = location.hash === "#gym" || params.has("tune") || !!openGuide;
  setStage(straightToGym ? "gym" : resumed ? "menu" : "attract");

  if (openGuide && overlayApi) {
    const sourceEl = document.querySelector(`.guide[data-id="${openGuide.id}"]`);
    overlayApi.open(openGuide, sourceEl);
  }
}

/* ---------- Boot ---------------------------------------------------------- */

mountNav();
mountScene();
mountOverlay();
mountAudio();
mountHome();
