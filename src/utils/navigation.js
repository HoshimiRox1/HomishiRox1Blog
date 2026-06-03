// 导航与角色切换的纯函数集中在这里，便于用测试锁定滚轮行为。
export function getNextCharacterIndex(currentIndex, deltaY, totalCharacters) {
  if (totalCharacters <= 0) {
    return 0;
  }

  const direction = deltaY > 0 ? 1 : -1;
  const nextIndex = currentIndex + direction + totalCharacters;

  return nextIndex % totalCharacters;
}

// 根据触摸滑动方向返回角色切换方向：上/左为上一个，下/右为下一个。
export function getSwipeCharacterDelta(start, end, threshold = 36) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < threshold) {
    return 0;
  }

  if (absX > absY) {
    return deltaX > 0 ? 1 : -1;
  }

  return deltaY > 0 ? 1 : -1;
}

// 根据路径查找页面配置。
export function getPageByPath(pages, path) {
  return pages.find((page) => page.path === path) ?? pages[0];
}

// 根据 id 查找页面配置。
export function getPageById(pages, id) {
  return pages.find((page) => page.id === id) ?? pages[0];
}

// 根据视口宽度选择常驻侧栏或小屏底部菜单。
export function getNavigationMode(viewportWidth, breakpoint = 760) {
  return viewportWidth <= breakpoint ? "mobile-menu" : "sidebar";
}

// 根据小屏菜单状态返回按钮文案。
export function getMobileMenuLabel(isOpen) {
  return isOpen ? "CLOSE" : "MENU";
}

// 桌面侧栏切页需要全屏转场层，手机菜单由自身完成退出动画。
export function shouldUseTransitionOverlay(navigationMode) {
  return navigationMode === "sidebar";
}
