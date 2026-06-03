// Home 页面管理首屏海报状态、角色图片预热和滚轮切换入口。
import { useEffect, useRef, useState } from "react";
import { characters } from "../data/site";
import {
  getNextCharacterIndex,
  getSwipeCharacterDelta,
} from "../utils/navigation";
import CharacterStage from "./CharacterStage";
import MarqueeBar from "./MarqueeBar";

const ANIMATION_LOCK_MS = 850;
const GESTURE_IDLE_UNLOCK_MS = 220;

// 渲染首页首屏、滚轮状态和角色舞台。
export default function HomePage() {
  const animationLockUntilRef = useRef(0);
  const lockRef = useRef(false);
  const lockTimeoutRef = useRef(null);
  const touchStartRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEnteredStage, setHasEnteredStage] = useState(false);

  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        window.clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  // 释放锁需要同时等动画结束和滚轮/滑动惯性结束。
  function scheduleLockRelease() {
    if (lockTimeoutRef.current) {
      window.clearTimeout(lockTimeoutRef.current);
    }

    const releaseDelay = Math.max(
      GESTURE_IDLE_UNLOCK_MS,
      animationLockUntilRef.current -
        window.performance.now() +
        GESTURE_IDLE_UNLOCK_MS,
    );

    lockTimeoutRef.current = window.setTimeout(() => {
      lockRef.current = false;
      lockTimeoutRef.current = null;
    }, releaseDelay);
  }

  // 统一处理角色进入和切换，动画期间锁定。
  function advanceStage(delta) {
    if (delta === 0) {
      return;
    }

    if (lockRef.current) {
      scheduleLockRelease();
      return;
    }

    lockRef.current = true;
    animationLockUntilRef.current = window.performance.now() + ANIMATION_LOCK_MS;
    if (!hasEnteredStage) {
      setHasEnteredStage(true);
    } else {
      setActiveIndex((current) =>
        getNextCharacterIndex(current, delta, characters.length),
      );
    }

    scheduleLockRelease();
  }

  // 处理一次滚轮手势，只推进一个角色。
  function handleWheel(event) {
    event.preventDefault();
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
      </div>
      <div className="home-hint-rail">
        <div className="home-hint-card">
          <strong>SCROLL TO WAKE THE STAGE</strong>
          <span>硬海报标题 + 清爽底色 + 粗野信息条</span>
        </div>
      </div>

      <CharacterStage
        character={characters[activeIndex]}
        characters={characters}
        isVisible={hasEnteredStage}
      />
      <div className="character-preload" aria-hidden="true">
        {characters.map((characterItem) => (
          <img
            data-character-preload="true"
            decoding="async"
            fetchPriority="high"
            key={characterItem.id}
            loading="eager"
            src={characterItem.image}
            alt=""
          />
        ))}
      </div>
      <MarqueeBar />
    </section>
  );
}
