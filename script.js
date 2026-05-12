/* ====================================================
   PROJET X NORMANDIE — script.js
   Ultra Premium Interactions
   ==================================================== */

'use strict';

// ====================================================
// CUSTOM CURSOR
// ====================================================
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverEls = document.querySelectorAll(
    'a, button, .faq-question, .feature-card, .org-card, .timeline-card, .amenity-item, .value-pill'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });
})();

// ====================================================
// NAVBAR SCROLL
// ====================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ====================================================
// MOBILE MENU
// ====================================================
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
})();

// ====================================================
// COUNTDOWN TIMER
// ====================================================
(function initCountdown() {
  // Compteur Hero — soirée du 18 juillet
  const target = new Date('2026-07-18T20:00:00');

  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };

  function pad(n, digits = 2) {
    return String(n).padStart(digits, '0');
  }

  function update() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      if (els.days)  els.days.textContent  = '000';
      if (els.hours) els.hours.textContent = '00';
      if (els.mins)  els.mins.textContent  = '00';
      if (els.secs)  els.secs.textContent  = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    if (els.days)  els.days.textContent  = pad(d, 3);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins)  els.mins.textContent  = pad(m);
    if (els.secs)  els.secs.textContent  = pad(s);
  }

  update();
  setInterval(update, 1000);
})();

// ====================================================
// SCROLL REVEAL
// ====================================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
})();

// ====================================================
// PARTICLES CANVAS
// ====================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size    = Math.random() * 2.5 + 0.5;
      this.speedY  = -(Math.random() * 0.6 + 0.15);
      this.speedX  = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.hue     = Math.random() > 0.75 ? 0 : 0; // all red-ish
      this.life    = 1;
      this.decay   = Math.random() * 0.0015 + 0.0005;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.life -= this.decay;

      if (this.life <= 0 || this.y < -10) this.reset();
    }

    draw() {
      const alpha = this.opacity * this.life;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${this.hue}, 100%, 55%)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 55%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // init particles
  const COUNT = Math.min(120, Math.floor(W * H / 12000));
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  loop();
})();

// ====================================================
// STAT NUMBER COUNTER ANIMATION
// ====================================================
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => io.observe(el));
})();

// ====================================================
// CLASSEMENT DONATEURS — 1er juin (VIP / verrou)
// ====================================================
(function initDonorsGating() {
  const targetDate = new Date('2026-06-01T20:00:00');
  const now = new Date();
  const isUnlocked = now >= targetDate;

  // On masque le tableau/podium + on gère la CTA si besoin
  const podium = document.querySelector('.podium-wrapper');
  const tableWrapper = document.querySelector('.donors-table-wrapper');
  const donorsCtas = document.querySelectorAll('.donors-cta');
  const rankingList = document.getElementById('ranking-list');

  // Petit bloc optionnel (si on l'ajoute dans index)
  const lockedBlock = document.getElementById('donors-locked');
  const unlockedBlock = document.getElementById('donors-unlocked');

  const setHidden = (el, hidden) => {
    if (!el) return;
    el.style.display = hidden ? 'none' : '';
  };

  if (!isUnlocked) {
    setHidden(podium, true);
    setHidden(tableWrapper, true);
    if (lockedBlock) setHidden(lockedBlock, false);
    if (unlockedBlock) setHidden(unlockedBlock, true);

    // La liste détaillée est optionnelle, on la garde fermée
    if (rankingList) rankingList.style.display = 'none';

    // CTA "Voir tout" peut rester visible mais n'affiche rien (on la coupe proprement)
    donorsCtas.forEach(cta => {
      const btn = cta.querySelector('button');
      if (btn && btn.id === 'show-ranking-btn') setHidden(cta, true);
    });
  } else {
    setHidden(podium, false);
    setHidden(tableWrapper, false);
    if (lockedBlock) setHidden(lockedBlock, true);
    if (unlockedBlock) setHidden(unlockedBlock, false);
  }
})();

