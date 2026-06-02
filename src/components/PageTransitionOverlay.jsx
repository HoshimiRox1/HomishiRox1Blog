// 色带转场覆盖层独立于路由，保证点击导航时先铺屏再换页。
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { pages } from "../data/site";

gsap.registerPlugin(useGSAP);

// 根据 transition 状态执行四条竖带展开、路由切换、倒放缩回。
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
      const track = overlay.querySelector(".transition-band-track");
      const sidebarBands = Array.from(document.querySelectorAll(".sidebar-band"));
      const transitionLabels = gsap.utils.toArray(
        ".transition-band-label",
        overlay,
      );

      if (reduceMotion || sidebarBands.length === 0) {
        onCovered(transition.page);
        onComplete();
        return;
      }

      const sidebarRect = sidebarBands[0].parentElement.getBoundingClientRect();

      gsap.set(overlay, {
        autoAlpha: 1,
      });
      gsap.set(track, {
        right: 0,
        top: sidebarRect.top,
        width: sidebarRect.width,
        height: sidebarRect.height,
      });
      gsap.set(transitionLabels, { y: 0, autoAlpha: 1 });

      const tl = gsap.timeline({
        onComplete,
      });

      tl.to(transitionLabels, {
        y: 58,
        autoAlpha: 0,
        duration: 0.28,
        ease: "power2.in",
        stagger: 0.06,
      }).to(
        track,
        {
          width: window.innerWidth,
          duration: 0.64,
          ease: "power3.inOut",
          onComplete: () => onCovered(transition.page),
        },
        0.18,
      ).to(track, {
        width: sidebarRect.width,
        duration: 0.58,
        ease: "power3.inOut",
        delay: 0.08,
      }).to(transitionLabels, {
        y: 0,
        autoAlpha: 1,
        duration: 0.22,
        ease: "power2.out",
        stagger: {
          each: 0.045,
          from: "end",
        },
      }, "-=0.18").set(overlay, {
        autoAlpha: 0,
      }).set(overlay, {
        clearProps: "all",
      });
    },
    { scope: overlayRef, dependencies: [transition?.key] },
  );

  return (
    <div className="page-transition-overlay" ref={overlayRef} aria-hidden="true">
      <div className="transition-band-track">
        {pages.map((page) => (
          <div
            className="transition-band"
            key={page.id}
            style={{ "--band-color": page.color, "--band-ink": page.ink }}
          >
            <span className="transition-band-label">{page.label}</span>
          </div>
        ))}
        <span
          className="transition-band-divider"
          style={{ "--divider-left": "0%" }}
        />
        <span
          className="transition-band-divider"
          style={{ "--divider-left": "25%" }}
        />
        <span
          className="transition-band-divider"
          style={{ "--divider-left": "50%" }}
        />
        <span
          className="transition-band-divider"
          style={{ "--divider-left": "75%" }}
        />
      </div>
    </div>
  );
}
