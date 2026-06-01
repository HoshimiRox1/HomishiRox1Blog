// 角色舞台只负责当前角色图、标题和入场动效。
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// 渲染当前角色并在切换时从右侧滑入。
export default function CharacterStage({ character, isVisible }) {
  const stageRef = useRef(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!isVisible) {
        gsap.set(".character-card", { autoAlpha: 0, xPercent: 34 });
        return;
      }

      gsap.fromTo(
        ".character-card",
        { autoAlpha: 0, xPercent: 34, scale: 0.96 },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: reduceMotion ? 0 : 0.82,
          ease: "power3.out",
        },
      );
    },
    { scope: stageRef, dependencies: [character.id, isVisible] },
  );

  return (
    <aside
      className={`character-stage ${isVisible ? "is-visible" : ""}`}
      ref={stageRef}
      aria-hidden={!isVisible}
    >
      <div className="character-card" style={{ "--character-accent": character.accent }}>
        <img src={character.image} alt={character.name} />
        <div className="character-meta">
          <span>{character.name}</span>
          <p>{character.title}</p>
        </div>
      </div>
    </aside>
  );
}