// ====================================================
// DONATION PROGRESS BAR ANIMATION
// ====================================================
(function initDonation() {
  const fill           = document.querySelector('.progress-fill');
  const percentEl      = document.getElementById('progress-percent');
  const raisedEl       = document.getElementById('raised-amount');
  const donorsCountEl  = document.getElementById('donors-count');
  const avgEl          = document.getElementById('avg-donation');

  if (!fill) return;

  const targetPct  = parseInt(fill.dataset.target, 10) || 100;
  const raised     = 608;
  const donorsN    = 5;
  const avg        = Math.round(raised / donorsN);

  function animateNum(el, target, duration = 1600, prefix = '', suffix = '') {
    if (!el) return;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // animate progress bar
        setTimeout(() => {
          fill.style.width = targetPct + '%';
          if (percentEl) {
            // animate percent text
            let start = performance.now();
            (function step(now) {
              const p = Math.min((now - start) / 1600, 1);
              const ease = 1 - Math.pow(1 - p, 3);
              percentEl.textContent = Math.floor(ease * targetPct) + '%';
              if (p < 1) requestAnimationFrame(step);
              else percentEl.textContent = targetPct + '%';
            })(performance.now());
          }
          animateNum(raisedEl,    raised, 1800);
          animateNum(donorsCountEl, donorsN, 1400);
          animateNum(avgEl,       avg,    1600);
        }, 200);

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const section = document.getElementById('donations');
  if (section) io.observe(section);
})();

// ====================================================
// FAQ ACCORDION
// ====================================================
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      // open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
})();

// ====================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = document.getElementById('navbar')?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ====================================================
// ACTIVE NAV LINK ON SCROLL
// ====================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const navH = document.getElementById('navbar')?.offsetHeight || 72;

  function update() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - navH - 50;
      if (window.scrollY >= top) current = sec.id;
    });

    links.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.style.color = href === current ? 'var(--red-neon)' : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ====================================================
// TIMELINE REVEAL ON SCROLL
// ====================================================
(function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((item, i) => {
    item.style.opacity    = '0';
    item.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    if (item.classList.contains('timeline-item--right')) {
      item.style.transform = 'translateX(40px)';
    } else {
      item.style.transform = 'translateX(-40px)';
    }
    io.observe(item);
  });
})();

// ====================================================
// CONTACT FORM SUBMIT (UI only)
// ====================================================
(function initContactForm() {
  const btn = document.getElementById('contact-submit');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.cf-input');
    let valid = true;

    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = 'rgba(255,0,24,0.6)';
        inp.style.boxShadow   = '0 0 0 3px rgba(255,0,24,0.15)';
        valid = false;
        setTimeout(() => {
          inp.style.borderColor = '';
          inp.style.boxShadow   = '';
        }, 2000);
      }
    });

    if (!valid) return;

    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = '✓ Message envoyé !';
    btn.style.background = 'linear-gradient(135deg, #1a7a1a, #22a622)';
    btn.disabled = true;

    setTimeout(() => {
      span.textContent  = orig;
      btn.style.background = '';
      btn.disabled = false;
      inputs.forEach(i => (i.value = ''));
    }, 3000);
  });
})();

// ====================================================
// HERO PARALLAX ON MOUSE MOVE
// ====================================================
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || window.innerWidth < 768) return;

  const lights = hero.querySelectorAll('.hero-light');
  const smoke  = hero.querySelectorAll('.hero-smoke');

  hero.addEventListener('mousemove', (e) => {
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;

    lights.forEach((l, i) => {
      const factor = (i + 1) * 8;
      l.style.transform = `rotate(${cx * factor}deg) translateY(${cy * 4}px)`;
    });

    smoke.forEach((s, i) => {
      const factor = (i + 1) * 5;
      s.style.transform = `translateX(${cx * factor}px)`;
    });
  });
})();

