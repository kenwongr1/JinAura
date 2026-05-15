/* ===================================================
   AMERIGROUP 礼锦生 – Main JS  (Light Sky-Blue Theme)
   =================================================== */

'use strict';

/* ── Language Toggle ── */
const html    = document.documentElement;
const langBtn = document.getElementById('langToggle');
const LANG_KEY = 'ag_lang';

function setLang(lang) {
  html.setAttribute('data-lang', lang);
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll('.about-video-wrap').forEach(wrap => {
    const video = wrap.querySelector('video');
    if (!video) return;
    const isActive = (lang === 'cn' && wrap.classList.contains('cn')) ||
                     (lang === 'en' && wrap.classList.contains('en'));
    isActive ? video.play() : video.pause();
  });
}
(function initLang() {
  setLang(localStorage.getItem(LANG_KEY) || 'en');
})();
langBtn && langBtn.addEventListener('click', () => {
  setLang(html.getAttribute('data-lang') === 'en' ? 'cn' : 'en');
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger  = document.getElementById('hamburger');
const navMenu    = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay && navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function openNav() {
  hamburger.classList.add('open');
  navMenu.classList.add('open');
  navOverlay && navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

hamburger && hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeNav() : openNav();
});

navOverlay && navOverlay.addEventListener('click', closeNav);

const navLinks = navMenu ? [...navMenu.querySelectorAll('.nav-link')] : [];

function setActiveLink(href) {
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === href));
}

navLinks.forEach(link =>
  link.addEventListener('click', () => {
    setActiveLink(link.getAttribute('href'));
    closeNav();
  })
);

/* ── Scroll spy ── */
const sections = ['about','science','benefits','products','research','contact']
  .map(id => document.getElementById(id)).filter(Boolean);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(sec => { if (scrollY >= sec.offsetTop) current = '#' + sec.id; });
  if (current) setActiveLink(current);
}, { passive: true });

/* ── Hero bubble canvas (sky-blue palette) ── */
(function initHeroCanvas() {
  const canvas = document.getElementById('bubbleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const bubbles = [];
  const COUNT   = 70;

  class Bubble {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * canvas.width;
      this.y     = init ? Math.random() * canvas.height : canvas.height + 20;
      this.r     = Math.random() * 18 + 6;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = -(Math.random() * 0.55 + 0.25);
      this.alpha = Math.random() * 0.6 + 0.3;
      this.hue   = 195 + Math.random() * 30;   // sky-blue range
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y + this.r < 0) this.reset(false);
    }
    draw() {
      ctx.save();

      // Almost-transparent interior — clear water bubble
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const fill = ctx.createRadialGradient(
        this.x, this.y - this.r * 0.2, 0,
        this.x, this.y, this.r
      );
      fill.addColorStop(0,   `rgba(255,255,255,${this.alpha * 0.04})`);
      fill.addColorStop(0.6, `rgba(200,235,255,${this.alpha * 0.06})`);
      fill.addColorStop(1,   `rgba(160,215,255,${this.alpha * 0.14})`);
      ctx.fillStyle = fill;
      ctx.fill();

      // Thin bright rim
      ctx.strokeStyle = `rgba(255,255,255,${this.alpha * 0.75})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Upper-left specular highlight
      const hx = this.x - this.r * 0.32, hy = this.y - this.r * 0.32;
      const hr = this.r * 0.22;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      hl.addColorStop(0, `rgba(255,255,255,${this.alpha * 0.9})`);
      hl.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = hl;
      ctx.fill();

      // Bottom reflection glimmer
      const bx = this.x + this.r * 0.2, by = this.y + this.r * 0.55;
      ctx.beginPath();
      ctx.arc(bx, by, this.r * 0.12, 0, Math.PI * 2);
      const bl = ctx.createRadialGradient(bx, by, 0, bx, by, this.r * 0.12);
      bl.addColorStop(0, `rgba(255,255,255,${this.alpha * 0.4})`);
      bl.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = bl;
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) bubbles.push(new Bubble());

  function drawBg() {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0,    '#1A6EAE');
    g.addColorStop(0.45, '#2A9DD4');
    g.addColorStop(1,    '#7CC8EE');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBg();
    bubbles.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ── Global floating bubbles – inject into every section ── */
(function injectSectionBubbles() {
  const sections = document.querySelectorAll(
    '.about, .science, .benefits, .stats-band, .products, .research, .contact'
  );

  sections.forEach(sec => {
    const layer = document.createElement('div');
    layer.className = 'bubble-layer';

    const isProducts = sec.classList.contains('products');
    const count = window.innerWidth < 600
      ? (isProducts ? 12 : 6)
      : (isProducts ? 24 : 12);
    for (let i = 0; i < count; i++) {
      const span  = document.createElement('span');
      const size  = (Math.random() * 28 + 8).toFixed(1);   // 8–36 px
      const left  = (Math.random() * 94 + 3).toFixed(1);   // 3–97 %
      const dur   = (Math.random() * 10 + 7).toFixed(1);   // 7–17 s
      const delay = (Math.random() * 6).toFixed(1);         // 0–6 s
      const dx    = ((Math.random() - 0.5) * 40).toFixed(1); // drift ±20px

      span.classList.add('bl');
      span.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${left}%;
        --d:${dur}s;
        --dl:${delay}s;
        --dx:${dx}px;
      `;
      layer.appendChild(span);
    }
    sec.appendChild(layer);
  });
})();

/* ── Intersection observer: fade-up & reveal ── */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .reveal').forEach(el => io.observe(el));
})();

/* ── Animated counters ── */
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const start  = performance.now();
      io.unobserve(el);
      (function tick(now) {
        const p = Math.min((now - start) / 1800, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.st-num[data-target]').forEach(n => io.observe(n));
})();

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── Contact form ── */
const form = document.getElementById('contactForm');
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const btn  = form.querySelector('button[type="submit"]');
  const lang = html.getAttribute('data-lang');
  btn.disabled = true;
  btn.innerHTML = lang === 'cn'
    ? '<i class="fas fa-spinner fa-spin"></i> 发送中...'
    : '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setTimeout(() => {
    btn.innerHTML = lang === 'cn'
      ? '<i class="fas fa-check-circle"></i> 留言已发送！'
      : '<i class="fas fa-check-circle"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#00a850,#00cc66)';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = lang === 'cn'
        ? '<i class="fas fa-paper-plane"></i> <span>发送留言</span>'
        : '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
    }, 4000);
  }, 1200);
});

/* ── Stagger card reveal delays ── */
['.science-cards .sci-card', '.benefits-grid .ben-card', '.research-grid .res-card']
  .forEach(sel =>
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    })
  );
