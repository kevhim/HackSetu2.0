# HackSetu 2.0 — Project Handover & Architecture Guide

Welcome to the **HackSetu 2.0** repository. This document provides an easy-to-understand, comprehensive handover for developers, maintainers, and organizers. It details **what each file does**, **how features work under the hood**, and **how to configure or update the site**.

---

## 1. Architecture & Tech Stack Summary

The project is intentionally built with a **zero-build static web stack**. There are no heavy compilation steps, no `node_modules` requirements, and no complex framework overhead.

| Technology | Purpose | Implementation |
| :--- | :--- | :--- |
| **HTML5** | Semantic structure & accessibility | [`index.html`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/index.html) |
| **Tailwind CSS** | Design system & utility styling | Loaded via Tailwind CDN with bespoke theme palette |
| **Vanilla CSS** | Complex keyframes, canvas overlays, marquee & scrollbar polish | [`css/custom.css`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/css/custom.css) |
| **Vanilla JavaScript** | Lifecycle countdown, modal, typewriter, drawer, scroll reveal | [`js/script.js`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/js/script.js) |
| **HTML5 Canvas** | High-performance interactive background grid with mouse distortion | [`js/grid.js`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/js/grid.js) |
| **Lenis** | Smooth luxury scrolling | CDN script integration |
| **Google Fonts** | Typography | *Space Grotesk*, *Plus Jakarta Sans*, *JetBrains Mono* |

---

## 2. Directory Structure & File-by-File Breakdown

```text
HackSetu2.0-main/
├── index.html              # Main single-page application landing page
├── css/
│   └── custom.css          # Custom animations, marquee, typewriter caret, and scrollbar styling
├── js/
│   ├── grid.js             # Canvas 2D interactive mouse-distortion background grid
│   └── script.js           # Core business logic: countdown, modal, navigation, typewriter
├── assets/
│   └── images/
│       ├── amity-logo.png  # Official Amity University Madhya Pradesh crest
│       ├── hacksetu-logo.png # Official HackSetu 2.0 emblem
│       └── acc-logo.png    # Amity Coding Club (ACC) official insignia
├── CHANGELOG.md            # Detailed history of all UI/UX revisions and features
├── HANDOVER.md             # This complete project handover document
├── README.md               # Quick overview, event summary, and running instructions
└── .gitignore              # Ignores OS/editor temporary files (.DS_Store, Thumbs.db, .vscode)
```

---

### File Details: What Does What?

#### 1. `index.html` (Main Landing Page)
The single entry point containing the full structural markup for the website:
- **Header & Navigation Bar**:
  - Tri-logo lockup: Amity University, HackSetu 2.0, and Amity Coding Club (ACC).
  - Navigation links (`#about`, `#schedule`, `#venue`, `Tracks`, `#contact`).
  - Primary `REGISTER NOW` CTA button.
  - Mobile hamburger button and responsive drawer.
- **Top Announcement Bar**:
  - Seamless continuous marquee ticker highlighting event dates and hosting club.
- **Hero Section**:
  - Host badge (`Amity University × Amity Coding Club`).
  - Large headline with typewriter keyword rotation (`INNOVATION`, `TECHNOLOGY`, `IDEAS`, `IMPACT`).
  - Key event highlight stats (36-Hour Hackathon, 200 Teams, ₹2L Rewards Pool, Teams of 4).
  - Real-time countdown timer display.
  - Quick action buttons (`REGISTER NOW`, `VIEW SCHEDULE`).
- **About Section (`#about`)**:
  - Detailed narrative of HackSetu ("Setu" bridge between ideas and industry).
  - *What's Coming* highlight teaser grid (Multiple Tracks, PS announcement notice, Mentors, Challenges).
  - Pipeline process banner (`IDEAS → PEOPLE → TECHNOLOGY → IMPACT`).
  - **Explore Gwalior** heritage & MP tourism showcase card (`https://www.mptourism.com/slow-travel-in-gwalior.html`).
  - **Amity University Madhya Pradesh** host campus showcase card (`https://www.amity.edu/gwalior/`).
