# HACKSETU 2.0 — Code | Connect | Create A Better Tomorrow

> **A National-Level 36-Hour Hackathon** hosted at Amity University Madhya Pradesh, Gwalior.  
> Organized by **Amity Coding Club (ACC)**, ASET.

---

## Overview

HackSetu 2.0 is a national-level collegiate hackathon bringing together over 200 teams (~800 participants) from institutions across India for 36 hours of continuous building, architecture, mentorship, and deployment.

Rooted in the Sanskrit concept of *"Setu"* (Bridge), HackSetu bridges creative student minds with industry realities.

---

## Features & Highlights

- **Minimalist Glassmorphism UI**: High-contrast, clean frosted glass surfaces selectively applied across navigation and showcase cards.
- **Developer Portfolio Typewriter Hero**: Restrained typewriter effect rotating key themes (`INNOVATION`, `TECHNOLOGY`, `IDEAS`, `IMPACT`) with natural human-like cadence and blinking caret.
- **Subtle Technical Background**: Pure CSS-generated 48px coordinate grid with atmospheric depth radial glows and vertical dimming.
- **Minimal Scroll Reveal**: Editorial entrance animations powered by Vanilla `IntersectionObserver` with zero scroll listeners, gentle stagger, and zero cumulative layout shift (0 CLS).
- **Live Lifecycle Countdown**: Real-time event countdown dynamically transitioning into live event and post-concluded states.
- **Accessibility & Motion First**: Full support for `prefers-reduced-motion` and complete progressive enhancement (100% readable with zero JavaScript).
- **Responsive & Lightweight**: Pure HTML5, CSS3, and Vanilla JavaScript with zero external frameworks or library dependencies.

---

## Event Details

- **Eligibility**: Open to School Students (Classes 9–12) and College & University Students (UG/PG)
- **Team Size**: Maximum 4 participants per team
- **Fee**: ₹1,200 PER TEAM (includes food, midnight snacks, 24/7 campus access, accommodation, and event kits)
- **Prizes**: ₹2,00,000 (Total Prize Pool — Cash Awards, Track Rewards, Cloud Credits & Tool Grants)

---

## Project Structure

```text
├── index.html              # Main landing page
├── css/
│   └── style.css           # Design tokens, minimalist glass UI, typewriter, grid & animations
├── js/
│   └── script.js           # Vanilla JS: countdown, mobile drawer, scroll reveal & typewriter
└── assets/
    ├── images/
    │   ├── amity-logo.png  # Amity University Madhya Pradesh crest
    │   └── hacksetu-logo.png # Official HackSetu 2.0 emblem
    └── icons/
```

---

## Local Development

Run with any local HTTP server:

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js (npx serve)
npx serve .
```

Open `http://localhost:3000/` in your browser.

---

## License

Created by **Amity Coding Club (ACC)**. All rights reserved.