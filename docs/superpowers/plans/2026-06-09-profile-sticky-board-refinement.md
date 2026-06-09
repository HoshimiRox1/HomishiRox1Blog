# Profile Sticky Board Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the first Profile Sticky Board pass so notes do not overlap by default, sticky notes are hard rectangles, the identity card has balanced page spacing, the display name stays inside the card, pill colors are varied, and narrow/mobile layouts can scroll through all content.

**Architecture:** Add a deterministic note-layout utility between `src/data/profile.js` and `ProfilePage` instead of hand-maintaining fragile percentage coordinates in JSX/CSS. Keep visual token choices in data/CSS variables, keep drag state in `useDraggableNote`, and keep scroll behavior scoped to Profile route classes so Home/navigation behavior is not disturbed.

**Tech Stack:** Vite, React 19, React Router 7, GSAP, Vitest, plain CSS in `src/styles.css`.

---

## File Structure

- Create `src/utils/profileLayout.js`: pure deterministic layout helpers for desktop note placement and collision detection.
- Create `src/utils/profileLayout.test.js`: unit tests for non-overlap, deterministic output, and mobile fallback decisions.
- Modify `src/data/profile.js`: replace fragile `layout.x/y` percentages with layout metadata (`layoutKey`, `span`, `tone`, optional `preferredSlot`) and add per-pill color token data.
- Modify `src/components/ProfilePage.jsx`: call `resolveProfileNoteLayout(profile.notes)` before rendering notes.
- Modify `src/components/ProfileStickyNote.jsx`: receive resolved note layout and expose tone/tag CSS variables.
- Modify `src/components/ProfileIdentityCard.jsx`: add a title class/attributes only if needed for testable text constraints.
- Modify `src/components/profile-sticky-board.test.jsx`: add component tests for no overlapping notes, hard note corners, varied pill colors, mobile scroll classes, and display-name containment contract.
- Modify `src/styles.css`: apply the refined desktop/mobile layout, identity card height, title constraints, hard note rectangles, varied pill colors, and Profile route scroll behavior.
- Modify `docs/modules/Profile/profile-sticky-board.md`: document the layout algorithm and content-edit boundaries.

## Non-Goals

- Do not redesign the Profile page from scratch.
- Do not change `SidebarAccordion`, `PageTransitionOverlay`, or mobile menu behavior.
- Do not introduce a physics engine, collision simulation, masonry dependency, CSS framework, or new runtime package.
- Do not persist dragged note positions.

## Parallelization

These tasks can run in parallel if using subagents:

- Worker A: `src/utils/profileLayout.js` and `src/utils/profileLayout.test.js`.
- Worker B: `src/data/profile.js`, `ProfileStickyNote.jsx`, and pill color test updates.
- Main thread: `src/styles.css`, `ProfilePage.jsx`, browser verification, and docs.

Do not let two agents edit `src/styles.css` concurrently. The style file is the integration point.

---

### Task 1: Deterministic Non-Overlapping Note Layout

**Files:**
- Create: `src/utils/profileLayout.js`
- Create: `src/utils/profileLayout.test.js`
- Modify: `src/data/profile.js`
- Modify: `src/components/ProfilePage.jsx`
- Modify: `src/components/ProfileStickyNote.jsx`

- [ ] **Step 1: Write failing layout utility tests**

Create `src/utils/profileLayout.test.js`:

```js
import { describe, expect, it } from "vitest";
import {
  doRectsOverlap,
  resolveProfileNoteLayout,
} from "./profileLayout";

const notes = [
  { id: "identity", size: "large", preferredSlot: "top-left" },
  { id: "loadout", size: "medium", preferredSlot: "top-right" },
  { id: "taste", size: "medium", preferredSlot: "middle-left" },
  { id: "current-quest", size: "large", preferredSlot: "middle-right" },
  { id: "links", size: "small", preferredSlot: "bottom-center" },
];

describe("profile note layout", () => {
  it("places all notes without overlapping their default rectangles", () => {
    const layout = resolveProfileNoteLayout(notes);

    expect(layout).toHaveLength(notes.length);

    for (let leftIndex = 0; leftIndex < layout.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < layout.length; rightIndex += 1) {
        expect(
          doRectsOverlap(layout[leftIndex].rect, layout[rightIndex].rect),
        ).toBe(false);
      }
    }
  });

  it("is deterministic for the same note order and metadata", () => {
    expect(resolveProfileNoteLayout(notes)).toEqual(resolveProfileNoteLayout(notes));
  });

  it("keeps every note inside the desktop board coordinate system", () => {
    const layout = resolveProfileNoteLayout(notes);

    for (const item of layout) {
      expect(item.rect.x).toBeGreaterThanOrEqual(0);
      expect(item.rect.y).toBeGreaterThanOrEqual(0);
      expect(item.rect.x + item.rect.width).toBeLessThanOrEqual(100);
      expect(item.rect.y + item.rect.height).toBeLessThanOrEqual(100);
    }
  });
});
```