- **Prizes & Registration Fee**:
  - ₹2,00,000 Total Prize pool hero showcase card with cash awards and cloud grants.
  - ₹1,200 PER TEAM transparent fee (Maximum 4 participants per team).
- **Venue & Travel Section (`#venue`)**:
  - Campus address (E-Block Seminar Hall, ASET, Amity Gwalior).
  - Goodies & Perks announcement card.
  - 4 essential facilities cards (High-Speed WiFi, Food & Snacks, Rest Areas, 24/7 Campus Security).
  - Transit and arrival logistics checklist (What to bring: Valid College ID / Aadhaar ID).
  - **How to Reach Gwalior**: By Flight (GWL Airport), By Train (Gwalior Junction), By Road (NH44/NH46).
  - **Coming From Across India?**: Multimodal interstate connectivity matrix (Delhi, Agra, Jhansi, Bhopal, Indore, Mumbai, Lucknow, Jaipur).
  - **From Gwalior to Venue**: Local terminal distances and interactive Google Maps link.
- **Queries & Contact Desk (`#contact`)**:
  - Dedicated cards with phone numbers and details for Student Coordinators and Faculty Coordinators.
- **Footer**:
  - Campus location, quick anchors, partner credits, and copyright.
- **Registration Selection Modal**:
  - Accessible pop-up modal prompting users to choose **School Team** (Classes 9–12) or **College / University Team** (UG/PG).

---

#### 2. `css/custom.css` (Styles & Keyframes)
Houses styles that are outside standard Tailwind utility classes:
- **Scrollbar Elimination**: Completely hides the default scrollbar on Firefox, Safari, Chrome, and Edge while retaining 100% natural scroll functionality.
- **Announcement Marquee Ticker**: CSS keyframe `ticker-slide` for continuous horizontal scrolling with hover pause.
- **Typewriter Caret**: Blinking gold vertical bar animation.
- **Live Pulse Indicators**: CSS ripple effect for the live status badge.
- **Scroll Reveal Utilities**: Base classes (`.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`) and transitions used by the JavaScript IntersectionObserver.
- **Modal Transitions**: Backdrop blur, zoom scale, and entrance opacity styles.

---

#### 3. `js/grid.js` (Canvas Interactive Background Grid)
Draws the animated coordinate grid across the entire browser viewport:
- **Canvas Rendering**: Renders a 48px coordinate grid with subtle intersecting dots.
- **Mouse Distortion Warp**: When the user moves their cursor, grid lines smoothly repel/bend away within a 200px radius using cubic falloff.
- **Fluid Lerping**: Smooths mouse coordinates frame-by-frame via `requestAnimationFrame` for stutter-free 60fps performance.
- **Accessibility Safeguard**: Automatically detects `prefers-reduced-motion` and falls back to a lightweight static CSS grid.

---

#### 4. `js/script.js` (Core Application Functionality)
Initializes all user interactions and logic:
- `initTypewriter()`: Types and backspaces rotating keywords with human-like typing cadence and blinking cursor.
- `initScrollReveal()`: Vanilla `IntersectionObserver` that progressively animates page sections into view as the user scrolls down (zero layout shift, zero scroll event listeners).
- `initCountdownTimer()`: Real-time countdown targeting **November 2, 2026, 09:00:00 IST**. Automatically handles 3 distinct states:
  1. *Countdown*: Shows remaining Days, Hours, Minutes, Seconds.
  2. *Live*: Replaces counter with "HACKSETU 2.0 IS LIVE" during the 36 hours.
  3. *Concluded*: Displays "EVENT CONCLUDED" once the event ends.
- `initMobileDrawer()`: Manages mobile navigation open/close states, backdrop dismiss, and ARIA attributes.
- `initHeaderScroll()`: Toggles sticky header shadow and backdrop blur once scrolled past 20px.
- `initSmoothScroll()`: Connects Lenis smooth scroll engine for editorial feel.
- `initActiveNav()`: Dynamically highlights the current active nav section based on viewport position.
- `initRegistrationModal()`: Controls opening and closing the School vs College category selection modal, including keyboard `Escape` dismissal and Tab focus trapping.
- `initTracksNav()`: Intercepts the "Tracks" button to display a non-intrusive toast notice informing participants that problem statements will release soon.

