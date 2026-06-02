# Home Shell and Navigation

## 当前功能

- 已实现 Vite + React 的 Phase 1 单页应用骨架。
- Home 初始首屏展示大标题、小字内容、底部滚动文字，不展示角色。
- Home 首次滚轮揭示当前角色，后续滚轮按方向在两个角色之间循环切换。
- 已接入 `waifus/珂莱塔-cutout.png` 和 `waifus/洛琪希-cutout.png`。
- 桌面端右侧常驻 Home / Profile / Portfolio / Blog 四条 FEED 式竖向包豪斯色带。
- 窄屏端隐藏右侧手风琴，改为底部 Menu 按钮打开四色全屏菜单；菜单四条竖条停在按钮上方，不遮挡按钮。
- 手风琴 hover 使用近白底和对应板块色文字；Home 默认态为冷灰底黑字，避免和主背景或 hover 底色撞色；不保留当前页面高亮状态，不使用 underline、阴影或悬浮位移。
- 桌面端点击色带后通过 GSAP 四色带转场切换页面：文字顺序直接滑出屏幕，不做透明度渐隐；四条文字全部离开后，四色克隆轨道从右侧原位等比横向扩张铺满屏幕，黑边保持固定宽度，切换路由后缩回右侧原位；桌面文字底部保留约 100px 安全距离。
- 窄屏端点击 Menu 后四条竖条从上往下、按 Home / Profile / Portfolio / Blog 顺序依次滑入；点击板块后四条竖条从左到右依次上滑消失，退出完成后切换页面。
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
- `SidebarAccordion` 发起导航意图；桌面真实 `navigate()` 在 `PageTransitionOverlay` 的四列铺屏后执行，窄屏真实 `navigate()` 在手机菜单四列退出后执行。
- `SidebarAccordion` 同时渲染桌面 `.sidebar-accordion` 和窄屏 `.mobile-menu-panel`；CSS 媒体查询决定可见形态，React 只维护一个 `isMobileMenuOpen` 布尔状态。
- `SidebarAccordion` 的 hover 视觉反馈由 `.sidebar-band::before` 和 `.mobile-menu-band::before` 绘制近白色整条背景，文字切换为对应板块色；桌面 `.sidebar-band span` 使用左下角作为右侧锚点和 `rotate(-90deg)`，并加入少量字体视觉出血补偿，让文字字底朝右并与各自色带右边缘接触，同时保持约 50px 底部留白；不使用 `.is-active` 当前页高亮。
- `PageTransitionOverlay` 测量 `.sidebar-accordion` 的当前位置，渲染一个只包含色带和分隔线的 `.transition-band-track` 克隆轨道，轨道内部四条色带用 grid 等分。
- 转场文字不渲染第二套克隆节点：GSAP 直接驱动 `.sidebar-band span` 真实节点依次下滑出屏，并在克隆轨道缩回后按反向顺序归位，避免 handoff 时产生左右偏移或闪烁。
- 桌面转场动画驱动克隆轨道的 `width`：轨道固定在右侧，从 sidebar 当前宽度扩张到视口宽度，执行路由切换后再缩回。轨道内部四条色带使用和真实 sidebar 一致的 grid 等分，每条克隆色带用固定 `border-left` 画黑边，因此扩张时黑边宽度不被缩放。
- 转场期间 `.sidebar-accordion.is-transitioning` 提高层级，并把真实 `.sidebar-band` 的背景和边框设为透明：克隆轨道接管色带视觉，真实文字节点仍留在上层参与动画；动画尾段先进入 `is-handoff-ready` 恢复真实色带和黑边，再隐藏克隆轨道，避免交接闪烁和接缝像素偏移。
- 窄屏转场复用已打开的 `.mobile-menu-band`：点击板块时四条竖条先按从左到右的 stagger 依次上滑消失，退出完成后切换路由并关闭菜单状态；不调用 `PageTransitionOverlay`。
- 响应式黑边宽度由 `--rail-border-width` 统一控制：桌面为 `4px`，窄屏为 `3px`；桌面真实 `.sidebar-band`、转场 `.transition-band` 和窄屏 `.mobile-menu-band` 必须读取同一变量。
- `HomePage` 使用 `lockRef` 管理 850ms 滚轮锁，避免一次手势或动画期间连续跳多个角色。
- 首次有效滚轮只从首屏进入角色舞台，不把索引从 0 跳到 1；后续滚轮才调用 `getNextCharacterIndex`。
- `getNextCharacterIndex` 使用 delta 方向推进一步，并在首尾循环；下滚到末尾后继续从第一个角色入场，不做倒放动画。
- `BgmPlayer` 目前是占位播放状态，不加载真实音频，符合浏览器自动播放限制。

## 对外接口

- `getNextCharacterIndex(currentIndex, deltaY, totalCharacters)`：返回按滚轮方向循环后的角色索引。
- `getPageByPath(pages, path)`：按路径查找页面配置，失败回 Home。
- `getPageById(pages, id)`：按 id 查找页面配置，失败回 Home。
- `getNavigationMode(viewportWidth, breakpoint)`：按视口宽度判断桌面 sidebar 或小屏 Menu 模式。
- `getMobileMenuLabel(isOpen)`：返回小屏菜单按钮的 `MENU` / `CLOSE` 文案。
- `shouldUseTransitionOverlay(navigationMode)`：判断当前导航模式是否需要桌面全屏转场层。

## 环境变量

不适用。

## 验证和调用方式

- 安装依赖：在项目根目录运行 `npm install`。
- 自动测试：在项目根目录运行 `npm test`，成功标志为 `src/utils/navigation.test.js` 9 条测试全部通过。
- 生产构建：在项目根目录运行 `npm run build`，成功标志为 Vite build exit 0。
- 本地预览：运行 `npm run dev -- --host 127.0.0.1` 后打开 `http://127.0.0.1:5173/`。

## 下一步 TODO

- 接入真实 BGM 曲目、音量和持久化状态。
- 扩展到 5 个角色素材和角色顺序配置。
- 后续 spec 中实现 Profile、Portfolio、Blog 的正式内容。
