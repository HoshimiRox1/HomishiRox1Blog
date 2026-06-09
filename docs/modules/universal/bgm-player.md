# BGM Player

## 模块性质

- 类型：全站通用组件。
- 实现状态：Phase 1 已实现。
- 冻结状态：位置和基础 HUD 形态稳定；真实音频、曲目、音量和持久化待扩展。

## 模块功能

BGM 播放器固定在全站左下角，提供用户主动触发的播放/暂停状态。当前阶段不加载真实音频，只保留视觉和交互占位，符合浏览器自动播放限制。

## 相关文件

- `src/components/BgmPlayer.jsx`
- `src/components/AppShell.jsx`
- `src/styles.css`

## 实现细节

- `BgmPlayer` 接收 `isHome`。
- 内部维护 `isPlaying` 状态。
- 按钮文案在 `PLAY` 和 `PAUSE` 之间切换。
- 状态文案在 `user triggered` 和 `playing` 之间切换。
- Home 页面添加 `.bgm-player--home`，上移避开底部 marquee。

## 动画效果实现

当前无 GSAP 动画，只通过状态切换更新文案。视觉上使用白底、黑粗边、圆角和动作粉按钮，符合 `docs/DESIGN.md` 的 HUD 组件规则。

## 响应式行为

- 桌面和移动端均固定左下角。
- Home 页面位置高于底部 marquee。
- 移动端同时避开底部 Menu 和 marquee。

## 后续开发边界

- 后续可接入真实曲目、音量控制和状态持久化。
- 接入真实音频时必须保留用户主动触发播放，不依赖自动播放。
- 扩展前需要同步 `docs/TODO.md` 和相关模块文档。
