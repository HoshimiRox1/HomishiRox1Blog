# Desktop Navigation and Page Transition

## 模块性质

- 类型：全站通用组件。
- 实现状态：已实现。
- 冻结状态：冻结。桌面侧栏色带、点击切页动效和铺屏转场已验收，后续默认不再修改。

## 模块功能

桌面端右侧 FEED 式色带是全站主导航和核心视觉记忆点。它展示 Home、Profile、Portfolio、Blog 四条竖向色带，点击后先执行色带铺屏转场，再切换路由。

## 相关文件

- `src/components/SidebarAccordion.jsx`
- `src/components/PageTransitionOverlay.jsx`
- `src/components/AppShell.jsx`
- `src/data/site.js`
- `src/utils/navigation.js`
- `src/styles.css`

## 实现细节

- `SidebarAccordion` 渲染桌面 `.sidebar-accordion` 和四个 `.sidebar-band`。
- 四条色带由 `pages` 配置驱动，顺序固定为 Home、Profile、Portfolio、Blog。
- 每条色带读取 CSS 变量：
  - `--band-color`
  - `--band-ink`
  - `--band-hover-ink`
- 桌面文字为旋转文字，锚定在色带底部区域。
- 当前页面不保留 active 高亮，避免侧栏视觉状态复杂化。
- `PageTransitionOverlay` 渲染 `.transition-band-track` 克隆轨道，只克隆色带，不克隆文字。
- 转场期间真实侧栏进入 `is-transitioning`，由克隆轨道接管色带视觉。

## 动画效果实现

桌面点击切页流程：

1. 用户点击真实 `.sidebar-band`。
2. `AppShell.handleNavigate()` 设置 `transition`。
3. `PageTransitionOverlay` 测量真实侧栏位置和宽度。
4. 真实侧栏文字节点按顺序向下滑出屏幕。
5. 克隆色带轨道从右侧原位横向扩张到铺满视口。
6. 覆盖完成后执行真实路由跳转。
7. 克隆色带轨道缩回右侧原位。
8. 真实文字节点按反向顺序滑回。
9. 清理 transform 和覆盖层样式。

关键动画参数：

- 文字滑出：`duration: 0.44`，`ease: "power3.in"`，`stagger: 0.06`。
- 色带铺屏：`duration: 0.64`，`ease: "power3.inOut"`。
- 色带缩回：`duration: 0.58`，`ease: "power3.inOut"`。
- 文字归位：`duration: 0.26`，`ease: "power2.out"`，从末尾反向 stagger。

## 响应式行为

- 该模块只负责桌面侧栏和桌面铺屏转场。
- 视口进入移动端断点后，切换到 `responsive-navigation.md` 记录的移动端 Menu 机制。

## 冻结说明

以下内容已冻结：

- 右侧四条竖向色带作为桌面主导航。
- Home / Profile / Portfolio / Blog 顺序。
- 文字滑出、色带铺屏、路由切换、色带缩回、文字归位的动画流程。
- 不保留当前页高亮。
- 不使用淡入淡出作为主要切页动画。

若要调整该模块，必须先说明为什么当前冻结实现无法满足新需求，并提供桌面和移动端回归验证方案。
