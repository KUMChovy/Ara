/* Mensajes rotativos (incluye toque de cumple y "daisuki") */
const mensajes = [
    "Feliz cumpleaños 🎂✨",
    "Me llamaste la atnecion as cómo eres (así, tal cual).",
    "Gracias por hacer mis días más ligeros chiquilla.",
    "だいすき — me gustas mucho.",
    "Ingaturoña 💟",
    "MACHISTA, MACHISTA, MACHISTA"
];

const mensajeEl = document.getElementById('mensajeBonito');
const btnMensaje = document.getElementById('btnMensaje');
const btnConfeti2 = document.getElementById('btnConfeti2');

let idx = 0;
btnMensaje?.addEventListener('click', () => {
    mensajeEl.textContent = mensajes[idx % mensajes.length];
    idx++;
});

/* Confeti con emojis */
function lanzarConfeti(n = 26) {
    const emojis = ['💜', '💖', '🎉', '🎈', '✨', '💗'];
    for (let i = 0; i < n; i++) {
        const span = document.createElement('span');
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.position = 'fixed';
        span.style.top = '-2rem';
        span.style.left = Math.random() * 100 + 'vw';
        span.style.fontSize = (Math.random() * 18 + 16) + 'px';
        span.style.transition = 'transform 1.4s ease, opacity 1.4s ease';
        span.style.zIndex = 9999;
        document.body.appendChild(span);

        requestAnimationFrame(() => {
            const angle = (Math.random() * 90) - 45;
            span.style.transform = `translateY(${window.innerHeight + 120}px) rotate(${angle}deg)`;
            span.style.opacity = 0.25 + Math.random() * 0.6;
        });

        setTimeout(() => span.remove(), 1700);
    }
}
btnConfeti2?.addEventListener('click', () => lanzarConfeti());

/* Scroll suave para anclas */
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
