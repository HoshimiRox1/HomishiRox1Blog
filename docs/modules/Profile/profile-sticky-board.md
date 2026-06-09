# Profile Sticky Board

## 模块性质

- 类型：Profile 页面正式内容模块。
- 实现状态：已实现。
- 冻结状态：不冻结；文案、贴纸数量、头像和链接可按内容阶段继续更新。

## 模块功能

Profile 页面由章节封面和 Sticky Board 两段组成。访问 `/profile` 后先看到沿用 Phase 1 占位页气质的纯色章节封面，滚轮或移动端上滑后进入个人白板。白板左侧是身份大方块，右侧是能力、技术栈、喜好、当前主线和链接贴纸。

## 相关文件

- `src/components/ProfilePage.jsx`
- `src/components/ProfileIdentityCard.jsx`
- `src/components/ProfileStickyNote.jsx`
- `src/components/useDraggableNote.js`
- `src/components/SectionCover.jsx`
- `src/data/profile.js`
- `src/styles.css`

## 内容修改位置

- 改名字：`src/data/profile.js`
- 改身份描述：`src/data/profile.js`
- 改贴纸文案：`src/data/profile.js`
- 改链接：`src/data/profile.js`
- 改头像：替换 `public/assets/profile/avatar.png`
- 增加 Profile 图片：放入 `public/assets/profile/`，再在 `src/data/profile.js` 引用。

## 组件边界

- `ProfilePage` 只负责封面/白板阶段切换、动画触发和组件组合。
- `ProfileIdentityCard` 只负责身份大方块渲染和头像失败 fallback。
- `ProfileStickyNote` 只负责单张贴纸渲染。
- `useDraggableNote` 只负责桌面端拖动状态，状态不持久化。
- `SectionCover` 复用章节封面视觉，供 Profile / Portfolio / Blog 继续扩展。

## 默认布局算法

Profile 桌面端贴纸默认位置不再由手写百分比坐标直接控制，而是由 `src/utils/profileLayout.js` 根据 `preferredSlot`、`size` 和固定候选槽位计算。算法会按贴纸顺序挑选第一个不与已放置贴纸重叠的位置，输出 CSS 变量给 `ProfileStickyNote`。

内容维护时优先改：

- 贴纸顺序：`src/data/profile.js`
- 贴纸尺寸：`size`
- 贴纸默认区域：`preferredSlot`
- 贴纸颜色语义：`tone`

不要直接在 JSX 里写 `left/top`。

## 视觉约束

- 贴纸本体是纯硬矩形，`border-radius: 0`。
- 身份卡允许圆角和硬阴影，且桌面端上下边距由 `--profile-card-edge` 保持一致。
- 胶囊标签使用 `profile-pill--*` 色彩语义，避免全站同一种薄荷绿。
- 窄屏和移动端由 `.app-shell--profile` 承担滚动，贴纸改为固定错位流，不启用自由拖动。

## 当前沉淀

- Profile route 滚动 ownership 已切到 `.app-shell--profile`，不再影响 Home 的全屏舞台滚动模式。
- Identity card 当前版本已调整为更宽侧栏、`1:1` 头像框和单行显示名 `HoshimiRox1`。
- 贴纸默认布局已从手写坐标改为 `src/utils/profileLayout.js` 输出的确定性布局变量。
- 桌面端贴纸比例已从“百分比宽度 + viewport min-height”改为稳定视觉尺寸变量，避免 1440px 和 1920px 桌面下被压成长条。
- 桌面端贴纸内部字号、间距和胶囊尺寸使用紧凑规则；移动端仍恢复固定错位流的原有阅读尺寸。

## 已知问题

- 暂无新的已确认视觉阻塞项。

## 响应式行为

- 桌面端使用左侧身份大方块 + 右侧自由贴纸板。
- 桌面端贴纸 hover 轻微旋转，鼠标拖动改变内存位移。
- 移动端改为顶部身份卡 + 固定错位贴纸流，关闭拖动和 hover 旋转。
- `prefers-reduced-motion: reduce` 下取消明显自动位移和 hover 过渡。
