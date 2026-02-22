/* ====== Mensajes + Stickers ====== */
// Mantener broma interna
const mensajes = [
  "Feliz cumpleaños 🎂✨",
  "Me llamaste la atención tal como eres (así, tal cual).",
  "Gracias por hacer mis días más ligeros, chiquilla.",
  "だいすき — me gustas mucho.",
  "Ingaturoña 💟",
  "MACHISTA, MACHISTA, MACHISTA"
];

/* Mapea stickers por índice de mensaje */
const stickersPorMensaje = {
  0: "stickers/5.webp",
  1: "stickers/2.webp",
  2: "stickers/3.webp",
  3: "stickers/4.webp",
  4: "stickers/1.webp",
  5: "stickers/6.webp"
};

// Alt de stickers por mensaje (sin perder la broma interna)
const altPorMensaje = {
  0: "Sticker de feliz cumpleaños",
  1: "Sticker tierno: me llamaste la atención",
  2: "Sticker agradecido: días más ligeros",
  3: "Sticker romántico: daisuki",
  4: "Sticker de Ingaturoña",
  5: "Sticker de broma interna: MACHISTA"
};

// Precarga
Object.values(stickersPorMensaje).forEach(src => { const img = new Image(); img.src = src; });

const mensajeEl = document.getElementById('mensajeBonito');
const stickerEl = document.getElementById('stickerImg');
const btnMensaje = document.getElementById('btnMensaje');

let idx = 0;

function mostrarMensajeYSticker() {
  const i = idx % mensajes.length;
  const mensaje = mensajes[i];
  const stickerSrc = stickersPorMensaje[i];

  // mensaje (aria-live en HTML)
  if (mensajeEl) mensajeEl.textContent = mensaje;

  // sticker + alt
  if (stickerEl) {
    if (stickerSrc) {
      stickerEl.src = stickerSrc;
      stickerEl.alt = altPorMensaje[i] || `Sticker del mensaje: ${mensaje}`;
      stickerEl.classList.remove('hidden');
      // reiniciar transición
      // eslint-disable-next-line no-unused-expressions
      stickerEl.offsetHeight;
      stickerEl.classList.add('show');
    } else {
      stickerEl.classList.remove('show');
      stickerEl.classList.add('hidden');
      stickerEl.alt = '';
    }
  }

  idx++;
}

btnMensaje?.addEventListener('click', mostrarMensajeYSticker);

document.addEventListener('DOMContentLoaded', () => { mostrarMensajeYSticker(); });

/* ===============================
   Confeti con emojis — Optimizado
   =============================== */
const __confettiPool = [];
let __confettiActive = 0;
let __confettiCooldown = false;

function getPooledSpan() { return __confettiPool.pop() || document.createElement('span'); }
function recycleSpan(node) {
  if (!node) return;
  node.remove();
  if (__confettiPool.length < 300) {
    node.removeAttribute('style');
    node.className = 'confetti-emoji';
    __confettiPool.push(node);
  }
}

function lanzarConfeti(n) {
  if (__confettiCooldown) return;

  const isMobile = window.innerWidth < 480;
  const MAX_ACTIVE = isMobile ? 350 : 520;
  const BASE_N = isMobile ? 120 : 190;
  const total = Math.min(n ?? BASE_N, (MAX_ACTIVE - __confettiActive));
  if (total <= 0) return;

  __confettiCooldown = true;
  setTimeout(() => { __confettiCooldown = false; }, 550);

  const emojis = ['💜', '💖', '🎉', '🎈', '✨', '💗', '🌸', '⭐'];
  const H = window.innerHeight;
  const W = window.innerWidth;

  const fragment = document.createDocumentFragment();

  function createParticle({ xVW, delay = 0, sizePX, fallMs, driftPX }) {
    const span = getPooledSpan();
    span.className = 'confetti-emoji';
    span.textContent = emojis[(Math.random() * emojis.length) | 0];

    const x = (xVW != null ? xVW : Math.random() * 100);
    span.style.left = x + 'vw';

    const fontSize = sizePX ?? (Math.random() < 0.22 ? (Math.random() * 12 + 26) : (Math.random() * 10 + 16));
    span.style.fontSize = fontSize + 'px';
    span.style.opacity = (0.7 + Math.random() * 0.3).toFixed(2);

    const roll = Math.random();
    if (roll < 0.55) {
      const spinDuration = (Math.random() * 1.2 + 1.0).toFixed(2);
      span.style.animation = `spin ${spinDuration}s linear infinite`;
    } else if (roll < 0.7) {
      const wig = (Math.random() * 1.0 + 0.8).toFixed(2);
      span.style.animation = `wiggle ${wig}s ease-in-out infinite`;
    }

    const dur = fallMs ?? (isMobile ? (900 + Math.random() * 500) : (1000 + Math.random() * 600));
    span.style.transitionDuration = `${dur}ms, ${dur}ms`;

    fragment.appendChild(span);
    __confettiActive++;

    setTimeout(() => {
      const drift = (driftPX != null ? driftPX : (Math.random() * 120 - 60));
      const rotate = (Math.random() * 90) - 45;
      span.style.transform = `translate3d(${drift}px, ${H + 120}px, 0) rotate(${rotate}deg)`;
      span.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);

      const bounceAt = dur + (Math.random() * 80);
      setTimeout(() => {
        const current = span.style.animation;
        span.style.animation = current ? `${current}, bounce 260ms ease-out 1` : `bounce 260ms ease-out 1`;
      }, bounceAt);

      setTimeout(() => {
        __confettiActive = Math.max(0, __confettiActive - 1);
        recycleSpan(span);
      }, dur + 520);
    }, delay);
  }

  const waves = [
    { count: Math.floor(total * 0.42), delayBase: 0 },
    { count: Math.floor(total * 0.34), delayBase: 90 },
    { count: Math.floor(total * 0.24), delayBase: 180 }
  ];

  for (const { count, delayBase } of waves) {
    for (let i = 0; i < count; i++) {
      createParticle({ xVW: undefined, delay: delayBase + Math.random() * 120, sizePX: undefined, fallMs: undefined, driftPX: undefined });
    }
  }

  function sideBurst(side = 'left') {
    const sideX = side === 'left' ? 8 : 92;
    const cnt = isMobile ? 14 : 18;
    for (let i = 0; i < cnt; i++) {
      createParticle({ xVW: sideX + (Math.random() * 2 - 1), delay: 120 + Math.random() * 100, sizePX: (Math.random() < 0.35 ? (22 + Math.random() * 8) : (16 + Math.random() * 6)), fallMs: (800 + Math.random() * 300), driftPX: (Math.random() * 100 - 50) });
    }
  }

  document.body.appendChild(fragment);
  setTimeout(() => sideBurst('left'), 120);
  setTimeout(() => sideBurst('right'), 160);
}

