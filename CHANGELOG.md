# HackSetu 2.0 — Comprehensive Changelog & Release Notes

This document provides a detailed overview of all design, content, architectural, and visual refinements implemented on the HackSetu 2.0 website.

---

## 1. Brand Identity & Co-Branded Lockups

- **Navbar Tri-Logo Lockup**:
  - Implemented an evenly aligned, balanced tri-logo arrangement inside clean white rounded pills:
    `[Amity University Logo] | [HackSetu 2.0 Logo] | [ACC Logo]`
  - Added subtle divider separators and hover micro-elevations.
- **Hero Host Institutional Pill**:
  - Refined into a clean, minimal presenter badge: `[Amity University Logo] × [ACC Logo]`.
  - Removed outdated text labels to emphasize high-impact official branding.
- **Amity Coding Club (ACC) Integration**:
  - Added ACC logo into navbar, hero, and footer with dedicated links to club channels.

---

## 2. Event Details & Verified Fact Reconciliation

- **Total Prize Pool**:
  - Standardized as **₹2,00,000 Total Rewards Pool**.
  - Replaced individual prize estimations with a verified highlight card featuring Cash Awards, Track Rewards, and Cloud Grants.
- **Team Capacity**:
  - Updated nationwide capacity to **200 Teams Only** (Team of 4 members, ~800 collegiate builders).
- **Registration Fee**:
  - Established clear breakdown: **₹1,200 per team** (**₹300 per member**).
  - Explicitly covers 36-hour event access, overnight campus accommodation, all meals, midnight snacks, continuous coffee, and hackathon kits.
- **Dates & Venue**:
  - **Dates**: November 2 – 3, 2026 (36 Hours Non-Stop).
  - **Venue**: E-Block Seminar Hall, ASET, Amity University Madhya Pradesh, Maharajpura Dang, Gwalior – 474005.

---

## 3. Section-by-Section Refinements

### A. About + Prize / Registration Section (`#about`)
- **Left "About HackSetu" Panel**:
  - Scaled heading *"A Bridge Between Ideas and Impact"* and optimized typography line-height.
  - Added **"What's Coming • HackSetu Highlights"** teaser grid featuring 4 compact cards:
    1. *Multiple Tracks* — Diverse problem statements across domains.
    2. *Tracks Loading Soon* — Official tracks announcing soon.
    3. *Mentors & Judges* — Industry experts coming soon.
    4. *Exciting Challenges* — Real-world problem solving.
  - Scaled bottom pipeline banner: `IDEAS → PEOPLE → TECHNOLOGY → IMPACT`.
- **Right Prize Pool Card**:
  - Scaled `TOTAL REWARDS` header and ₹2,00,000 hero figure.
  - Replaced all "bounty" terminology with `Track Rewards` and `TOTAL CASH & REWARDS POOL`.
- **Right Registration Card**:
  - Scaled ₹1,200 amount and supporting copy.
  - Enhanced `PROCEED TO REGISTER →` CTA button height and presence.

### B. Venue & Event Logistics Section (`#venue`)
- **Campus & Location Card**:
  - Rebalanced vertical empty space by adding a dedicated **"🎁 GOODIES & PERKS"** information block:
    *"Participant goodies, hackathon kits, swags and other event perks will be provided to registered teams."*
  - Consolidated dual buttons into a single primary yellow action: **`MORE INFORMATION →`**.
  - 4 facility cards (High-Speed WiFi, Food & Refreshments, Rest Zones, 24/7 Security) scaled and balanced.
- **Event Logistics Card**:
  - Visual height balanced with the left card.
  - Detailed arrival times (08:30 AM IST Gate 1), airport/station transit distances, packing checklist, and hostel accommodation notes.

### C. For Queries / Doubts Section (`#contact`)
- Added a dedicated communication desk with contact details:
  - **Student Coordinators**:
    - Jaideep Kamthan: `+91 80855 62034`
    - Yash Sharma: `+91 95898 85077`
  - **Faculty Coordinators**:
    - Dr. Samta Jain Goyal (ASET, Amity University)
    - Dr. Nistha Parashar (ASET, Amity University)

### D. Removal of "Bounty" Terminology
- Globally updated all phrasing from "bounty/bounties" to "rewards", "awards", or "prizes" across the Hero, Highlights, About, and documentation files.

---

## 4. UI / UX & Engineering Enhancements

- **Interactive Distortion Canvas Grid**:
  - Dynamic full-screen canvas grid with mouse-reactive wave distortion that smoothly ripples under the cursor.
  - Seamless background consistency across all sections.
  - Fallback support for users with `prefers-reduced-motion`.
- **Scrollbar Polish**:
  - Hidden native browser scrollbars cross-browser:
    - Firefox: `scrollbar-width: none`
    - IE / Legacy Edge: `-ms-overflow-style: none`
    - Chrome / Safari / Edge: `::-webkit-scrollbar { display: none }`
  - Zero disruption to scrolling: mouse-wheel, trackpad, touch swipe, and keyboard navigation remain 100% fluid and natural with Lenis smooth-scroll.
- **Active Navigation & Countdown Timer**:
  - Real-time countdown timer targeting November 2, 2026, 09:00 AM IST with state machine handling active and post-event states.
  - IntersectionObserver-driven active section indicator in the top navbar.
  - Accessible mobile drawer navigation with focus trapping and ARIA support.
