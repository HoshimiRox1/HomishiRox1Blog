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

  it("uses the mock-style BGM status copy", () => {
    const { container, cleanup } = render(<BgmPlayer isHome />);

    expect(container.textContent).toContain("BGM");
    expect(container.textContent).toContain("user triggered");

    cleanup();
  });
});
