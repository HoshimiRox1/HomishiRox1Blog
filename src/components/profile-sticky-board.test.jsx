import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import PlaceholderPage from "./PlaceholderPage";
import ProfileIdentityCard from "./ProfileIdentityCard";
import ProfilePage from "./ProfilePage";
import ProfileStickyNote from "./ProfileStickyNote";
import SectionCover from "./SectionCover";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.matchMedia = window.matchMedia ?? (() => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
}));

window.PointerEvent = window.PointerEvent ?? MouseEvent;

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
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("Profile sticky board", () => {
  it("keeps editable profile content in a data object", () => {
    expect(profile.displayName).toBe("HoshimiRox1");
    expect(profile.avatarSrc).toContain("Avatar.jpg");
    expect(profile.notes.map((note) => note.layout.desktop.left)).toEqual([
      "49%",
      "43%",
      "69%",
      "53%",
      "73%",
    ]);
    expect(profile.notes.map((note) => note.tone)).toEqual([
      "profile",
      "portfolio",
      "pink",
      "mint",
      "paper",
    ]);
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
    const note = render(
      <ProfileStickyNote
        layout={{
          style: {
            "--note-left": "49%",
            "--note-top": "12%",
            "--note-width": "270px",
            "--note-min-height": "160px",
            "--note-rotate": "3deg",
            "--note-color": "#B9F5FF",
          },
        }}
        note={profile.notes[0]}
      />,
    );

    expect(identity.container.textContent).toContain("HoshimiRox1");
    expect(identity.container.textContent).toContain("PROFILE / 02");
    expect(note.container.textContent).toContain("IDENTITY");
    expect(note.container.textContent).toContain("审美和表达欲先行。");
    expect(identity.container.querySelector(".profile-avatar img")?.getAttribute("src")).toContain(
      "Avatar.jpg",
    );
    expect(
      identity.container.querySelectorAll(".profile-identity-card__title span"),
    ).toHaveLength(2);
    expect(note.container.querySelector(".profile-note")?.getAttribute("draggable")).not.toBe(
      "true",
    );

    identity.cleanup();
    note.cleanup();
  });

  it("shows an avatar fallback when the configured profile image fails", () => {
    const { container, cleanup } = render(<ProfileIdentityCard profile={profile} />);
    const image = container.querySelector(".profile-avatar img");

    act(() => {
      image?.dispatchEvent(new Event("error", { bubbles: true }));
    });

    expect(container.querySelector(".profile-avatar")?.textContent).toContain(
      "???",
    );

    cleanup();
  });

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
    expect(container.querySelector(".section-cover")).not.toBeNull();
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
    expect(container.querySelector(".profile-whiteboard")).not.toBeNull();
    expect(container.querySelector(".profile-board-title")).not.toBeNull();
    expect(container.textContent).toContain("NOT A RESUME");

    cleanup();
  });

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

  it("uses pointer drag only so the browser does not create a native drag ghost", () => {
    const note = render(
      <ProfileStickyNote
        dragProps={{
          style: {
            "--drag-x": "0px",
            "--drag-y": "0px",
          },
          handlers: {
            onPointerDown() {},
          },
        }}
        layout={{
          style: {
            "--note-left": "49%",
            "--note-top": "12%",
            "--note-width": "270px",
            "--note-min-height": "160px",
            "--note-rotate": "3deg",
            "--note-color": "#B9F5FF",
          },
        }}
        note={profile.notes[0]}
      />,
    );

    const article = note.container.querySelector(".profile-note");

    expect(article?.getAttribute("draggable")).not.toBe("true");

    note.cleanup();
  });

  it("renders sticky note pills with semantic tone classes", () => {
    const loadout = render(
      <ProfileStickyNote
        layout={{
          style: {
            "--note-left": "43%",
            "--note-top": "45%",
            "--note-width": "230px",
            "--note-min-height": "160px",
            "--note-rotate": "-3deg",
            "--note-color": "#FFE7A6",
          },
        }}
        note={profile.notes[1]}
      />,
    );
    const links = render(
      <ProfileStickyNote
        layout={{
          style: {
            "--note-left": "73%",
            "--note-top": "69%",
            "--note-width": "250px",
            "--note-min-height": "120px",
            "--note-rotate": "-2deg",
            "--note-color": "#D8CCFF",
          },
        }}
        note={profile.notes[4]}
      />,
    );

    expect(
      Array.from(loadout.container.querySelectorAll(".profile-note__tags .profile-pill")).map(
        (pill) => pill.className,
      ),
    ).toEqual([
      "profile-pill profile-pill--portfolio",
      "profile-pill profile-pill--portfolio",
      "profile-pill profile-pill--portfolio",
      "profile-pill profile-pill--portfolio",
      "profile-pill profile-pill--portfolio",
    ]);
    expect(
      Array.from(links.container.querySelectorAll(".profile-note__links .profile-pill")).map(
        (pill) => pill.className,
      ),
    ).toEqual([
      "profile-pill profile-pill--paper",
      "profile-pill profile-pill--paper",
      "profile-pill profile-pill--paper",
    ]);

    loadout.cleanup();
    links.cleanup();
  });

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
    expect(noteStyles.every((style) => style.includes("--note-min-height"))).toBe(
      true,
    );
    expect(noteStyles.every((style) => style.includes("--note-rotate"))).toBe(true);
    expect(noteStyles.every((style) => style.includes("--note-color"))).toBe(true);
    expect(new Set(noteStyles.map((style) => style.match(/--note-tone: ([^;]+)/)?.[1]))).toEqual(
      new Set(["profile", "portfolio", "pink", "mint", "paper"]),
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

  it("renders the identity display name as two stacked preview-aligned lines", () => {
    const { container, cleanup } = render(<ProfileIdentityCard profile={profile} />);
    const title = container.querySelector(".profile-identity-card__title");
    const metaPills = Array.from(
      container.querySelectorAll(".profile-identity-card__meta .profile-pill"),
    ).map((pill) => pill.className);
    const titleLines = Array.from(
      container.querySelectorAll(".profile-identity-card__title span"),
    ).map((line) => line.textContent);

    expect(title).not.toBeNull();
    expect(title?.textContent?.replace(/\s+/g, "")).toBe("HoshimiRox1");
    expect(titleLines).toEqual(["Hoshimi", "Rox1"]);
    expect(metaPills).toEqual([
      "profile-pill profile-pill--profile",
      "profile-pill profile-pill--paper",
    ]);

    cleanup();
  });

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

  it("keeps the whiteboard content independent from the global sidebar nav", () => {
    const { container, cleanup } = render(<ProfilePage />);
    const page = container.querySelector(".profile-page");

    act(() => {
      page?.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 120 }));
    });

    expect(container.querySelector(".profile-whiteboard")).not.toBeNull();
    expect(container.querySelector(".profile-side-bands")).toBeNull();

    cleanup();
  });
});
