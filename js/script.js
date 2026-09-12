/**
 * HACKSETU 2.0 - Core Vanilla JavaScript (Obsidian Cyber-Gold Edition)
 * Zero dependencies: Real-time countdown lifecycle, accessible mobile drawer,
 * Lenis smooth momentum scroll, keyboard-accessible registration modal,
 * and tracks notification toast.
 * Strictly 0% Blue, 0% Purple, 0% Green.
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
            <div class="inline-flex items-center gap-2.5 bg-amber-500 text-black border border-amber-400 px-6 py-2.5 rounded-full font-display text-xl font-black tracking-wider shadow-lg shadow-amber-500/20">
              <span class="pulse-indicator pulse-indicator-white"></span>
              HACKSETU 2.0 IS LIVE
            </div>
            <p class="text-zinc-400 text-sm sm:text-base font-medium">36-Hour Non-Stop Hackathon is currently in progress at E-Block Seminar Hall, AUMP.</p>
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
            <div class="inline-flex items-center gap-2.5 bg-zinc-800 text-white border border-white/15 px-6 py-2.5 rounded-full font-display text-xl font-black tracking-wider">
              EVENT CONCLUDED
            </div>
            <p class="text-zinc-400 text-sm sm:text-base font-medium">Thank you to all 200 national teams and partners who made HackSetu 2.0 extraordinary.</p>
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

  function toggleMenu() {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    drawer.classList.toggle('active');
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close drawer on navigation link click
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
    });
  });

  // Close drawer on Outside click
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      menuBtn.focus();
    }
  });
}

/**
 * Sticky Header Scroll Shadow
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let isScrolled = false;
  const handleScroll = () => {
    const shouldScroll = window.scrollY > 15;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      if (isScrolled) {
        header.classList.add('shadow-2xl', 'border-white/10', 'bg-obsidian-950/95');
      } else {
        header.classList.remove('shadow-2xl');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Ultra-Smooth Momentum Scrolling powered by Lenis
 */
function initSmoothScroll() {
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 76;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  if (typeof window.Lenis !== 'undefined' && !prefersReducedMotion) {
    lenisInstance = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
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
            duration: 1.15
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
 */
function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery && motionQuery.matches) {
    return;
  }

  const phrases = ['INNOVATION', 'TECHNOLOGY', 'IDEAS', 'IMPACT'];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;

  const typingSpeed = 95;
  const deletingSpeed = 45;
  const pauseOnComplete = 2100;
  const pauseOnEmpty = 340;

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

      const variation = Math.floor(Math.random() * 36) - 18;
      setTimeout(typeTick, Math.max(60, typingSpeed + variation));
    }
  }

  setTimeout(typeTick, pauseOnComplete);
}

/**
 * Minimal Scroll Reveal via IntersectionObserver
 */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsObserver = 'IntersectionObserver' in window;

  if (prefersReducedMotion || !supportsObserver) {
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  document.documentElement.classList.add('js-reveal-enabled');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);

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
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight - 40) {
      el.style.setProperty('--reveal-delay', '0');
    }
    revealObserver.observe(el);
  });
}

/**
 * ACTIVE SECTION NAVIGATION
 */
function initActiveNav() {
  const targetSectionIds = ['highlights', 'tracks', 'about', 'prizes', 'venue', 'contact', 'register'];

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
        if (link.classList.contains('nav-link-custom')) {
          link.classList.remove('text-zinc-400');
          link.classList.add('text-white');
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.classList.contains('nav-link-custom')) {
          link.classList.add('text-zinc-400');
          link.classList.remove('text-white');
        }
      }
    });
  }

  function getFocalLine() {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 76;
    return headerHeight + 20;
  }

  function computeActiveSection() {
    if (isClickScrolling) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollY < 180) {
      setActive(null);
      return;
    }

    if (windowHeight + scrollY >= docHeight - 40) {
      setActive('register');
      return;
    }

    const focalLine = getFocalLine();

    // Nested check: #prizes inside #about
    const prizesEl = document.getElementById('prizes');
    if (prizesEl) {
      const pRect = prizesEl.getBoundingClientRect();
      if (pRect.top <= focalLine + 60 && pRect.bottom >= focalLine) {
        setActive('prizes');
        return;
      }
    }

    let bestMatch = null;
    let minDistance = Infinity;

    for (const item of trackedSections) {
      if (item.id === 'prizes') continue;

      const rect = item.element.getBoundingClientRect();
      if (rect.top <= focalLine && rect.bottom > focalLine) {
        bestMatch = item.id;
        break;
      }

      const dist = Math.abs(rect.top - focalLine);
      if (rect.top > focalLine && dist < 130 && dist < minDistance) {
        minDistance = dist;
        bestMatch = item.id;
      }
    }

    if (bestMatch) {
      setActive(bestMatch);
    }
  }

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

  window.addEventListener('scroll', () => {
    if (!isClickScrolling) {
      computeActiveSection();
    }
  }, { passive: true });

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

  computeActiveSection();
}

/**
 * Registration Audience Selection Modal (School vs College)
 */
function initRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  const panel = document.getElementById('registrationModalPanel');
  const backdrop = document.getElementById('registrationModalBackdrop');
  const closeBtn = document.getElementById('closeRegModalBtn');
  const triggers = document.querySelectorAll('.js-reg-modal-trigger');

  if (!modal || !panel) return;

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

    document.body.style.overflow = 'hidden';
    if (window.lenis && typeof window.lenis.stop === 'function') {
      window.lenis.stop();
    }

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

    document.body.style.overflow = '';
    if (window.lenis && typeof window.lenis.start === 'function') {
      window.lenis.start();
    }

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

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

  const optionLinks = modal.querySelectorAll('.reg-option-card');
  optionLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeModal, 200);
    });
  });
}

/**
 * Tracks & Problem Statement Navigation Handler
 */
const TRACKS_CONFIG = {
  url: null,
  message: 'Official Problem Statements will be released soon.',
};

function initTracksNav() {
  const tracksButtons = [
    document.getElementById('navTracksBtn'),
    document.getElementById('mobileTracksBtn')
  ].filter(Boolean);

  if (!tracksButtons.length) return;

  function showTracksNotice() {
    if (TRACKS_CONFIG.url) {
      window.open(TRACKS_CONFIG.url, '_blank', 'noopener,noreferrer');
      return;
    }

    let toast = document.getElementById('tracksNoticeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tracksNoticeToast';
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[120] bg-obsidian-900 text-white border border-amber-500/40 shadow-2xl shadow-black/80 rounded-2xl px-6 py-3.5 flex items-center gap-3 transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none max-w-[90vw] backdrop-blur-xl';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <span class="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">💡</span>
        <div>
          <div class="font-display font-extrabold text-sm text-white">TRACKS &amp; PROBLEM STATEMENTS</div>
          <p class="text-xs text-amber-400 font-medium">${TRACKS_CONFIG.message}</p>
        </div>
      `;
      document.body.appendChild(toast);
    }

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
