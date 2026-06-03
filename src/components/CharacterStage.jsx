// 角色舞台只负责角色图、标题和入场动效。
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// 渲染所有角色图片节点，并只让当前角色从右侧滑入。
export default function CharacterStage({ character, characters, isVisible }) {
  const stageRef = useRef(null);
  const stagedCharacters = characters?.length ? characters : [character];

  useGSAP(
    () => {
      const q = gsap.utils.selector(stageRef);
      const figures = q(".character-figure");
      const activeFigure = q(".character-figure[data-character-active='true']");
      const meta = q(".character-meta");
      const activeElements = [...activeFigure, ...meta];
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf([...figures, ...meta]);
      gsap.set(figures, {
        autoAlpha: 0,
        xPercent: 26,
        scale: 0.96,
      });

      if (!isVisible) {
        gsap.set(meta, {
          autoAlpha: 0,
          xPercent: 26,
          scale: 0.96,
        });
        return;
      }

      gsap.fromTo(
        activeElements,
        { autoAlpha: 0, xPercent: 26, scale: 0.96 },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: reduceMotion ? 0 : 0.82,
          ease: "power3.out",
          overwrite: "auto",
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
      <div
        className="character-card"
        style={{ "--character-accent": character.accent }}
      >
        <div className="character-stage-shell">
          <div
            className="character-stage-panel"
            aria-hidden={isVisible ? "true" : "false"}
          >
            <strong>ROXY STAGE</strong>
            <span />
          </div>
        </div>
        <span className="character-stage-label">CHARACTER</span>
        {stagedCharacters.map((characterItem) => {
          const isActive = characterItem.id === character.id;

          return (
            <div
              className={`character-figure ${
                isActive ? "character-figure--active" : ""
              }`}
              data-character-active={isActive ? "true" : "false"}
              data-character-id={characterItem.id}
              aria-hidden={!isVisible || !isActive}
              key={characterItem.id}
            >
              <img
                decoding="async"
                fetchPriority="high"
                loading="eager"
                src={characterItem.image}
                alt={isActive ? characterItem.name : ""}
              />
            </div>
          );
        })}
        <div className="character-meta" aria-hidden={!isVisible}>
          <span>{character.name}</span>
          <i className="character-meta-meter" aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}
