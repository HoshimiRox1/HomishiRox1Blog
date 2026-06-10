import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tracks } from "../data/bgm";
import BgmPlayer from "./BgmPlayer";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.matchMedia = vi.fn(() => ({
  matches: true,
  addEventListener() {},
  removeEventListener() {},
}));

function renderPlayer(props = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<BgmPlayer {...props} />);
  });

  return {
    container,
    cleanup() {
      act(() => root.unmount());
      container.remove();
    },
  };
}

function click(element) {
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

function changeRange(element, value) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(
      element,
      String(value),
    );
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("BgmPlayer", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(async function play() {
      this.dispatchEvent(new Event("play"));
    });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function pause() {
      this.dispatchEvent(new Event("pause"));
    });
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("starts paused and restores track, volume, and progress without autoplay", () => {
    window.localStorage.setItem(
      "roxy-bgm:v1",
      JSON.stringify({ trackId: tracks[1].id, volume: 0.35, currentTime: 42 }),
    );

    const { container, cleanup } = renderPlayer();

    expect(container.querySelector(".bgm-player-title")?.textContent).toBe(
      tracks[1].title,
    );
    expect(container.querySelector(".bgm-play-button")?.textContent).toBe("PLAY");
    expect(container.querySelector(".bgm-volume-range")?.value).toBe("0.35");
    expect(container.querySelector(".bgm-audio")?.currentTime).toBe(42);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

    cleanup();
  });

  it("plays, pauses, and reports a rejected browser play request", async () => {
    const { container, cleanup } = renderPlayer();
    const audio = container.querySelector(".bgm-audio");
    const playButton = container.querySelector(".bgm-play-button");

    await act(async () => click(playButton));
    expect(playButton.textContent).toBe("PAUSE");

    click(playButton);
    expect(playButton.textContent).toBe("PLAY");

    HTMLMediaElement.prototype.play.mockRejectedValueOnce(
      new DOMException("blocked", "NotAllowedError"),
    );
    await act(async () => click(playButton));
    expect(playButton.textContent).toBe("PLAY");
    expect(container.querySelector(".bgm-player-status")?.textContent).toBe("tap play");

    cleanup();
  });

  it("wraps previous and next controls and continues after a track ends", async () => {
    const { container, cleanup } = renderPlayer();
    const previous = container.querySelector(".bgm-previous-button");
    const next = container.querySelector(".bgm-next-button");
    const audio = container.querySelector(".bgm-audio");

    click(previous);
    expect(container.querySelector(".bgm-player-title")?.textContent).toBe(
      tracks.at(-1).title,
    );

    click(next);
    expect(container.querySelector(".bgm-player-title")?.textContent).toBe(
      tracks[0].title,
    );

    await act(async () => click(container.querySelector(".bgm-play-button")));
    await act(async () => audio.dispatchEvent(new Event("ended")));
    expect(container.querySelector(".bgm-player-title")?.textContent).toBe(
      tracks[1].title,
    );
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    cleanup();
  });

  it("only toggles expansion from the card surface", () => {
    const { container, cleanup } = renderPlayer();
    const player = container.querySelector(".bgm-player");
    const surface = container.querySelector(".bgm-toggle-surface");

    expect(player.className).not.toContain("bgm-player--expanded");
    click(container.querySelector(".bgm-play-button"));
    expect(player.className).not.toContain("bgm-player--expanded");

    click(surface);
    expect(player.className).toContain("bgm-player--expanded");

    click(container.querySelector(".bgm-volume-button"));
    expect(player.className).toContain("bgm-player--expanded");

    cleanup();
  });

  it("hides a missing artist and exposes accessible range controls", () => {
    const customTracks = [
      { ...tracks[0], artist: undefined },
      tracks[1],
      tracks[2],
    ];
    const { container, cleanup } = renderPlayer({ trackList: customTracks });

    expect(container.querySelector(".bgm-player-artist")).toBeNull();
    expect(container.querySelector(".bgm-progress-range")?.getAttribute("aria-label")).toBe(
      "歌曲进度",
    );
    expect(container.querySelector(".bgm-volume-range")?.getAttribute("aria-label")).toBe(
      "音量",
    );

    cleanup();
  });

  it("updates progress and volume and persists both values", () => {
    const { container, cleanup } = renderPlayer();
    const audio = container.querySelector(".bgm-audio");
    Object.defineProperty(audio, "duration", { configurable: true, value: 180 });

    act(() => audio.dispatchEvent(new Event("loadedmetadata")));
    changeRange(container.querySelector(".bgm-progress-range"), 64);
    changeRange(container.querySelector(".bgm-volume-range"), 0.4);

    expect(audio.currentTime).toBe(64);
    expect(audio.volume).toBe(0.4);
    expect(JSON.parse(window.localStorage.getItem("roxy-bgm:v1"))).toMatchObject({
      trackId: tracks[0].id,
      currentTime: 64,
      volume: 0.4,
    });

    cleanup();
  });

  it("shows an audio error without skipping the broken track", () => {
    const { container, cleanup } = renderPlayer();
    const title = container.querySelector(".bgm-player-title")?.textContent;

    act(() => container.querySelector(".bgm-audio").dispatchEvent(new Event("error")));

    expect(container.querySelector(".bgm-player-status")?.textContent).toBe(
      "audio unavailable",
    );
    expect(container.querySelector(".bgm-player-title")?.textContent).toBe(title);

    cleanup();
  });

  it("restores the cover element after a failed cover and a track change", () => {
    const { container, cleanup } = renderPlayer();
    const firstCover = container.querySelector(".bgm-cover-wrap img");

    act(() => firstCover.dispatchEvent(new Event("error")));
    expect(container.querySelector(".bgm-cover-wrap img")).toBeNull();

    click(container.querySelector(".bgm-next-button"));
    expect(container.querySelector(".bgm-cover-wrap img")?.getAttribute("src")).toBe(
      tracks[1].cover,
    );

    cleanup();
  });

  it("restores the cover element when an ended track advances automatically", async () => {
    const { container, cleanup } = renderPlayer();
    act(() =>
      container.querySelector(".bgm-cover-wrap img").dispatchEvent(new Event("error")),
    );

    await act(async () =>
      container.querySelector(".bgm-audio").dispatchEvent(new Event("ended")),
    );

    expect(container.querySelector(".bgm-cover-wrap img")?.getAttribute("src")).toBe(
      tracks[1].cover,
    );

    cleanup();
  });

  it("ignores a repeated surface click while the expansion timeline is active", () => {
    window.matchMedia.mockReturnValueOnce({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    });
    const { container, cleanup } = renderPlayer();
    const surface = container.querySelector(".bgm-toggle-surface");

    click(surface);
    click(surface);

    expect(container.querySelector(".bgm-player")?.className).toContain(
      "bgm-player--expanded",
    );

    cleanup();
  });

  it("removes hidden drawer controls from keyboard interaction", () => {
    const { container, cleanup } = renderPlayer();
    const drawer = container.querySelector(".bgm-drawer");
    const volumePanel = container.querySelector(".bgm-volume-panel");

    expect(drawer.hasAttribute("inert")).toBe(true);
    click(container.querySelector(".bgm-toggle-surface"));
    expect(drawer.hasAttribute("inert")).toBe(false);
    expect(volumePanel.hasAttribute("inert")).toBe(true);

    click(container.querySelector(".bgm-volume-button"));
    expect(volumePanel.hasAttribute("inert")).toBe(false);

    cleanup();
  });
});
