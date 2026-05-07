/* ============================================================
   work.js — Filter system + geo bg + scroll reveal
   ============================================================ */

// ── Geometric Background ───────────────────────────────────
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
      { type:'triangle', x:W*.07,  y:H*.18,  size:170, angle:0.3,  speed: .0003,  color:C.green, alpha:.04, lw:1   },
      { type:'triangle', x:W*.93,  y:H*.70,  size:210, angle:1.8,  speed:-.0002,  color:C.navy,  alpha:.1,  lw:1   },
      { type:'triangle', x:W*.52,  y:H*.07,  size:95,  angle:0.6,  speed: .0005,  color:C.olive, alpha:.05, lw:.8  },
      { type:'triangle', x:W*.74,  y:H*.86,  size:130, angle:2.2,  speed: .0003,  color:C.green, alpha:.03, lw:.7  },
      { type:'hex',      x:W*.87,  y:H*.11,  size:68,  angle:0,    speed: .0004,  color:C.green, alpha:.05, lw:1   },
      { type:'hex',      x:W*.11,  y:H*.79,  size:88,  angle:0.9,  speed:-.0003,  color:C.olive, alpha:.04, lw:.8  },
      { type:'hex',      x:W*.62,  y:H*.94,  size:52,  angle:0.2,  speed: .0006,  color:C.green, alpha:.04, lw:.7  },
      { type:'square',   x:W*.81,  y:H*.40,  size:56,  angle:0.78, speed: .0004,  color:C.green, alpha:.05, lw:.8  },
      { type:'square',   x:W*.19,  y:H*.52,  size:42,  angle:0.4,  speed:-.0005,  color:C.white, alpha:.025,lw:.6  },
      { type:'square',   x:W*.36,  y:H*.29,  size:32,  angle:1.0,  speed: .0007,  color:C.olive, alpha:.04, lw:.6  },
      { type:'circle',   x:W*.04,  y:H*.42,  size:78,  angle:0,    speed:0,       color:C.navy,  alpha:.15, lw:1   },
      { type:'circle',   x:W*.96,  y:H*.87,  size:115, angle:0,    speed:0,       color:C.green, alpha:.035,lw:.8  },
      { type:'cross',    x:W*.47,  y:H*.33,  size:14,  angle:0,    speed: .001,   color:C.green, alpha:.18, lw:1   },
      { type:'cross',    x:W*.83,  y:H*.59,  size:10,  angle:0.5,  speed:-.0008,  color:C.olive, alpha:.16, lw:.8  },
      { type:'cross',    x:W*.23,  y:H*.23,  size:12,  angle:1.2,  speed: .0006,  color:C.white, alpha:.1,  lw:.7  },
      { type:'dot',      x:W*.27,  y:H*.27,  size:3,   angle:0,    speed:0,       color:C.green, alpha:.3,  lw:0   },
      { type:'dot',      x:W*.71,  y:H*.19,  size:2.5, angle:0,    speed:0,       color:C.olive, alpha:.35, lw:0   },
      { type:'dot',      x:W*.41,  y:H*.76,  size:2,   angle:0,    speed:0,       color:C.green, alpha:.25, lw:0   },
      { type:'dot',      x:W*.89,  y:H*.51,  size:3,   angle:0,    speed:0,       color:C.white, alpha:.12, lw:0   },
    ];
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    const col = s.color + s.alpha + ')';

    switch (s.type) {
      case 'dot':
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(0,0,s.size,0,Math.PI*2); ctx.fill();
        break;
      case 'circle':
        ctx.strokeStyle = col; ctx.lineWidth = s.lw;
        ctx.beginPath(); ctx.arc(0,0,s.size,0,Math.PI*2); ctx.stroke();
        break;
      case 'cross':
        ctx.strokeStyle = col; ctx.lineWidth = s.lw;
        ctx.beginPath();
        ctx.moveTo(-s.size,0); ctx.lineTo(s.size,0);
        ctx.moveTo(0,-s.size); ctx.lineTo(0,s.size);
        ctx.stroke();
        break;
      case 'triangle': {
        const h = s.size * Math.sqrt(3) / 2;
        ctx.strokeStyle = col; ctx.lineWidth = s.lw;
        ctx.beginPath();
        ctx.moveTo(0,-s.size*.6); ctx.lineTo(s.size*.5,h*.4); ctx.lineTo(-s.size*.5,h*.4);
        ctx.closePath(); ctx.stroke();
        break;
      }
      case 'hex':
        ctx.strokeStyle = col; ctx.lineWidth = s.lw;
        ctx.beginPath();
        for (let i=0;i<6;i++){
          const a=(Math.PI/3)*i;
          i===0?ctx.moveTo(Math.cos(a)*s.size,Math.sin(a)*s.size)
               :ctx.lineTo(Math.cos(a)*s.size,Math.sin(a)*s.size);
        }
        ctx.closePath(); ctx.stroke();
        break;
      case 'square':
        ctx.strokeStyle = col; ctx.lineWidth = s.lw;
        ctx.strokeRect(-s.size/2,-s.size/2,s.size,s.size);
        break;
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0,0,W,H);
    shapes.forEach(s => { s.angle += s.speed; drawShape(s); });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); buildShapes(); });
  resize(); buildShapes(); tick();
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Filter Bar ─────────────────────────────────────────────
(function () {
  const btns     = document.querySelectorAll('.filter-btn');
  const cards    = document.querySelectorAll('.project-card');
  const noResult = document.getElementById('noResults');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const cat      = card.dataset.category;
        const isCS     = card.classList.contains('coming-soon');
        const matches  =
          filter === 'all' ||
          (filter === 'coming-soon' && isCS) ||
          (filter !== 'coming-soon' && cat === filter);

        if (matches) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Show empty state if nothing passes filter
      noResult.style.display = visible === 0 ? 'block' : 'none';
    });
  });
})();