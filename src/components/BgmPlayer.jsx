// BGM 播放器提供紧凑 HUD、真实音频控制与可逆展开动效。
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { tracks } from "../data/bgm";
import { formatBgmTime, useBgmPlayer } from "./useBgmPlayer";

gsap.registerPlugin(useGSAP);

// 阻止播放器控件点击冒泡到卡片展开层。
function stopControlEvent(event) {
  event.stopPropagation();
}

// 渲染无外部依赖的播放器控制图标。
function PlayerIcon({ name }) {
  const commonProps = {
    "aria-hidden": "true",
    "data-icon": name,
    focusable: "false",
    viewBox: "0 0 24 24",
  };

  if (name === "pause") {
    return (
      <svg {...commonProps}>
        <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
      </svg>
    );
  }

  if (name === "previous") {
    return (
      <svg {...commonProps}>
        <path d="M6 5h3v14H6zM18 5v14L9 12z" />
      </svg>
    );
  }

  if (name === "next") {
    return (
      <svg {...commonProps}>
        <path d="M15 5h3v14h-3zM6 5v14l9-7z" />
      </svg>
    );
  }

  if (name === "volume") {
    return (
      <svg {...commonProps}>
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        <path d="M16 8.2a5 5 0 0 1 0 7.6M18.5 5.8a8.5 8.5 0 0 1 0 12.4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M7 5v14l11-7z" />
    </svg>
  );
}

// 渲染固定左下角的多曲目播放器。
export default function BgmPlayer({ isHome = false, trackList = tracks }) {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const volumeTimelineRef = useRef(null);
  const expansionLockRef = useRef(false);
  const volumeLockRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const player = useBgmPlayer(trackList);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.set(".bgm-drawer", { yPercent: 100 });

      timelineRef.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            expansionLockRef.current = false;
          },
          onReverseComplete: () => {
            gsap.set(".bgm-drawer-viewport", { visibility: "hidden" });
            gsap.set(".bgm-drawer", { yPercent: 100 });
            expansionLockRef.current = false;
          },
        })
        .to(".bgm-collapsed-copy", { autoAlpha: 0, x: 28, duration: 0.16 })
        .to(".bgm-play-button", { x: 70, duration: 0.2 }, ">-0.02")
        .fromTo(
          ".bgm-previous-button",
          { autoAlpha: 0, x: 0 },
          { autoAlpha: 1, x: -62, duration: 0.18 },
          ">-0.04",
        )
        .fromTo(
          ".bgm-next-button",
          { autoAlpha: 0, x: 0 },
          { autoAlpha: 1, x: 62, duration: 0.18 },
          "<0.04",
        )
        .set(".bgm-drawer-viewport", { visibility: "visible" })
        .to(".bgm-drawer", { yPercent: 0, duration: 0.32 }, ">-0.02");

      volumeTimelineRef.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            volumeLockRef.current = false;
          },
          onReverseComplete: () => {
            volumeLockRef.current = false;
          },
        })
        .to(".bgm-cover-wrap", { x: -30, duration: 0.18 })
        .to(
          ".bgm-volume-panel",
          { clipPath: "inset(0% 0 0 0)", duration: 0.2 },
          0,
        );
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  // 切歌后重新尝试加载该曲目的封面。
  useEffect(() => {
    setCoverFailed(false);
  }, [player.currentTrack.cover]);

  // 按严格时间线展开或反向收起播放器。
  function toggleExpanded() {
    const timeline = timelineRef.current;
    if (expansionLockRef.current) return;

    if (isExpanded && isVolumeOpen) {
      volumeTimelineRef.current?.progress(0).pause();
      setIsVolumeOpen(false);
    }

    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);
    if (!reducedMotion) {
      expansionLockRef.current = true;
      if (nextExpanded) timeline?.play();
      else timeline?.reverse();
    }
  }

  // 展开或收回独立音量区。
  function toggleVolume() {
    const timeline = volumeTimelineRef.current;
    if (volumeLockRef.current) return;
    const nextOpen = !isVolumeOpen;
    setIsVolumeOpen(nextOpen);
    if (!reducedMotion) {
      volumeLockRef.current = true;
      if (nextOpen) timeline?.play();
      else timeline?.reverse();
    }
  }

  const durationLabel = player.duration > 0 ? formatBgmTime(player.duration) : "--:--";
  const progressPercent = player.duration
    ? `${(player.currentTime / player.duration) * 100}%`
    : "0%";

  return (
    <aside
      ref={rootRef}
      className={`bgm-player ${isHome ? "bgm-player--home" : ""} ${
        isExpanded ? "bgm-player--expanded" : ""
      } ${isVolumeOpen ? "bgm-player--volume-open" : ""}`}
    >
      <audio
        ref={player.audioRef}
        className="bgm-audio"
        preload="metadata"
        onLoadedMetadata={player.handleLoadedMetadata}
        onTimeUpdate={player.handleTimeUpdate}
        onEnded={player.handleEnded}
        onError={player.handleError}
      />

      <div className="bgm-drawer-viewport">
        <section className="bgm-drawer" aria-hidden={!isExpanded} inert={!isExpanded}>
          <div className="bgm-drawer-heading">
            <div className="bgm-drawer-copy" aria-live="polite">
              <strong>{player.currentTrack.title}</strong>
              {player.currentTrack.artist ? <span>{player.currentTrack.artist}</span> : null}
            </div>
            <div
              className="bgm-volume-panel"
              aria-hidden={!isVolumeOpen}
              inert={!isVolumeOpen}
            >
              <span
                className="bgm-volume-fill"
                style={{ height: `${player.volume * 100}%` }}
              />
              <input
                className="bgm-volume-range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={player.volume}
                aria-label="音量"
                onClick={stopControlEvent}
                onChange={(event) => player.setVolume(Number(event.target.value))}
              />
            </div>
            <div className="bgm-cover-wrap">
              {player.currentTrack.cover && !coverFailed ? (
                <img
                  src={player.currentTrack.cover}
                  alt=""
                  onLoad={() => setCoverFailed(false)}
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <span>NO ART</span>
              )}
            </div>
          </div>

          <div className="bgm-progress-row">
            <span>{formatBgmTime(player.currentTime)}</span>
            <label className="bgm-progress-control">
              <input
                className="bgm-progress-range"
                type="range"
                min="0"
                max={player.duration || 0}
                step="0.1"
                value={Math.min(player.currentTime, player.duration || 0)}
                style={{ "--bgm-progress": progressPercent }}
                disabled={!player.duration}
                aria-label="歌曲进度"
                onClick={stopControlEvent}
                onChange={(event) => player.seek(Number(event.target.value))}
              />
            </label>
            <span>{durationLabel}</span>
            <button
              className="bgm-volume-button"
              type="button"
              aria-label={isVolumeOpen ? "收起音量控制" : "展开音量控制"}
              aria-expanded={isVolumeOpen}
              onClick={(event) => {
                stopControlEvent(event);
                toggleVolume();
              }}
            >
              <PlayerIcon name="volume" />
            </button>
          </div>
        </section>
      </div>

      <section className="bgm-base">
        <button
          className="bgm-toggle-surface"
          type="button"
          aria-label={isExpanded ? "收起歌曲详情" : "展开歌曲详情"}
          aria-expanded={isExpanded}
          onClick={toggleExpanded}
        />
        <button
          className="bgm-track-button bgm-previous-button"
          type="button"
          aria-label="上一首"
          onClick={(event) => {
            stopControlEvent(event);
            setCoverFailed(false);
            player.previous();
          }}
        >
          <PlayerIcon name="previous" />
        </button>
        <button
          className="bgm-play-button"
          type="button"
          aria-label={player.isPlaying ? "暂停" : "播放"}
          onClick={(event) => {
            stopControlEvent(event);
            void player.togglePlay();
          }}
        >
          <PlayerIcon name={player.isPlaying ? "pause" : "play"} />
        </button>
        <button
          className="bgm-track-button bgm-next-button"
          type="button"
          aria-label="下一首"
          onClick={(event) => {
            stopControlEvent(event);
            setCoverFailed(false);
            player.next();
          }}
        >
          <PlayerIcon name="next" />
        </button>
        <div className="bgm-collapsed-copy" aria-live="polite">
          <strong className="bgm-player-title">{player.currentTrack.title}</strong>
          {player.currentTrack.artist ? (
            <span className="bgm-player-artist">{player.currentTrack.artist}</span>
          ) : null}
          <span className="bgm-player-status">{player.status}</span>
        </div>
      </section>
    </aside>
  );
}
