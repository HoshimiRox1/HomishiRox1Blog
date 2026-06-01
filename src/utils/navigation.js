// 导航与角色切换的纯函数集中在这里，便于用测试锁定滚轮行为。
export function getNextCharacterIndex(currentIndex, deltaY, totalCharacters) {
  if (totalCharacters <= 0) {
    return 0;
  }

  const direction = deltaY > 0 ? 1 : -1;
  const nextIndex = currentIndex + direction + totalCharacters;

  return nextIndex % totalCharacters;
}

// 根据路径查找页面配置。
export function getPageByPath(pages, path) {
  return pages.find((page) => page.path === path) ?? pages[0];
}

// 根据 id 查找页面配置。
export function getPageById(pages, id) {
  return pages.find((page) => page.id === id) ?? pages[0];
}
