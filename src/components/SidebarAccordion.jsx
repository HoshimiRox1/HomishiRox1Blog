// 右侧 FEED 式色带手风琴和小屏 Menu 是全站唯一主导航。
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { pages } from "../data/site";
import { getMobileMenuLabel } from "../utils/navigation";

gsap.registerPlugin(useGSAP);

// 渲染四条固定顺序的竖向色带。
export default function SidebarAccordion({
  activePageId,
  isMobileMenuOpen,
  isTransitioning,
  onMobileNavigate,
  onNavigate,
  onToggleMobileMenu,
}) {
  const mobileMenuRef = useRef(null);
  const didInitMobileMenuRef = useRef(false);

  useGSAP(
    () => {
      const panel = mobileMenuRef.current;
      const bands = gsap.utils.toArray(".mobile-menu-band", panel);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf(bands);

      if (isMobileMenuOpen) {
        gsap.set(panel, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.fromTo(
          bands,
          { yPercent: -110 },
          {
            yPercent: 0,
            duration: reduceMotion ? 0 : 0.56,
            ease: "power3.out",
            overwrite: true,
            stagger: 0.07,
          },
        );
        didInitMobileMenuRef.current = true;
        return;
      }

      if (isTransitioning) {
        return;
      }

      if (!didInitMobileMenuRef.current) {
        gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(bands, { yPercent: -110 });
        didInitMobileMenuRef.current = true;
        return;
      }

      gsap.to(bands, {
        yPercent: -110,
        duration: reduceMotion ? 0 : 0.34,
        ease: "power2.in",
        overwrite: true,
        stagger: 0.045,
        onComplete: () => {
          gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        },
      });
    },
    {
      scope: mobileMenuRef,
      dependencies: [isMobileMenuOpen, isTransitioning],
      revertOnUpdate: false,
    },
  );
  function handleMobileBandClick(page) {
    const panel = mobileMenuRef.current;
    const bands = gsap.utils.toArray(".mobile-menu-band", panel);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (activePageId === page.id) {
      onToggleMobileMenu();
      return;
    }

    gsap.killTweensOf(bands);
    gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        onMobileNavigate(page);
      },
    }).to(bands, {
      yPercent: -110,
      duration: reduceMotion ? 0 : 0.58,
      ease: "power3.in",
      overwrite: true,
      stagger: 0.075,
    });
  }

  return (
    <>
      <nav
        className={`sidebar-accordion ${
          isTransitioning ? "is-transitioning" : ""
        }`}
        aria-label="Main sections"
      >
        {pages.map((page) => (
          <button
            className="sidebar-band"
            key={page.id}
            style={{
              "--band-color": page.color,
              "--band-ink": page.ink,
              "--band-hover-ink": page.hoverInk ?? page.color,
            }}
            onClick={() => onNavigate(page)}
            type="button"
          >
            <span>{page.label}</span>
          </button>
        ))}
      </nav>

      <nav
        id="mobile-menu-panel"
        className={`mobile-menu-panel ${
          isMobileMenuOpen ? "is-open" : ""
        } ${isTransitioning ? "is-transitioning" : ""}`}
        ref={mobileMenuRef}
        aria-hidden={!isMobileMenuOpen}
        aria-label="Mobile sections"
      >
        {pages.map((page) => (
          <button
            className="mobile-menu-band"
            key={page.id}
            style={{
              "--band-color": page.color,
              "--band-ink": page.ink,
              "--band-hover-ink": page.hoverInk ?? page.color,
            }}
            onClick={() => handleMobileBandClick(page)}
            type="button"
          >
            <span>{page.label}</span>
          </button>
        ))}
      </nav>

      <button
        className="mobile-menu-toggle"
        aria-controls="mobile-menu-panel"
        aria-expanded={isMobileMenuOpen}
        onClick={onToggleMobileMenu}
        type="button"
      >
        {getMobileMenuLabel(isMobileMenuOpen)}
      </button>
    </>
  );
}
