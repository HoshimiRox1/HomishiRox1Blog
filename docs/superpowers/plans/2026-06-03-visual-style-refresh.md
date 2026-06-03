# Visual Style Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Phase 1 to match `docs/superpowers/specs/2026-06-03-visual-style-refresh-design.md` and `visual-style-hybrid-mockup.html` by changing palette, copy, and text styling only. Keep the current motion system intact.

**Architecture:** Treat `src/data/site.js` as the source of truth for page metadata, palette values, and sidebar hover inks. Use `src/styles.css` for the shared visual system and responsive polish, while leaving the GSAP timelines, wheel-lock logic, transition choreography, and route structure unchanged. The only component-level changes should be text/copy wiring and color reads that let the new style tokens flow through the existing shell.

**Tech Stack:** Vite, React, React Router, GSAP, `@gsap/react`, plain CSS.

**Hard Constraints:** No changes to wheel interaction behavior, `lockRef`, `getNextCharacterIndex`, overlay sequencing, GSAP durations/easing, or route paths. No new dependencies. No redesign of the animation flow itself.

---

## File Structure

- Modify `src/data/site.js`: new page palette, hover inks, page descriptions, and section labels.
- Modify `src/components/HomePage.jsx`: refresh the home kicker and supporting copy only.
- Modify `src/components/SidebarAccordion.jsx`: read per-page hover ink data instead of using the current Home special-case literal.
- Modify `src/components/BgmPlayer.jsx`: refresh button and status text only.
- Modify `src/styles.css`: all shared colors, borders, surface treatments, typography tone, and responsive styling.
- Modify `docs/TODO.md`: mark the visual refresh slice complete after verification.
- Modify `docs/modules/home-shell-and-navigation.md`: record the refreshed style facts after the visual pass.
- Reference only: `visual-style-hybrid-mockup.html`.

## Task 1: Freeze the Motion Boundary and Map Style Entry Points

**Files:**
- Inspect: `src/components/HomePage.jsx`
- Inspect: `src/components/SidebarAccordion.jsx`
- Inspect: `src/components/PageTransitionOverlay.jsx`
- Inspect: `src/components/CharacterStage.jsx`
- Inspect: `src/data/site.js`
- Inspect: `src/styles.css`

- [ ] **Step 1: Confirm which files are motion-bearing and must stay behaviorally unchanged**

Run:

```powershell
rg -n "gsap|wheel|lockRef|setTimeout|transition|yPercent|duration|ease" src/components src/utils
```

Expected: the output points to the existing animation and wheel code paths only; no new motion behavior is introduced in this slice.

- [ ] **Step 2: Inventory every color and copy source that will change**

Run:

```powershell
rg -n "#[0-9A-Fa-f]{3,6}|ROXY BLOG|PERSONAL SITE|Play|Pause|PROFILE|PORTFOLIO|BLOG" src
```

Expected: a compact list of hardcoded palette literals and user-facing strings that can be swapped without touching animation logic.

- [ ] **Step 3: Freeze the implementation boundary in notes before editing**

Record that the only allowed edits are palette, text, and style-token plumbing. Explicitly exclude `PageTransitionOverlay` timelines, wheel lock timing, and route sequencing from this slice.

- [ ] **Step 4: Run the baseline checks before any change**

Run:

```powershell
npm test
```

Expected: current green baseline, so later regressions are easy to spot.

## Task 2: Introduce the New Palette and Page Metadata

**Files:**
- Modify: `src/data/site.js`
- Modify: `src/components/SidebarAccordion.jsx`

- [ ] **Step 1: Replace the page palette with the new mockup-friendly set**

Use the refreshed palette from the spec/mockup reference:

- Shell / ink: `#F7FBFF` / `#111111`
- Home: `#D8CCFF`
- Profile: `#B9F5FF`
- Portfolio: `#FFE7A6`
- Blog: `#C7F2D4`
- Action accent: `#FF7AA8`
- Soft status accent: `#D7FFF1`
- Home hover ink: `#6B4DFF`

Keep route ids, paths, and the sidebar order unchanged.

- [ ] **Step 2: Add explicit hover-ink values per page**

Make the sidebar hover text pull from data instead of relying on the current `page.id === "home"` special case. Use a darkened accent per band so the hover state still reads clearly against the pale surfaces.

- [ ] **Step 3: Refresh page copy to match the new tone**

Rewrite the page descriptions and blog section labels so they sound like a clean visual identity refresh, not a motion rewrite. Keep the semantic meaning of each page intact.

- [ ] **Step 4: Re-run the unit test suite**

Run:

```powershell
npm test
```

Expected: all existing navigation tests still pass, because ids, paths, and wheel behavior are untouched.

## Task 3: Restyle the Shell and Page Surfaces

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Shift the global shell from dark-heavy to clean pale surfaces**

Update the root, app shell, home, and placeholder backgrounds so the page reads like the mockup: cold white base, black structural borders, and soft pastel accents. Keep the existing layout geometry and responsive breakpoints.

- [ ] **Step 2: Restyle the core surfaces without changing motion hooks**

Retune the visual treatment of:

- `.home-kicker`
- `.home-title`
- `.home-copy`
- `.character-meta`
- `.marquee-bar`
- `.sidebar-band`
- `.bgm-player`
- `.placeholder-page`
- `.blog-sections`

Only touch color, border, radius, spacing, and type treatment here. Do not touch GSAP hooks or animation durations.

- [ ] **Step 3: Rework the narrow-screen colors and fallback menu styling**

Keep the current mobile menu behavior and reveal sequence, but adapt the colors and surfaces so the narrow-screen fallback still feels like the same palette rather than a separate theme.

- [ ] **Step 4: Validate the visual build**

Run:

```powershell
npm run build
```

Expected: Vite build exits 0 after the CSS refresh.

## Task 4: Polish Copy and Sync Docs

**Files:**
- Modify: `src/components/HomePage.jsx`
- Modify: `src/components/BgmPlayer.jsx`
- Modify: `docs/TODO.md`
- Modify: `docs/modules/home-shell-and-navigation.md`

- [ ] **Step 1: Refresh the visible copy in the few component-level text sources**

Update the Home kicker and support copy, plus the BGM button/status text, so the wording matches the fresher, cleaner stage direction from the mockup.

- [ ] **Step 2: Confirm the sidebar and placeholder text read consistently**

Check the labels and descriptions emitted from `src/data/site.js` so they all align with the new palette and tone.

- [ ] **Step 3: Sync the project docs after the visual pass**

Mark the style refresh slice in `docs/TODO.md` and capture the palette/copy facts in `docs/modules/home-shell-and-navigation.md`.

- [ ] **Step 4: Do a real browser verification pass**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Then inspect `http://127.0.0.1:5173/` on desktop and mobile widths. Confirm:

- the only visible changes are color, copy, and surface styling;
- the wheel still advances one character per gesture;
- the overlay transition still uses the existing choreography;
- the sidebar and mobile menu still navigate the same way;
- the marquee and BGM player still occupy the same structural roles without new overlap.