// ====================================================
// GLOW EFFECT ON SECTION ENTRY
// ====================================================
(function initSectionGlow() {
  const glowSections = document.querySelectorAll('.donations-section, .donateurs-section');
  if (!glowSections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const glow = entry.target.querySelector('.donation-bg-glow, .footer-glow');
      if (!glow) return;
      if (entry.isIntersecting) {
        glow.style.transform = 'translate(-50%, -50%) scale(1.3)';
        glow.style.opacity = '1';
        glow.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
      } else {
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
        glow.style.opacity = '0.5';
      }
    });
  }, { threshold: 0.2 });

  glowSections.forEach(s => io.observe(s));
})();

// ====================================================
// PODIUM ANIMATION ON ENTRY
// ====================================================
(function initPodium() {
  const podium = document.querySelector('.podium-wrapper');
  if (!podium) return;

  const items = podium.querySelectorAll('.podium-item');
  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${i * 0.15 + 0.3}s, transform 0.6s ease ${i * 0.15 + 0.3}s`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(item => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  io.observe(podium);
})();

// ====================================================
// FEATURE CARDS TILT EFFECT
// ====================================================
(function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.feature-card, .org-card-inner, .timeline-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;

      card.style.transform = `perspective(600px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ====================================================
// HERO BADGE TYPING EFFECT
// ====================================================
(function initBadgeGlow() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  let toggle = false;
  setInterval(() => {
    toggle = !toggle;
    badge.style.boxShadow = toggle
      ? '0 0 20px rgba(255,0,24,0.3), inset 0 0 20px rgba(255,0,24,0.05)'
      : '0 0 8px rgba(255,0,24,0.15)';
  }, 2000);
})();

// ====================================================
// DONOR TABLE ROW ANIMATION
// ====================================================
(function initDonorRows() {
  const rows = document.querySelectorAll('.donor-row');
  rows.forEach((row, i) => {
    row.style.opacity   = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rows.forEach(row => {
          row.style.opacity   = '1';
          row.style.transform = 'translateX(0)';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const table = document.querySelector('.donors-table-wrapper');
  if (table) io.observe(table);
})();

// ====================================================
// DONOR RANKING TOGGLE
(function initRankingToggle() {
  const btn  = document.getElementById('show-ranking-btn');
  const list = document.getElementById('ranking-list');
  if (!btn || !list) return;

  btn.addEventListener('click', () => {
    const isOpen = list.style.display === 'block';
    list.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? 'Voir tout le classement' : 'Masquer le classement';
  });
})();

// ====================================================
// LOGO X CLICK EASTER EGG
// ====================================================
(function initEasterEgg() {
  const logoX = document.querySelector('.logo-big-x');
  if (!logoX) return;

  let clicks = 0;
  logoX.addEventListener('click', () => {
    clicks++;
    if (clicks === 5) {
      clicks = 0;
      // Fire confetti-like particles from logo
      for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
          position:fixed;
          width:6px;height:6px;
          background:hsl(${Math.random()*30},100%,55%);
          border-radius:50%;
          pointer-events:none;
          z-index:9999;
          left:50%;top:40%;
          animation:none;
          box-shadow:0 0 8px currentColor;
        `;
        document.body.appendChild(el);

        const angle  = Math.random() * Math.PI * 2;
        const speed  = Math.random() * 8 + 3;
        const dx     = Math.cos(angle) * speed;
        const dy     = Math.sin(angle) * speed - 5;
        let   x = 0, y = 0, vy = dy;
        let   frames = 0;

        const anim = setInterval(() => {
          x  += dx * 0.95;
          vy += 0.3;
          y  += vy;
          frames++;
          el.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
          el.style.opacity   = String(1 - frames / 60);
          if (frames > 60) { clearInterval(anim); el.remove(); }
        }, 16);
      }
    }
  });
})();

// ====================================================
// INIT COMPLETE
// ====================================================
console.log(
  '%c🔴 PROJET X NORMANDIE — 31.12.2026',
  'color:#ff0018;font-family:monospace;font-size:14px;font-weight:bold;text-shadow:0 0 10px #ff0018;'
);