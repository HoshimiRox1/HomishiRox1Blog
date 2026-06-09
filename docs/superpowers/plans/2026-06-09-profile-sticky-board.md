# Profile Sticky Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/profile` from a placeholder to a two-stage Profile page with a chapter cover and a draggable Brutalist Sticky Board.

**Architecture:** Keep Profile content in `src/data/profile.js`; keep route wiring in `AppShell`; keep the cover, identity card, note card, and drag behavior in separate components/hooks. `ProfilePage` owns only page-level stage transitions and composition so the content and board pieces can change without touching navigation or global shell code.

**Tech Stack:** Vite, React 19, React Router 7, GSAP, Vitest, plain CSS in `src/styles.css`.

---

## File Structure

- Create `src/data/profile.js`: single source for display name, cover copy, identity copy, avatar path, notes, tags, and links.
- Create `src/components/SectionCover.jsx`: reusable chapter cover extracted from the existing placeholder-page visual language.
- Create `src/components/ProfileIdentityCard.jsx`: renders the left/top identity block and avatar fallback.
- Create `src/components/ProfileStickyNote.jsx`: renders one note from data without owning layout or drag state.
- Create `src/components/useDraggableNote.js`: hook that manages pointer drag state for desktop-capable notes.
- Create `src/components/ProfilePage.jsx`: page orchestration, cover-to-board reveal, GSAP entry animation.
- Create `src/components/profile-sticky-board.test.jsx`: behavior tests for data-driven content, avatar fallback, cover reveal, note rendering, and drag state.
- Modify `src/components/AppShell.jsx`: route `/profile` to `ProfilePage`.
- Modify `src/components/PlaceholderPage.jsx`: compose `SectionCover` so Portfolio/Blog keep the same cover style.
- Modify `src/styles.css`: add Profile board styles and extend existing placeholder styles only where shared.
- Modify `docs/modules/README.md`: replace Profile placeholder entry with formal Profile module entries.
- Create `docs/modules/Profile/profile-sticky-board.md`: document implementation boundaries and future edit points.
- Modify `docs/TODO.md`: mark Profile formal spec implementation complete and update next tasks.

## Parallelization

The implementation has three mostly independent tracks:

- Worker A can implement data + pure render components/tests: `src/data/profile.js`, `ProfileIdentityCard.jsx`, `ProfileStickyNote.jsx`, part of `profile-sticky-board.test.jsx`.
- Worker B can implement cover reuse and route wiring: `SectionCover.jsx`, `PlaceholderPage.jsx`, `AppShell.jsx`, related tests.
- Main thread should own `ProfilePage.jsx`, drag hook integration, CSS, docs, and final browser verification because those pieces depend on visual integration.

Do not let two agents edit `src/styles.css` at the same time. Do not edit frozen navigation behavior.

---

### Task 1: Profile Data Contract

**Files:**
- Create: `src/data/profile.js`
- Test: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Write the failing data/render test**

