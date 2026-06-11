import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { characters } from "../data/site";
import { tracks } from "../data/bgm";
import BgmPlayer from "./BgmPlayer";
import CharacterStage from "./CharacterStage";
import HomePage from "./HomePage";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.matchMedia = window.matchMedia ?? (() => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
}));

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const character = {
  id: "test",
  name: "测试角色",
  title: "Test stage title.",
  accent: "#ffd6e8",
  image: "test-character.png",
};

const alternateCharacter = {
  id: "alternate",
  name: "备用角色",
  title: "Alternate stage title.",
  accent: "#d7fff1",
  image: "alternate-character.png",
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
  it("uses the three real BGM files in the approved playback order", () => {
    expect(tracks).toEqual([
      expect.objectContaining({
        title: "超える",
        artist: "[Alexandros]",
        src: "/assets/bgm/%5BAlexandros%5D%20-%20%E8%B6%85%E3%81%88%E3%82%8B.mp3",
        cover: null,
      }),
      expect.objectContaining({
        title: "Recollect",
        artist: "鈴木このみ / Ashnikko",
        src: "/assets/bgm/%E9%88%B4%E6%9C%A8%E3%81%93%E3%81%AE%E3%81%BF,Ashnikko%20-%20Recollect.mp3",
        cover: null,
      }),
      expect.objectContaining({
        title: "Color Your Night",
        artist:
          "Lotus Juice / Azumi Takahashi / アトラスサウンドチーム / ATLUS GAME MUSIC",
        src: "/assets/bgm/Lotus%20Juice%20%20Azumi%20Takahashi%20%20%E3%82%A2%E3%83%88%E3%83%A9%E3%82%B9%E3%82%B5%E3%82%A6%E3%83%B3%E3%83%89%E3%83%81%E3%83%BC%E3%83%A0%20%20ATLUS%20GAME%20MUSIC%20-%20Color%20Your%20Night.mp3",
        cover: null,
      }),
    ]);
  });
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

  it("preloads every character image before the user switches characters", () => {
    const { container, cleanup } = render(<HomePage />);
    const preloadImages = container.querySelectorAll(
      ".character-preload img[data-character-preload='true']",
    );

    expect(preloadImages).toHaveLength(characters.length);
    for (const characterItem of characters) {
      expect(
        Array.from(preloadImages).some((image) =>
          image.getAttribute("src")?.includes(characterItem.image),
        ),
      ).toBe(true);
    }

    cleanup();
  });

  it("keeps inertial wheel events from switching characters after the animation lock window", () => {
    vi.useFakeTimers();
    const { container, cleanup } = render(<HomePage />);
    const homePage = container.querySelector(".home-page");

    act(() => {
      homePage?.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 120,
        }),
      );
    });
    expect(container.querySelector(".character-meta")?.textContent).toContain(
      "珂莱塔",
    );

    act(() => {
      vi.advanceTimersByTime(820);
      homePage?.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 120,
        }),
      );
      vi.advanceTimersByTime(80);
      homePage?.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 120,
        }),
      );
    });

    expect(container.querySelector(".character-meta")?.textContent).toContain(
      "珂莱塔",
    );

    act(() => {
      vi.advanceTimersByTime(240);
      homePage?.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: 120,
        }),
      );
    });

    expect(container.querySelector(".character-meta")?.textContent).toContain(
      "洛琪希",
    );

    cleanup();
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

  it("keeps an independent figure image node for every staged character", () => {
    const { container, cleanup } = render(
      <CharacterStage
        character={character}
        characters={[character, alternateCharacter]}
        isVisible
      />,
    );
    const figureImages = container.querySelectorAll(".character-figure img");

    expect(figureImages).toHaveLength(2);
    expect(
      container.querySelector("[data-character-id='test'] img")?.getAttribute(
        "src",
      ),
    ).toBe("test-character.png");
    expect(
      container
        .querySelector("[data-character-id='alternate'] img")
        ?.getAttribute("src"),
    ).toBe("alternate-character.png");

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

  it("uses the current track title without ordinary status copy", async () => {
    const loadSpy = vi
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => {});
    const { container, cleanup } = render(<BgmPlayer isHome />);
    await act(async () => Promise.resolve());

    expect(container.textContent).toContain(tracks[0].title);
    expect(container.querySelector(".bgm-player-status")).toBeNull();

    cleanup();
    loadSpy.mockRestore();
  });
});
