# App Shell and Routing

## 模块性质

- 类型：通用基础设施。
- 实现状态：已实现，稳定。
- 冻结状态：不冻结。后续新增正式页面时可以扩展路由，但不应改动持久 Shell 的基本职责。

## 模块功能

`AppShell` 是全站持久外壳，负责组合当前路由页面、全站导航、BGM 播放器和页面转场覆盖层。它不承载页面专属内容，只维护跨页面状态和路由切换入口。

当前已接入页面：

- `/`：Home。
- `/profile`：Profile Sticky Board 正式页面。
- `/portfolio`：Portfolio 占位页。
- `/blog`：Blog 占位页。
- `*`：兜底回 Home。

## 相关文件

- `src/components/AppShell.jsx`
- `src/App.jsx`
- `src/main.jsx`
- `src/data/site.js`
- `src/utils/navigation.js`

## 实现细节

- 使用 React Router 的 `Routes` / `Route` / `useLocation` / `useNavigate` 管理路由。
- 通过 `getPageByPath(pages, location.pathname)` 计算当前页面配置。
- 通过 `currentPage.id` 给根节点设置 `app-shell--{pageId}` 类名。
- 通过 CSS 变量 `--page-color` 和 `--page-ink` 向页面外壳传递当前页面主色和文字色。
- 常驻渲染 `BgmPlayer`、`SidebarAccordion` 和 `PageTransitionOverlay`，避免页面切换时重复卸载这些全站组件。

## 动画效果实现

- `AppShell` 本身不直接写 GSAP 动画。
- 桌面端导航点击后，`handleNavigate()` 创建 `transition` 状态，由 `PageTransitionOverlay` 完成铺屏动画。
- 覆盖层遮住页面后调用 `handleCovered(page)`，再执行真实 `navigate(page.path)`。
- 转场完成后清空 `transition`，并关闭移动端菜单状态。

## 响应式行为

- `AppShell` 通过 `getNavigationMode(window.innerWidth)` 判断移动端点击是否走移动端菜单转场。
- 桌面端走 `PageTransitionOverlay`。
- 移动端菜单自身完成退出动画后直接路由跳转。

## 后续开发边界

- 新增正式页面时，可以替换对应 `PlaceholderPage` 路由元素。
- 不要在 `AppShell` 中堆页面业务内容。
- 不要绕过 `SidebarAccordion` / `PageTransitionOverlay` 自建另一套路由转场。
