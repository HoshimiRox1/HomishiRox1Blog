# Site Data and Navigation Utils

## 模块性质

- 类型：通用基础设施。
- 实现状态：已实现，稳定。
- 冻结状态：不冻结。后续补页面、角色、曲目信息时可以扩展数据，但必须保持现有字段兼容。

## 模块功能

该模块集中管理页面配置、角色配置、底部 marquee 文案和导航相关纯函数。它是页面顺序、页面色彩、角色素材和导航行为的共享事实来源。

## 相关文件

- `src/data/site.js`
- `src/utils/navigation.js`
- `src/utils/navigation.test.js`

## 已实现数据

`pages` 当前包含：

- Home：`#D8CCFF` / hover `#6B4DFF`
- Profile：`#B9F5FF` / hover `#1494AB`
- Portfolio：`#FFE7A6` / hover `#A07400`
- Blog：`#C7F2D4` / hover `#2D7B4D`

`characters` 当前包含：

- 珂莱塔：`waifus/珂莱塔-cutout.png`
- 洛琪希：`waifus/洛琪希-cutout.png`

`marqueeText` 当前为：

- `ROXY BLOG / FRESH BRUTALIST STAGE / HOME / PROFILE / PORTFOLIO / BLOG /`

## 已实现纯函数

- `getNextCharacterIndex(currentIndex, deltaY, totalCharacters)`：按滚轮方向循环角色索引。
- `getSwipeCharacterDelta(start, end, threshold)`：把触摸滑动转成角色切换方向。
- `getPageByPath(pages, path)`：按路径查页面，失败回 Home。
- `getPageById(pages, id)`：按 id 查页面，失败回 Home。
- `getNavigationMode(viewportWidth, breakpoint)`：判断桌面侧栏或移动端菜单。
- `getMobileMenuLabel(isOpen)`：返回 `MENU` / `CLOSE`。
- `shouldUseTransitionOverlay(navigationMode)`：桌面侧栏使用转场覆盖层，移动端菜单不用。

## 动画效果实现

本模块不直接实现动画，只提供动画组件需要的数据和判断函数。

## 后续开发边界

- 新增页面时必须同步 `pages`，保证导航顺序和页面色彩来源一致。
- 扩展角色时优先追加 `characters`，不要把角色素材硬编码到组件里。
- 修改纯函数行为时必须同步更新 `src/utils/navigation.test.js`。
