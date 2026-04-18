/* =========================================
   CASA DE CHÁ DO DF — script.js
   ========================================= */

// ---- SCROLL PROGRESS BAR ----
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- HAMBURGER MOBILE ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Fechar ao clicar em link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- TABS DO MENU ----
const tabs = document.querySelectorAll('.tab');
const menuContents = document.querySelectorAll('.menu-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    menuContents.forEach(mc => {
      const id = mc.id.replace('tab-', '');
      mc.classList.toggle('hidden', id !== target);
    });
  });
});

// ---- SCROLL ANIMATIONS ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Adicionar classe fade-in a elementos
const animateEls = [
  ...document.querySelectorAll('.cha-card'),
  ...document.querySelectorAll('.menu-item'),
  ...document.querySelectorAll('.depo'),
  ...document.querySelectorAll('.sobre-stats .stat'),
  ...document.querySelectorAll('.gal-card'),
  ...document.querySelectorAll('.info-item'),
  document.querySelector('.form-card'),
  document.querySelector('.sobre .split-visual'),
].filter(Boolean);

animateEls.forEach((el, i) => {
  el.classList.add('fade-in');
  const delay = el.dataset.delay || 0;
  el.style.transitionDelay = (parseInt(delay) || i * 60) + 'ms';
  observer.observe(el);
});

// ---- BOTÃO DE RESERVA ----
const btnReserva = document.getElementById('btn-reserva');
const toast = document.getElementById('toast');

btnReserva.addEventListener('click', () => {
  // Validação simples
  const inputs = document.querySelectorAll('.form-card input, .form-card select');
  let ok = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#c0392b';
      ok = false;
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });

  if (!ok) {
    btnReserva.textContent = 'Preencha todos os campos';
    setTimeout(() => { btnReserva.textContent = 'Solicitar Reserva'; }, 2000);
    return;
  }

  // Feedback visual
  btnReserva.textContent = 'Enviando...';
  btnReserva.style.opacity = '0.7';
  btnReserva.style.pointerEvents = 'none';

  setTimeout(() => {
    btnReserva.textContent = '✓ Solicitação Enviada';
    btnReserva.style.opacity = '1';
    showToast();

    // Reset do formulário
    setTimeout(() => {
      document.querySelectorAll('.form-card input, .form-card textarea').forEach(el => el.value = '');
      document.querySelectorAll('.form-card select').forEach(el => el.selectedIndex = 0);
      btnReserva.textContent = 'Solicitar Reserva';
      btnReserva.style.pointerEvents = 'auto';
    }, 2500);
  }, 1200);
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ---- SMOOTH SCROLL para links ancora ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- MARQUEE duplicar para loop infinito ----
const track = document.querySelector('.marquee-track');
if (track) {
  track.innerHTML += track.innerHTML;
}

// ---- PARALLAX sutil no hero ----
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

// ---- CUSTOM CURSOR ----
(function () {
  // Só ativa em dispositivos com mouse
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring segue com suavidade via lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  (function loop() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Estado hover em links e botões
  const hoverEls = document.querySelectorAll('a, button, .tab, .cha-card, .gal-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Esconder ao sair da janela
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

// Hover dos cards de chá gerenciado pelo CSS (.cha-card:hover)

console.log('%c🍵 Casa de Chá do Distrito Federal', 'font-size:14px;color:#b5924a;font-weight:bold;');
console.log('%cSite desenvolvido com carinho.', 'font-size:11px;color:#9a8a76;');
