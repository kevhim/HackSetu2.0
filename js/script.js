/**
 * HACKSETU 2.0 - Core Vanilla JavaScript (Light Mode Edition)
 * Zero dependencies: Real-time countdown lifecycle, accessible mobile drawer, scroll interactions
 */

function initHackSetu() {
  initTypewriter();
  initScrollReveal();
  initCountdownTimer();
  initMobileDrawer();
  initHeaderScroll();
  initSmoothScroll();
  initActiveNav();
  initRegistrationModal();
  initTracksNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHackSetu);
} else {
  initHackSetu();
}

/**
 * Real-Time Countdown Timer with Full Lifecycle State
 * Target: HackSetu 2.0 Opening Ceremony (November 2, 2026, 09:00:00 IST)
 * Event End: November 3, 2026, 17:00:00 IST
 */
function initCountdownTimer() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');
  const countdownGrid = document.getElementById('countdownGrid');
  const countdownWrapper = document.getElementById('countdownWrapper');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const eventStart = new Date('2026-11-02T09:00:00+05:30').getTime();
  const eventEnd = new Date('2026-11-03T17:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distanceToStart = eventStart - now;
    const distanceToEnd = eventEnd - now;

    // Case 1: Event is currently LIVE
    if (distanceToStart <= 0 && distanceToEnd > 0) {
      if (countdownGrid) {
        countdownGrid.innerHTML = `
          <div class="flex flex-col items-center gap-3 w-full py-4">
            <div class="inline-flex items-center gap-2.5 bg-gold-400 text-navy-900 border border-gold-500 px-5 py-2 rounded-full font-display text-xl font-extrabold tracking-wider">
              <span class="pulse-indicator pulse-indicator-gold"></span>
              HACKSETU 2.0 IS LIVE
            </div>
            <p class="text-ink-600 text-base">36-Hour Non-Stop Hackathon is currently in progress at E-Block Seminar Hall, AUMP.</p>
          </div>
        `;
      }
      return;
    }

    // Case 2: Event has concluded
    if (distanceToEnd <= 0) {
      if (countdownGrid) {
        countdownGrid.innerHTML = `
          <div class="flex flex-col items-center gap-3 w-full py-4">
            <div class="inline-flex items-center gap-2.5 bg-navy-100 text-navy-900 border border-navy-200 px-5 py-2 rounded-full font-display text-xl font-extrabold tracking-wider">
              EVENT CONCLUDED
            </div>
            <p class="text-ink-600 text-base">Thank you to all 200 national teams and partners who made HackSetu 2.0 extraordinary.</p>
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
 * Sticky Header shadow on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let isScrolled = false;
  const handleScroll = () => {
    const shouldScroll = window.scrollY > 12;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      if (isScrolled) {
        header.classList.add('shadow-lg');
      } else {
        header.classList.remove('shadow-lg');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Smooth scrolling powered by Lenis with sticky navbar offset compensation
 */
function initSmoothScroll() {
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 76;

  // Initialize Lenis smooth scroll if loaded and user hasn't requested reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  if (typeof window.Lenis !== 'undefined' && !prefersReducedMotion) {
    lenisInstance = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenisInstance;
  }

  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('js-reg-modal-trigger')) return;
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetElement, {
            offset: -headerHeight - 16,
            duration: 1.2
          });
        } else {
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 16;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
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

/**
 * ACTIVE SECTION NAVIGATION
 * Indicates which section of the page the visitor is currently viewing.
 * Uses IntersectionObserver, Vanilla JS, and the existing navigation structure.
 */
function initActiveNav() {
  const targetSectionIds = ['highlights', 'about', 'prizes', 'venue', 'register'];

  // Query valid elements currently present in the DOM
  const trackedSections = [];
  targetSectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      trackedSections.push({ id, element: el });
    }
  });

  if (!trackedSections.length) return;

  const desktopLinks = document.querySelectorAll('.nav-link-custom, .header-register-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer a[href="#register"]');
  const allNavLinks = [...desktopLinks, ...mobileLinks];

  let currentActiveId = null;
  let isClickScrolling = false;
  let clickScrollTimeout = null;

  function setActive(activeId) {
    if (activeId === currentActiveId) return;
    currentActiveId = activeId;

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === `#${activeId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        // Update desktop nav link colors
        if (link.classList.contains('nav-link-custom')) {
          link.classList.remove('text-white/70');
          link.classList.add('text-white');
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.classList.contains('nav-link-custom')) {
          link.classList.add('text-white/70');
          link.classList.remove('text-white');
        }
      }
    });
  }

  function getFocalLine() {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 76;
    return headerHeight + 20; // Reading focal line ~96px from viewport top
  }

  function computeActiveSection() {
    if (isClickScrolling) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Boundary 1: At top of page (Hero section), no section is active
    if (scrollY < 180) {
      setActive(null);
      return;
    }

    // Boundary 2: At or near bottom of page, activate Register section
    if (windowHeight + scrollY >= docHeight - 40) {
      setActive('register');
      return;
    }

    const focalLine = getFocalLine();

    // Nested section check: #prizes is located inside #about
    const prizesEl = document.getElementById('prizes');
    if (prizesEl) {
      const pRect = prizesEl.getBoundingClientRect();
      // If prizes card covers the focal reading line
      if (pRect.top <= focalLine + 60 && pRect.bottom >= focalLine) {
        setActive('prizes');
        return;
      }
    }

    // Determine which section currently encompasses or is closest to the focal line
    let bestMatch = null;
    let minDistance = Infinity;

    for (const item of trackedSections) {
      if (item.id === 'prizes') continue; // Handled specifically above

      const rect = item.element.getBoundingClientRect();

      // Section covers the focal line
      if (rect.top <= focalLine && rect.bottom > focalLine) {
        bestMatch = item.id;
        break;
      }

      // Section top is approaching focal line
      const dist = Math.abs(rect.top - focalLine);
      if (rect.top > focalLine && dist < 120 && dist < minDistance) {
        minDistance = dist;
        bestMatch = item.id;
      }
    }

    if (bestMatch) {
      setActive(bestMatch);
    }
  }

  // IntersectionObserver for reactive boundary detection
  const supportsObserver = 'IntersectionObserver' in window;
  if (supportsObserver) {
    const observerOptions = {
      root: null,
      rootMargin: '-76px 0px -40% 0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    };

    const sectionObserver = new IntersectionObserver(() => {
      if (!isClickScrolling) {
        computeActiveSection();
      }
    }, observerOptions);

    trackedSections.forEach(item => {
      sectionObserver.observe(item.element);
    });
  }

  // Passive scroll listener ensures zero latency during rapid scrolling or trackpad flicks
  window.addEventListener('scroll', () => {
    if (!isClickScrolling) {
      computeActiveSection();
    }
  }, { passive: true });

  // Smooth link click coordination
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  allAnchorLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (this.classList.contains('js-reg-modal-trigger')) return;
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.substring(1);

      if (targetSectionIds.includes(targetId)) {
        isClickScrolling = true;
        setActive(targetId);

        if (clickScrollTimeout) clearTimeout(clickScrollTimeout);
        clickScrollTimeout = setTimeout(() => {
          isClickScrolling = false;
          computeActiveSection();
        }, 850);
      }
    });
  });

  // Run initial state calculation
  computeActiveSection();
}

