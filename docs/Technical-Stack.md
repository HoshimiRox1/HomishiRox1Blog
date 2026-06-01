# Technical Stack

## 1. 当前冻结技术栈

Phase 1 采用：

- Vite
- React
- GSAP
- React Router
- 普通 CSS 或 CSS Modules
- 静态本地数据对象 / JSON

当前阶段不引入数据库、后端服务、CMS、队列、对象存储或服务端渲染框架。

## 2. 选型理由

Roxy Blog 的第一阶段重点是强交互主页，而不是内容管理系统。Vite + React + GSAP 适合快速实现以下能力：

- 右侧 FEED 式竖向色带手风琴。
- Home 内滚轮手势锁定的角色切换。
- 大标题缩放、滑动、裁切和角色入场。
- 底部无缝滚动文字。
- 全站 BGM 播放器状态管理。
- Profile、Portfolio、Blog 占位页的轻量路由切换。

React 用于组织页面和组件状态；GSAP 用于处理时间线、滚轮触发、转场和高精度动画；Vite 用于保持开发体验轻量。

## 3. 未来 Astro 兼容策略

未来当 Blog 和笔记书架成为内容重点时，可以迁移或扩展为 Astro 外壳 + React Islands：

- Astro 负责静态内容、SEO、博客结构和内容集合。
- React + GSAP 保留 Home、Portfolio 动效、BGM 播放器等强交互区域。
- 现有 React 应用可以先整体挂入 Astro 页面，再逐步拆分。

为了给未来迁移留后路，Phase 1 需要遵守：

- 页面边界清楚：Home、ProfilePlaceholder、PortfolioPlaceholder、BlogPlaceholder。
- 动效逻辑封装为组件或 hook，不散落在全局脚本里。
- 内容数据使用本地对象或 JSON，不绑死到复杂 SPA 状态机。
- BGM 播放器保持独立全局组件。
- 路由保持轻量，不提前引入复杂权限、数据加载或服务端依赖。

## 4. 关键依赖边界

- GSAP 是核心动效依赖，新增 GSAP 插件前需要说明用途。
- React Router 只负责 Phase 1 的页面状态和占位页切换。
- 不新增大型 UI 框架，除非用户确认。
- 不使用外部 CDN 脚本作为运行依赖。
- 不把角色素材上传到第三方服务。

## 5. 验证方式

后续实现阶段至少需要验证：

- `npm run build` 能成功完成生产构建。
- 本地预览中 Home 首屏、角色切换、手风琴转场、占位页、BGM 控件可见且不互相遮挡。
- 移动端或窄屏下，右侧手风琴需要有明确降级方案。
- 对 `prefers-reduced-motion` 用户提供弱动效或无动效退路。
