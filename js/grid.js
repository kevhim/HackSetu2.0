/**
 * HackSetu 2.0 — Interactive Obsidian Cyber-Grid & Ambient 3D Particle Field
 * 
 * High-performance dark-mode technical grid rendered on full-screen canvas.
 * Zero blue, zero purple, zero green: Deep Obsidian (#08080A) with subtle
 * titanium line coordinates, reactive cyber-amber glow nodes, floating embers,
 * and a cursor-following ambient volumetric light spotlight.
 */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.setProperty('--grid-bg', '1');
    const style = document.createElement('style');
    style.textContent = `
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
        background-color: #08080A;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 48px 48px;
      }
    `;
    document.head.appendChild(style);
    return;
  }

  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ─── Config ───
  const GRID_SIZE = 48;
  const LINE_COLOR = 'rgba(255, 255, 255, 0.055)';
  const DOT_COLOR = 'rgba(245, 158, 11, 0.55)';
  const DOT_RADIUS = 1.2;
  const DISTORT_RADIUS = 240;
  const DISTORT_STRENGTH = 22;
  const SMOOTH_FACTOR = 0.08;
  const BG_COLOR = '#08080A';

  // Floating Cyber Embers
  const EMBER_COUNT = 38;
  const embers = [];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let mouseX = -9999;
  let mouseY = -9999;
  let smoothX = -9999;
  let smoothY = -9999;
  let animId = null;
  let isVisible = true;

  function initEmbers() {
    embers.length = 0;
    for (let i = 0; i < EMBER_COUNT; i++) {
      embers.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        radius: 0.8 + Math.random() * 1.8,
        speedY: 0.2 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: 0.15 + Math.random() * 0.5,
        fadeSpeed: 0.005 + Math.random() * 0.008,
        increasing: Math.random() > 0.5
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!embers.length) initEmbers();
  }

  function distort(px, py) {
    const dx = px - smoothX;
    const dy = py - smoothY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > DISTORT_RADIUS || dist < 0.1) {
      return { x: px, y: py };
    }

    const t = 1 - (dist / DISTORT_RADIUS);
    const force = t * t * t * DISTORT_STRENGTH;
    const angle = Math.atan2(dy, dx);
    return {
      x: px + Math.cos(angle) * force,
      y: py + Math.sin(angle) * force
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Deep obsidian void
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Dynamic cursor spotlight aura
    if (smoothX > -100 && smoothY > -100) {
      const cursorGlow = ctx.createRadialGradient(smoothX, smoothY, 10, smoothX, smoothY, 260);
      cursorGlow.addColorStop(0, 'rgba(245, 158, 11, 0.09)');
      cursorGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.025)');
      cursorGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);
    }

    // Grid coordinates
    const startX = -GRID_SIZE;
    const startY = -GRID_SIZE;
    const endX = width + GRID_SIZE * 2;
    const endY = height + GRID_SIZE * 2;

    const cols = Math.ceil((endX - startX) / GRID_SIZE) + 1;
    const rows = Math.ceil((endY - startY) / GRID_SIZE) + 1;

    const points = new Array(cols);
    for (let c = 0; c < cols; c++) {
      points[c] = new Array(rows);
      for (let r = 0; r < rows; r++) {
        const rawX = startX + c * GRID_SIZE;
        const rawY = startY + r * GRID_SIZE;
        points[c][r] = distort(rawX, rawY);
      }
    }

    // Horizontal lines
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 0.75;
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const p = points[c][r];
        if (c === 0) ctx.moveTo(p.x, p.y);
        else {
          const prev = points[c - 1][r];
          ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
        }
      }
      if (cols > 1) {
        const last = points[cols - 1][r];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const p = points[c][r];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else {
          const prev = points[c][r - 1];
          ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
        }
      }
      if (rows > 1) {
        const last = points[c][rows - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    // Reactive amber intersection nodes
    ctx.fillStyle = DOT_COLOR;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const p = points[c][r];
        const rawX = startX + c * GRID_SIZE;
        const rawY = startY + r * GRID_SIZE;
        const dx = rawX - smoothX;
        const dy = rawY - smoothY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DISTORT_RADIUS * 1.25) {
          const t = 1 - (dist / (DISTORT_RADIUS * 1.25));
          const radius = DOT_RADIUS + t * 2.2;
          ctx.globalAlpha = 0.4 + t * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Render & update floating cyber embers
    embers.forEach(ember => {
      ember.y -= ember.speedY;
      ember.x += ember.speedX;

      if (ember.increasing) {
        ember.opacity += ember.fadeSpeed;
        if (ember.opacity >= 0.7) ember.increasing = false;
      } else {
        ember.opacity -= ember.fadeSpeed;
        if (ember.opacity <= 0.1) ember.increasing = true;
      }

      // Recycle embers when out of view
      if (ember.y < -10) {
        ember.y = height + 10;
        ember.x = Math.random() * width;
      }
      if (ember.x < -10) ember.x = width + 10;
      if (ember.x > width + 10) ember.x = -10;

      ctx.fillStyle = `rgba(245, 158, 11, ${ember.opacity})`;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top atmosphere radial warm gradient
    const gradient = ctx.createRadialGradient(width / 2, -60, 0, width / 2, -60, 950);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
    gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function animate() {
    if (!isVisible) {
      animId = requestAnimationFrame(animate);
      return;
    }

    smoothX += (mouseX - smoothX) * SMOOTH_FACTOR;
    smoothY += (mouseY - smoothY) * SMOOTH_FACTOR;

    draw();
    animId = requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }

  function onTouchEnd() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