/**
 * =============================================================================
 * REGISTRATION CONFIGURATION
 * Official registration endpoints.
 * When dedicated registration portal URLs are provided, update the values below.
 * =============================================================================
 */
const AMITY_REGISTRATION_CONFIG = {
  // Registration destination for School Teams (Classes 9–12) - to be added later
  schoolUrl: '',
  // Registration destination for College Teams (UG / PG) - to be added later
  collegeUrl: '',
};

/**
 * Registration Selection Modal (School vs College)
 * Handles smooth opening/closing, focus management, ESC dismissal,
 * backdrop click, and body scroll lock.
 */
function initRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  const panel = document.getElementById('registrationModalPanel');
  const backdrop = document.getElementById('registrationModalBackdrop');
  const closeBtn = document.getElementById('closeRegModalBtn');
  const triggers = document.querySelectorAll('.js-reg-modal-trigger');
  const schoolOption = document.getElementById('schoolTeamOption');
  const collegeOption = document.getElementById('collegeTeamOption');

  if (!modal || !panel) return;

  // Initialize registration URLs from configuration if provided
  if (schoolOption && AMITY_REGISTRATION_CONFIG.schoolUrl) {
    schoolOption.href = AMITY_REGISTRATION_CONFIG.schoolUrl;
  }
  if (collegeOption && AMITY_REGISTRATION_CONFIG.collegeUrl) {
    collegeOption.href = AMITY_REGISTRATION_CONFIG.collegeUrl;
  }

  let lastActiveElement = null;

  function openModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    lastActiveElement = document.activeElement;

    // Close mobile drawer if open
    const drawer = document.getElementById('mobileDrawer');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (drawer && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    modal.setAttribute('aria-hidden', 'false');

    panel.classList.remove('scale-96');
    panel.classList.add('scale-100');

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    if (window.lenis && typeof window.lenis.stop === 'function') {
      window.lenis.stop();
    }

    // Accessible focus management: focus on the first option card
    const firstOption = modal.querySelector('.reg-option-card');
    if (firstOption) {
      setTimeout(() => firstOption.focus(), 60);
    }
  }

  function closeModal() {
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.setAttribute('aria-hidden', 'true');

    panel.classList.remove('scale-100');
    panel.classList.add('scale-96');

    // Restore background scrolling
    document.body.style.overflow = '';
    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }

    // Restore previous focus
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Attach click listener to all registration triggers
  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Keyboard accessibility: ESC key to dismiss, and Tab key focus trap
  window.addEventListener('keydown', (e) => {
    if (modal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      } else if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
  });

  // Option cards do nothing on click for now until official registration URLs are connected
  [schoolOption, collegeOption].forEach(option => {
    if (option) {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        // Simply do nothing for now
      });
    }
  });
}

