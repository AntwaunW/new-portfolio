/* ============================================================
   skills.js — Progress bar animation + geo bg + scroll reveal
   ============================================================ */

// ── Geometric Background (same system as about.js) ─────────
(function () {
  const canvas = document.getElementById('geoBg');
  const ctx    = canvas.getContext('2d');

  const C = {
    green: 'rgba(54, 255, 0,',
    navy:  'rgba(31, 36, 121,',
    olive: 'rgba(167, 191, 6,',
    white: 'rgba(255, 255, 255,',
  };

  let W, H, shapes;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function buildShapes() {
    shapes = [
      // Triangles
      { type: 'triangle', x: W*0.06,  y: H*0.15,  size: 160, angle: 0.3,  speed:  0.0003,  color: C.green, alpha: 0.04, lw: 1   },
      { type: 'triangle', x: W*0.94,  y: H*0.68,  size: 200, angle: 1.8,  speed: -0.0002,  color: C.navy,  alpha: 0.1,  lw: 1   },
      { type: 'triangle', x: W*0.50,  y: H*0.06,  size: 90,  angle: 0.6,  speed:  0.0005,  color: C.olive, alpha: 0.05, lw: 0.8 },
      { type: 'triangle', x: W*0.75,  y: H*0.85,  size: 130, angle: 2.2,  speed:  0.0003,  color: C.green, alpha: 0.03, lw: 0.7 },
      // Hexagons
      { type: 'hex',      x: W*0.88,  y: H*0.10,  size: 65,  angle: 0,    speed:  0.0004,  color: C.green, alpha: 0.05, lw: 1   },
      { type: 'hex',      x: W*0.10,  y: H*0.78,  size: 85,  angle: 0.9,  speed: -0.0003,  color: C.olive, alpha: 0.04, lw: 0.8 },
      { type: 'hex',      x: W*0.60,  y: H*0.95,  size: 50,  angle: 0.2,  speed:  0.0006,  color: C.green, alpha: 0.04, lw: 0.7 },
      // Diamonds / squares
      { type: 'square',   x: W*0.80,  y: H*0.42,  size: 55,  angle: 0.78, speed:  0.0004,  color: C.green, alpha: 0.05, lw: 0.8 },
      { type: 'square',   x: W*0.20,  y: H*0.50,  size: 40,  angle: 0.4,  speed: -0.0005,  color: C.white, alpha: 0.025,lw: 0.6 },
      { type: 'square',   x: W*0.35,  y: H*0.30,  size: 30,  angle: 1.0,  speed:  0.0007,  color: C.olive, alpha: 0.04, lw: 0.6 },
      // Circles
      { type: 'circle',   x: W*0.04,  y: H*0.40,  size: 75,  angle: 0,    speed: 0,        color: C.navy,  alpha: 0.15, lw: 1   },
      { type: 'circle',   x: W*0.96,  y: H*0.88,  size: 110, angle: 0,    speed: 0,        color: C.green, alpha: 0.035,lw: 0.8 },
      // Crosses
      { type: 'cross',    x: W*0.46,  y: H*0.32,  size: 14,  angle: 0,    speed:  0.001,   color: C.green, alpha: 0.18, lw: 1   },
      { type: 'cross',    x: W*0.84,  y: H*0.58,  size: 10,  angle: 0.5,  speed: -0.0008,  color: C.olive, alpha: 0.16, lw: 0.8 },
      { type: 'cross',    x: W*0.22,  y: H*0.22,  size: 12,  angle: 1.2,  speed:  0.0006,  color: C.white, alpha: 0.1,  lw: 0.7 },
      // Dots
      { type: 'dot',      x: W*0.28,  y: H*0.28,  size: 3,   angle: 0,    speed: 0,        color: C.green, alpha: 0.3,  lw: 0   },
      { type: 'dot',      x: W*0.70,  y: H*0.18,  size: 2.5, angle: 0,    speed: 0,        color: C.olive, alpha: 0.35, lw: 0   },
      { type: 'dot',      x: W*0.40,  y: H*0.75,  size: 2,   angle: 0,    speed: 0,        color: C.green, alpha: 0.25, lw: 0   },
      { type: 'dot',      x: W*0.90,  y: H*0.52,  size: 3,   angle: 0,    speed: 0,        color: C.white, alpha: 0.12, lw: 0   },
    ];
  }

  function drawTriangle(ctx, s) {
    const h = s * Math.sqrt(3) / 2;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(s * 0.5, h * 0.4);
    ctx.lineTo(-s * 0.5, h * 0.4);
    ctx.closePath();
  }

  function drawHex(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      i === 0 ? ctx.moveTo(Math.cos(a)*s, Math.sin(a)*s)
              : ctx.lineTo(Math.cos(a)*s, Math.sin(a)*s);
    }
    ctx.closePath();
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    const col = s.color + s.alpha + ')';

    switch (s.type) {
      case 'dot':
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'circle':
        ctx.strokeStyle = col;
        ctx.lineWidth = s.lw;
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'cross':
        ctx.strokeStyle = col;
        ctx.lineWidth = s.lw;
        ctx.beginPath();
        ctx.moveTo(-s.size, 0); ctx.lineTo(s.size, 0);
        ctx.moveTo(0, -s.size); ctx.lineTo(0, s.size);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.strokeStyle = col;
        ctx.lineWidth = s.lw;
        drawTriangle(ctx, s.size);
        ctx.stroke();
        break;
      case 'hex':
        ctx.strokeStyle = col;
        ctx.lineWidth = s.lw;
        drawHex(ctx, s.size);
        ctx.stroke();
        break;
      case 'square':
        ctx.strokeStyle = col;
        ctx.lineWidth = s.lw;
        ctx.strokeRect(-s.size/2, -s.size/2, s.size, s.size);
        break;
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach(s => { s.angle += s.speed; drawShape(s); });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); buildShapes(); });
  resize();
  buildShapes();
  tick();
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
})();

// ── Progress Bar Animation on Scroll ──────────────────────
(function () {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        const target = fill.style.getPropertyValue('--target');
        // Small delay so it feels intentional
        setTimeout(() => {
          fill.style.width = target;
          fill.classList.add('animated');
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    // Start at 0 so animation fires on scroll
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();