// ── BOOT INTRO SEQUENCE ──
(function boot() {
  const overlay = document.getElementById('intro-overlay');
  const linesEl = document.getElementById('boot-lines');
  const bar     = document.getElementById('intro-bar');
  const pct     = document.getElementById('intro-pct');
  const ready   = document.getElementById('intro-ready');

  const cmds = [
    { cmd: 'init --env production',              ok: false, t: 180  },
    { cmd: 'load jvm_runtime --spring-boot-3.5', ok: true,  t: 480  },
    { cmd: 'mount portfolio@jawaharbharathi',     ok: true,  t: 780  },
    { cmd: 'connect postgresql://interviewforge',ok: true,  t: 1050 },
    { cmd: 'compile assets --next-js-15',        ok: true,  t: 1320 },
    { cmd: 'start server 0.0.0.0:3000',          ok: true,  t: 1580 },
  ];

  cmds.forEach(({ cmd, ok, t }) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'boot-line';
      el.innerHTML =
        `<span class="b-prompt">$</span>` +
        `<span class="b-cmd">${cmd}</span>` +
        (ok ? `<span class="b-ok">✓ ok</span>` : '');
      linesEl.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    }, t);
  });

  setTimeout(() => {
    let w = 0;
    bar.style.transition = 'none';
    const iv = setInterval(() => {
      w += 1.4;
      bar.style.width = Math.min(w, 100) + '%';
      pct.textContent = Math.floor(Math.min(w, 100)) + '%';
      if (w >= 100) {
        clearInterval(iv);
        pct.textContent = '100%';
        setTimeout(() => {
          ready.classList.add('show');
          setTimeout(() => {
            overlay.classList.add('exit');
            document.body.classList.add('hero-ready');
            setTimeout(() => {
              overlay.remove();
              startNameScramble();
              initNeuralCanvas();
            }, 1000);
          }, 420);
        }, 120);
      }
    }, 11);
  }, 1820);
})();

// ── CUSTOM CURSOR — Fast dot + ring (no lag) ──
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;
let ringRaf = null;

// Dot follows mouse instantly (no lag)
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
});

// Ring follows with gentle lerp for smoothness without slowness
function animateRing() {
  const ease = 0.14;
  ringX += (mouseX - ringX) * ease;
  ringY += (mouseY - ringY) * ease;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top  = `${ringY}px`;
  ringRaf = requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .contact-link, .btn-a, .btn-b, .email-btn, .project-item, .hero-terminal, .commit-card, .skill-group, .stat-box, .about-social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

// ── PROJECT HOVER PREVIEW ──
const hc = document.getElementById('hover-card');
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    hc.textContent = item.dataset.emoji || '🚀';
    hc.style.opacity = '1';
    hc.style.transform = 'scale(1) rotate(-2deg)';
  });
  item.addEventListener('mouseleave', () => {
    hc.style.opacity = '0';
    hc.style.transform = 'scale(.85) rotate(2deg)';
  });
  item.addEventListener('mousemove', e => {
    hc.style.left = `${e.clientX + 24}px`;
    hc.style.top  = `${e.clientY - 75}px`;
  });
});

// ── HERO NAME SCRAMBLE ──
const chars = '█▓▒░◆◇○●$¥▰▱▲▼';
const nameEl = document.getElementById('hero-scramble-name');

function startNameScramble() {
  if (!nameEl) return;
  const target = 'JAWAHAR';
  let iteration = 0;
  const maxIter = 50;

  const iv = setInterval(() => {
    const progress = iteration / maxIter;
    const resolved = Math.floor(progress * target.length);
    let result = '';
    for (let i = 0; i < target.length; i++) {
      result += i < resolved ? target[i] : chars[Math.floor(Math.random() * chars.length)];
    }
    nameEl.childNodes[0].textContent = result + '\n';
    iteration++;
    if (iteration > maxIter) {
      clearInterval(iv);
      nameEl.childNodes[0].textContent = target + '\n';
    }
  }, 70);
}

// ── SMOOTH PARALLAX ON HERO BG TEXT ──
const bgTxt = document.querySelector('.hero-bg-text');
if (bgTxt) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgTxt.style.transform = `translate(-50%, calc(-50% + ${y * 0.28}px))`;
    bgTxt.style.opacity = Math.max(0, 1 - y / 450) + '';
  });
}

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.n-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.n-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── FADE IN OBSERVER ──
document.querySelectorAll('.fi').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
  }, { threshold: 0.07 }).observe(el);
});

// ── ANIMATED METRIC COUNTERS ──
const metricObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.metric-num[data-target]').forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target  = +el.dataset.target;
      const suffix  = el.dataset.suffix || '';
      const duration = 1600;
      const start    = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        // Ease out expo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    metricObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const metricsSection = document.querySelector('.metrics-row');
if (metricsSection) metricObserver.observe(metricsSection);

// ── TECH ORBIT: propagate --speed to child .o-tag so counter-animations sync ──
document.querySelectorAll('.orbit-arm').forEach(arm => {
  const speed = getComputedStyle(arm).getPropertyValue('--speed').trim();
  arm.querySelectorAll('.o-tag').forEach(tag => {
    tag.style.setProperty('--speed', speed);
    tag.style.animationDelay = arm.style.getPropertyValue('--delay') || '0s';
  });
});


// ── CONTACT EMAIL HANDLER ──
const emailBtn = document.getElementById('email-contact-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const subject = encodeURIComponent("Hi Jawahar, Inquiry from Portfolio");
    const body = encodeURIComponent("Hi Jawahar,\n\nI visited your portfolio and wanted to connect.\n\nBest regards,\n[Your Name]");
    const a = document.createElement('a');
    a.href = `mailto:jawaharbharathi@gmail.com?subject=${subject}&body=${body}`;
    a.click();
  });
}

// ── NEURAL CONSTELLATION CANVAS ──
function initNeuralCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0;
  let particles = [];
  const maxParticles = window.innerWidth < 768 ? 22 : 50;
  const connectDist = 115;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width)  this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDist) {
          const alpha = (1 - dist / connectDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      const rect = canvas.getBoundingClientRect();
      const mcx = mouseX - rect.left;
      const mcy = mouseY - rect.top;

      if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
        const dx = particles[i].x - mcx;
        const dy = particles[i].y - mcy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mcd = 150;
        if (dist < mcd) {
          const alpha = (1 - dist / mcd) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mcx, mcy);
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}