---

#### 5. `assets/images/` (Visual Brand Assets)
- `amity-logo.png`: Official Amity University Madhya Pradesh institutional crest.
- `hacksetu-logo.png`: Official HackSetu 2.0 emblem.
- `acc-logo.png`: Official Amity Coding Club emblem.

---

## 3. How to Update & Maintain Common Features

### A. Updating the Tracks / Problem Statements URL
When official tracks and problem statements are published:
1. Open [`js/script.js`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/js/script.js).
2. Locate `TRACKS_CONFIG` around line 681:
   ```javascript
   const TRACKS_CONFIG = {
     url: 'https://your-live-tracks-url.com', // Update this string
     message: 'Problem Statement will be released soon.',
   };
   ```
3. Once `url` is non-null, clicking "TRACKS" in the navbar immediately redirects participants to that page.

---

### B. Connecting Official Registration Links (School & College)
When the registration Google Forms / portal links go live:
1. Open [`index.html`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/index.html).
2. Find `#schoolTeamOption` and `#collegeTeamOption` (around lines 1114 & 1139).
3. Update `href="javascript:void(0)"` to your destination URLs, for example:
   ```html
   <!-- School Registration -->
   <a href="https://forms.gle/school-form-link" target="_blank" rel="noopener" id="schoolTeamOption" ...>

   <!-- College Registration -->
   <a href="https://forms.gle/college-form-link" target="_blank" rel="noopener" id="collegeTeamOption" ...>
   ```
4. In [`js/script.js`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/js/script.js) (lines 662–670), remove the placeholder `e.preventDefault()`.

---

### C. Updating Event Dates or Countdown Clock
To change the event launch date/time:
1. Open [`js/script.js`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/js/script.js).
2. Update the timestamps in `initCountdownTimer`:
   ```javascript
   const eventStart = new Date('2026-11-02T09:00:00+05:30').getTime();
   const eventEnd   = new Date('2026-11-03T17:00:00+05:30').getTime();
   ```
3. Update corresponding dates in [`index.html`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/index.html) text elements.

---

### D. Updating Coordinator Phone Numbers / Contacts
1. Open [`index.html`](file:///c:/Users/kamth/Downloads/HackSetu2.0-main/HackSetu2.0-main/index.html).
2. Search for `#contact` or coordinator names:
   - **Jaideep Kamthan**: `+91 80855 62034`
   - **Yash Sharma**: `+91 95898 85077`
   - **Dr. Samta Jain Goyal** & **Dr. Nistha Parashar**
3. Update the phone numbers and `tel:` links as needed.

---

## 4. Local Development & Deployment

### Running Locally
No installation or package manager required. Run any static server from the project directory:

```bash
# Option 1: Python 3
python -m http.server 3000

# Option 2: Node.js npx
npx serve .

# Option 3: VS Code Live Server extension
# Right click index.html -> "Open with Live Server"
```
Visit `http://localhost:3000/` in any modern browser.

### Deploying to Production
Because the repository consists of pure static files, it can be deployed in seconds to:
- **GitHub Pages**: Go to Repo Settings > Pages > Deploy from branch `main` / root.
- **Vercel**: Import repository; no build command needed (Output directory: `.`).
- **Netlify**: Drag & drop or connect repo (Publish directory: `.`).
- **Cloudflare Pages**: Connect repo (Build command: empty, Output directory: `/`).

---

## 5. Contact & Support

For queries regarding code architecture or event management:
- **Organized by**: Amity Coding Club (ACC), ASET
- **Host Institution**: Amity University Madhya Pradesh, Gwalior
- **GitHub Repository**: [https://github.com/kevhim/HackSetu2.0.git](https://github.com/kevhim/HackSetu2.0.git)
