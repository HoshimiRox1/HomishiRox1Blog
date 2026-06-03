// BGM 播放器在 Phase 1 只提供用户触发的占位播放状态。
import { useState } from "react";

// 渲染固定左下角的播放/暂停控件。
export default function BgmPlayer({ isHome }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <aside className={`bgm-player ${isHome ? "bgm-player--home" : ""}`}>
      <button type="button" onClick={() => setIsPlaying((value) => !value)}>
        {isPlaying ? "PAUSE" : "PLAY"}
      </button>
      <div>
        <strong>BGM</strong>
        <span>{isPlaying ? "playing" : "user triggered"}</span>
      </div>
    </aside>
  );
}
