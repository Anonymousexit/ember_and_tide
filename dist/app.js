const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const header = $('#header');
const heroImage = $('.hero-image');
const depthSections = $$('.pour, .gather');
let scrollQueued = false;
function updateScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 70);
  const scrollRange = document.documentElement.scrollHeight - innerHeight;
  header.style.setProperty('--page-progress', scrollRange > 0 ? y / scrollRange : 0);
  if (!reduced.matches && y < innerHeight * 1.5) heroImage.style.transform = `translate3d(0,${y * .19}px,0) scale(1.04)`;
  if (!reduced.matches) {
    const depths = depthSections.map(section => ({ section, rect: section.getBoundingClientRect() }));
    depths.forEach(({ section, rect }) => {
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const amount = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
        $('img', section).style.transform = `translate3d(0,${amount * 55}px,0)`;
      }
    });
  }
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { requestAnimationFrame(updateScroll); scrollQueued = true; } }, { passive: true });
addEventListener('resize', () => { if (!scrollQueued) { requestAnimationFrame(updateScroll); scrollQueued = true; } }, { passive: true });
updateScroll();
if (!reduced.matches && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => observer.observe(el));
}
const footerMark = $('.footer-wordmark');
let letterIndex = 0;
function wrapLetters(parent) {
  [...parent.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      [...node.textContent].forEach(letter => {
        const span = document.createElement('span');
        span.className = `footer-letter${letter === ' ' ? ' footer-space' : ''}`;
        span.textContent = letter === ' ' ? '\u00a0' : letter;
        span.style.setProperty('--letter-index', letterIndex++); span.setAttribute('aria-hidden', 'true');
        fragment.append(span);
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE) wrapLetters(node);
  });
}
wrapLetters(footerMark);
if (!reduced.matches && 'IntersectionObserver' in window) {
  $$('.food-picture, .story-main, .story-aside img').forEach(el => el.classList.add('photo-reveal'));
  const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); motionObserver.unobserve(entry.target); }
  }), { threshold: .15 });
  $$('.photo-reveal, .dish, .footer-wordmark').forEach(el => motionObserver.observe(el));
}
const toggle = $('.menu-toggle');
function closeNav() { toggle.setAttribute('aria-expanded', 'false'); $('#mobile-nav').classList.remove('open'); $('#mobile-nav').inert = true; document.body.style.overflow = ''; }
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open)); $('#mobile-nav').classList.toggle('open', open); $('#mobile-nav').inert = !open;
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('#mobile-nav a').forEach(a => a.addEventListener('click', closeNav));
addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
matchMedia('(min-width: 641px)').addEventListener('change', e => { if (e.matches) closeNav(); });

// A spring-driven circular follower, with no React renders or layout reads per frame.
const cursor = $('.cursor');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
$$('.footer-book, .book-button, .solid-button, .outline-button').forEach(button => {
  button.classList.add('magnetic');
  let magnetFrame = 0;
  button.addEventListener('pointermove', e => {
    if (!finePointer.matches || reduced.matches || e.pointerType === 'touch') return;
    const rect = button.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * .12;
    const dy = (e.clientY - rect.top - rect.height / 2) * .15;
    cancelAnimationFrame(magnetFrame);
    magnetFrame = requestAnimationFrame(() => { button.style.transform = `translate3d(${dx}px,${dy}px,0)`; });
  }, { passive: true });
  button.addEventListener('pointerleave', () => {
    cancelAnimationFrame(magnetFrame); const start = getComputedStyle(button).transform; button.style.transform = '';
    if (!reduced.matches) button.animate([{ transform: start }, { transform: 'translate3d(0,0,0)' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
});
let x = -100, y = -100, targetX = -100, targetY = -100, vx = 0, vy = 0, lastTime = 0, cursorFrame = 0, visible = false;
function drawCursor(time) {
  const dt = Math.min((time - (lastTime || time)) / 1000, 1 / 30); lastTime = time;
  const stiffness = 620, damping = 43;
  vx += ((targetX - x) * stiffness - vx * damping) * dt;
  vy += ((targetY - y) * stiffness - vy * damping) * dt;
  x += vx * dt; y += vy * dt;
  cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
  if (visible && (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(vx) + Math.abs(vy) > .05)) cursorFrame = requestAnimationFrame(drawCursor);
  else { cursorFrame = 0; lastTime = 0; }
}
function hideCursor() { visible = false; cursor.style.opacity = '0'; document.body.classList.remove('cursor-ready'); }
function cursorMode(target) {
  const interactive = target.closest('button,a,[data-cursor]');
  const label = interactive?.dataset.cursor || '';
  cursor.classList.toggle('active', !!interactive); cursor.classList.toggle('labelled', !!label); $('span', cursor).textContent = label;
}
addEventListener('pointerover', e => { if (e.target instanceof Element) cursorMode(e.target); }, { passive: true });
addEventListener('scroll', () => { cursor.classList.remove('active', 'labelled'); $('span', cursor).textContent = ''; }, { passive: true });
addEventListener('pointermove', e => {
  if (!finePointer.matches || reduced.matches || e.pointerType === 'touch') return;
  targetX = e.clientX; targetY = e.clientY;
  if (!visible) { x = targetX; y = targetY; vx = vy = 0; visible = true; }
  const nativeField = e.target.closest('input,select');
  cursor.style.opacity = nativeField ? '0' : '1'; document.body.classList.add('cursor-ready');
  cursorMode(e.target);
  if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
}, { passive: true });
document.addEventListener('pointerleave', hideCursor);
addEventListener('blur', hideCursor);
addEventListener('keydown', e => { if (e.key === 'Tab') hideCursor(); });
reduced.addEventListener('change', () => { hideCursor(); if (reduced.matches) { heroImage.style.transform = 'none'; $$('.reveal').forEach(el => el.classList.add('visible')); } });

const booking = $('#booking-dialog');
let returnFocus;
function showDialog(dialog, trigger) { closeNav(); returnFocus = trigger; dialog.append(cursor); dialog.showModal(); document.body.style.overflow = 'hidden'; hideCursor(); }
$$('dialog').forEach(dialog => {
  $('.close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.append(cursor); hideCursor(); document.body.style.overflow = ''; returnFocus?.focus(); });
});
const dateInput = $('input[name=date]');
function localDate() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
dateInput.min = localDate(); dateInput.value = localDate();
$$('[data-book]').forEach(button => button.addEventListener('click', () => { dateInput.min = localDate(); $('#booking-form').hidden = false; $('#booking-result').hidden = true; showDialog(booking, button); }));
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault(); if (!e.currentTarget.reportValidity()) return;
  const values = new FormData(e.currentTarget); const date = new Date(`${values.get('date')}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const result = $('#booking-result'); result.replaceChildren();
  const summary = document.createElement('p'); summary.className = 'booking-summary'; summary.textContent = `${values.get('guests')} · ${date} · ${values.get('time')}`;
  const note = document.createElement('p'); note.className = 'booking-result-note'; note.textContent = 'Your perfect evening, imagined. This preview has not made a reservation. Live table booking will be available when the restaurant details are confirmed.';
  const edit = document.createElement('button'); edit.className = 'outline-button'; edit.textContent = 'Change your plans ↗'; edit.addEventListener('click', () => { result.hidden = true; e.target.hidden = false; dateInput.focus(); });
  result.append(summary, note, edit); e.target.hidden = true; result.hidden = false; edit.focus();
});
$('#year').textContent = new Date().getFullYear();
