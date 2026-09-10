/**
 * HackSetu 2.0 — Interactive Distortion Grid Background
 * 
 * Draws a faint technical grid on a full-screen canvas.
 * When the cursor moves over it, grid lines smoothly bend/distort
 * away from the cursor like a magnetic field or fabric warp.
 * 
 * Performance: Uses requestAnimationFrame, respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Bail on reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Fall back to a simple static grid via CSS
    document.body.style.setProperty('--grid-bg', '1');
    const style = document.createElement('style');
    style.textContent = `
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
        background-color: #F4F8FE;
        background-image:
          linear-gradient(rgba(8, 20, 48, 0.09) 1px, transparent 1px),
          linear-gradient(90deg, rgba(8, 20, 48, 0.09) 1px, transparent 1px);
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
  const GRID_SIZE = 48;                    // Grid cell size in px
  const LINE_COLOR = 'rgba(8, 20, 48, 0.095)'; // Thin, dark-toned subtle navy grid lines
  const DOT_COLOR = 'rgba(8, 20, 48, 0.13)';   // Subtle intersection dots
  const DOT_RADIUS = 0.9;                 // Crisp thin dot size at intersections
  const DISTORT_RADIUS = 200;             // Cursor influence radius in px
  const DISTORT_STRENGTH = 18;            // Max pixel displacement at center
  const SMOOTH_FACTOR = 0.08;             // Lerp speed for cursor tracking (lower = smoother)
  const BG_COLOR = '#F4F8FE';             // Page background

  // ─── State ───
  let width = 0;
  let height = 0;
  let dpr = 1;
  let mouseX = -9999;   // Current mouse position (raw)
  let mouseY = -9999;
  let smoothX = -9999;  // Smoothed mouse position (lerped)
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

  // ─── Distortion function ───
  // Returns the displaced position of a grid point based on distance from cursor
  function distort(px, py) {
    const dx = px - smoothX;
    const dy = py - smoothY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > DISTORT_RADIUS || dist < 0.1) {
      return { x: px, y: py };
    }

    // Smooth falloff: cubic ease-out creates an organic, non-linear bulge
    const t = 1 - (dist / DISTORT_RADIUS);
    const force = t * t * t * DISTORT_STRENGTH;

    // Push points away from cursor
    const angle = Math.atan2(dy, dx);
    return {
      x: px + Math.cos(angle) * force,
      y: py + Math.sin(angle) * force
    };
  }

  // ─── Draw Frame ───
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Fill background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Calculate grid range (extend beyond viewport for edge coverage)
    const startX = -GRID_SIZE;
    const startY = -GRID_SIZE;
    const endX = width + GRID_SIZE * 2;
    const endY = height + GRID_SIZE * 2;

    const cols = Math.ceil((endX - startX) / GRID_SIZE) + 1;
    const rows = Math.ceil((endY - startY) / GRID_SIZE) + 1;

    // Pre-compute distorted grid points
    const points = new Array(cols);
    for (let c = 0; c < cols; c++) {
      points[c] = new Array(rows);
      for (let r = 0; r < rows; r++) {
        const rawX = startX + c * GRID_SIZE;
        const rawY = startY + r * GRID_SIZE;
        points[c][r] = distort(rawX, rawY);
      }
    }

    // Draw horizontal grid lines (smooth curves through distorted points)
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 0.65;

    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const p = points[c][r];
        if (c === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          // Quadratic curve through midpoints for smoother bending
          const prev = points[c - 1][r];
          const midX = (prev.x + p.x) / 2;
          const midY = (prev.y + p.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
      }
      // Final segment
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

    // Draw small dots at intersections (only near cursor for subtle emphasis)
    ctx.fillStyle = DOT_COLOR;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const p = points[c][r];
        const rawX = startX + c * GRID_SIZE;
        const rawY = startY + r * GRID_SIZE;
        const dx = rawX - smoothX;
        const dy = rawY - smoothY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DISTORT_RADIUS * 1.2) {
          const t = 1 - (dist / (DISTORT_RADIUS * 1.2));
          const radius = DOT_RADIUS + t * 1.5; // Dots grow near cursor
          ctx.globalAlpha = 0.3 + t * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Subtle top radial glow
    const gradient = ctx.createRadialGradient(width / 2, -50, 0, width / 2, -50, 900);
    gradient.addColorStop(0, 'rgba(15, 42, 92, 0.025)');
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

    // Smoothly lerp toward actual mouse position
    smoothX += (mouseX - smoothX) * SMOOTH_FACTOR;
    smoothY += (mouseY - smoothY) * SMOOTH_FACTOR;

    draw();
    animId = requestAnimationFrame(animate);
  }

  // ─── Mouse Tracking ───
  // The canvas has pointer-events:none, so we listen on document
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    // Smoothly drift cursor influence off-screen
    mouseX = -9999;
    mouseY = -9999;
  }

  // Touch support: track finger position
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

  // ─── Visibility API (pause when tab is hidden) ───
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