/**
 * =============================================================================
 * TRACKS & PROBLEM STATEMENT CONFIGURATION
 * When the official Tracks and Problem Statement portal is released,
 * update this URL (e.g. 'https://tracks.hacksetu.in' or dedicated route).
 * If null or empty, clicking displays the release notification.
 * =============================================================================
 */
const TRACKS_CONFIG = {
  url: null, // Replace with live URL when PS is released
  message: 'Problem Statement will be released soon.',
};

/**
 * Tracks & Problem Statement Navigation Handler
 * Provides an extensible link destination that alerts users that
 * the official Problem Statement is releasing soon without navigating to broken routes.
 */
function initTracksNav() {
  const tracksButtons = [
    document.getElementById('navTracksBtn'),
    document.getElementById('mobileTracksBtn')
  ].filter(Boolean);

  if (!tracksButtons.length) return;

  function showTracksNotice() {
    // If a live tracks URL is configured, navigate to it
    if (TRACKS_CONFIG.url) {
      window.open(TRACKS_CONFIG.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Otherwise show friendly non-intrusive toast notification
    let toast = document.getElementById('tracksNoticeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tracksNoticeToast';
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-navy-950 text-white border-2 border-gold-400 shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-3 transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none max-w-[90vw]';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <span class="w-8 h-8 rounded-lg bg-gold-400 text-navy-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">💡</span>
        <div>
          <div class="font-display font-extrabold text-sm text-white">TRACKS &amp; PROBLEM STATEMENTS</div>
          <p class="text-xs text-gold-300 font-medium">${TRACKS_CONFIG.message}</p>
        </div>
      `;
      document.body.appendChild(toast);
    }

    // Display toast with smooth animation
    clearTimeout(toast._hideTimer);
    toast.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    toast._hideTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    }, 3200);
  }

  tracksButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If inside mobile drawer, close the drawer
      const drawer = document.getElementById('mobileDrawer');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (drawer && drawer.classList.contains('active')) {
        drawer.classList.remove('active');
        if (menuBtn) {
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
      showTracksNotice();
    });
  });
}


