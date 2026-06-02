// 右侧 FEED 式色带手风琴是全站唯一主导航。
import { pages } from "../data/site";

// 渲染四条固定顺序的竖向色带。
export default function SidebarAccordion({
  activePageId,
  isTransitioning,
  onNavigate,
}) {
  return (
    <nav
      className={`sidebar-accordion ${
        isTransitioning ? "is-transitioning" : ""
      }`}
      aria-label="Main sections"
    >
      {pages.map((page) => (
        <button
          className={`sidebar-band ${
            activePageId === page.id ? "is-active" : ""
          }`}
          key={page.id}
          style={{ "--band-color": page.color, "--band-ink": page.ink }}
          onClick={() => onNavigate(page)}
          type="button"
        >
          <span>{page.label}</span>
        </button>
      ))}
    </nav>
  );
}
