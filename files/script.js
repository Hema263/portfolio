/* =========================================================
   HEMASRI S — PORTFOLIO SCRIPT
   Vanilla JS — no external runtime dependencies.
   ========================================================= */

/* ---------- Mobile menu ---------- */
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

menuIcon.addEventListener('click', () => {
  navbar.classList.toggle('show');
});
navbar.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('show'));
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* ---------- Typewriter role rotation ---------- */
const roles = [
  'AI & Data Science Engineer',
  'Cybersecurity Analyst',
  'Patent-Holding Innovator',
  'Full-Stack Builder'
];
const roleEl = document.getElementById('roleTyped');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIdx];

  if (!deleting) {
    charIdx++;
    roleEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIdx--;
    roleEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 70);
}
typeLoop();

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll(
  '.about-grid, .skills-grid, .timeline-item, .project-card, .ca-grid, .contact-grid'
);
revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ---------- Patent link: no external URL on file, point to Achievements ---------- */
const patentLink = document.getElementById('patentLink');
if (patentLink) {
  patentLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('cert-achieve').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Hero node network canvas ----------
   A quiet, ambient network graph: nodes drift and link when close,
   echoing both "adaptive trust" scoring and traffic-grid signal flow. */
const canvas = document.getElementById('nodeField');
const ctx = canvas.getContext('2d');
let width, height, nodes = [];
const NODE_COUNT_BASE = 60;
const LINK_DIST = 130;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  const hero = canvas.parentElement;
  width = canvas.width = hero.offsetWidth;
  height = canvas.height = hero.offsetHeight;
  const count = Math.min(NODE_COUNT_BASE, Math.floor((width * height) / 22000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.4 + 0.6
  }));
}

function drawFrame() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x += a.vx;
    a.y += a.vy;
    if (a.x < 0 || a.x > width) a.vx *= -1;
    if (a.y < 0 || a.y > height) a.vy *= -1;

    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DIST) {
        ctx.strokeStyle = `rgba(233, 238, 245, ${0.14 * (1 - dist / LINK_DIST)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(242, 199, 126, 0.55)';
    ctx.fill();
  }

  if (!reduceMotion) requestAnimationFrame(drawFrame);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawFrame();
if (reduceMotion) {
  // Draw a single static frame instead of animating continuously.
  drawFrame();
}
