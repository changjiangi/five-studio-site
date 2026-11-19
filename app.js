(() => {
  // 1. Dynamic copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Mobile navigation toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Copy email to clipboard buttons
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1800);
      } catch {
        window.location.href = `mailto:${value}`;
      }
    });
  });

  // 4. Interactive Hero Controller easter egg
  const logoSvg = document.getElementById('interactive-logo');
  const consoleText = document.getElementById('console-text');
  const counterEl = document.getElementById('stage-counter');
  let inputCount = 0;
  let nudgeTimer = null;

  const triggerControllerInput = (el) => {
    if (!logoSvg || !consoleText) return;
    const key = el.getAttribute('data-key') || 'BTN';
    const nudgeClass = el.getAttribute('data-nudge') || 'nudge-pop';

    inputCount += 1;
    if (counterEl) {
      counterEl.textContent = `INPUTS: ${String(inputCount).padStart(2, '0')}`;
    }

    logoSvg.classList.remove('nudge-up', 'nudge-down', 'nudge-left', 'nudge-right', 'nudge-pop');
    void logoSvg.offsetWidth;
    logoSvg.classList.add(nudgeClass);

    el.classList.add('is-pressed');
    setTimeout(() => el.classList.remove('is-pressed'), 180);

    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => {
      logoSvg.classList.remove(nudgeClass);
    }, 200);

    if (inputCount % 5 === 0) {
      consoleText.classList.add('combo');
      consoleText.innerHTML = `5P COMBO! <strong>MAKE SMALL. PLAY BIG.</strong>`;
    } else {
      consoleText.classList.remove('combo');
      consoleText.innerHTML = `PRESSED <strong>[${key}]</strong> — P${((inputCount - 1) % 5) + 1} READY`;
    }
  };

  if (logoSvg) {
    logoSvg.querySelectorAll('[data-key]').forEach((control) => {
      control.addEventListener('click', () => triggerControllerInput(control));
      control.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerControllerInput(control);
        }
      });
    });
  }

  // 5. Signature Five Studio dot-matrix backdrop
  const canvas = document.getElementById('dot-matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = [
    { color: 'rgba(183, 252, 73, 0.52)', weight: 0.44, size: 3.1 }, // acid lime
    { color: 'rgba(231, 110, 99, 0.44)', weight: 0.17, size: 2.5 }, // arcade coral
    { color: 'rgba(215, 180, 92, 0.36)', weight: 0.14, size: 2.3 }, // warm gold
    { color: 'rgba(130, 178, 128, 0.22)', weight: 0.25, size: 2.0 }, // muted moss
  ];

  let dots = [];
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;

  const pickTone = (seed) => {
    const r = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
    let acc = 0;
    for (const item of palette) {
      acc += item.weight;
      if (r <= acc) return item;
    }
    return palette[0];
  };

  const buildGrid = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const spacing = width < 640 ? 44 : 50;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const idx = row * 131 + col * 17 + 7;
        const tone = pickTone(idx);
        // Slight staggered grid echoing the Five Studio banner pattern
        const staggerY = (col % 2 === 0 ? 0 : spacing * 0.45);
        dots.push({
          x: col * spacing + (row % 2 === 0 ? 0 : 10),
          y: row * spacing + staggerY,
          size: tone.size,
          color: tone.color,
          phase: (idx % 31) * 0.42,
          speed: 0.65 + (Math.abs(idx) % 7) * 0.12,
        });
      }
    }
  };

  const render = (time) => {
    ctx.clearRect(0, 0, width, height);
    const t = time * 0.001;

    for (const dot of dots) {
      const shimmer = prefersReducedMotion ? 1 : 0.62 + 0.38 * Math.sin(t * dot.speed + dot.phase);
      const px = dot.x + pointerX * (dot.size * 2.2);
      const py = dot.y + pointerY * (dot.size * 2.2);

      ctx.globalAlpha = shimmer;
      ctx.fillStyle = dot.color;
      ctx.fillRect(px, py, dot.size, dot.size);
    }
    ctx.globalAlpha = 1;

    if (!prefersReducedMotion) {
      requestAnimationFrame(render);
    }
  };

  buildGrid();
  window.addEventListener('resize', () => {
    buildGrid();
    if (prefersReducedMotion) render(0);
  });

  if (!prefersReducedMotion) {
    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / width - 0.5) * -1.4;
      pointerY = (e.clientY / height - 0.5) * -1.4;
    }, { passive: true });
    requestAnimationFrame(render);
  } else {
    render(0);
  }
})();
