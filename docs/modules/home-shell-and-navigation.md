# Home Shell and Navigation

## 当前功能

- 已实现 Vite + React 的 Phase 1 单页应用骨架。
- Home 初始首屏展示大标题、小字内容、底部滚动文字，不展示角色。
- Home 首次滚轮揭示当前角色，后续滚轮按方向在两个角色之间循环切换。
- 已接入 `waifus/珂莱塔-cutout.png` 和 `waifus/洛琪希-cutout.png`。
- 右侧常驻 Home / Profile / Portfolio / Blog 四条 FEED 式竖向包豪斯色带。
- 手风琴 hover 和当前页面态只让旋转文字轻微悬浮并带少量阴影；不使用 underline，也不移动或高亮整条色带。
- 点击色带后通过 GSAP 覆盖层铺屏转场，再切换到对应占位页。
- BGM 播放器固定左下角，Home 页面时上移避开底部 marquee。

## 采用架构

- React Router 提供轻量页面路由，`AppShell` 常驻渲染导航、播放器和转场层。
- 页面、角色、文案和配色集中在 `src/data/site.js`。
- 角色索引和页面查找逻辑在 `src/utils/navigation.js`，并用 Vitest 覆盖。
- 核心动效由 GSAP 和 `@gsap/react` 管理，组件内使用 scoped animation 和 reduced-motion fallback。
- 全局视觉系统使用普通 CSS，不引入 UI 框架。

## 相关文件索引

### 界面层

- `src/App.jsx`
- `src/main.jsx`
- `src/components/AppShell.jsx`
- `src/components/HomePage.jsx`
- `src/components/CharacterStage.jsx`
- `src/components/SidebarAccordion.jsx`
- `src/components/PageTransitionOverlay.jsx`
- `src/components/MarqueeBar.jsx`
- `src/components/BgmPlayer.jsx`
- `src/components/PlaceholderPage.jsx`
- `src/styles.css`

### 业务逻辑层

- `src/utils/navigation.js`

### 数据层

- `src/data/site.js`
- `waifus/珂莱塔-cutout.png`
- `waifus/洛琪希-cutout.png`

### 配置与脚本

- `package.json`
- `vite.config.js`
- `index.html`

### 测试

- `src/utils/navigation.test.js`

## 实现细节

- `AppShell` 根据当前 `location.pathname` 查找 active page，避免每个页面重复管理导航状态。
- `SidebarAccordion` 只发起导航意图；真实 `navigate()` 在 `PageTransitionOverlay` 铺屏后执行。
- `SidebarAccordion` 的 hover/active 视觉反馈只落在 `span` 文本上：`rotate(90deg) translateY(-4px)` 加轻量 `text-shadow`；色带按钮本体保持 `transform/filter: none`。
- `HomePage` 使用 `lockRef` 管理 850ms 滚轮锁，避免一次手势或动画期间连续跳多个角色。
- 首次有效滚轮只从首屏进入角色舞台，不把索引从 0 跳到 1；后续滚轮才调用 `getNextCharacterIndex`。
- `getNextCharacterIndex` 使用 delta 方向推进一步，并在首尾循环；下滚到末尾后继续从第一个角色入场，不做倒放动画。
- `BgmPlayer` 目前是占位播放状态，不加载真实音频，符合浏览器自动播放限制。

## 对外接口

- `getNextCharacterIndex(currentIndex, deltaY, totalCharacters)`：返回按滚轮方向循环后的角色索引。
- `getPageByPath(pages, path)`：按路径查找页面配置，失败回 Home。
- `getPageById(pages, id)`：按 id 查找页面配置，失败回 Home。

## 环境变量

不适用。

## 验证和调用方式

- 安装依赖：在项目根目录运行 `npm install`。
- 自动测试：在项目根目录运行 `npm test`，成功标志为 `src/utils/navigation.test.js` 6 条测试全部通过。
- 生产构建：在项目根目录运行 `npm run build`，成功标志为 Vite build exit 0。
- 本地预览：运行 `npm run dev -- --host 127.0.0.1` 后打开 `http://127.0.0.1:5173/`。

## 下一步 TODO

- 接入真实 BGM 曲目、音量和持久化状态。
- 扩展到 5 个角色素材和角色顺序配置。
- 后续 spec 中实现 Profile、Portfolio、Blog 的正式内容。