- [ ] **Step 2: Run the failing utility test**

Run: `npm test -- src/utils/profileLayout.test.js`

Expected: FAIL because `src/utils/profileLayout.js` does not exist.

- [ ] **Step 3: Implement deterministic layout helper**

Create `src/utils/profileLayout.js`:

```js
// Profile 贴纸布局使用确定性槽位，避免首屏默认重叠。
const NOTE_SIZE_RECTS = {
  large: { width: 36, height: 27 },
  medium: { width: 31, height: 24 },
  small: { width: 27, height: 20 },
};

const SLOT_CANDIDATES = {
  "top-left": [
    { x: 0, y: 0 },
    { x: 3, y: 30 },
    { x: 38, y: 0 },
  ],
  "top-right": [
    { x: 47, y: 3 },
    { x: 63, y: 29 },
    { x: 6, y: 31 },
  ],
  "middle-left": [
    { x: 7, y: 38 },
    { x: 0, y: 63 },
    { x: 36, y: 31 },
  ],
  "middle-right": [
    { x: 55, y: 39 },
    { x: 41, y: 66 },
    { x: 0, y: 37 },
  ],
  "bottom-center": [
    { x: 34, y: 75 },
    { x: 0, y: 74 },
    { x: 65, y: 72 },
  ],
};

const FALLBACK_CANDIDATES = [
  { x: 0, y: 0 },
  { x: 38, y: 0 },
  { x: 0, y: 31 },
  { x: 39, y: 31 },
  { x: 0, y: 63 },
  { x: 34, y: 73 },
  { x: 66, y: 5 },
  { x: 68, y: 46 },
];

// 判断两个百分比矩形是否相交。
export function doRectsOverlap(left, right) {
  return !(
    left.x + left.width <= right.x ||
    right.x + right.width <= left.x ||
    left.y + left.height <= right.y ||
    right.y + right.height <= left.y
  );
}

// 解析单张贴纸的尺寸。
export function getNoteRectSize(size) {
  return NOTE_SIZE_RECTS[size] ?? NOTE_SIZE_RECTS.medium;
}

// 给每张贴纸分配第一个不碰撞的候选位置。
export function resolveProfileNoteLayout(notes) {
  const placed = [];

  for (const note of notes) {
    const size = getNoteRectSize(note.size);
    const candidates = [
      ...(SLOT_CANDIDATES[note.preferredSlot] ?? []),
      ...FALLBACK_CANDIDATES,
    ];
    const candidate = candidates.find((item) => {
      const rect = { ...item, ...size };
      return !placed.some((placedItem) => doRectsOverlap(rect, placedItem.rect));
    }) ?? { x: 0, y: 0 };
    const rect = { ...candidate, ...size };

    placed.push({
      id: note.id,
      rect,
      style: {
        "--note-left": `${rect.x}%`,
        "--note-top": `${rect.y}%`,
        "--note-width": `${rect.width}%`,
      },
    });
  }

  return placed;
}
```

- [ ] **Step 4: Update note data metadata**

In `src/data/profile.js`, replace each `layout: { x, y, rotate }` with stable metadata:

```js
preferredSlot: "top-left",
rotate: -2,
tone: "profile",
```

Use these exact slot/tone values:

```js
// identity
preferredSlot: "top-left",
rotate: -2,
tone: "profile",

// loadout
preferredSlot: "top-right",
rotate: 2,
tone: "portfolio",

// taste
preferredSlot: "middle-left",
rotate: 1,
tone: "mint",

// current-quest
preferredSlot: "middle-right",
rotate: -1,
tone: "pink",

// links
preferredSlot: "bottom-center",
rotate: 2,
tone: "paper",
```

