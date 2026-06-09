// 全站外壳负责持久导航、播放器和路由转场，不承载页面专属内容。
import { useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { pages } from "../data/site";
import { getNavigationMode, getPageByPath, shouldUseTransitionOverlay } from "../utils/navigation";
import BgmPlayer from "./BgmPlayer";
import HomePage from "./HomePage";
import PageTransitionOverlay from "./PageTransitionOverlay";
import PlaceholderPage from "./PlaceholderPage";
import ProfilePage from "./ProfilePage";
import SidebarAccordion from "./SidebarAccordion";

// 组合持久 Shell 与当前路由页面。
export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = useMemo(
    () => getPageByPath(pages, location.pathname),
    [location.pathname],
  );
  const [transition, setTransition] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 触发色带铺屏转场，并在遮盖完成后切换路由。
  function handleNavigate(page, navigationMode = "sidebar") {
    if (page.path === location.pathname || transition) {
      return;
    }

    if (!shouldUseTransitionOverlay(navigationMode)) {
      navigate(page.path);
      setIsMobileMenuOpen(false);
      return;
    }

    setTransition({
      key: `${page.id}-${Date.now()}`,
      page,
    });
  }

  // 覆盖层完全遮住屏幕后执行真实路由跳转。
  function handleCovered(page) {
    navigate(page.path);
  }

  return (
    <div
      className={`app-shell app-shell--${currentPage.id}`}
      style={{ "--page-color": currentPage.color, "--page-ink": currentPage.ink }}
    >
      <main className="app-main" aria-live="polite">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/portfolio"
            element={<PlaceholderPage pageId="portfolio" />}
          />
          <Route path="/blog" element={<PlaceholderPage pageId="blog" />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <BgmPlayer isHome={currentPage.id === "home"} />
      <SidebarAccordion
        activePageId={currentPage.id}
        isMobileMenuOpen={isMobileMenuOpen}
        isTransitioning={Boolean(transition)}
        onNavigate={handleNavigate}
        onMobileNavigate={(page) =>
          handleNavigate(page, getNavigationMode(window.innerWidth))
        }
        onToggleMobileMenu={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
      />
      <PageTransitionOverlay
        transition={transition}
        onCovered={handleCovered}
        onComplete={() => {
          setTransition(null);
          setIsMobileMenuOpen(false);
        }}
      />
    </div>
  );
}