const btnConfeti2 = document.getElementById('btnConfeti2');
btnConfeti2?.addEventListener('click', () => {
  const isMobile = window.innerWidth < 480;
  lanzarConfeti(isMobile ? 130 : 200);
  setTimeout(() => lanzarConfeti(isMobile ? 70 : 110), 260);
});

/* ====== Scroll suave ====== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ====== Coverflow ANCLADO: 5 visibles, sin huecos en extremos ====== */
(function () {
  const root = document.getElementById('carrusel');
  if (!root) return;

  const viewport = root.querySelector('.cfw-viewport');
  const track    = root.querySelector('.cfw-track');
  const items    = Array.from(root.querySelectorAll('.cfw-item'));
  const dotsWrap = root.querySelector('.cfw-dots');
  const btnPrev  = root.querySelector('.cfw-btn.prev');
  const btnNext  = root.querySelector('.cfw-btn.next');

  if (!items.length) return;

  /* --- (A) Inyecta <img> reales dentro de cada .cfw-item --- */
  items.forEach((btn, i) => {
    const srcText = (btn.textContent || '').trim(); // p.ej. stickers/1.webp
    btn.textContent = '';
    const img = document.createElement('img');
    img.className = 'carousel-img';
    img.loading = 'lazy';
    img.alt = `Sticker ${i + 1}`;
    img.src = srcText;
    btn.appendChild(img);
  });

  /* --- (B) Dots dinámicos según cantidad --- */
  const total = items.length;
  const dots = [];
  dotsWrap.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'cfw-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Ir a la ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  /* --- (C) Estado y helpers --- */
  let index = Math.floor(total / 2); // arrancamos centrando una del medio
  let prevCenter = -1;

  // Distancia circular mínima en rango [-half, +half]
  function circDist(a, b, n) {
    let d = (a - b) % n;
    if (d >  n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d; // puede ser negativo
  }

  function paint() {
    // Limpia clases relativas
    items.forEach(el => {
      el.classList.remove('is-center','is-left1','is-right1','is-left2','is-right2','is-out','spin-in');
      el.setAttribute('aria-current', 'false');
    });

    // Aplica clases para 5 visibles: k = distancia circular a 'index'
    for (let i = 0; i < total; i++) {
      const k = circDist(i, index, total); // [-floor(n/2)..+floor(n/2)]
      const el = items[i];

      // Mapea a estados
      if (k === 0) {
        el.classList.add('is-center');
        el.setAttribute('aria-current', 'true');
      } else if (k === -1) {
        el.classList.add('is-left1');
      } else if (k === 1) {
        el.classList.add('is-right1');
      } else if (k === -2) {
        el.classList.add('is-left2');
      } else if (k === 2) {
        el.classList.add('is-right2');
      } else {
        el.classList.add('is-out');
      }
    }

    // dots activos
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));

    // animación twist al nuevo centro
    if (index !== prevCenter) {
      items[index]?.classList.add('spin-in');
      items[index]?.addEventListener('animationend', () => {
        items[index]?.classList.remove('spin-in');
      }, { once: true });
      prevCenter = index;
    }
  }

  function goTo(i) {
    index = (i + total) % total; // circular siempre
    paint();
  }
  function prev() { goTo(index - 1); }
  function next() { goTo(index + 1); }

  // Click en tarjeta para centrar
  items.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));

  // Botones
  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);

  // Teclado (cuando viewport tiene foco)
  viewport?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe / Drag → solo decide prev/next por umbral, sin mover nada
  let dragging = false, startX = 0, curX = 0;
  function onDown(x) { dragging = true; startX = x; curX = x; }
  function onMove(x) { if (!dragging) return; curX = x; }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    const delta = curX - startX;
    const TH = 28; // px; umbral pequeño
    if (Math.abs(delta) > TH) (delta < 0) ? next() : prev();
  }

  viewport?.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  viewport?.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX), { passive: true });
  viewport?.addEventListener('touchend',   onUp);

  viewport?.addEventListener('mousedown', (e) => { onDown(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  // Inicial
  paint();
})();
