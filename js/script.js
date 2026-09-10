/**
 * HACKSETU 2.0 - Core Vanilla JavaScript
 * Zero dependencies: Real-time countdown lifecycle, accessible mobile drawer, scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollReveal();
  initCountdownTimer();
  initMobileDrawer();
  initHeaderScroll();
  initSmoothScroll();
});

/**
 * Real-Time Countdown Timer with Full Lifecycle State
 * Target: HackSetu 2.0 Opening Ceremony (October 22, 2026, 09:00:00 IST)
 * Event End: October 24, 2026, 17:00:00 IST
 */
function initCountdownTimer() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');
  const countdownGrid = document.getElementById('countdownGrid');
  const headerTitle = document.getElementById('countdownHeaderTitle');
  const countdownWrapper = document.getElementById('countdownWrapper');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const eventStart = new Date('2026-10-22T09:00:00+05:30').getTime();
  const eventEnd = new Date('2026-10-24T17:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distanceToStart = eventStart - now;
    const distanceToEnd = eventEnd - now;

    // Case 1: Event is currently LIVE (Between start and end)
    if (distanceToStart <= 0 && distanceToEnd > 0) {
      if (headerTitle) headerTitle.textContent = 'EVENT STATUS';
      if (countdownGrid) {
        countdownGrid.innerHTML = `
          <div class="event-live-banner" style="grid-column: 1 / -1;">
            <div class="live-badge-glow">
              <span class="pulse-indicator"></span>
              HACKSETU 2.0 IS LIVE
            </div>
            <p class="event-live-text">48-Hour Non-Stop Hackathon is currently in progress at E-Block Seminar Hall, AUMP.</p>
          </div>
        `;
      }
      return;
    }

    // Case 2: Event has concluded
    if (distanceToEnd <= 0) {
      if (headerTitle) headerTitle.textContent = 'HACKSETU 2.0 CONCLUDED';
      if (countdownGrid) {
        countdownGrid.innerHTML = `
          <div class="event-live-banner" style="grid-column: 1 / -1;">
            <div class="live-badge-glow" style="background: rgba(59, 130, 246, 0.2); color: var(--blue-400); border-color: var(--blue-400);">
              EVENT CONCLUDED
            </div>
            <p class="event-live-text">Thank you to all 75 national teams and partners who made HackSetu 2.0 extraordinary.</p>
          </div>
        `;
      }
      return;
    }

    // Case 3: Standard active countdown
    const days = Math.floor(distanceToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distanceToStart % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distanceToStart % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Accessible Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.getElementById('mobileDrawer');

  if (!menuBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close when clicking any nav link in drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
      menuBtn.focus();
    }
  });
}

/**
 * Sticky Header elevation shadow on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let isScrolled = false;
  const handleScroll = () => {
    const shouldScroll = window.scrollY > 12;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      header.classList.toggle('scrolled', isScrolled);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Smooth scrolling with sticky navbar offset compensation
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 76;

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Restrained Typewriter Effect for Hero Emphasized Phrase
 * Rotates through key theme phrases: INNOVATION, TECHNOLOGY, IDEAS, IMPACT
 * Respects prefers-reduced-motion, maintains static fallback for SEO / no-JS
 * Natural typing cadence, pause before deleting, zero layout shifting
 */
function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  // Respect prefers-reduced-motion: leave static pre-rendered text untouched
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery && motionQuery.matches) {
    return;
  }

  const phrases = ['INNOVATION', 'TECHNOLOGY', 'IDEAS', 'IMPACT'];
  let phraseIndex = 0;
  let charIndex = phrases[0].length; // start with already rendered 'INNOVATION'
  let isDeleting = true;

  const typingSpeed = 100; // ms base typing speed
  const deletingSpeed = 48; // ms deleting speed
  const pauseOnComplete = 2000; // ms pause when phrase is completed
  const pauseOnEmpty = 360; // ms pause before typing next phrase

  function typeTick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      textEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeTick, pauseOnEmpty);
        return;
      }

      setTimeout(typeTick, deletingSpeed);
    } else {
      charIndex++;
      textEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeTick, pauseOnComplete);
        return;
      }

      // Subtle natural variation (±20ms) for human-like typing cadence
      const variation = Math.floor(Math.random() * 41) - 20;
      setTimeout(typeTick, Math.max(65, typingSpeed + variation));
    }
  }

  // Allow reader to read the initial pre-rendered phrase first before rotation starts
  setTimeout(typeTick, pauseOnComplete);
}

/**
 * Minimal Scroll Reveal via IntersectionObserver
 * Subtly reveals major section cards, headings, and groups upon scrolling into view
 * Opacity (0 -> 1), slight vertical translation (18px -> 0), subtle blur reduction (3px -> 0)
 * Respects prefers-reduced-motion, provides immediate fallback if JS or observer is unavailable
 */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsObserver = 'IntersectionObserver' in window;

  // If reduced motion is enabled or IntersectionObserver is not supported, leave content visible without animation
  if (prefersReducedMotion || !supportsObserver) {
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Safely activate reveal CSS now that JS and observer support are confirmed
  document.documentElement.classList.add('js-reveal-enabled');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -48px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);

        // After entrance transition finishes, clean up will-change property
        entry.target.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') {
            entry.target.style.willChange = 'auto';
          }
        }, { once: true });
      }
    });
  }, observerOptions);

  const viewportHeight = window.innerHeight;
  revealElements.forEach(el => {
    // If element is already in or above initial viewport fold, reveal immediately without stagger delay
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight - 48) {
      el.style.setProperty('--reveal-delay', '0');
    }
    revealObserver.observe(el);
  });
}

