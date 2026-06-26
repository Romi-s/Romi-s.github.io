'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = window.matchMedia('(pointer: fine)').matches;

/* ── Footer year ─────────────────────────────────── */
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Nav: scrolled state + mobile menu ───────────── */
const nav = document.querySelector('[data-nav]');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
onScroll();

const navToggle = document.querySelector('[data-nav-toggle]');
const navLinksWrap = document.querySelector('[data-nav-links]');
navToggle?.addEventListener('click', () => navLinksWrap.classList.toggle('open'));
navLinksWrap?.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', () => navLinksWrap.classList.remove('open'))
);

/* ── Scroll progress bar + scrolled nav ──────────── */
const progress = document.querySelector('[data-progress]');
const updateScroll = () => {
  onScroll();
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
};
updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

/* ── Active section spy ──────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* ── Split hero name into animated characters ────── */
const heroName = document.querySelector('[data-split]');
if (heroName) {
  const text = heroName.textContent;
  heroName.textContent = '';
  let idx = 0;
  [...text].forEach(ch => {
    if (ch === ' ') {
      heroName.appendChild(Object.assign(document.createElement('span'), { className: 'space' }));
    } else {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.transitionDelay = (idx * 0.035) + 's';
      heroName.appendChild(span);
      idx++;
    }
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() => heroName.querySelectorAll('.char').forEach(c => c.classList.add('in')))
  );
}

/* ── Line-mask reveal for section titles ─────────── */
document.querySelectorAll('[data-reveal-lines]').forEach(el => {
  el.innerHTML = `<span class="line-inner">${el.innerHTML}</span>`;
});

/* ── Scroll reveal (generic + line titles) ───────── */
const revealer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), Math.min(i * 55, 240));
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, [data-reveal-lines]').forEach(el => revealer.observe(el));

/* ── Animated counters ───────────────────────────── */
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

/* ── Project filter (with re-entry animation) ────── */
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const projects = document.querySelectorAll('[data-filter-item]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.textContent.trim().toLowerCase();
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    projects.forEach(item => {
      const show = filter === 'all' || item.dataset.category.includes(filter);
      item.classList.toggle('hide', !show);
      item.classList.remove('pop');
      if (show) { void item.offsetWidth; item.classList.add('pop'); }
    });
  });
});

/* ════════════════════════════════════════════════════
   MOTION LAYER (skipped under reduced-motion)
   ════════════════════════════════════════════════════ */
if (!reduceMotion) {

  /* ── Custom cursor ─────────────────────────────── */
  if (finePointer) {
    const dot = document.querySelector('[data-cursor-dot]');
    const ring = document.querySelector('[data-cursor-ring]');
    document.body.classList.add('custom-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = ring.style.opacity = 1;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const ringLoop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(ringLoop);
    };
    ringLoop();

    document.querySelectorAll('a, button, [data-magnetic], input, textarea, [data-tilt]')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ── Magnetic elements ─────────────────────────── */
  if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── 3D tilt on cards ──────────────────────────── */
  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Constellation canvas ──────────────────────── */
  const canvas = document.querySelector('[data-constellation]');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [];
    const mouse = { x: -9999, y: -9999 };

    const config = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      const count = Math.min(Math.floor((innerWidth * innerHeight) / 16000), 90);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr,
      }));
    };
    config();
    window.addEventListener('resize', config);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    window.addEventListener('mouseout', () => { mouse.x = mouse.y = -9999; });

    const LINK = 140;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const link = LINK * dpr;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // gentle attraction toward cursor
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180 * dpr) { n.vx += (dxm / dm) * 0.02; n.vy += (dym / dm) * 0.02; }
        n.vx *= 0.99; n.vy *= 0.99;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // edges
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            const a = (1 - d / link) * 0.22;
            ctx.strokeStyle = `rgba(120, 170, 200, ${a})`;
            ctx.lineWidth = dpr * 0.6;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // node, brighter near cursor
        const near = dm < 180 * dpr;
        ctx.fillStyle = near ? 'rgba(45, 212, 191, 0.9)' : 'rgba(150, 160, 190, 0.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();

        // line from cursor to nearby nodes
        if (dm < 170 * dpr) {
          ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - dm / (170 * dpr)) * 0.5})`;
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
}