```jsx
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import ProfileIdentityCard from "./ProfileIdentityCard";
import ProfileStickyNote from "./ProfileStickyNote";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function render(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(element);
  });

  return {
    container,
    cleanup() {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe("Profile sticky board", () => {
  it("keeps editable profile content in a data object", () => {
    expect(profile.displayName).toBe("HoshimiRox1");
    expect(profile.avatarSrc).toBe("/assets/profile/avatar.png");
    expect(profile.notes.map((note) => note.kicker)).toEqual([
      "IDENTITY",
      "LOADOUT",
      "TASTE",
      "CURRENT QUEST",
      "LINKS",
    ]);
  });

  it("renders identity and note content from profile data", () => {
    const identity = render(<ProfileIdentityCard profile={profile} />);
    const note = render(<ProfileStickyNote note={profile.notes[0]} />);

    expect(identity.container.textContent).toContain("HoshimiRox1");
    expect(identity.container.textContent).toContain("PROFILE / 02");
    expect(note.container.textContent).toContain("IDENTITY");
    expect(note.container.textContent).toContain("审美和表达欲先行。");

    identity.cleanup();
    note.cleanup();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: FAIL because `src/data/profile.js`, `ProfileIdentityCard`, and `ProfileStickyNote` do not exist.

- [ ] **Step 3: Create the data file and pure render components**

Create `src/data/profile.js`:

```js
// Profile 页面内容集中配置，组件只负责根据这些数据渲染。
export const profile = {
  displayName: "HoshimiRox1",
  displayNameLines: ["Hoshimi", "Rox1"],
  handle: "HoshimiRox1",
  indexLabel: "PROFILE / 02",
  avatarSrc: "/assets/profile/avatar.png",
  identityCopy: "审美、兴趣、技术栈和正在升级的能力，都贴在这块个人白板上。",
  cover: {
    title: "PROFILE",
    description: "一块贴满能力、兴趣和当前主线的个人白板。",
  },
  footerTags: ["NOT A RESUME", "INTEREST-DRIVEN BUILDER"],
  notes: [
    {
      id: "identity",
      kicker: "IDENTITY",
      title: "审美和表达欲先行。",
      body: "我喜欢把界面做成有舞台感的东西：有结构、有节奏，也有一点不服帖的个人痕迹。",
      color: "#B9F5FF",
      size: "large",
      layout: { x: 4, y: 2, rotate: -2 },
    },
    {
      id: "loadout",
      kicker: "LOADOUT",
      title: "技术栈像装备栏。",
      tags: ["React", "CSS", "GSAP", "Vite", "UI Motion"],
      color: "#FFE7A6",
      size: "medium",
      layout: { x: 48, y: 6, rotate: 2 },
    },
    {
      id: "taste",
      kicker: "TASTE",
      title: "兴趣是燃料。",
      tags: ["Anime", "Games", "Personal Site", "Music", "Cool UI"],
      color: "#D7FFF1",
      size: "medium",
      layout: { x: 16, y: 42, rotate: 1 },
    },
    {
      id: "current-quest",
      kicker: "CURRENT QUEST",
      title: "把品味变成能跑的界面。",
      body: "现在的主线是把审美判断沉进组件、动效和内容系统里，让个人网站从骨架长出人格。",
      color: "#FFD6E8",
      size: "large",
      layout: { x: 52, y: 40, rotate: -1 },
    },
    {
      id: "links",
      kicker: "LINKS",
      title: "GitHub / Blog / Mail",
      links: [
        { label: "GitHub", href: "https://github.com/HoshimiRox1" },
        { label: "Blog", href: "/" },
        { label: "Mail", href: "mailto:hello@example.com" },
      ],
      color: "#FFFFFF",
      size: "small",
      layout: { x: 36, y: 70, rotate: 2 },
    },
  ],
};
```

Create `src/components/ProfileIdentityCard.jsx`:

```jsx
// Profile 身份卡承担页面视觉重心，内容从 profile 数据读取。
import { useState } from "react";

