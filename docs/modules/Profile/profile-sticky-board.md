# Profile Sticky Board

## 模块性质

- 类型：Profile 页面正式内容模块。
- 实现状态：已实现。
- 冻结状态：不冻结；文案、贴纸数量、头像和链接可按内容阶段继续更新。

## 模块功能

Profile 页面由章节封面和 Sticky Board 两段组成。访问 `/profile` 后先看到沿用 Phase 1 占位页气质的纯色章节封面，滚轮或移动端上滑后进入个人白板。当前桌面端白板已对齐 `profile-preview.html` 的主要构图：整块 whiteboard 内同时容纳浅青身份卡、海报级 `PROFILE / BOARD` 背景标题、五张固定磁贴和底部 meta chips，同时继续复用网站原有的右侧竖条导航。

## 相关文件

- `src/components/ProfilePage.jsx`
- `src/components/ProfileIdentityCard.jsx`
- `src/components/ProfileStickyNote.jsx`
- `src/components/useDraggableNote.js`
- `src/components/SectionCover.jsx`
- `src/data/profile.js`
- `src/utils/profileLayout.js`
- `src/utils/profileResponsive.js`
- `src/styles.css`

## 内容修改位置

- 改名字：`src/data/profile.js`
- 改身份描述：`src/data/profile.js`
- 改贴纸文案：`src/data/profile.js`
- 改链接：`src/data/profile.js`
- 改头像：替换根路径静态资源 `/assets/Avatar.jpg`
- 增加 Profile 图片：确认资源实际落点后，在 `src/data/profile.js` 的 `avatarSrc` 或其他字段里引用。

## 组件边界

- `ProfilePage` 只负责封面/白板阶段切换、动画触发和 whiteboard 组件组合。
- `ProfileIdentityCard` 只负责身份大方块渲染和头像失败 fallback。
- `ProfileStickyNote` 只负责单张磁贴渲染。
- `useDraggableNote` 只负责桌面端拖动状态，状态不持久化。
- `SectionCover` 复用章节封面视觉，供 Profile / Portfolio / Blog 继续扩展。

## 默认布局数据

Profile 桌面端磁贴默认位置不再由碰撞算法计算，而是由 `src/data/profile.js` 中每张 note 的 `layout.desktop` preset 明确给出 `left / top / width / minHeight / rotate / background`。`src/utils/profileLayout.js` 现在只负责把这些 preset 转成统一 CSS 变量，供 `ProfileStickyNote` 使用。

内容维护时优先改：

- 贴纸顺序：`src/data/profile.js`
- 贴纸尺寸：`layout.desktop.width` 和 `layout.desktop.minHeight`
- 贴纸默认坐标：`layout.desktop.left` 和 `layout.desktop.top`
- 贴纸旋转与底色：`layout.desktop.rotate`、`layout.desktop.background`
- 贴纸颜色语义：`tone`

不要直接在 JSX 里写 `left/top`。

## 视觉约束

- 磁贴本体是纯硬矩形，`border-radius: 0`。
- 身份卡是浅青底、粗黑边、圆角和硬阴影，头像保持 `1:1` 圆角矩形。
- 胶囊标签使用 `profile-pill--*` 色彩语义，避免全站同一种薄荷绿。
- 页面继续使用全站竖条导航；白板本体不再渲染页内替代导航。
- 窄屏和移动端由 `.app-shell--profile` 承担滚动，磁贴改为固定错位流，不启用自由拖动。
- 手机态阈值当前提升到 `830px`；`831px - 980px` 保留给平板单列 whiteboard 过渡态。

## 当前沉淀

- Profile route 滚动 ownership 已切到 `.app-shell--profile`，不再影响 Home 的全屏舞台滚动模式。
- Avatar 当前资源路径为 `/assets/Avatar.jpg`，并保留失败 fallback。
- Identity card 当前版本已对齐 preview 气质：浅青底、`1:1` 头像框和双行显示名 `Hoshimi / Rox1`。
- 桌面端磁贴布局已从碰撞算法改为 preview 对齐 preset，避免 1440px 和 1920px 桌面下被压成长条。
- 身份卡、头像框、标题字号和 footer 偏移已改为同一组桌面响应 token，定义在 `src/utils/profileResponsive.js`。
- 手机态阈值已从 `760px` 提前到 `830px`，直接吃掉原先 `830px - 760px` 的尴尬错位区间。

## 已知问题

- 暂无新的已确认视觉阻塞项。

## 响应式行为

- 桌面端使用整块 whiteboard + 全站原有竖条导航。
- 桌面端磁贴 hover 轻微旋转，鼠标拖动改变内存位移。
- `831px - 980px` 改为单列 whiteboard 过渡态。
- `830px` 及以下直接进入移动端：顶部身份卡 + 固定错位贴纸流，关闭拖动和 hover 旋转。
- `prefers-reduced-motion: reduce` 下取消明显自动位移和 hover 过渡。

## 参考文档

- 通用响应式阈值和联动缩放原则：`docs/modules/universal/responsive-layout-thresholds.md`
