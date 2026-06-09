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
    expect(profile.avatarSrc).toBe("/assets/profile/avatar.png");
    expect(profile.notes.map((note) => note.preferredSlot)).toEqual([
      "top-left",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-center",
    ]);
    expect(profile.notes.map((note) => note.tone)).toEqual([
      "profile",
      "portfolio",
      "mint",
      "pink",
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
            "--note-left": "4%",
            "--note-top": "2%",
            "--note-width": "36%",
            "--note-height": "27%",
            "--note-aspect-ratio": "36 / 27",
          },
        }}
        note={profile.notes[0]}
      />,
    );

    expect(identity.container.textContent).toContain("HoshimiRox1");
    expect(identity.container.textContent).toContain("PROFILE / 02");
    expect(note.container.textContent).toContain("IDENTITY");
    expect(note.container.textContent).toContain("审美和表达欲先行。");

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

  it("renders sticky note pills with semantic tone classes", () => {
    const loadout = render(
      <ProfileStickyNote
        layout={{
          style: {
            "--note-left": "48%",
            "--note-top": "6%",
            "--note-width": "31%",
            "--note-height": "24%",
            "--note-aspect-ratio": "31 / 24",
          },
        }}
        note={profile.notes[1]}
      />,
    );
    const links = render(
      <ProfileStickyNote
        layout={{
          style: {
            "--note-left": "36%",
            "--note-top": "70%",
            "--note-width": "27%",
            "--note-height": "20%",
            "--note-aspect-ratio": "27 / 20",
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
    expect(noteStyles.every((style) => style.includes("--note-height"))).toBe(true);
    expect(noteStyles.every((style) => style.includes("--note-aspect-ratio"))).toBe(
      true,
    );
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

  it("keeps the identity display name as a single readable line", () => {
    const { container, cleanup } = render(<ProfileIdentityCard profile={profile} />);
    const title = container.querySelector(".profile-identity-card__title");
    const metaPills = Array.from(
      container.querySelectorAll(".profile-identity-card__meta .profile-pill"),
    ).map((pill) => pill.className);

    expect(title).not.toBeNull();
    expect(title?.textContent).toBe("HoshimiRox1");
    expect(container.querySelectorAll(".profile-identity-card__title span")).toHaveLength(0);
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
});