// 渲染头像、名称和个人定位。
export default function ProfileIdentityCard({ profile }) {
  const [hasAvatarError, setHasAvatarError] = useState(false);

  return (
    <aside className="profile-identity-card">
      <div className="profile-identity-card__meta">
        <span>{profile.indexLabel}</span>
        <span>{profile.handle}</span>
      </div>
      <div className="profile-avatar" aria-label={`${profile.displayName} avatar`}>
        {hasAvatarError ? (
          <span>???</span>
        ) : (
          <img
            alt=""
            src={profile.avatarSrc}
            onError={() => setHasAvatarError(true)}
          />
        )}
      </div>
      <h1>
        {profile.displayNameLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p>{profile.identityCopy}</p>
    </aside>
  );
}
```

Create `src/components/ProfileStickyNote.jsx`:

```jsx
// Profile 贴纸只负责渲染单张便签，不保存拖动状态。
export default function ProfileStickyNote({ note, dragProps = {} }) {
  return (
    <article
      className={`profile-note profile-note--${note.size}`}
      style={{
        "--note-color": note.color,
        "--note-x": `${note.layout.x}%`,
        "--note-y": `${note.layout.y}%`,
        "--note-rotate": `${note.layout.rotate}deg`,
        ...dragProps.style,
      }}
      {...dragProps.handlers}
    >
      <span className="profile-note__kicker">{note.kicker}</span>
      <h2>{note.title}</h2>
      {note.body ? <p>{note.body}</p> : null}
      {note.tags ? (
        <ul className="profile-note__tags" aria-label={`${note.kicker} tags`}>
          {note.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      {note.links ? (
        <div className="profile-note__links">
          {note.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS for data-driven render tests.

### Task 2: Reusable Section Cover

**Files:**
- Create: `src/components/SectionCover.jsx`
- Modify: `src/components/PlaceholderPage.jsx`
- Test: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add failing cover reuse tests**

Append to the existing test file:

```jsx
import SectionCover from "./SectionCover";
import PlaceholderPage from "./PlaceholderPage";

it("renders a reusable section cover with placeholder visual classes", () => {
  const { container, cleanup } = render(
    <SectionCover
      className="profile-cover"
      description="Profile cover copy"
      index="02"
      title="PROFILE"
    />,
  );

  expect(container.querySelector(".placeholder-content")).not.toBeNull();
  expect(container.textContent).toContain("02");
  expect(container.textContent).toContain("PROFILE");
  expect(container.textContent).toContain("Profile cover copy");

  cleanup();
});

it("keeps Portfolio and Blog placeholders on the reusable cover component", () => {
  const portfolio = render(<PlaceholderPage pageId="portfolio" />);
  const blog = render(<PlaceholderPage pageId="blog" />);

  expect(portfolio.container.querySelector(".section-cover")).not.toBeNull();
  expect(blog.container.querySelector(".section-cover")).not.toBeNull();
  expect(blog.container.textContent).toContain("番剧记录");

  portfolio.cleanup();
  blog.cleanup();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: FAIL because `SectionCover` does not exist and `PlaceholderPage` does not render `.section-cover`.

- [ ] **Step 3: Create `SectionCover` and refactor `PlaceholderPage`**

Create `src/components/SectionCover.jsx`:

```jsx
// 章节封面复用 Phase 1 占位页的纯色大标题舞台感。
export default function SectionCover({
  className = "",
  description,
  index,
  sections,
  title,
}) {
  return (
    <section className={`placeholder-page section-cover ${className}`.trim()}>
      <div className="placeholder-content">
        <p className="placeholder-index">{index}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {sections ? (
          <ul className="blog-sections">
            {sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
```

Modify `src/components/PlaceholderPage.jsx` to keep GSAP and delegate markup:

```jsx
// 占位页保留 Phase 1 的扩展入口，不提前实现完整内容系统。
import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { pages } from "../data/site";
import { getPageById } from "../utils/navigation";
import SectionCover from "./SectionCover";

gsap.registerPlugin(useGSAP);

// 根据 pageId 渲染 Profile、Portfolio 或 Blog 占位内容。
export default function PlaceholderPage({ pageId }) {
  const page = useMemo(() => getPageById(pages, pageId), [pageId]);
  const pageRef = useRef(null);
  const index = `0${pages.findIndex((item) => item.id === page.id) + 1}`;

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.fromTo(
        ".placeholder-content",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.62,
          ease: "power3.out",
        },
      );
    },
    { scope: pageRef, dependencies: [pageId] },
  );

  return (
    <div ref={pageRef}>
      <SectionCover
        description={page.description}
        index={index}
        sections={page.sections}
        title={page.title}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS for cover reuse tests.

### Task 3: Profile Page Cover-to-Board Flow

**Files:**
- Create: `src/components/ProfilePage.jsx`
- Modify: `src/components/AppShell.jsx`
- Test: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add failing Profile page tests**

Append:

```jsx
import ProfilePage from "./ProfilePage";

it("starts Profile on a chapter cover before revealing the board", () => {
  const { container, cleanup } = render(<ProfilePage />);

  expect(container.querySelector(".profile-page--cover")).not.toBeNull();
  expect(container.textContent).toContain("PROFILE");
  expect(container.querySelector(".profile-board")).toBeNull();

  cleanup();
});

it("reveals the sticky board after a wheel gesture on the cover", () => {
  const { container, cleanup } = render(<ProfilePage />);
  const page = container.querySelector(".profile-page");

  act(() => {
    page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
  });

  expect(container.querySelector(".profile-page--board")).not.toBeNull();
  expect(container.querySelector(".profile-board")).not.toBeNull();
  expect(container.textContent).toContain("NOT A RESUME");

  cleanup();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: FAIL because `ProfilePage` does not exist.

- [ ] **Step 3: Implement `ProfilePage` and route it**

Create `src/components/ProfilePage.jsx`:

```jsx
// Profile 页面编排章节封面与 Sticky Board，不直接维护具体文案。
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../data/profile";
import ProfileIdentityCard from "./ProfileIdentityCard";
import ProfileStickyNote from "./ProfileStickyNote";
import SectionCover from "./SectionCover";

gsap.registerPlugin(useGSAP);

// 渲染 Profile 的封面阶段和白板阶段。
export default function ProfilePage() {
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const pageRef = useRef(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!isBoardVisible) {
        gsap.fromTo(
          ".placeholder-content",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0 : 0.62,
            ease: "power3.out",
          },
        );
        return;
      }

      gsap.fromTo(
        ".profile-board-panel",
        { autoAlpha: 0, y: reduceMotion ? 0 : 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.58,
          ease: "power3.out",
          stagger: reduceMotion ? 0 : 0.06,
        },
      );
    },
    { scope: pageRef, dependencies: [isBoardVisible] },
  );

  // 首次滚动或上滑从封面进入白板。
  function revealBoard(event) {
    if (isBoardVisible) {
      return;
    }

    if ("deltaY" in event && Math.abs(event.deltaY) < 8) {
      return;
    }

    setIsBoardVisible(true);
  }

  return (
    <section
      className={`profile-page ${
        isBoardVisible ? "profile-page--board" : "profile-page--cover"
      }`}
      onTouchMove={revealBoard}
      onWheel={revealBoard}
      ref={pageRef}
    >
      {isBoardVisible ? (
        <div className="profile-board">
          <ProfileIdentityCard profile={profile} />
          <div className="profile-note-field">
            {profile.notes.map((note) => (
              <ProfileStickyNote key={note.id} note={note} />
            ))}
          </div>
          <div className="profile-board-footer">
            {profile.footerTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ) : (
        <SectionCover
          className="profile-cover"
          description={profile.cover.description}
          index="02"
          title={profile.cover.title}
        />
      )}
    </section>
  );
}
```

Modify `src/components/AppShell.jsx`:

```jsx
import ProfilePage from "./ProfilePage";
```

Replace the `/profile` route element:

```jsx
<Route path="/profile" element={<ProfilePage />} />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS for cover-to-board tests.

### Task 4: Desktop Drag Hook

**Files:**
- Create: `src/components/useDraggableNote.js`
- Modify: `src/components/ProfilePage.jsx`
- Test: `src/components/profile-sticky-board.test.jsx`

- [ ] **Step 1: Add failing drag behavior test**

Append:

```jsx
it("moves a desktop note with pointer drag without changing its content", () => {
  const { container, cleanup } = render(<ProfilePage />);
  const page = container.querySelector(".profile-page");

  act(() => {
    page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
  });

  const note = container.querySelector("[data-note-id='identity']");
  const beforeText = note?.textContent;

  act(() => {
    note?.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        clientX: 10,
        clientY: 10,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 42,
        clientY: 54,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    window.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
  });

  expect(note?.textContent).toBe(beforeText);
  expect(note?.getAttribute("style")).toContain("--drag-x: 32px");
  expect(note?.getAttribute("style")).toContain("--drag-y: 44px");

  cleanup();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: FAIL because notes do not expose `data-note-id` and drag variables.

- [ ] **Step 3: Implement drag hook and wire notes**

Create `src/components/useDraggableNote.js`:

```js
// 桌面端贴纸拖动状态只保存在内存，刷新后恢复默认布局。
import { useEffect, useRef, useState } from "react";

// 返回指定 note 的 pointer handlers 和 CSS 位移变量。
export function useDraggableNotes() {
  const [positions, setPositions] = useState({});
  const activeDragRef = useRef(null);

  useEffect(() => {
    function handlePointerMove(event) {
      const activeDrag = activeDragRef.current;
      if (!activeDrag) {
        return;
      }

      setPositions((current) => ({
        ...current,
        [activeDrag.id]: {
          x: activeDrag.originX + event.clientX - activeDrag.startX,
          y: activeDrag.originY + event.clientY - activeDrag.startY,
        },
      }));
    }

    function handlePointerUp() {
      activeDragRef.current = null;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function getDragProps(id) {
    const position = positions[id] ?? { x: 0, y: 0 };

    return {
      style: {
        "--drag-x": `${position.x}px`,
        "--drag-y": `${position.y}px`,
      },
      handlers: {
        onPointerDown(event) {
          if (event.pointerType === "touch") {
            return;
          }

          activeDragRef.current = {
            id,
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
          };
        },
      },
    };
  }

  return { getDragProps };
}
```

Modify `ProfileStickyNote.jsx` article props:

```jsx
data-note-id={note.id}
```

Modify `ProfilePage.jsx`:

```jsx
import { useDraggableNotes } from "./useDraggableNote";
```

Inside component:

```jsx
const { getDragProps } = useDraggableNotes();
```

Pass drag props:

```jsx
<ProfileStickyNote
  dragProps={getDragProps(note.id)}
  key={note.id}
  note={note}
/>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS for drag behavior.

### Task 5: Profile Board Styling

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add CSS for the Profile board**

Append styles near the placeholder section:

```css
.profile-page {
  background: var(--shell-bg);
  color: var(--ink);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.profile-page--board {
  background-image:
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
    linear-gradient(180deg, var(--grid-line) 1px, transparent 1px);
  background-size: 36px 36px;
}

.profile-board {
  display: grid;
  gap: clamp(20px, 3vw, 34px);
  grid-template-columns: minmax(260px, 360px) minmax(420px, 1fr);
  min-height: 100vh;
  padding: clamp(24px, 4vw, 48px);
  padding-right: calc(var(--sidebar-width) + clamp(24px, 4vw, 52px));
  position: relative;
}

.profile-board-panel {
  opacity: 0;
}

.profile-identity-card {
  align-self: start;
  background: var(--shell-paper);
  border: 5px solid var(--ink);
  border-radius: 28px;
  box-shadow: 12px 12px 0 var(--ink);
  min-height: min(680px, calc(100vh - 96px));
  padding: clamp(18px, 2.4vw, 28px);
  position: sticky;
  top: clamp(24px, 4vw, 48px);
}

.profile-identity-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}

.profile-identity-card__meta span,
.profile-board-footer span,
.profile-note__tags li,
.profile-note__links a {
  background: var(--soft-accent);
  border: 3px solid var(--ink);
  border-radius: 999px;
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 950;
  line-height: 1;
  padding: 8px 10px;
  text-decoration: none;
  text-transform: uppercase;
}

.profile-avatar {
  align-items: center;
  background: var(--profile-band);
  border: 4px solid var(--ink);
  border-radius: 22px;
  display: flex;
  font-size: clamp(2.6rem, 7vw, 5rem);
  font-weight: 950;
  justify-content: center;
  margin: clamp(26px, 4vw, 44px) 0;
  min-height: 220px;
  overflow: hidden;
}

.profile-avatar img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.profile-identity-card h1 {
  font-size: clamp(3.4rem, 7vw, 6.4rem);
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.78;
  margin: 0;
  text-transform: uppercase;
}

.profile-identity-card h1 span {
  display: block;
}

.profile-identity-card p {
  color: var(--muted-ink);
  font-size: clamp(1rem, 1.5vw, 1.18rem);
  font-weight: 850;
  margin: 22px 0 0;
}

.profile-note-field {
  min-height: calc(100vh - 96px);
  position: relative;
}

.profile-note {
  background: var(--note-color);
  border: 4px solid var(--ink);
  border-radius: 6px;
  cursor: grab;
  left: var(--note-x);
  padding: clamp(16px, 2vw, 22px);
  position: absolute;
  top: var(--note-y);
  touch-action: none;
  transform:
    translate(var(--drag-x, 0), var(--drag-y, 0))
    rotate(var(--note-rotate));
  transition: transform 0.16s ease;
  user-select: none;
  width: clamp(220px, 24vw, 330px);
}

.profile-note:hover,
.profile-note:focus-within {
  transform:
    translate(var(--drag-x, 0), var(--drag-y, 0))
    rotate(calc(var(--note-rotate) + 2deg));
}

.profile-note:active {
  cursor: grabbing;
}

.profile-note--large {
  width: clamp(260px, 30vw, 390px);
}

.profile-note--small {
  width: clamp(210px, 21vw, 280px);
}

.profile-note__kicker {
  display: block;
  font-size: 0.74rem;
  font-weight: 950;
  text-align: right;
}

.profile-note h2 {
  font-size: clamp(1.45rem, 2.2vw, 2.18rem);
  font-weight: 950;
  letter-spacing: 0;
  line-height: 1.05;
  margin: 18px 0 0;
}

.profile-note p {
  color: #262626;
  font-size: 0.96rem;
  font-weight: 800;
  margin: 14px 0 0;
}

.profile-note__tags,
.profile-note__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}

.profile-board-footer {
  bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  left: clamp(24px, 4vw, 48px);
  position: fixed;
  z-index: 10;
}
```

- [ ] **Step 2: Add responsive and reduced-motion CSS**

Append:

```css
@media (prefers-reduced-motion: reduce) {
  .profile-note,
  .profile-note:hover,
  .profile-note:focus-within {
    transition: none;
  }
}

@media (max-width: 980px) {
  .profile-board {
    grid-template-columns: 1fr;
    overflow-y: auto;
    padding-bottom: calc(var(--mobile-menu-height) + 104px);
    padding-right: clamp(20px, 5vw, 34px);
  }

  .profile-identity-card {
    min-height: auto;
    position: relative;
    top: auto;
  }

  .profile-note-field {
    display: grid;
    gap: 16px;
    min-height: auto;
  }

  .profile-note {
    cursor: default;
    left: auto;
    position: relative;
    top: auto;
    touch-action: auto;
    transform: rotate(var(--note-rotate));
    width: min(100%, 560px);
  }

  .profile-note:nth-child(even) {
    justify-self: end;
  }

  .profile-note:hover,
  .profile-note:focus-within {
    transform: rotate(var(--note-rotate));
  }

  .profile-board-footer {
    bottom: calc(var(--mobile-menu-height) + 16px);
    left: 20px;
    right: 20px;
  }
}

@media (max-width: 760px) {
  .profile-board {
    padding: 20px 16px calc(var(--mobile-menu-height) + 112px);
  }

  .profile-identity-card {
    border-width: 4px;
    border-radius: 22px;
    box-shadow: 8px 8px 0 var(--ink);
  }

  .profile-avatar {
    min-height: 170px;
  }
}
```

- [ ] **Step 3: Run build after CSS changes**

Run: `npm run build`

Expected: PASS and Vite writes `dist`.

### Task 6: Documentation Sync

**Files:**
- Create: `docs/modules/Profile/profile-sticky-board.md`
- Modify: `docs/modules/README.md`
- Modify: `docs/modules/universal/app-shell-routing.md`
- Modify: `docs/TODO.md`

- [ ] **Step 1: Write Profile module documentation**

Create `docs/modules/Profile/profile-sticky-board.md`:

```markdown
# Profile Sticky Board

## 模块性质

- 类型：Profile 页面正式内容模块。
- 实现状态：已实现。
- 冻结状态：不冻结；文案、贴纸数量、头像和链接可按内容阶段继续更新。

## 模块功能

Profile 页面由章节封面和 Sticky Board 两段组成。访问 `/profile` 后先看到沿用 Phase 1 占位页气质的纯色章节封面，滚轮或移动端上滑后进入个人白板。白板左侧是身份大方块，右侧是能力、技术栈、喜好、当前主线和链接贴纸。

## 相关文件

- `src/components/ProfilePage.jsx`
- `src/components/ProfileIdentityCard.jsx`
- `src/components/ProfileStickyNote.jsx`
- `src/components/useDraggableNote.js`
- `src/components/SectionCover.jsx`
- `src/data/profile.js`
- `src/styles.css`

## 内容修改位置

- 改名字：`src/data/profile.js`
- 改身份描述：`src/data/profile.js`
- 改贴纸文案：`src/data/profile.js`
- 改链接：`src/data/profile.js`
- 改头像：替换 `public/assets/profile/avatar.png`
- 增加 Profile 图片：放入 `public/assets/profile/`，再在 `src/data/profile.js` 引用。

## 组件边界

- `ProfilePage` 只负责封面/白板阶段切换、动画触发和组件组合。
- `ProfileIdentityCard` 只负责身份大方块渲染和头像失败 fallback。
- `ProfileStickyNote` 只负责单张贴纸渲染。
- `useDraggableNote` 只负责桌面端拖动状态，状态不持久化。
- `SectionCover` 复用章节封面视觉，供 Profile / Portfolio / Blog 继续扩展。

## 响应式行为

- 桌面端使用左侧身份大方块 + 右侧自由贴纸板。
- 桌面端贴纸 hover 轻微旋转，鼠标拖动改变内存位移。
- 移动端改为顶部身份卡 + 固定错位贴纸流，关闭拖动和 hover 旋转。
- `prefers-reduced-motion: reduce` 下取消明显自动位移和 hover 过渡。
```

- [ ] **Step 2: Update module index and TODO**

In `docs/modules/README.md`, replace the Profile table row with:

```markdown
| Profile Sticky Board | `docs/modules/Profile/profile-sticky-board.md` | 已实现，待内容继续打磨 |
```

In `docs/modules/universal/app-shell-routing.md`, change `/profile` route description to:

```markdown
- `/profile`：Profile Sticky Board 正式页面。
```

In `docs/TODO.md`, add to 已完成:

```markdown
16. 根据 `2026-06-09-profile-sticky-board-design.md` 将 Profile 占位页升级为章节封面 + Sticky Board 正式页面。
```

And remove “制定 Profile 正式内容 spec” from 下一步任务.

- [ ] **Step 3: Run documentation grep**

Run: `rg -n "Profile 占位|制定 Profile|Profile Sticky" docs`

Expected: only historical placeholder docs or updated references remain; `README.md`, TODO, and routing doc point to Profile Sticky Board as current implementation.

### Task 7: Final Verification

**Files:**
- No source edits unless verification finds a defect.

- [ ] **Step 1: Run focused tests**

Run: `npm test -- src/components/profile-sticky-board.test.jsx`

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Browser verification**

Run: `npm run dev`, open the local Vite URL, and verify:

- Desktop `/profile` first shows the chapter cover.
- Wheel on cover reveals the Sticky Board.
- Identity card shows `HoshimiRox1`.
- Missing avatar shows `???` when `/assets/profile/avatar.png` is absent.
- Desktop notes drag with the mouse and navigation still works.
- Mobile viewport shows fixed offset note flow and no text overlap.
- `prefers-reduced-motion` does not show obvious automatic movement.

## Self-Review

- Spec coverage: The plan covers cover-first entry, Profile Sticky Board layout, data-driven content, avatar fallback, desktop drag, mobile fixed layout, reduced motion, docs sync, and verification.
- Placeholder scan: No `TBD`, `TODO`, or vague “implement later” steps remain.
- Type consistency: `profile`, `ProfilePage`, `ProfileIdentityCard`, `ProfileStickyNote`, `SectionCover`, and `useDraggableNotes` names are consistent across tasks.
