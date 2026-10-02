/* =========================================================
   WEDDING CONFIG — edit everything here.
   The whole website reads its text from this object.
   ========================================================= */
const weddingConfig = {

  groom: "Dushyant",

  bride: "Preeti",

  // Countdown target (ISO format with timezone)
  weddingDate: "2026-11-24T18:00:00+05:30",

  displayDate: "24 November 2026",

  // ---- Reception (shown in the venue section) ----
  receptionDate: "2026-11-25",

  venue: "LS Garden",

  address: "",

  city: "Cheeka, Haryana",

  // Paste a Google Maps share link. If left as-is, a search for the venue is used.
  googleMapsUrl: "https://www.google.com/maps/place/ls+garden+cheeka/data=!4m2!3m1!1s0x3911d10041adf9e1:0xe84302d617efdfb?sa=X&ved=1t:242&ictx=111",

  // Country code + number, digits only (e.g. "919876543210")
  whatsappNumber: "91XXXXXXXXXX",

  rsvpMessage: "Congratulations {groom} & {bride}!\nWe would love to celebrate with you.",

  music: "assets/music.mp3",

  hashtag: "#DushyantWedsPreeti",

  // Closing message signature
  familyName: "The Entire Bhatt Family",
  familyNameHindi: "समस्त भट्ट परिवार",

  // Family lines on the invitation card
  groomFamily: [
    { relation: "Grandson of", names: "Late Reshma Rani & Shri Jaipal Bhatt" },
    { relation: "Beloved son of", names: "Mrs Sunita & Shri Rajkumar Bhatt" }
  ],

  brideFamily: [
    { relation: "Beloved daughter of", names: "Mrs Neelam & Shri Vinod Vaid" }
  ],

  // Optional photo seen through the palace arch on the opening screen.
  // If the file doesn't exist, the illustrated palace garden is shown instead.
  heroImage: "assets/images/hero.jpg",

  // Our Story — two photographs. "focus" = which part stays centred in the round frame, "zoom" = how close it is.
  storyTagline: "A journey filled with love, laughter and countless beautiful moments.",

  story: [
    { image: "assets/images/couple-1.jpg", title: "Dushyant & Preeti", focus: "52% 58%", zoom: 1.3 },
    { image: "assets/images/couple-2.jpg", title: "Together, always", focus: "54% 62%", zoom: 1.45 }
  ]

};

/* =========================================================
   Nothing below needs editing.
   ========================================================= */
