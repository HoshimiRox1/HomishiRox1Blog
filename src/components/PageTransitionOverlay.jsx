// 色带转场覆盖层独立于路由，保证点击导航时先铺屏再换页。
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// 根据 transition 状态执行铺屏、路由切换、缩回。
export default function PageTransitionOverlay({
  transition,
  onCovered,
  onComplete,
}) {
  const overlayRef = useRef(null);

  useGSAP(
    () => {
      if (!transition) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const overlay = overlayRef.current;

      gsap.set(overlay, {
        backgroundColor: transition.page.color,
        color: transition.page.ink,
        transformOrigin: "right center",
        scaleX: 0,
        autoAlpha: 1,
      });

      const tl = gsap.timeline({
        onComplete,
      });

      tl.to(overlay, {
        scaleX: 1,
        duration: reduceMotion ? 0 : 0.48,
        ease: "power3.inOut",
        onComplete: () => onCovered(transition.page),
      }).to(overlay, {
        scaleX: 0,
        duration: reduceMotion ? 0 : 0.42,
        ease: "power3.inOut",
        transformOrigin: "left center",
        delay: reduceMotion ? 0 : 0.08,
      }).set(overlay, {
        autoAlpha: 0,
      });
    },
    { scope: overlayRef, dependencies: [transition?.key] },
  );

  return (
    <div className="page-transition-overlay" ref={overlayRef} aria-hidden="true">
      <span>{transition?.page.label}</span>
    </div>
  );
}
