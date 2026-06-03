// Home 页面管理首屏海报状态和角色滚轮切换入口。
import { useRef, useState } from "react";
import { characters } from "../data/site";
import {
  getNextCharacterIndex,
  getSwipeCharacterDelta,
} from "../utils/navigation";
import CharacterStage from "./CharacterStage";
import MarqueeBar from "./MarqueeBar";

// 渲染首页首屏、滚轮状态和角色舞台。
export default function HomePage() {
  const containerRef = useRef(null);
  const lockRef = useRef(false);
  const touchStartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEnteredStage, setHasEnteredStage] = useState(false);

  // 统一处理角色进入和切换，动画期间锁定。
  function advanceStage(delta) {
    if (lockRef.current || delta === 0) {
      return;
    }

    lockRef.current = true;
    if (!hasEnteredStage) {
      setHasEnteredStage(true);
    } else {
      setActiveIndex((current) =>
        getNextCharacterIndex(current, delta, characters.length),
      );
    }

    window.setTimeout(() => {
      lockRef.current = false;
    }, 850);
  }

  // 处理一次滚轮手势，只推进一个角色。
  function handleWheel(event) {
    advanceStage(event.deltaY);
  }

  // 记录触摸起点，用于手机端方向滑动切换人物。
  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  // 手机端滑动：上/左为上一个人物，下/右为下一个人物。
  function handleTouchEnd(event) {
    if (!touchStartRef.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const delta = getSwipeCharacterDelta(touchStartRef.current, {
      x: touch.clientX,
      y: touch.clientY,
    });

    touchStartRef.current = null;
    advanceStage(delta);
  }

  return (
    <section
      className={`home-page ${hasEnteredStage ? "home-page--staged" : ""}`}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onWheel={handleWheel}
      ref={containerRef}
    >
      <div className="home-grid" aria-hidden="true" />
      <div className="home-poster">
        <div className="home-tags" aria-label="Roxy Blog categories">
          <span className="home-tag home-tag--brand">ROXY BLOG</span>
          <span className="home-tag">ANIME / NOTES / WORK</span>
        </div>
        <h1 className="home-title">
          ROXY
          <br />
          BLOG
        </h1>
        <div className="home-hint-card">
          <strong>SCROLL TO WAKE THE STAGE</strong>
          <span>硬海报标题 + 清爽底色 + 粗野信息条</span>
        </div>
      </div>

      <CharacterStage
        character={characters[activeIndex]}
        isVisible={hasEnteredStage}
      />
      <MarqueeBar />
    </section>
  );
}
