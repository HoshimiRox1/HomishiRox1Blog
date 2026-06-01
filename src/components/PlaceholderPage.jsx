// 占位页保留 Phase 1 的扩展入口，不提前实现完整内容系统。
import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { pages } from "../data/site";
import { getPageById } from "../utils/navigation";

gsap.registerPlugin(useGSAP);

// 根据 pageId 渲染 Profile、Portfolio 或 Blog 占位内容。
export default function PlaceholderPage({ pageId }) {
  const page = useMemo(() => getPageById(pages, pageId), [pageId]);
  const pageRef = useRef(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.fromTo(
        ".placeholder-content",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.62,
          ease: "power3.out",
        },
      );
    },
    { scope: pageRef, dependencies: [pageId] },
  );

  return (
    <section className="placeholder-page" ref={pageRef}>
      <div className="placeholder-content">
        <p className="placeholder-index">0{pages.findIndex((item) => item.id === page.id) + 1}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        {page.sections ? (
          <ul className="blog-sections">
            {page.sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