- [ ] **Step 5: Wire resolved layout into `ProfilePage`**

In `src/components/ProfilePage.jsx`, import:

```jsx
import { resolveProfileNoteLayout } from "../utils/profileLayout";
```

Inside `ProfilePage`, add:

```jsx
const resolvedNoteLayout = resolveProfileNoteLayout(profile.notes);
```

When rendering notes:

```jsx
const layout = resolvedNoteLayout.find((item) => item.id === note.id);

<ProfileStickyNote
  dragProps={getDragProps(note.id)}
  key={note.id}
  layout={layout}
  note={note}
/>
```

- [ ] **Step 6: Update `ProfileStickyNote` to use resolved layout**

Change the component signature:

```jsx
export default function ProfileStickyNote({ note, layout, dragProps = {} }) {
```

Replace the note position style with:

```jsx
style={{
  "--note-color": note.color,
  "--note-left": layout?.style["--note-left"],
  "--note-top": layout?.style["--note-top"],
  "--note-width": layout?.style["--note-width"],
  "--note-rotate": `${note.rotate}deg`,
  "--note-tone": note.tone,
  ...dragProps.style,
}}
```

- [ ] **Step 7: Run layout tests**

Run: `npm test -- src/utils/profileLayout.test.js`

Expected: PASS.

### Task 2: Component Tests for Visual Contracts

**Files:**
- Modify: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add tests for hard notes, varied tones, and scroll class contracts**

Append these tests inside `describe("Profile sticky board", () => { ... })`:

```jsx
it("renders sticky notes with resolved layout variables and tone hooks", () => {
  const { container, cleanup } = render(<ProfilePage />);
  const page = container.querySelector(".profile-page");

  act(() => {
    page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
  });

  const notes = Array.from(container.querySelectorAll(".profile-note"));
  const noteStyles = notes.map((note) => note.getAttribute("style") ?? "");

  expect(notes).toHaveLength(5);
  expect(noteStyles.every((style) => style.includes("--note-left"))).toBe(true);
  expect(noteStyles.every((style) => style.includes("--note-width"))).toBe(true);
  expect(new Set(noteStyles.map((style) => style.match(/--note-tone: ([^;]+)/)?.[1]))).toEqual(
    new Set(["profile", "portfolio", "mint", "pink", "paper"]),
  );

  cleanup();
});

it("marks the Profile route as the page that owns vertical scrolling", () => {
  const { container, cleanup } = render(<ProfilePage />);
  const page = container.querySelector(".profile-page");

  act(() => {
    page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
  });

  expect(container.querySelector(".profile-page--board")).not.toBeNull();
  expect(container.querySelector(".profile-board")).not.toBeNull();

  cleanup();
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: FAIL until Task 1 is wired.

- [ ] **Step 3: Run the component test again after Task 1**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

### Task 3: Hard Rectangle Sticky Notes and Varied Pill Colors

**Files:**
- Modify: `src/styles.css`
- Modify: `src/data/profile.js`
- Modify: `src/components/ProfileStickyNote.jsx`

- [ ] **Step 1: Split shared pill selector into semantic classes**

In `ProfileStickyNote.jsx`, change tag/link class names:

```jsx
<li
  className={`profile-pill profile-pill--${note.tone}`}
  key={tag}
>
  {tag}
</li>
```

For links:

```jsx
<a
  className={`profile-pill profile-pill--${note.tone}`}
  key={link.label}
  href={link.href}
>
  {link.label}
</a>
```

In `ProfileIdentityCard.jsx`, change meta spans:

```jsx
<span className="profile-pill profile-pill--profile">{profile.indexLabel}</span>
<span className="profile-pill profile-pill--paper">{profile.handle}</span>
```

In `ProfilePage.jsx`, footer tags:

```jsx
<span className="profile-pill profile-pill--ink" key={tag}>{tag}</span>
```

- [ ] **Step 2: Replace the global mint pill CSS**

In `src/styles.css`, remove this grouped background ownership:

```css
.profile-identity-card__meta span,
.profile-board-footer span,
.profile-note__tags li,
.profile-note__links a {
  background: var(--soft-accent);
  ...
}
```

Replace it with:

```css
.profile-pill {
  border: 3px solid var(--ink);
  border-radius: 999px;
  color: var(--ink);
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 950;
  line-height: 1;
  padding: 8px 10px;
  text-decoration: none;
  text-transform: uppercase;
}