(() => {
  "use strict";

  const C = weddingConfig;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fileName = (p) => String(p).split("/").pop();
  const isPlaceholder = (v) => !v || /^YOUR\b/i.test(v);

  /* ---------- Bind config text ---------- */
  const dateParts = (C.displayDate.match(/^(\d{1,2})\s+(.+)$/) || [null, C.displayDate, ""]);
  const data = {
    ...C,
    groomInitial: C.groom.trim().charAt(0).toUpperCase(),
    brideInitial: C.bride.trim().charAt(0).toUpperCase(),
    ...(() => {
      const d = new Date(`${C.receptionDate}T12:00:00`);
      if (isNaN(d)) return {};
      const f = (o) => d.toLocaleDateString("en-GB", o);
      return { receptionWeekday: f({ weekday: "long" }), receptionDay: f({ day: "numeric" }), receptionMonthYear: f({ month: "long", year: "numeric" }) };
    })(),
    day: dateParts[1],
    monthYear: dateParts[2]
  };

  $$("[data-bind]").forEach((el) => {
    const v = data[el.dataset.bind];
    if (v) el.textContent = v;
    else if (el.dataset.bind === "hashtag") el.remove();
  });
  document.title = `${C.groom} & ${C.bride} · ${C.displayDate}`;

  /* ---------- Family lines ---------- */
  $$("[data-family]").forEach((el) => {
    const list = el.dataset.family === "bride" ? C.brideFamily : C.groomFamily;
    if (!Array.isArray(list)) return;
    el.innerHTML = list.map((f) =>
      `<p class="fam-relation">${esc(f.relation)}</p><p class="fam-names">${esc(f.names)}</p>`).join("");
  });

  /* ---------- Palace gate ---------- */
  (() => {
    const gate = $(".gate");
    const root = document.documentElement;
    if (!gate) { root.classList.remove("gated"); return; }
    root.classList.add("no-scroll");
    const rnd = (a, b) => a + Math.random() * (b - a);
    $(".gt-petals", gate).innerHTML = Array.from({ length: 12 }, () =>
      `<i style="--x:${rnd(2, 98).toFixed(0)}%;--s:${rnd(.8, 1.4).toFixed(2)};--t:${rnd(12, 20).toFixed(1)}s;--dl:-${rnd(0, 20).toFixed(1)}s;--sw:${rnd(30, 90).toFixed(0)}px"></i>`).join("");

    const open = () => {
      if (gate.classList.contains("opening")) return;
      // zoom towards the centre of the doorway
      const arch = $(".gt-opening", gate).getBoundingClientRect();
      $(".gt-scene", gate).style.transformOrigin = `${arch.left + arch.width / 2}px ${arch.top + arch.height * 0.62}px`;
      gate.classList.add("opening");
      const T = reduceMotion ? [0, 0, 300] : [2000, 3100, 4000];
      setTimeout(() => gate.classList.add("enter"), T[0]);
      setTimeout(() => { root.classList.remove("gated", "no-scroll"); window.scrollTo(0, 0); }, T[1]);
      setTimeout(() => gate.remove(), T[2]);
    };
    gate.addEventListener("click", open);
    gate.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    $(".gate-seal", gate).focus({ preventScroll: true });
  })();

  /* ---------- Links: maps + WhatsApp ---------- */
  const mapsUrl = !isPlaceholder(C.googleMapsUrl) && /^https?:/i.test(C.googleMapsUrl)
    ? C.googleMapsUrl
    : "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent([C.venue, C.address, C.city].filter((x) => !isPlaceholder(x)).join(", ") || C.city);
  $$("[data-maps]").forEach((a) => (a.href = mapsUrl));

  const waText = C.rsvpMessage.replace(/\{groom\}/g, C.groom).replace(/\{bride\}/g, C.bride);
  const waDigits = String(C.whatsappNumber).replace(/\D/g, "");
  const waUrl = (waDigits.length >= 8 ? `https://wa.me/${waDigits}` : "https://wa.me/") + "?text=" + encodeURIComponent(waText);
  $$("[data-rsvp]").forEach((a) => (a.href = waUrl));

  /* ---------- Placeholder helper for missing photos ---------- */
  const placeholder = (label) =>
    `<div class="ph-inner"><svg viewBox="-160 -160 320 320" aria-hidden="true"><use href="#cluster" x="-160" y="-160" width="320" height="320" /></svg><span>${esc(label)}</span></div>`;

  /* ---------- Hero photo (optional) ---------- */
  const hero = $(".hero");
  if (C.heroImage) {
    const probe = new Image();
    probe.onload = () => {
      $(".hero-photo").style.backgroundImage = `url("${C.heroImage}")`;
      hero.classList.add("has-photo");
    };
    probe.src = C.heroImage;
  }

  /* ---------- Our Story ---------- */
  const storyOk = C.story.map(() => false);
  $$(".sp-frame").forEach((frame) => {
    const i = +frame.dataset.photo;
    const s = C.story[i];
    const img = $("img", frame);
    if (!s) { frame.closest(".sp").remove(); return; }
    const ok = () => {
      storyOk[i] = true;
      frame.classList.add("zoomable");
      frame.setAttribute("role", "button");
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("aria-label", `View photo: ${s.title}`);
    };
    img.alt = s.title;
    if (s.focus) { img.style.objectPosition = s.focus; img.style.transformOrigin = s.focus; }
    if (s.zoom) img.style.setProperty("--z", s.zoom);
    img.addEventListener("load", ok, { once: true });
    img.addEventListener("error", () => {
      img.remove();
      frame.insertAdjacentHTML("beforeend", placeholder(fileName(s.image)));
    }, { once: true });
    img.src = s.image;
    frame.addEventListener("click", () => storyOk[i] && openViewer(i));
    frame.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && storyOk[i]) { e.preventDefault(); openViewer(i); }
    });
  });

  /* ---------- Photo viewer (glass) ---------- */
  const viewer = $(".viewer");
  const vImg = $(".viewer-img", viewer);
  const vCap = $(".viewer-cap", viewer);
  const vCount = $(".viewer-count", viewer);
  let vIndex = 0, vLastFocus = null;

  const vStep = (from, dir) => {
    let n = from;
    for (let k = 0; k < C.story.length; k++) {
      n = (n + dir + C.story.length) % C.story.length;
      if (storyOk[n]) return n;
    }
    return from;
  };
  function vShow(i, dir = 0) {
    vIndex = i;
    const total = storyOk.filter(Boolean).length;
    vCount.textContent = total > 1 ? `${storyOk.slice(0, i + 1).filter(Boolean).length} / ${total}` : "";
    viewer.classList.toggle("single", total < 2);
    vImg.style.opacity = "0";
    vImg.style.transform = `translateX(${dir * 36}px)`;
    setTimeout(() => {
      vImg.src = C.story[i].image;
      vImg.alt = C.story[i].title;
      vCap.textContent = C.story[i].title;
      const show = () => { vImg.style.opacity = "1"; vImg.style.transform = "none"; };
      if (vImg.complete && vImg.naturalWidth) requestAnimationFrame(show); else vImg.onload = show;
    }, dir ? 160 : 0);
  }
  function openViewer(i) {
    vLastFocus = document.activeElement;
    viewer.hidden = false;
    document.documentElement.classList.add("no-scroll");
    vShow(i);
    requestAnimationFrame(() => viewer.classList.add("open"));
    $(".viewer-close", viewer).focus({ preventScroll: true });
  }
  function closeViewer() {
    viewer.classList.remove("open");
    document.documentElement.classList.remove("no-scroll");
    setTimeout(() => { viewer.hidden = true; vImg.removeAttribute("src"); }, 380);
    vLastFocus && vLastFocus.focus({ preventScroll: true });
  }
  const vNav = (dir) => vShow(vStep(vIndex, dir), dir);

  $(".viewer-close", viewer).addEventListener("click", closeViewer);
  $(".viewer-prev", viewer).addEventListener("click", () => vNav(-1));
  $(".viewer-next", viewer).addEventListener("click", () => vNav(1));
  $(".viewer-backdrop", viewer).addEventListener("click", closeViewer);
  document.addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") vNav(1);
    if (e.key === "ArrowLeft") vNav(-1);
  });
  (() => {
    const stage = $(".viewer-card", viewer);
    let sx = 0, sy = 0, dx = 0, dy = 0, on = false;
    stage.addEventListener("pointerdown", (e) => {
      on = true; sx = e.clientX; sy = e.clientY; dx = dy = 0;
      vImg.classList.add("dragging");
      try { stage.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    });
    stage.addEventListener("pointermove", (e) => {
      if (!on) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      vImg.style.transform = Math.abs(dy) > Math.abs(dx) ? `translateY(${Math.max(0, dy)}px)` : `translateX(${dx}px)`;
    });
    const end = () => {
      if (!on) return;
      on = false;
      vImg.classList.remove("dragging");
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) vNav(dx < 0 ? 1 : -1);
      else if (dy > 110) closeViewer();
      else vImg.style.transform = "none";
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
  })();

  /* ---------- Ambient background (petals, gold dust, mandala) ---------- */
  $$("[data-ambient]").forEach((sec, si) => {
    const dark = sec.dataset.ambient === "dark";
    const rnd = (a, b) => (a + Math.random() * (b - a));
    const petals = Array.from({ length: dark ? 7 : 8 }, () =>
      `<i style="--x:${rnd(3, 97).toFixed(0)}%;--s:${rnd(.7, 1.25).toFixed(2)};--t:${rnd(16, 26).toFixed(1)}s;--dl:-${rnd(0, 24).toFixed(1)}s;--sw:${rnd(30, 80).toFixed(0)}px"></i>`).join("");
    sec.insertAdjacentHTML("afterbegin",
      `<div class="ambient${dark ? " dark" : ""}" aria-hidden="true">
        <span class="amb-mandala ${si % 2 ? "am-r" : "am-l"}"></span>
        <div class="amb-petals">${petals}</div>
        <div class="amb-dust"></div>
      </div>`);
  });

  /* ---------- Scroll reveal ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach((el) => revealObs.observe(el));

  /* ---------- Parallax (hero depth + story frames) ---------- */
  const depthEls = $$("[data-depth]");
  const heroContent = $(".hero-content");
  const heroCue = $(".scroll-cue");
  const parallaxEls = $$("[data-parallax]");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y < vh * 1.2) {
      depthEls.forEach((el) => (el.style.translate = `0 ${(y * el.dataset.depth).toFixed(1)}px`));
      const p = Math.min(y / (vh * 0.75), 1);
      heroContent.style.translate = `0 ${(y * 0.35).toFixed(1)}px`;
      heroContent.style.opacity = String(1 - p);
      heroCue.style.visibility = y > 40 ? "hidden" : "";
    }
    const twoUp = innerWidth < 820;
    parallaxEls.forEach((el) => {
      if (twoUp) { el.style.translate = ""; return; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * el.dataset.parallax;
      el.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  }
  if (!reduceMotion) {
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---------- Hero particles: petals + gold dust ---------- */
  (function particles() {
    const canvas = $(".hero-particles");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, parts = [];

    const sprite = (size, draw) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      draw(c.getContext("2d"), size);
      return c;
    };
    const petalSprites = [["#F8DDD5", "#E3A89E"], ["#FBE9E3", "#EBC0B6"], ["#FFF8F2", "#EAD2C4"]].map(([a, b]) =>
      sprite(48, (g, s) => {
        const grd = g.createLinearGradient(0, 0, s, s);
        grd.addColorStop(0, a); grd.addColorStop(1, b);
        g.fillStyle = grd;
        g.beginPath();
        g.moveTo(s / 2, 2);
        g.bezierCurveTo(s * .95, s * .2, s * .85, s * .8, s / 2, s - 2);
        g.bezierCurveTo(s * .15, s * .8, s * .05, s * .2, s / 2, 2);
        g.fill();
        g.strokeStyle = "rgba(255,255,255,.5)";
        g.lineWidth = 1;
        g.beginPath(); g.moveTo(s / 2, 6); g.quadraticCurveTo(s * .55, s / 2, s / 2, s - 8); g.stroke();
      }));
    const glow = sprite(32, (g, s) => {
      const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grd.addColorStop(0, "rgba(255,240,200,1)");
      grd.addColorStop(.25, "rgba(226,193,120,.9)");
      grd.addColorStop(1, "rgba(215,180,106,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
    });

    const rand = (a, b) => a + Math.random() * (b - a);
    const newPetal = (initial) => ({
      type: 0, x: rand(0, w), y: initial ? rand(-h, h) : rand(-60, -20),
      s: rand(9, 17), rot: rand(0, 6.28), vr: rand(-.02, .02), vy: rand(.35, .8),
      sway: rand(.4, 1.1), ph: rand(0, 6.28), flip: rand(0, 6.28), img: petalSprites[(Math.random() * 3) | 0]
    });
    const newDust = (initial) => ({
      type: 1, x: rand(0, w), y: initial ? rand(0, h) : h + 10,
      s: rand(4, 11), vy: rand(-.12, -.35), ph: rand(0, 6.28), sway: rand(.1, .35)
    });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = w < 700;
      parts = [
        ...Array.from({ length: small ? 12 : 20 }, () => newPetal(true)),
        ...Array.from({ length: small ? 26 : 44 }, () => newDust(true))
      ];
    }

    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.ph += 0.012;
        if (p.type === 0) {
          p.y += p.vy; p.x += Math.sin(p.ph) * p.sway; p.rot += p.vr; p.flip += 0.03;
          if (p.y > h + 30) parts[i] = newPetal(false);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.55 + 0.45 * Math.sin(p.flip));
          ctx.globalAlpha = 0.85;
          ctx.drawImage(p.img, -p.s / 2, -p.s / 2, p.s, p.s * 1.25);
          ctx.restore();
        } else {
          p.y += p.vy; p.x += Math.sin(p.ph) * p.sway;
          if (p.y < -10) parts[i] = newDust(false);
          ctx.globalAlpha = 0.25 + 0.6 * Math.abs(Math.sin(p.ph * 1.7));
          ctx.drawImage(glow, p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    resize();
    let rw = innerWidth;
    addEventListener("resize", () => { if (innerWidth !== rw) { rw = innerWidth; resize(); } });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    setTimeout(start, 900);
  })();

  /* ---------- Scratch card ---------- */
  (function scratch() {
    const card = $(".scratch-card");
    const canvas = $(".scratch-canvas", card);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let w = 0, h = 0, dpr = 1, drawing = false, last = null, started = false, done = false, lastCheck = 0;

    function paint() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      // champagne foil
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#EDD7A3");
      g.addColorStop(0.28, "#D7B46A");
      g.addColorStop(0.52, "#F2E2B6");
      g.addColorStop(0.78, "#C9A257");
      g.addColorStop(1, "#E4C88A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // brushed texture
      for (let i = 0; i < (w * h) / 14; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.22)" : "rgba(110,78,30,.12)";
        ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 2 + .5, 1);
      }
      // sheen
      const s = ctx.createLinearGradient(0, h * 0.1, w, h * 0.9);
      s.addColorStop(0.3, "rgba(255,255,255,0)");
      s.addColorStop(0.46, "rgba(255,255,255,.38)");
      s.addColorStop(0.56, "rgba(255,255,255,0)");
      ctx.fillStyle = s;
      ctx.fillRect(0, 0, w, h);

      // embossed frame
      const frame = (inset, color, off) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        const r = 12, x = inset + off, y = inset + off, fw = w - inset * 2, fh = h - inset * 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + fw, y, x + fw, y + fh, r); ctx.arcTo(x + fw, y + fh, x, y + fh, r);
        ctx.arcTo(x, y + fh, x, y, r); ctx.arcTo(x, y, x + fw, y, r); ctx.closePath(); ctx.stroke();
      };
      frame(14, "rgba(255,255,255,.75)", 1);
      frame(14, "rgba(120,85,35,.35)", 0);
      frame(20, "rgba(120,85,35,.18)", 0);

      // embossed text helper
      const emboss = (text, font, y) => {
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255,255,255,.65)";
        ctx.fillText(text, w / 2 + 1, y + 1);
        ctx.fillStyle = "rgba(96,66,24,.55)";
        ctx.fillText(text, w / 2, y);
      };
      emboss(`${data.groomInitial} & ${data.brideInitial}`, `italic 500 ${Math.round(w * 0.17)}px "Cormorant Garamond", Georgia, serif`, h * 0.42);
      ctx.fillStyle = "rgba(96,66,24,.35)";
      ctx.fillRect(w / 2 - 34, h * 0.53, 68, 1);
      emboss("S C R A T C H   T O   R E V E A L".replace(/ /g, " "), `500 ${Math.max(10, Math.round(w * 0.034))}px "DM Sans", system-ui, sans-serif`, h * 0.6);
    }

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    function scratchTo(p) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "#000";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(36, w * 0.13);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x + 0.01, p.y);
      ctx.stroke();
      last = p;
    }
    function check() {
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < px.length; i += 4 * 24) { total++; if (px[i] < 50) clear++; }
      if (clear / total >= 0.6) reveal();
    }
    function reveal() {
      if (done) return;
      done = true;
      card.classList.add("revealed", "touched");
      burst();
      setTimeout(() => canvas.remove(), 1200);
    }
    function burst() {
      if (reduceMotion) return;
      for (let i = 0; i < 26; i++) {
        const el = document.createElement("span");
        el.className = "burst-petal" + (i % 3 === 0 ? " g" : "");
        const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 150;
        el.style.setProperty("--x", `${Math.cos(a) * d}px`);
        el.style.setProperty("--y", `${Math.sin(a) * d + 40}px`);
        el.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
        el.style.animationDelay = `${Math.random() * 0.15}s`;
        card.appendChild(el);
        setTimeout(() => el.remove(), 2600);
      }
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (done) return;
      drawing = true; started = true;
      card.classList.add("touched");
      try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      last = pos(e);
      scratchTo(pos(e));
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drawing || done) return;
      const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (events.length ? events : [e]).forEach((ev) => scratchTo(pos(ev)));
      const now = performance.now();
      if (now - lastCheck > 180) { lastCheck = now; check(); }
    });
    const end = () => { if (drawing) { drawing = false; check(); } };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); }
    });

    paint();
    if (document.fonts) document.fonts.ready.then(() => { if (!started) paint(); });
    let rw = innerWidth;
    addEventListener("resize", () => { if (!started && innerWidth !== rw) { rw = innerWidth; paint(); } });
  })();

  /* ---------- Countdown ---------- */
  (function countdown() {
    const target = new Date(C.weddingDate).getTime();
    const els = { days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'), minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]') };
    const set = (el, v) => {
      if (el.textContent === v) return;
      el.textContent = v;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    };
    function tick() {
      const diff = target - Date.now();
      if (isNaN(target)) return;
      if (diff <= 0) {
        const grid = $(".cd-grid");
        grid.insertAdjacentHTML("afterend", `<p class="cd-done">${Date.now() - target < 864e5 ? "Today is the day" : "Just married"}</p>`);
        grid.remove();
        return;
      }
      const pad = (n) => String(n).padStart(2, "0");
      set(els.days, pad(Math.floor(diff / 864e5)));
      set(els.hours, pad(Math.floor(diff / 36e5) % 24));
      set(els.minutes, pad(Math.floor(diff / 6e4) % 60));
      set(els.seconds, pad(Math.floor(diff / 1e3) % 60));
      setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    }
    tick();
  })();

  /* ---------- Music ---------- */
  (function music() {
    const btn = $(".music-btn");
    if (!C.music) return;
    const KEY = "wedding-music";
    const store = {
      get() { try { return sessionStorage.getItem(KEY); } catch { return null; } },
      set(v) { try { sessionStorage.setItem(KEY, v); } catch { /* private mode */ } }
    };
    const audio = new Audio();
    audio.src = C.music;
    audio.loop = true;
    audio.preload = "none";
    let playing = false, pausedByHide = false, fadeRaf = 0;

    btn.hidden = false;
    if (store.get() !== "off") btn.classList.add("waiting");

    const setUI = (on) => {
      playing = on;
      btn.classList.toggle("playing", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Pause music" : "Play music");
      if (on) btn.classList.remove("waiting");
    };
    const fade = (to, ms, cb) => {
      cancelAnimationFrame(fadeRaf);
      const from = audio.volume, t0 = performance.now();
      const stepFn = (t) => {
        const k = Math.min((t - t0) / ms, 1);
        audio.volume = from + (to - from) * k;
        if (k < 1) fadeRaf = requestAnimationFrame(stepFn); else cb && cb();
      };
      fadeRaf = requestAnimationFrame(stepFn);
    };
    function play() {
      audio.volume = 0;
      return audio.play().then(() => { setUI(true); fade(0.6, 1800); return true; })
        .catch((err) => { setUI(false); return err && err.name === "NotAllowedError" ? false : "error"; });
    }
    function pause() { setUI(false); fade(0, 500, () => audio.pause()); }

    audio.addEventListener("error", () => { btn.hidden = true; disarm(); });

    // Start on the visitor's first real interaction (browsers block autoplay)
    const unlockEvents = ["pointerdown", "touchend", "keydown", "click"];
    const unlock = (e) => {
      if (e.target.closest && e.target.closest(".music-btn")) return;
      disarm();
      if (store.get() === "off" || playing) return;
      play().then((r) => { if (r === false) arm(); });
    };
    function arm() { unlockEvents.forEach((t) => document.addEventListener(t, unlock, { capture: true, passive: true })); }
    function disarm() { unlockEvents.forEach((t) => document.removeEventListener(t, unlock, { capture: true })); }
    arm();

    btn.addEventListener("click", () => {
      disarm();
      if (playing) { store.set("off"); pause(); }
      else { store.set("on"); play(); }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && playing) { pausedByHide = true; audio.pause(); }
      else if (!document.hidden && pausedByHide) { pausedByHide = false; audio.play().catch(() => setUI(false)); }
    });
  })();
})();
