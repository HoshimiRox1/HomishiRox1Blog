# Profile Placeholder Page

## 模块性质

- 类型：Profile 页面专有入口。
- 实现状态：Phase 1 已实现。
- 冻结状态：占位页不冻结；正式 Profile 页面会在后续 spec 中替换。

## 模块功能

Profile 当前只作为全站骨架验证入口，用于确认导航、路由、页面转场和基础视觉风格可用。它不是正式 Profile 设计。

## 相关文件

- `src/components/PlaceholderPage.jsx`
- `src/components/AppShell.jsx`
- `src/data/site.js`
- `src/styles.css`

## 当前内容

- 展示 `PROFILE` 标题。
- 展示页面编号。
- 描述后续会展开个人档案卡、喜好、联系方式和 GitHub。

## 实现细节

- `PlaceholderPage` 接收 `pageId="profile"`。
- 通过 `getPageById(pages, "profile")` 读取页面配置。
- 通过 `pages.findIndex()` 生成页面编号。

## 动画效果实现

- 进入页面时 `.placeholder-content` 从 `autoAlpha: 0`、`y: 28` 动画到可见位置。
- 时长：`0.62s`。
- 缓动：`power3.out`。
- 支持 `prefers-reduced-motion: reduce`。

## 后续开发边界

- 正式 Profile 应按 `docs/DESIGN.md` 发展为个人档案板 / 角色设定卡。
- 正式实现时应新增或更新 Profile 目录下的模块文档，不要把实现细节塞回通用占位组件文档。
