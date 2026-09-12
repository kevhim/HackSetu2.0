/**
 * HackSetu 2.0 — Interactive Obsidian Cyber-Grid Background
 * 
 * High-performance dark-mode technical grid rendered on full-screen canvas.
 * Zero blue, zero purple, zero green: Deep Obsidian (#08080A) with subtle
 * titanium line coordinates and reactive cyber-amber glow nodes.
 * 
 * Magnetic Cursor Warp: Grid lines smoothly distort around cursor
 * with cubic ease-out spring physics.
 * 
 * Performance: 60/120 FPS requestAnimationFrame, passive listeners,
 * full prefers-reduced-motion accessibility safeguard.
 */

(function () {
  'use strict';

  // Bail on reduced motion preference with sleek obsidian fallback
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

  // ─── Obsidian Cyber-Grid Config ───
  const GRID_SIZE = 48;                         // 48px technical grid cell
  const LINE_COLOR = 'rgba(255, 255, 255, 0.055)'; // Subtle monochrome titanium coordinates
  const DOT_COLOR = 'rgba(245, 158, 11, 0.45)';    // Cyber-amber glowing intersection nodes
  const DOT_RADIUS = 1.0;                      // Base dot size at intersections
  const DISTORT_RADIUS = 220;                  // Cursor influence radius in px
  const DISTORT_STRENGTH = 20;                 // Max pixel displacement at center
  const SMOOTH_FACTOR = 0.08;                  // Silky lerp speed for cursor tracking
  const BG_COLOR = '#08080A';                  // Deep obsidian void background

  // ─── State ───
  let width = 0;
  let height = 0;
  let dpr = 1;
  let mouseX = -9999;
  let mouseY = -9999;
  let smoothX = -9999;
  let smoothY = -9999;
  let animId = null;
  let isVisible = true;

  // ─── Resize ───
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ─── Distortion Function (Cubic Elastic Falloff) ───
  function distort(px, py) {
    const dx = px - smoothX;
    const dy = py - smoothY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > DISTORT_RADIUS || dist < 0.1) {
      return { x: px, y: py };
    }

    // Smooth cubic falloff: organic magnetic warp
    const t = 1 - (dist / DISTORT_RADIUS);
    const force = t * t * t * DISTORT_STRENGTH;

    const angle = Math.atan2(dy, dx);
    return {
      x: px + Math.cos(angle) * force,
      y: py + Math.sin(angle) * force
    };
  }

  // ─── Draw Frame ───
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Fill obsidian void
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Grid coordinates
    const startX = -GRID_SIZE;
    const startY = -GRID_SIZE;
    const endX = width + GRID_SIZE * 2;
    const endY = height + GRID_SIZE * 2;

    const cols = Math.ceil((endX - startX) / GRID_SIZE) + 1;
    const rows = Math.ceil((endY - startY) / GRID_SIZE) + 1;

    // Compute distorted grid points
    const points = new Array(cols);
    for (let c = 0; c < cols; c++) {
      points[c] = new Array(rows);
      for (let r = 0; r < rows; r++) {
        const rawX = startX + c * GRID_SIZE;
        const rawY = startY + r * GRID_SIZE;
        points[c][r] = distort(rawX, rawY);
      }
    }

    // Draw horizontal grid lines
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 0.75;

    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const p = points[c][r];
        if (c === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          const prev = points[c - 1][r];
          const midX = (prev.x + p.x) / 2;
          const midY = (prev.y + p.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
      }
      if (cols > 1) {
        const last = points[cols - 1][r];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const p = points[c][r];
        if (r === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          const prev = points[c][r - 1];
          const midX = (prev.x + p.x) / 2;
          const midY = (prev.y + p.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
      }
      if (rows > 1) {
        const last = points[c][rows - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    // Draw reactive cyber-amber intersection nodes near cursor
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
          const radius = DOT_RADIUS + t * 2.0; // Glowing nodes expand near cursor
          ctx.globalAlpha = 0.35 + t * 0.65;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Atmospheric warm amber radial glow at top-center
    const gradient = ctx.createRadialGradient(width / 2, -60, 0, width / 2, -60, 850);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
    gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.015)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // ─── Animation Loop ───
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

  // ─── Mouse Tracking ───
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

  // ─── Init ───
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
