# Home Shell and Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Spec 01: the Phase 1 Roxy Blog Home shell, FEED-style sidebar navigation, role switching stage, placeholder pages, and BGM player.

**Architecture:** Create a Vite + React app with React Router for four page states, local data modules for pages and characters, pure helper functions for gesture/navigation behavior, and component-scoped GSAP animations through `useGSAP`. Keep the visual system in plain CSS so the Bauhaus palette and responsive accordion behavior remain easy to inspect.

**Tech Stack:** Vite, React, React Router, GSAP, `@gsap/react`, Vitest, plain CSS.

---

## File Structure

- Create `package.json`, `index.html`, `vite.config.js`: Vite app, scripts, React plugin, Vitest jsdom config.
- Create `src/main.jsx`, `src/App.jsx`, `src/styles.css`: app entry, shell composition, global visual system.
- Create `src/data/site.js`: `pages` and `characters` source of truth.
- Create `src/utils/navigation.js`: pure helpers for cyclic character stepping and page lookup.
- Create `src/utils/navigation.test.js`: TDD coverage for wheel direction, cyclic wrapping, and page lookup.
- Create `src/components/AppShell.jsx`: persistent layout, route state, overlay transition orchestration.
- Create `src/components/HomePage.jsx`: Home initial/active states and wheel gesture entry point.
- Create `src/components/CharacterStage.jsx`: character image/title stage animation.
- Create `src/components/SidebarAccordion.jsx`: right-side Bauhaus vertical navigation.
- Create `src/components/PageTransitionOverlay.jsx`: GSAP four-band expand/retract transition cloned from the right accordion as one flex track to avoid inter-column gaps.
- Create `src/components/MarqueeBar.jsx`: bottom continuous text.
- Create `src/components/BgmPlayer.jsx`: user-triggered play/pause placeholder player.
- Create `src/components/PlaceholderPage.jsx`: Profile/Portfolio/Blog placeholder content.
- Create `docs/modules/home-shell-and-navigation.md`: module doc using the repo template shape.
- Modify `docs/TODO.md`: mark Spec 01 implementation status after verification.

## Task 1: Initialize Project and Dependencies

- [ ] Create the Vite React app files manually to preserve the existing docs and assets.
- [ ] Add dependencies: `@vitejs/plugin-react`, `vite`, `react`, `react-dom`, `react-router`, `gsap`, `@gsap/react`, `vitest`, `jsdom`.
- [ ] Add scripts: `dev`, `build`, `preview`, `test`.
- [ ] Run `npm install`.

## Task 2: Lock Navigation Behavior with Tests

- [ ] Write failing Vitest tests in `src/utils/navigation.test.js` for:
  - scrolling down advances one character;
  - scrolling up moves one character back;
  - indices wrap from last to first on downward wheel gestures;
  - indices wrap from first to last on upward wheel gestures;
  - route/page lookup falls back to Home.
- [ ] Run the specific test command and confirm RED.
- [ ] Implement `getNextCharacterIndex`, `getPageByPath`, and `getPageById` in `src/utils/navigation.js`.
- [ ] Re-run the test command and confirm GREEN.

## Task 3: Build App Data and Routing Shell

- [ ] Create `src/data/site.js` with the four fixed pages and two initial characters.
- [ ] Build `src/main.jsx` with `BrowserRouter`.
- [ ] Build `src/App.jsx` with declarative `Routes`.
- [ ] Build `AppShell` so sidebar, BGM player, and transition overlay persist on every route.

## Task 4: Build Home and Character Stage

- [ ] Implement Home initial state with large title, supporting copy, and no visible character.
- [ ] Add wheel handling with an animation lock: one wheel event moves one cyclic character index.
- [ ] Reveal stage only after the first valid wheel gesture.
- [ ] Use GSAP for title movement and character entrance, with reduced-motion fallback.

## Task 5: Build Sidebar Transition and Placeholder Pages

- [ ] Implement four right-side full-height color bands in fixed order: Home, Profile, Portfolio, Blog.
- [ ] Implement active state from current route as stable text-only highlighting; do not float, shadow, move, filter, mask, or underline the full band.
- [ ] On click, slide the four real sidebar label nodes downward out of the viewport in order without opacity fading. Only after every label exits, expand one label-free cloned flex track from the right rail into equal full-screen columns, navigate after expansion, then shrink back to the rail before returning the original labels in reverse order. The four columns must stay adjacent throughout expansion, with no exposed background gaps.
- [ ] Implement placeholder page entrance animation and Phase 1 copy.

## Task 6: Build Marquee and BGM Player

- [ ] Implement bottom seamless marquee with the Spec 01 tone.
- [ ] Implement fixed BGM player with play/pause state that only changes after user action.
- [ ] Position the player above the marquee on Home and in the lower-left corner elsewhere.

## Task 7: Styling and Responsive Pass

- [ ] Implement the black/cream/red/yellow/blue visual system from `docs/brief.md`.
- [ ] Keep the Home first viewport poster-like and ensure the sidebar remains the main navigation.
- [ ] Add narrow-screen accordion degradation: thinner right rail, smaller rotated labels, protected content inset.
- [ ] Check text does not overlap with BGM, marquee, sidebar, or character images.

## Task 8: Docs and Verification

- [ ] Update `docs/modules/home-shell-and-navigation.md` with current implementation facts.
- [ ] Update `docs/TODO.md` to reflect Spec 01 completion state and remaining Phase 1 follow-ups.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Start the dev server and verify in browser:
  - Home loads with no character initially;
  - a wheel gesture reveals exactly one character;
  - repeated wheel during animation does not skip multiple characters;
  - sidebar bands navigate with visible overlay transition;
  - placeholder pages, BGM player, and marquee are visible without incoherent overlap;
  - desktop and narrow viewport layouts are nonblank and usable.
