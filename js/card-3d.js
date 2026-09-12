/**
 * HackSetu 2.0 — Interactive 3D Card Tilt & Dynamic Specular Glare
 * 
 * Provides hardware-accelerated 3D perspective tilt and real-time
 * cursor-following specular amber lighting across cards.
 * Zero external libraries, smooth spring return, touch-safe.
 */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const MAX_TILT = 7; // Max tilt in degrees
  const PERSPECTIVE = 1000;

  function init3DCards() {
    const cards = document.querySelectorAll('.obsidian-card, .obsidian-card-active, .reg-option-card');

    cards.forEach(card => {
      // Create dynamic specular sheen overlay if not present
      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-10';
        glare.style.background = 'radial-gradient(circle 280px at 50% 50%, rgba(245, 158, 11, 0.18), transparent 75%)';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.style.transformStyle = 'preserve-3d';
        card.appendChild(glare);
      }

      let rafId = null;

      function onMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (x - centerX) / centerX;
        const tiltY = (y - centerY) / centerY;

        const rotX = -tiltY * MAX_TILT;
        const rotY = tiltX * MAX_TILT;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`;
          card.style.transition = 'transform 0.08s ease-out, border-color 0.2s ease, box-shadow 0.2s ease';

          // Update specular glare
          glare.style.opacity = '1';
          glare.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(245, 158, 11, 0.22), transparent 75%)`;
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
        glare.style.opacity = '0';
      }

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCards);
  } else {
    init3DCards();
  }
})();
