# Character Stage

## 模块性质

- 类型：Home 页面专用组件。
- 实现状态：已实现，待扩展。
- 冻结状态：角色入场和手势锁逻辑稳定；角色数量、顺序、标题和配色后续可扩展。

## 模块功能

角色舞台负责展示动漫角色 cutout、舞台背板、`CHARACTER` 标签和角色 meta。它是 Home 内部的视觉内容，不承担全站导航职责。

## 相关文件

- `src/components/CharacterStage.jsx`
- `src/components/HomePage.jsx`
- `src/data/site.js`
- `src/utils/navigation.js`
- `src/styles.css`
- `waifus/珂莱塔-cutout.png`
- `waifus/洛琪希-cutout.png`

## 实现细节

- `CharacterStage` 接收当前 `character`、完整 `characters` 列表和 `isVisible`。
- 所有角色都会渲染为独立 `.character-figure` 节点。
- 当前角色通过 `data-character-active="true"` 标记。
- 切换前会 kill 旧 tween，并隐藏所有角色 figure，再让当前角色入场。
- 舞台壳、`ROXY STAGE` 面板和 `CHARACTER` 标签在首屏常驻。
- 角色 meta 只显示角色名和绿色 meter 条，不显示描述文本，避免遮挡角色脸部。

## 动画效果实现

角色入场动画：

- 初始：`autoAlpha: 0`，`xPercent: 26`，`scale: 0.96`。
- 入场：`autoAlpha: 1`，`xPercent: 0`，`scale: 1`。
- 时长：`0.82s`。
- 缓动：`power3.out`。
- 支持 `prefers-reduced-motion: reduce`，降级为 0 时长。

滚轮和触摸切换：

- `HomePage` 统一处理滚轮和触摸。
- 首次有效滚轮只唤醒舞台，不切到下一个角色。
- 后续滚轮按方向调用 `getNextCharacterIndex()`。
- 触摸滑动通过 `getSwipeCharacterDelta()` 转成切换方向。
- 一次手势只切换一个角色，动画期间锁定。

## 响应式行为

- 舞台高度、角色高度、背板高度使用 `clamp()` / `calc()` 连续缩放。
- 桌面到平板之间避免人物先缩、舞台断崖缩短或提示卡跳变。
- 小屏下舞台整体缩小并避开底部 Menu、BGM 和 marquee。

## 后续开发边界

- 可扩展到 5 个角色 IP。
- 新增角色应优先写入 `src/data/site.js` 的 `characters`，不要在组件里硬编码。
- 角色图必须保持清晰，背景色块不能抢主体。
- 不要把角色系统用于全站页面切换；页面切换仍由侧栏色带负责。
