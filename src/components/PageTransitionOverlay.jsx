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
      const sidebarLabels = sidebarBands.map((band) => band.querySelector("span"));

      if (reduceMotion) {
        onCovered(transition.page);
        onComplete();
        return;
      }

      if (sidebarBands.length === 0) {
        onCovered(transition.page);
        onComplete();
        return;
      }

      const sidebarRect = sidebarBands[0].parentElement.getBoundingClientRect();
      const sidebar = sidebarBands[0].parentElement;
      gsap.set(overlay, {
        autoAlpha: 1,
      });
      sidebar.classList.remove("is-handoff-ready");
      gsap.set(track, {
        right: 0,
        top: sidebarRect.top,
        width: sidebarRect.width,
        height: window.innerHeight,
      });
      gsap.set(sidebarLabels, { y: 0 });

      const tl = gsap.timeline({
        onComplete,
      });

      tl.to(sidebarLabels, {
        y: window.innerHeight + 180,
        duration: 0.44,
        ease: "power3.in",
        stagger: 0.06,
      }).to(
        track,
        {
          width: window.innerWidth,
          duration: 0.64,
          ease: "power3.inOut",
          onComplete: () => onCovered(transition.page),
        },
        ">",
      ).to(track, {
        width: sidebarRect.width,
        duration: 0.58,
        ease: "power3.inOut",
        delay: 0.08,
      }).to(sidebarLabels, {
        y: 0,
        duration: 0.26,
        ease: "power2.out",
        stagger: {
          each: 0.045,
          from: "end",
        },
      }, "-=0.18").set(sidebarLabels, {
        clearProps: "transform",
      }).call(() => {
        sidebar.classList.add("is-handoff-ready");
      }).set(overlay, {
        autoAlpha: 0,
      }).set(overlay, {
        clearProps: "all",
      }).set(track, {
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
          />
        ))}
      </div>
    </div>
  );
}
