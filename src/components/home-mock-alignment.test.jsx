import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import BgmPlayer from "./BgmPlayer";
import CharacterStage from "./CharacterStage";
import HomePage from "./HomePage";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.matchMedia = window.matchMedia ?? (() => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
}));

const character = {
  id: "test",
  name: "测试角色",
  title: "Test stage title.",
  accent: "#ffd6e8",
  image: "test-character.png",
};

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

describe("Home mock alignment", () => {
  it("renders the mock-style home tags and scroll hint", () => {
    const { container, cleanup } = render(<HomePage />);

    expect(container.textContent).toContain("ROXY BLOG");
    expect(container.textContent).toContain("ANIME / NOTES / WORK");
    expect(container.textContent).toContain("SCROLL TO WAKE THE STAGE");
    expect(container.querySelector(".home-grid")).not.toBeNull();

    cleanup();
  });

  it("keeps the hint card outside the poster flow on desktop layouts", () => {
    const { container, cleanup } = render(<HomePage />);

    expect(container.querySelector(".home-poster .home-hint-card")).toBeNull();
    expect(container.querySelector(".home-hint-rail .home-hint-card")).not.toBeNull();

    cleanup();
  });

  it("keeps the title size and hint card position unchanged after entering the stage", () => {
    const previousMatchMedia = window.matchMedia;
    window.matchMedia = () => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    });

    const { container, cleanup } = render(<HomePage />);
    const title = container.querySelector(".home-title");
    const hintCard = container.querySelector(".home-hint-card");

    act(() => {
      container.querySelector(".home-page")?.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 120,
        }),
      );
    });

    expect(container.querySelector(".home-page")?.className).toContain(
      "home-page--staged",
    );
    expect(title?.getAttribute("style") ?? "").not.toContain("scale");
    expect(title?.getAttribute("style") ?? "").not.toContain("transform");
    expect(hintCard?.getAttribute("style") ?? "").not.toContain("translate");
    expect(hintCard?.getAttribute("style") ?? "").not.toContain("y:");

    cleanup();
    window.matchMedia = previousMatchMedia;
  });

  it("keeps the character stage shell visible before the character enters", () => {
    const { container, cleanup } = render(
      <CharacterStage character={character} isVisible={false} />,
    );

    expect(container.textContent).toContain("CHARACTER");
    expect(container.textContent).toContain("ROXY STAGE");
    expect(container.querySelector(".character-stage-shell")).not.toBeNull();
    expect(container.querySelector(".character-card")).not.toBeNull();

    cleanup();
  });

  it("shows only the character name and a meter in the character meta card", () => {
    const { container, cleanup } = render(
      <CharacterStage character={character} isVisible />,
    );

    expect(container.querySelector(".character-meta")?.textContent).toContain(
      "测试角色",
    );
    expect(container.querySelector(".character-meta")?.textContent).not.toContain(
      "Test stage title.",
    );
    expect(container.querySelector(".character-meta-meter")).not.toBeNull();

    cleanup();
  });

  it("keeps the placeholder panel inside the stage shell", () => {
    const { container, cleanup } = render(
      <CharacterStage character={character} isVisible={false} />,
    );
    const stageShell = container.querySelector(".character-stage-shell");
    const stagePanel = container.querySelector(".character-stage-panel");

    expect(stageShell).not.toBeNull();
    expect(stagePanel).not.toBeNull();
    expect(stageShell?.contains(stagePanel)).toBe(true);

    cleanup();
  });

  it("keeps the visible meta card outside the placeholder panel structure", () => {
    const { container, cleanup } = render(
      <CharacterStage character={character} isVisible />,
    );
    const stagePanel = container.querySelector(".character-stage-panel");
    const metaCard = container.querySelector(".character-meta");
    const stageShell = container.querySelector(".character-stage-shell");

    expect(stagePanel).not.toBeNull();
    expect(metaCard).not.toBeNull();
    expect(stagePanel?.contains(metaCard)).toBe(false);
    expect(stageShell?.contains(metaCard)).toBe(false);

    cleanup();
  });

  it("keeps the hint card on a dedicated fixed rail for mobile HUD placement", () => {
    const { container, cleanup } = render(<HomePage />);
    const hintRail = container.querySelector(".home-hint-rail");

    expect(hintRail).not.toBeNull();
    expect(hintRail?.className).not.toContain("static");
    expect(container.querySelector(".home-poster .home-hint-card")).toBeNull();

    cleanup();
  });

  it("keeps the mobile hint rail aligned to the bgm left baseline contract", () => {
    const { container, cleanup } = render(<HomePage />);
    const hintRail = container.querySelector(".home-hint-rail");

    expect(hintRail).not.toBeNull();
    expect(hintRail?.getAttribute("style") ?? "").not.toContain("left:");

    cleanup();
  });

  it("keeps the character meta width independent from the stage right edge", () => {
    const { container, cleanup } = render(
      <CharacterStage character={character} isVisible />,
    );
    const metaCard = container.querySelector(".character-meta");

    expect(metaCard).not.toBeNull();
    expect(metaCard?.getAttribute("style") ?? "").not.toContain("right:");

    cleanup();
  });

  it("uses the mock-style BGM status copy", () => {
    const { container, cleanup } = render(<BgmPlayer isHome />);

    expect(container.textContent).toContain("BGM");
    expect(container.textContent).toContain("user triggered");

    cleanup();
  });
});
