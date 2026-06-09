# Profile Preview Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the desktop `/profile` whiteboard so its composition, avatar treatment, sticky-note sizing, and side-band language align with `profile-preview.html` while preserving the existing cover-entry flow, data-driven content, drag behavior, and mobile readability.

**Architecture:** Keep `ProfilePage` as the cover/board switch, but replace the desktop board internals with a new `profile-board-shell -> profile-whiteboard -> profile-side-bands` hierarchy. Shift note placement from collision-based slots to explicit preset layout data resolved by `profileLayout.js`, keep `ProfileIdentityCard` and `ProfileStickyNote` as focused renderers, and drive visual verification through Vitest plus Browser comparison against the preview reference.

**Tech Stack:** Vite, React 19, GSAP, React Router, Vitest, plain CSS.

---

### Task 1: Lock the new whiteboard contract in tests

**Files:**
- Modify: `src/components/profile-sticky-board.test.jsx`
- Modify: `src/utils/profileLayout.test.js`

- [ ] **Step 1: Rewrite Profile data expectations for the new asset path and board structure**

Expect `profile.avatarSrc` to point at the real discovered asset path `/assets/Avatar.jpg`, assert the board renders `.profile-board-shell`, `.profile-whiteboard`, `.profile-board-title`, `.profile-side-bands`, and keep the DOM order assertion for the five notes.

- [ ] **Step 2: Add structure assertions for the identity card and side bands**

Check that the identity card still renders both pills, the avatar container exists, the title renders two line spans from `displayNameLines`, and the side-band labels render `HOME / PROFILE / PORTFOLIO / BLOG`.

- [ ] **Step 3: Replace the layout algorithm assertions with preset-based assertions**

Update `src/utils/profileLayout.test.js` to assert each note id resolves to stable `left`, `top`, `width`, `minHeight`, `rotate`, and `background` values that match the spec table instead of overlap-free slot rectangles.

- [ ] **Step 4: Run the focused tests to verify RED**

Run: `npm test -- src/components/profile-sticky-board.test.jsx src/utils/profileLayout.test.js`

Expected: failures caused by missing whiteboard/side-band markup, old avatar path, and old layout output.

### Task 2: Rebuild the Profile whiteboard around the approved spec

**Files:**
- Modify: `src/components/ProfilePage.jsx`
- Modify: `src/components/ProfileIdentityCard.jsx`
- Create: `src/components/ProfileSideBands.jsx`
- Modify: `src/components/ProfileStickyNote.jsx`
- Modify: `src/data/profile.js`
- Modify: `src/utils/profileLayout.js`

- [ ] **Step 1: Move the board hierarchy to the new whiteboard shell**

Refactor `ProfilePage` to render:
`profile-board-shell`, `profile-whiteboard`, `profile-board-title`, `profile-board-hint`, `ProfileIdentityCard`, `profile-note-field`, `profile-board-footer`, and `ProfileSideBands`, while keeping the cover-stage behavior intact.

- [ ] **Step 2: Point profile data at the real avatar file and add explicit desktop layout presets**

Update `profile.avatarSrc` to `/assets/Avatar.jpg`, keep `displayNameLines`, and attach a desktop preset object per note so the board no longer depends on `preferredSlot` collision placement.

- [ ] **Step 3: Refactor the layout utility to expose the preset style contract**

Make `resolveProfileNoteLayout` return the explicit desktop style variables consumed by `ProfileStickyNote`, including `--note-left`, `--note-top`, `--note-width`, `--note-min-height`, `--note-rotate`, and `--note-color`.

- [ ] **Step 4: Update the note and identity renderers to match the new markup**

Render the identity title from `displayNameLines`, keep the `1 / 1` avatar frame and image fallback, and let `ProfileStickyNote` read background/rotation directly from the resolved preset instead of mixing old slot variables with note-level defaults.

- [ ] **Step 5: Run the focused tests to verify GREEN**

Run: `npm test -- src/components/profile-sticky-board.test.jsx src/utils/profileLayout.test.js`

Expected: both files pass with the new DOM contract and preset layout output.

### Task 3: Restyle desktop and mobile Profile behavior to the preview-aligned composition

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/AppShell.jsx` (only if needed to prevent desktop sidebar conflict)

- [ ] **Step 1: Replace the desktop grid board with the whiteboard composition**

Add styles for `profile-board-shell`, `profile-whiteboard`, `profile-board-title`, `profile-board-hint`, `profile-side-bands`, the cyan identity card, absolute-positioned notes, and an in-board footer chip row.

- [ ] **Step 2: Preserve mobile flow while scoping the preview alignment to desktop**

Keep the existing `max-width: 980px` stacked flow, hide the internal side bands on narrow screens, keep the avatar square, and ensure the footer returns to normal document flow on mobile.

- [ ] **Step 3: Resolve desktop navigation overlap only if it still conflicts**

If the global sidebar visually collides with the internal side bands, hide or suppress the desktop shell sidebar on the Profile route while keeping the mobile menu intact.

- [ ] **Step 4: Run the full test suite and build**

Run: `npm test`
Run: `npm run build`

Expected: all tests pass and Vite build exits with code 0.

### Task 4: Browser acceptance against the preview reference

**Files:**
- No source edits required unless visual issues are discovered

- [ ] **Step 1: Start the local dev server**

Run: `npm run dev`

- [ ] **Step 2: Compare preview reference and real Profile page in Browser**

Open `http://localhost:5173/profile-preview.html` and `http://localhost:5173/profile` in Browser, trigger the wheel transition into the board, and compare the 1440x900 composition: whiteboard frame, cyan identity card, square avatar, note widths, side-band typography, and in-board footer chips.

- [ ] **Step 3: Check large and narrow viewports**

Verify `1920x1080` keeps notes readable and centered inside the board, and `390x844` introduces no new overlap or blocked interactions.

- [ ] **Step 4: Record doc updates if implementation changes shipped behavior**

If the new whiteboard supersedes the old layout algorithm, update `docs/TODO.md` and `docs/modules/Profile/profile-sticky-board.md` to reflect the new desktop architecture and Avatar asset location.