.profile-pill--profile {
  background: var(--profile-band);
}

.profile-pill--portfolio {
  background: var(--portfolio-band);
}

.profile-pill--mint {
  background: var(--soft-accent);
}

.profile-pill--pink {
  background: #ffd6e8;
}

.profile-pill--paper {
  background: var(--shell-paper);
}

.profile-pill--ink {
  background: var(--ink);
  color: var(--shell-bg);
}
```

- [ ] **Step 3: Make sticky notes pure hard rectangles**

In `.profile-note`, change:

```css
border-radius: 0;
left: var(--note-left);
top: var(--note-top);
width: var(--note-width);
```

Remove `left: var(--note-x)`, `top: var(--note-y)`, and width clamps from the base desktop `.profile-note`.

- [ ] **Step 4: Run focused component tests**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

### Task 4: Identity Card Height and Display Name Constraints

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/ProfileIdentityCard.jsx`
- Modify: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add a test for display name line contract**

Append:

```jsx
it("keeps the identity display name split into constrained lines", () => {
  const { container, cleanup } = render(<ProfileIdentityCard profile={profile} />);
  const title = container.querySelector(".profile-identity-card__title");
  const lines = container.querySelectorAll(".profile-identity-card__title span");

  expect(title).not.toBeNull();
  expect(lines).toHaveLength(2);
  expect(lines[0].textContent).toBe("Hoshimi");
  expect(lines[1].textContent).toBe("Rox1");

  cleanup();
});
```

- [ ] **Step 2: Add title class to identity heading**

In `ProfileIdentityCard.jsx`:

```jsx
<h1 className="profile-identity-card__title">
```

- [ ] **Step 3: Replace identity card desktop sizing**

In `src/styles.css`, update `.profile-board`:

```css
.profile-board {
  --profile-card-edge: clamp(24px, 4vw, 48px);
  display: grid;
  gap: clamp(20px, 3vw, 34px);
  grid-template-columns: minmax(268px, 348px) minmax(420px, 1fr);
  min-height: 100vh;
  padding: var(--profile-card-edge);
  padding-right: calc(var(--sidebar-width) + clamp(24px, 4vw, 52px));
  position: relative;
}
```

Update `.profile-identity-card`:

```css
.profile-identity-card {
  align-self: start;
  background: var(--shell-paper);
  border: 5px solid var(--ink);
  border-radius: 28px;
  box-shadow: 12px 12px 0 var(--ink);
  display: grid;
  grid-template-rows: auto minmax(150px, 1fr) auto auto;
  height: calc(100vh - var(--profile-card-edge) * 2);
  min-height: 0;
  padding: clamp(18px, 2.4vw, 28px);
  position: sticky;
  top: var(--profile-card-edge);
}
```

Update title styles:

```css
.profile-identity-card__title {
  font-size: clamp(2.35rem, 4.2vw, 4.35rem);
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.84;
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}

.profile-identity-card__title span {
  display: block;
  max-width: 100%;
}
```

Remove or replace the old `.profile-identity-card h1` and `.profile-identity-card h1 span` rules.

- [ ] **Step 4: Keep BGM overlap allowed**

Do not add bottom padding or bottom avoidance to `.profile-identity-card`. BGM remains an independent fixed overlay and may overlap the card if the viewport is short.

- [ ] **Step 5: Run tests**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

### Task 5: Profile-Owned Mobile and Narrow Viewport Scrolling

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add a test documenting mobile fixed-flow behavior**

Append:

```jsx
it("renders all Profile notes in DOM order for narrow fixed-flow layouts", () => {
  const { container, cleanup } = render(<ProfilePage />);
  const page = container.querySelector(".profile-page");

  act(() => {
    page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
  });

  expect(
    Array.from(container.querySelectorAll(".profile-note")).map((note) =>
      note.getAttribute("data-note-id"),
    ),
  ).toEqual(["identity", "loadout", "taste", "current-quest", "links"]);

  cleanup();
});
```

- [ ] **Step 2: Make Profile route own scroll**

In `src/styles.css`, add route-scoped rules:

```css
.app-shell--profile {
  height: 100vh;
  overflow-y: auto;
}

.app-shell--profile .app-main {
  min-height: 100vh;
}

.app-shell--profile .profile-page {
  min-height: 100vh;
  overflow: visible;
}
```

Keep `body { overflow: hidden; }` unchanged because Home depends on full-screen stage behavior.

- [ ] **Step 3: Remove double scrolling from Profile board**

In `@media (max-width: 980px)`, use:

```css
.profile-page {
  overflow: visible;
}

.profile-board {
  grid-template-columns: 1fr;
  min-height: 100vh;
  overflow: visible;
  padding-bottom: calc(var(--mobile-menu-height) + 128px);
  padding-right: clamp(20px, 5vw, 34px);
}
```

Do not set both `.profile-page` and `.profile-board` as independent scroll containers.

- [ ] **Step 4: Mobile note flow should ignore drag layout**

In `@media (max-width: 980px)`, update:

```css
.profile-note {
  cursor: default;
  left: auto;
  position: relative;
  top: auto;
  touch-action: auto;
  transform: rotate(var(--note-rotate));
  width: min(100%, 560px);
}
```

This keeps the existing fixed-flow intent but relies on `.app-shell--profile` for scrolling.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

### Task 6: Documentation Update

**Files:**
- Modify: `docs/modules/Profile/profile-sticky-board.md`

- [ ] **Step 1: Add layout algorithm documentation**

Add this section:

```markdown
## 默认布局算法

Profile 桌面端贴纸默认位置不再由手写百分比坐标直接控制，而是由 `src/utils/profileLayout.js` 根据 `preferredSlot`、`size` 和固定候选槽位计算。算法会按贴纸顺序挑选第一个不与已放置贴纸重叠的位置，输出 CSS 变量给 `ProfileStickyNote`。

内容维护时优先改：

- 贴纸顺序：`src/data/profile.js`
- 贴纸尺寸：`size`
- 贴纸默认区域：`preferredSlot`
- 贴纸颜色语义：`tone`

不要直接在 JSX 里写 `left/top`。
```

- [ ] **Step 2: Add visual constraints documentation**

Add:

```markdown
## 视觉约束

- 贴纸本体是纯硬矩形，`border-radius: 0`。
- 身份卡允许圆角和硬阴影，且桌面端上下边距由 `--profile-card-edge` 保持一致。
- 胶囊标签使用 `profile-pill--*` 色彩语义，避免全站同一种薄荷绿。
- 窄屏和移动端由 `.app-shell--profile` 承担滚动，贴纸改为固定错位流，不启用自由拖动。
```

- [ ] **Step 3: Run docs grep**

Run: `rg -n "preferredSlot|profileLayout|profile-pill|border-radius: 0|app-shell--profile" docs src`

Expected: Finds the new layout utility, CSS contract, and Profile module documentation.

### Task 7: Verification

**Files:**
- No source edits unless verification finds a defect.

- [ ] **Step 1: Run utility tests**

Run: `npm test -- src/utils/profileLayout.test.js`

Expected: PASS.

- [ ] **Step 2: Run component tests**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

- [ ] **Step 3: Run full suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Browser verification**

Run: `npm run dev`, then verify `/profile` at:

- Desktop `1280x720`:
  - Cover appears first.
  - Wheel reveals board.
  - Default notes do not overlap.
  - Notes are hard rectangles.
  - Identity card top and bottom page gaps match visually.
  - Display name stays inside the identity card.
  - Pills are not all mint.

- Narrow `900x720`:
  - Layout does not create hidden content.
  - Page can scroll if content exceeds viewport.
  - No horizontal overflow.

- Mobile `390x844`:
  - Cover appears first.
  - Swipe/scroll reveals board.
  - Notes appear in fixed flow.
  - All notes can be reached by scrolling.
  - Bottom content is not trapped behind mobile menu/BGM.

## Self-Review

- Spec coverage: Covers all six reported problems: note overlap, hard rectangles, identity card edge spacing, display-name overflow, pill color variety, and narrow/mobile scrolling.
- Placeholder scan: No `TBD`, `TODO`, “implement later,” or vague test instructions remain.
- Type consistency: `preferredSlot`, `tone`, `resolveProfileNoteLayout`, `doRectsOverlap`, `profile-pill--*`, and `.app-shell--profile` are consistently named across tests, implementation steps, CSS, and docs.
