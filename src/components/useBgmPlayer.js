// BGM 播放状态与浏览器音频事件集中在此 hook，视图组件只负责展示和动效。
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "roxy-bgm:v1";
const DEFAULT_VOLUME = 0.1;

// 将数值限制在播放器允许的范围内。
function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

// 读取并校验可恢复的播放器状态。
function readStoredState(trackList) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    const trackIndex = trackList.findIndex((track) => track.id === stored?.trackId);

    return {
      trackIndex: trackIndex >= 0 ? trackIndex : 0,
      volume: Number.isFinite(stored?.volume)
        ? clamp(stored.volume, 0, 1)
        : DEFAULT_VOLUME,
      currentTime: Number.isFinite(stored?.currentTime)
        ? Math.max(stored.currentTime, 0)
        : 0,
    };
  } catch {
    return { trackIndex: 0, volume: DEFAULT_VOLUME, currentTime: 0 };
  }
}

// 格式化播放器时间，未知时长由视图使用占位符处理。
export function formatBgmTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

// 管理多曲目播放、进度、音量、错误与持久化。
export function useBgmPlayer(trackList) {
  const initialState = useMemo(() => readStoredState(trackList), [trackList]);
  const audioRef = useRef(null);
  const autoplayAttemptedRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const restoredTimeRef = useRef(initialState.currentTime);
  const [trackIndex, setTrackIndex] = useState(initialState.trackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialState.currentTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialState.volume);
  const [status, setStatus] = useState("user triggered");
  const currentTrack = trackList[trackIndex] ?? trackList[0];

  // 尝试开始播放，并处理浏览器用户激活限制。
  async function play() {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      setIsPlaying(true);
      setStatus("playing");
      return true;
    } catch {
      setIsPlaying(false);
      setStatus("tap play");
      return false;
    }
  }

  // 在播放与暂停之间切换。
  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setStatus("paused");
      return;
    }

    await play();
  }

  // 切换到指定偏移的曲目，并保留当前播放意图。
  function changeTrack(offset, forcePlay = isPlaying) {
    pendingPlayRef.current = forcePlay;
    restoredTimeRef.current = 0;
    setCurrentTime(0);
    setDuration(0);
    setStatus(forcePlay ? "loading" : "ready");
    setTrackIndex((index) => (index + offset + trackList.length) % trackList.length);
  }

  // 更新当前播放位置。
  function seek(nextTime) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextTime)) return;

    const maximum = duration || nextTime;
    const safeTime = clamp(nextTime, 0, maximum);
    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  }

  // 同步音量到音频节点。
  function setVolume(nextVolume) {
    const safeVolume = clamp(nextVolume, 0, 1);
    setVolumeState(safeVolume);
    if (audioRef.current) audioRef.current.volume = safeVolume;
  }

  // 曲目变更时装载资源，并在需要时延续播放。
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.src;
    audio.volume = volume;
    audio.load();

    if (restoredTimeRef.current > 0) {
      audio.currentTime = restoredTimeRef.current;
      restoredTimeRef.current = 0;
    }

    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      void play();
      return;
    }

    if (!autoplayAttemptedRef.current) {
      autoplayAttemptedRef.current = true;
      void play();
    }
  }, [currentTrack]);

  // 将可恢复状态写入本地存储，但不保存自动播放状态。
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ trackId: currentTrack.id, volume, currentTime }),
    );
  }, [currentTrack.id, currentTime, volume]);

  return {
    audioRef,
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    status,
    volume,
    togglePlay,
    previous: () => changeTrack(-1),
    next: () => changeTrack(1),
    seek,
    setVolume,
    handleLoadedMetadata(event) {
      const nextDuration = Number.isFinite(event.currentTarget.duration)
        ? event.currentTarget.duration
        : 0;
      setDuration(nextDuration);
    },
    handleTimeUpdate(event) {
      setCurrentTime(event.currentTarget.currentTime);
    },
    handleEnded() {
      changeTrack(1, true);
    },
    handleError() {
      setIsPlaying(false);
      setStatus("audio unavailable");
    },
  };
}
