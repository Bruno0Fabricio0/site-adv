/* moved from root script.js with portrait fallback */
const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const links = document.querySelectorAll('[data-scroll]');
const animated = document.querySelectorAll('.fade-up');
const portrait = document.querySelector('.portrait');
const progress = document.querySelector('.scroll-progress');

function setSticky() {
  const s = window.scrollY > 8;
  header.classList.toggle('is-sticky', s);
}

function setProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const winHeight = window.innerHeight;
  const denom = Math.max(docHeight - winHeight, 1);
  const pct = Math.min(100, Math.max(0, (scrollTop / denom) * 100));
  progress.style.width = pct + '%';
}

function toggleNav() {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function smoothScrollTo(id) {
  const el = document.querySelector(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 0) - 12;
  window.scrollTo({ top, behavior: 'smooth' });
}

function handleLink(e) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  e.preventDefault();
  smoothScrollTo(href);
  if (nav.classList.contains('open')) toggleNav();
}

function initObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.12 });
  animated.forEach((el) => io.observe(el));
}

function initIcons() {
  const cards = document.querySelectorAll('.card[data-icon]');
  cards.forEach((card) => {
    const path = card.getAttribute('data-icon');
    if (!path) return;
    const iconBox = card.querySelector('.icon');
    if (!iconBox) return;
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'Ícone';
    img.src = path;
    img.addEventListener('load', () => {
      iconBox.innerHTML = '';
      iconBox.appendChild(img);
    });
  });
}

function initPortraitPhoto() {
  if (!portrait) return;
  const photo = portrait.getAttribute('data-photo');
  const fallback = portrait.getAttribute('data-fallback');
  const img = portrait.querySelector('img');
  if (!img) return;
  if (photo) {
    img.src = photo;
    img.addEventListener('error', () => {
      if (fallback) img.src = fallback;
    }, { once: true });
  } else if (fallback) {
    img.src = fallback;
  }
}

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(t) {
  const html = document.documentElement;
  html.setAttribute('data-theme', t);
  if (themeToggle) themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
}

function initTheme() {
  const initial = getPreferredTheme();
  applyTheme(initial);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
}

function init() {
  setSticky();
  setProgress();
  initObserver();
  initIcons();
  initPortraitPhoto();
  window.addEventListener('scroll', () => { setSticky(); setProgress(); }, { passive: true });
  if (navToggle) navToggle.addEventListener('click', toggleNav);
  links.forEach((a) => a.addEventListener('click', handleLink));
  initTheme();
}

document.addEventListener('DOMContentLoaded', init);