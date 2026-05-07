/* ============================================================
   main.js — Portfolio Interactions
   ============================================================ */

// ── Custom Cursor ──────────────────────────────────────────
const cursor    = document.getElementById('cursor');
const ring      = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

// Track raw mouse position
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smoothly animate the trailing ring via requestAnimationFrame
function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand cursor on interactive elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    ring.style.width    = '52px';
    ring.style.height   = '52px';
    ring.style.opacity  = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    ring.style.width    = '36px';
    ring.style.height   = '36px';
    ring.style.opacity  = '0.5';
  });
});

// ── Nav: shrink on scroll ──────────────────────────────────
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.padding = '0.9rem 4rem';
  } else {
    nav.style.padding = '1.5rem 4rem';
  }
});