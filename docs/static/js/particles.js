(function () {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;
  const mouse = { x: null, y: null, radius: 100 };

  const CONFIG = {
    light: {
      bg: '#f4f5f7',
      dot: 'rgba(26, 34, 51, 0.4)',
      lineRgb: '26, 34, 51',
      lineOpacity: 0.15
    },
    dark: {
      bg: '#0f1420',
      dot: 'rgba(232, 234, 237, 0.45)',
      lineRgb: '232, 234, 237',
      lineOpacity: 0.12
    }
  };

  const LINE_MAX_DIST = 120;
  const DOT_RADIUS = 2;

  function currentTheme() {
    try {
      return document.documentElement.getAttribute('data-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  }

  function cfg() {
    return CONFIG[currentTheme()] || CONFIG.light;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function getParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    const base = Math.floor(area / 15000);
    return Math.min(Math.max(base, 30), 90);
  }

  function initParticles() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }
    }
  }

  function draw() {
    const c = cfg();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINE_MAX_DIST) {
          const opacity = c.lineOpacity * (1 - dist / LINE_MAX_DIST);
          ctx.strokeStyle = `rgba(${c.lineRgb}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = c.dot;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();
})();
