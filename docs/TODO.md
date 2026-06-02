# TODO

## 当前阶段：Phase 1 主页面与全站骨架

目标：先实现 Roxy Blog 的主页面、右侧手风琴导航、角色滚轮切换、BGM 播放器和三个占位页。

当前实施依据：`docs/superpowers/specs/01-home-shell-and-navigation.md`。

## 已完成

1. 初始化 Vite + React + GSAP 项目结构。
2. 建立页面组件：Home、ProfilePlaceholder、PortfolioPlaceholder、BlogPlaceholder。
3. 建立右侧 FEED 式包豪斯色带手风琴。
4. 实现 Home 首屏：大标题、小字内容、底部滚动文字。
5. 实现 Home 滚轮手势锁：一次滚轮手势只切换一个角色。
6. 接入 `waifus/珂莱塔-cutout.png` 和 `waifus/洛琪希-cutout.png`。
7. 实现左下角 BGM 播放器，Home 页面避开底部滚动文字。
8. 实现 Profile、Portfolio、Blog 的占位页转场。
9. 运行测试、构建和浏览器验证，并同步模块文档。
10. 优化 FEED 式导航响应式：桌面转场改为 transform 接管，小屏改为底部 Menu + 四竖条全屏菜单，并修复文字遮挡与高亮面积不匹配问题。

## 下一步任务

1. 为 BGM 接入真实曲目、音量控制和状态持久化。
2. 补齐 5 个角色 IP 的素材、顺序、标题和配色。
3. 制定 Profile 正式内容 spec。
4. 制定 Portfolio 作品滚动擦除切换 spec。
5. 制定 Blog 四类书架内容系统 spec。

## 暂不做

- Portfolio 完整作品数据和滚动擦除切换。
- Profile 完整个人档案设计。
- Blog 四类书架内容系统。
- 5 个角色 IP 的完整素材系统。
- Astro 迁移或内容集合。
