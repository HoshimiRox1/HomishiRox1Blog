# Responsive Navigation

## 模块性质

- 类型：全站通用组件。
- 实现状态：已实现。
- 冻结状态：冻结。桌面/移动端导航切换和移动端下滑竖条菜单已验收，后续默认不再修改。

## 模块功能

该模块定义主导航在不同视口下的表现：

- 桌面端：右侧常驻四条竖向色带。
- 移动端：隐藏右侧侧栏，显示底部 `MENU` / `CLOSE` 按钮，点击后打开四条移动端竖条菜单。

## 相关文件

- `src/components/SidebarAccordion.jsx`
- `src/components/AppShell.jsx`
- `src/utils/navigation.js`
- `src/styles.css`

## 实现细节

- `getNavigationMode(viewportWidth, breakpoint = 760)` 判断当前模式。
- `SidebarAccordion` 同时渲染桌面侧栏、移动端菜单面板和移动端按钮。
- CSS 媒体查询决定桌面和移动端元素可见性。
- React 只维护一个 `isMobileMenuOpen` 状态。
- 移动端菜单按钮通过 `aria-controls` 和 `aria-expanded` 关联菜单面板。

## 动画效果实现

移动端打开菜单：

1. 点击 `MENU`。
2. `.mobile-menu-panel` 设置为可见并允许点击。
3. 四条 `.mobile-menu-band` 从上方按 Home、Profile、Portfolio、Blog 顺序下滑进入。
4. 每条色带停在底部 Menu 按钮上方，不遮挡按钮。

移动端关闭菜单：

1. 点击 `CLOSE` 或当前页面色带。
2. 四条竖条向上滑出。
3. 面板设置为不可见并禁用点击。

移动端点击其他页面：

1. 点击目标 `.mobile-menu-band`。
2. 四条竖条从左到右依次上滑退出。
3. 退出完成后执行路由切换。
4. 关闭菜单状态。

关键动画参数：

- 打开：`duration: 0.56`，`ease: "power3.out"`，`stagger: 0.07`。
- 普通关闭：`duration: 0.34`，`ease: "power2.in"`，`stagger: 0.045`。
- 点击切页退出：`duration: 0.58`，`ease: "power3.in"`，`stagger: 0.075`。

## 响应式行为

- 桌面黑边宽度通过 `--rail-border-width: 4px` 控制。
- 移动端黑边宽度通过 `--rail-border-width: 3px` 控制。
- 桌面真实色带、转场克隆色带和移动端色带都读取同一黑边变量。
- 移动端不调用 `PageTransitionOverlay`，菜单自身承担退出转场。

## 冻结说明

以下内容已冻结：

- `760px` 左右的导航模式切换策略。
- 移动端底部 Menu 按钮。
- 四条竖条从上往下进入、从上方退出的动效。
- 移动端切页不走桌面铺屏覆盖层。
- 菜单不遮挡底部按钮。

后续页面不得单独实现自己的移动端主导航。
