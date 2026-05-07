/* ============================================================
   about.js — Geometric background + scroll reveal
   ============================================================ */

// ── Geometric Background Canvas ───────────────────────────
(function () {
  const canvas = document.getElementById('geoBg');
  const ctx    = canvas.getContext('2d');

  const C = {
    green:  'rgba(54, 255, 0,',
    navy:   'rgba(31, 36, 121,',
    olive:  'rgba(167, 191, 6,',
    white:  'rgba(255, 255, 255,',
  };

  let W, H, shapes;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Shape definitions
  function buildShapes() {
    shapes = [
      // Large slow-rotating triangles
      { type: 'triangle', x: W * 0.08,  y: H * 0.18, size: 180, angle: 0,    speed: 0.0003,  color: C.green, alpha: 0.045, filled: false, lw: 1   },
      { type: 'triangle', x: W * 0.92,  y: H * 0.72, size: 220, angle: 1.2,  speed: -0.0002, color: C.navy,  alpha: 0.12,  filled: false, lw: 1   },
      { type: 'triangle', x: W * 0.55,  y: H * 0.08, size: 100, angle: 0.5,  speed: 0.0005,  color: C.olive, alpha: 0.06,  filled: false, lw: 0.8 },

      // Hexagons
      { type: 'hex',      x: W * 0.85,  y: H * 0.12, size: 70,  angle: 0,    speed: 0.0004,  color: C.green, alpha: 0.06,  filled: false, lw: 1   },
      { type: 'hex',      x: W * 0.12,  y: H * 0.82, size: 90,  angle: 0.8,  speed: -0.0003, color: C.olive, alpha: 0.05,  filled: false, lw: 0.8 },
      { type: 'hex',      x: W * 0.42,  y: H * 0.92, size: 55,  angle: 0.3,  speed: 0.0006,  color: C.green, alpha: 0.04,  filled: false, lw: 0.7 },

      // Squares / diamonds
      { type: 'square',   x: W * 0.78,  y: H * 0.38, size: 60,  angle: 0.78, speed: 0.0004,  color: C.green, alpha: 0.05,  filled: false, lw: 0.8 },
      { type: 'square',   x: W * 0.18,  y: H * 0.55, size: 45,  angle: 0.4,  speed: -0.0005, color: C.white, alpha: 0.03,  filled: false, lw: 0.6 },
      { type: 'square',   x: W * 0.65,  y: H * 0.65, size: 35,  angle: 1.0,  speed: 0.0007,  color: C.olive, alpha: 0.045, filled: false, lw: 0.6 },

      // Small filled accent dots
      { type: 'dot',      x: W * 0.25,  y: H * 0.25, size: 3,   angle: 0,    speed: 0,       color: C.green, alpha: 0.3,   filled: true,  lw: 0   },
      { type: 'dot',      x: W * 0.72,  y: H * 0.20, size: 2.5, angle: 0,    speed: 0,       color: C.olive, alpha: 0.35,  filled: true,  lw: 0   },
      { type: 'dot',      x: W * 0.38,  y: H * 0.78, size: 2,   angle: 0,    speed: 0,       color: C.green, alpha: 0.25,  filled: true,  lw: 0   },
      { type: 'dot',      x: W * 0.88,  y: H * 0.55, size: 3,   angle: 0,    speed: 0,       color: C.white, alpha: 0.15,  filled: true,  lw: 0   },

      // Circles (ring only)
      { type: 'circle',   x: W * 0.05,  y: H * 0.42, size: 80,  angle: 0,    speed: 0,       color: C.navy,  alpha: 0.18,  filled: false, lw: 1   },
      { type: 'circle',   x: W * 0.95,  y: H * 0.90, size: 120, angle: 0,    speed: 0,       color: C.green, alpha: 0.04,  filled: false, lw: 0.8 },

      // Cross / plus lines
      { type: 'cross',    x: W * 0.48,  y: H * 0.35, size: 16,  angle: 0,    speed: 0.001,   color: C.green, alpha: 0.2,   filled: false, lw: 1   },
      { type: 'cross',    x: W * 0.82,  y: H * 0.60, size: 12,  angle: 0.5,  speed: -0.0008, color: C.olive, alpha: 0.18,  filled: false, lw: 0.8 },
    ];
  }

  function drawTriangle(ctx, size) {
    const h = size * Math.sqrt(3) / 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.6);
    ctx.lineTo(size * 0.5, h * 0.4);
    ctx.lineTo(-size * 0.5, h * 0.4);
    ctx.closePath();
  }

  function drawHex(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      i === 0 ? ctx.moveTo(Math.cos(a) * size, Math.sin(a) * size)
              : ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    }
    ctx.closePath();
  }

  function drawSquare(ctx, size) {
    ctx.beginPath();
    ctx.rect(-size / 2, -size / 2, size, size);
  }

  function drawCross(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
    ctx.moveTo(0, -size); ctx.lineTo(0, size);
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    const col = s.color + s.alpha + ')';

    if (s.type === 'dot') {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (s.type === 'circle') {
      ctx.strokeStyle = col;
      ctx.lineWidth = s.lw;
      ctx.beginPath();
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (s.type === 'cross') {
      ctx.strokeStyle = col;
      ctx.lineWidth = s.lw;
      drawCross(ctx, s.size);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.strokeStyle = col;
    ctx.lineWidth = s.lw;

    if (s.type === 'triangle') drawTriangle(ctx, s.size);
    if (s.type === 'hex')      drawHex(ctx, s.size);
    if (s.type === 'square')   drawSquare(ctx, s.size);

    if (s.filled) { ctx.fillStyle = col; ctx.fill(); }
    else          { ctx.stroke(); }

    ctx.restore();
  }

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach(s => {
      s.angle += s.speed;
      drawShape(s);
    });
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    buildShapes();
  });

  resize();
  buildShapes();
  tick();
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();