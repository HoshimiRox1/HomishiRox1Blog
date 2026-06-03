// Home 页面管理首屏海报状态和角色滚轮切换入口。
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { characters } from "../data/site";
import { getNextCharacterIndex } from "../utils/navigation";
import CharacterStage from "./CharacterStage";
import MarqueeBar from "./MarqueeBar";

gsap.registerPlugin(useGSAP);

// 渲染首页首屏、滚轮状态和角色舞台。
export default function HomePage() {
  const containerRef = useRef(null);
  const lockRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEnteredStage, setHasEnteredStage] = useState(false);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(".home-title", {
        scale: hasEnteredStage ? 0.34 : 1,
        x: 0,
        y: hasEnteredStage ? "-25vh" : 0,
        duration: reduceMotion ? 0 : 0.85,
        ease: "power3.inOut",
        transformOrigin: "left top",
      });

      gsap.to(".home-copy", {
        y: hasEnteredStage ? -18 : 0,
        autoAlpha: hasEnteredStage ? 0.68 : 1,
        duration: reduceMotion ? 0 : 0.55,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [hasEnteredStage] },
  );

  // 处理一次滚轮手势，只推进一个角色并在动画期锁定。
  function handleWheel(event) {
    if (lockRef.current || event.deltaY === 0) {
      return;
    }

    lockRef.current = true;
    if (!hasEnteredStage) {
      setHasEnteredStage(true);
    } else {
      setActiveIndex((current) =>
        getNextCharacterIndex(current, event.deltaY, characters.length),
      );
    }

    window.setTimeout(() => {
      lockRef.current = false;
    }, 850);
  }

  return (
    <section
      className={`home-page ${hasEnteredStage ? "home-page--staged" : ""}`}
      onWheel={handleWheel}
      ref={containerRef}
    >
      <div className="home-poster">
        <p className="home-kicker">FRESH BRUTALIST / HOME / STAGE</p>
        <h1 className="home-title">ROXY BLOG</h1>
        <p className="home-copy">
          冷白底、粗黑边框和柔和色块组成这座主页舞台。继续滚轮，角色会从右侧色带后方进入。
        </p>
      </div>

      <CharacterStage
        character={characters[activeIndex]}
        isVisible={hasEnteredStage}
      />
      <MarqueeBar />
    </section>
  );
}
