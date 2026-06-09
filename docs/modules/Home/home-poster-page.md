# Home Poster Page

## 模块性质

- 类型：Home 页面专用组件。
- 实现状态：已实现，稳定。
- 冻结状态：不完全冻结。Home 母风格已稳定，但后续可在不破坏构图的前提下更新文案或角色系统。

## 模块功能

Home 首屏是全站视觉锚点，负责建立 Roxy Blog 的第一印象。首屏展示大标题、双标签、滚轮提示卡、密网格背景、角色舞台壳和底部 marquee。首屏不直接展示角色图，角色需要通过首次滚轮唤醒。

## 相关文件

- `src/components/HomePage.jsx`
- `src/components/CharacterStage.jsx`
- `src/components/MarqueeBar.jsx`
- `src/data/site.js`
- `src/styles.css`
- `src/components/home-mock-alignment.test.jsx`

## 实现细节

- `HomePage` 持有 `activeIndex` 和 `hasEnteredStage`。
- `.home-grid` 提供背景网格。
- `.home-poster` 承载双标签和 `ROXY BLOG` 换行大标题。
- `.home-hint-rail` / `.home-hint-card` 承载滚轮提示文案。
- `CharacterStage` 在首屏常驻舞台壳，但角色图和 meta 初始隐藏。
- `.character-preload` 预热所有角色图片，避免首次切换时空白。
- `MarqueeBar` 固定在底部提供持续运动感。

## 动画效果实现

- Home 页面自身不做大标题缩小动画。
- 首次有效滚轮只负责把 `hasEnteredStage` 置为 true，唤醒角色舞台。
- 后续滚轮才切换角色索引。
- 滚轮切换由 `lockRef` 和 `animationLockUntilRef` 锁定，避免一次长滚轮触发多次切换。

关键参数：

- 角色动画锁：`ANIMATION_LOCK_MS = 850`。
- 手势空闲解锁：`GESTURE_IDLE_UNLOCK_MS = 220`。

## 响应式行为

- Home 标题和提示卡使用独立响应式轨迹。
- 标题保留海报级缩放趋势。
- 提示卡在桌面和平板区间逐步下沉，贴近 BGM 上方，避免和舞台跳变。
- 首次滚轮后不再推动标题或提示卡额外位移。

## 后续开发边界

- Home 是全站风格校准标准，不应随意弱化主标题、粗边、网格和舞台感。
- 不要把 Home 变成普通 landing page。
- 若要调整 Home 主构图，应先对照 `docs/DESIGN.md` 说明设计理由。
