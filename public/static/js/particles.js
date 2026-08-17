(function () {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;
  const mouse = { x: null, y: null, radius: 90 };

  const CONFIG = {
    light: {
      bg: '#f4f5f7',
      dot: [26, 34, 51],
      lineRgb: '26, 34, 51',
      lineOpacity: 0.22,
      glowColor: 'rgba(26, 34, 51, 0.12)',
      dotAlpha: 0.85,
      dotSize: 2.0,
      speed: 0.22,
      lineWidth: 0.8,
      lineMaxDist: 150,
      particleAreaDivisor: 11000,
      minCount: 80,
      maxCount: 220,
      pulse: true
    },
    dark: {
      bg: '#0f1420',
      dot: [232, 234, 237],
      lineRgb: '232, 234, 237',
      lineOpacity: 0.22,
      glowColor: 'rgba(232, 234, 237, 0.10)',
      dotAlpha: 0.9,
      dotSize: 2.0,
      speed: 0.22,
      lineWidth: 0.9,
      lineMaxDist: 150,
      particleAreaDivisor: 11000,
      minCount: 80,
      maxCount: 220,
      pulse: true
    }
  };

  function currentTheme() {
    try {
      return document.documentElement.getAttribute('data-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  }
  function cfg() { return CONFIG[currentTheme()] || CONFIG.light; }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function getParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    const c = cfg();
    const base = Math.floor(area / c.particleAreaDivisor);
    return Math.min(Math.max(base, c.minCount), c.maxCount);
  }

  function initParticles() {
    const count = getParticleCount();
    const c = cfg();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * c.speed * 2,
      vy: (Math.random() - 0.5) * c.speed * 2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.6 + Math.random() * 1.2,
      baseSize: c.dotSize * (0.75 + Math.random() * 0.5),
      closeness: Math.random()
    }));
  }

  function update(time) {
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
          p.x += (dx / dist) * force * 0.9;
          p.y += (dy / dist) * force * 0.9;
        }
      }
    }
  }

  function draw(time) {
    const c = cfg();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, width, height);

    // Connection lines with cluster brightness
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < c.lineMaxDist) {
          const base = 1 - dist / c.lineMaxDist;
          // cluster brightness boost based on local neighborhood
          const boost = 0.08 * (a.closeness + b.closeness);
          const opacity = Math.min(c.lineOpacity * base + boost, 0.55);
          ctx.strokeStyle = `rgba(${c.lineRgb}, ${opacity})`;
          ctx.lineWidth = c.lineWidth;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Particles with soft glow and subtle pulse
    for (const p of particles) {
      let alpha = c.dotAlpha;
      let size = p.baseSize;
      if (c.pulse) {
        const pulse = Math.sin(time * 0.001 * p.pulseSpeed + p.phase);
        const pulseFactor = 1 + pulse * 0.25;
        size *= pulseFactor;
        alpha = Math.min(alpha * (0.85 + pulse * 0.15), 1);
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${c.dot.join(',')})`;

      // soft halo glow
      const glowRadius = size * 4;
      const grd = ctx.createRadialGradient(p.x, p.y, size * 0.5, p.x, p.y, glowRadius);
      grd.addColorStop(0, c.glowColor);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // core dot
      ctx.fillStyle = `rgb(${c.dot.join(',')})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function animate(time) {
    update(time);
    draw(time);
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

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mediaQuery.matches) {
    resize();
    requestAnimationFrame(animate);
  } else {
    resize();
    draw(0);
  }
})();
