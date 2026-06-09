# Profile Preview Alignment Design

## 1. 背景

当前 `/profile` 的 Sticky Board 虽然已经修过磁贴长条化，但大屏观感仍然和 `profile-preview.html` 不一致。问题不只是单张磁贴比例，而是整体构图已经偏离示例：

- 示例是一个完整的 `whiteboard` 大白板容器，所有身份卡、标题、磁贴、底部 meta chips 都贴在同一块白板上。
- 当前实现是左侧身份卡 + 右侧磁贴场的 CSS grid，缺少外层白板框，磁贴只在右侧窄字段内排布。
- 示例身份卡是浅青色大卡，带粗边框、圆角和硬阴影；当前身份卡偏白色 HUD 卡。
- 示例磁贴使用 230-270px 固定宽度和手写式绝对坐标；当前磁贴使用布局算法输出尺寸变量，导致大屏视觉不像示例。
- 示例右侧有一个窄的圆角 `side-bands` 视觉栏；当前全站导航是右侧 FEED 色带，字体方向、宽度和框体效果不同。
- 示例头像框本身不是 1:1；本次实现需要保留用户要求的 1:1 圆角矩形头像。

本 spec 的目标是：大屏 Profile Board 视觉直接对齐 `profile-preview.html`，不再继续在当前 grid 结构上补丁式调整。

## 2. 目标

大屏 `/profile` 进入白板阶段后，应读成一整块 Brutalist Profile Whiteboard：

1. 有完整白板背景：白底、细网格、粗黑边框、28px 左右圆角，像示例文件里的 `whiteboard`。
2. 身份卡照抄示例气质：浅青底、6px 黑边、30px 圆角、10px 硬阴影，作为白板内左侧主视觉。
3. 头像资源使用用户放入 assets 的 `Avatar`，头像框保持 1:1 圆角矩形，不能回到示例里的高矩形头像框。
4. 大屏磁贴样式照抄示例：硬矩形、5px 黑边、固定像素宽度、固定绝对坐标、每张有自己的 pastel 底色和旋转角。
5. 大屏右侧栏字体效果和卡片颜色照抄示例的 `side-bands`，同时不破坏现有全站导航路由能力。
6. 保留 Profile 先显示章节封面、滚轮进入白板的流程。
7. 移动端可以继续沿用现有固定错位流，不要求完全照抄示例移动布局，除非后续另开移动端视觉 refinement。

## 3. 非目标

- 不重做 Home、Portfolio、Blog。
- 不改 BGM 播放器。
- 不新增 UI 框架或大型依赖。
- 不把 `profile-preview.html` 作为运行时代码引入；它只作为视觉基准。
- 不在本次扩展 Profile 完整个人内容，只调整现有 Profile 内容的视觉承载方式。

## 4. 视觉基准

以 `profile-preview.html` 的 1440x900 渲染作为大屏参考：

| 元素 | 示例视觉 | 实现要求 |
| --- | --- | --- |
| 页面背景 | 冷白底 + 24px 细网格 | Profile board 阶段保留冷白网格底 |
| 白板 | `whiteboard`，约 28px 页面边距，6px 黑边，28px 圆角，白底 32px 网格 | 新增或重构 `.profile-whiteboard`，成为身份卡和磁贴共同坐标系 |
| 身份卡 | 浅青底，6px 黑边，30px 圆角，10px 硬阴影，白板左内侧绝对定位 | `.profile-identity-card` 改为示例风格；不再是白色卡 |
| 头像 | 示例为高矩形，本项目改为 1:1 | `.profile-avatar` 使用 `aspect-ratio: 1 / 1`，圆角矩形，黑边，图片 `object-fit: cover` |
| 标题 | `PROFILE / BOARD` 超大黑字藏在身份卡后，形成海报压场 | 保留为白板内背景层，可被身份卡局部遮挡 |
| 磁贴 | `.sticky`，230-270px 宽，5px 黑边，16px padding，固定坐标 | `.profile-note` 大屏直接使用示例尺寸、字号、边框、旋转和坐标 |
| 底部 meta | 浅青胶囊 chip，贴在白板底部 | `.profile-board-footer` 改为白板内绝对定位，不再 fixed |
| 侧栏 | 76px 宽，圆角外框，四段 pastel 色块，竖排文字 | 桌面 Profile 内部显示 `.profile-side-bands` 视觉栏；现有全站导航仍负责真实路由 |

## 5. 组件结构

### 5.1 `ProfilePage`

`ProfilePage` 继续负责封面阶段与白板阶段切换。白板阶段结构调整为：

```jsx
<div className="profile-board-shell">
  <section className="profile-whiteboard">
    <div className="profile-board-title">PROFILE<br />BOARD</div>
    <div className="profile-board-hint">DRAG NOTES / HOVER TILT</div>
    <ProfileIdentityCard profile={profile} />
    <div className="profile-note-field">
      {profile.notes.map(...)}
    </div>
    <div className="profile-board-footer">...</div>
  </section>
  <ProfileSideBands />
</div>
```

要点：

- `.profile-board-shell` 对应示例 `.board-shell`。
- `.profile-whiteboard` 对应示例 `.whiteboard`，是大屏绝对定位坐标系。
- `.profile-note-field` 不再拥有独立右侧窄列宽度；大屏时可以 `position: static` 或作为透明覆盖层，让磁贴根据白板坐标定位。

### 5.2 `ProfileIdentityCard`

保留组件边界，但改成示例结构：

- 顶部两颗 `.profile-pill`：`PROFILE / 02` 和 `HoshimiRox1`。
- 中间头像框 `.profile-avatar`。
- 底部标题和简介。

调整点：

- 卡片背景改为 `#B9F5FF`。
- 标题大屏允许换行回到 `Hoshimi<br />Rox1` 的示例效果；如果仍要单行，应另开要求。当前 spec 以示例为准，使用双行。
- 头像框保持 `aspect-ratio: 1 / 1`，宽度 100%，不能使用示例的高矩形比例。

### 5.3 `ProfileStickyNote`

组件继续只负责单张磁贴内容渲染，但大屏 class 和 style 变量要贴近示例：

- `data-note-id` 继续保留，用于测试和拖动。
- `kicker` 渲染为右上角 `.profile-note__kicker`。
- `title`、`body`、`tags`、`links` 保持数据驱动。
- 大屏样式不再按 `size` 自动推导复杂尺寸；直接由 layout preset 给出 `left/top/width/minHeight/rotate/background`。

用户后续称呼统一为“磁贴”，文档和注释中可逐步把“贴纸”改为“磁贴”。

### 5.4 `ProfileSideBands`

新增轻量组件或在 `ProfilePage` 内部渲染。它只负责 Profile 白板里的右侧视觉栏：

- 四段顺序：Home、Profile、Portfolio、Blog。
- 颜色照抄示例：`#D8CCFF`、`#B9F5FF`、`#FFE7A6`、`#C7F2D4`。
- 文字使用 `writing-mode: vertical-rl`。
- 是否点击导航：推荐可点击，并复用现有 `pages` 配置与导航逻辑；如果实现复杂，第一版允许作为纯视觉，但必须不遮挡现有全站导航。

## 6. 数据与资源

### 6.1 Avatar

数据层新增或修改：

```js
avatarSrc: "/assets/profile/Avatar.png"
```

实施前必须用 `rg --files public src` 或 PowerShell 文件搜索确认真实文件名。若用户放的是 `Avatar.jpg`、`Avatar.webp` 或大小写不同，以实际文件名为准。资源推荐放置路径：

```txt
public/assets/profile/Avatar.png
```

原因：Vite 会把 `public` 下资源按根路径服务，组件可直接引用 `/assets/profile/Avatar.png`。

### 6.2 磁贴布局数据

推荐把大屏布局从通用碰撞算法改为示例 preset：

```js
layout: {
  left: "49%",
  top: "12%",
  width: "270px",
  minHeight: "160px",
  rotate: "3deg"
}
```

五张磁贴初始 preset 对齐示例：

| note id | left | top | width | minHeight | color | rotate |
| --- | --- | --- | --- | --- | --- | --- |
| identity | `49%` | `12%` | `270px` | `160px` | `#B9F5FF` | `3deg` |
| loadout | `43%` | `45%` | `230px` | `160px` | `#FFE7A6` | `-3deg` |
| taste | `69%` | `36%` | `230px` | `160px` | `#FFD6E8` | `4deg` |
| current-quest | `53%` | `63%` | `255px` | `160px` | `#D7FFF1` | `2deg` |
| links | `73%` | `69%` | `250px` | `120px` | `#D8CCFF` | `-2deg` |

这些坐标相对于 `.profile-whiteboard`，不是右侧窄列。

## 7. 响应式规则

### 大屏：`min-width: 981px`

- 使用 `profile-preview.html` 的白板布局。
- 页面内容尽量锁在首屏内，不依赖纵向滚动阅读。
- `.profile-board-shell` 使用 `grid-template-columns: minmax(0, 1fr) 76px`，gap 18px，padding 28px。
- 现有全站右侧 FEED 导航如果仍固定显示，需要避免和 Profile 内部 `side-bands` 视觉栏冲突。推荐在 `.app-shell--profile` 桌面白板阶段隐藏全站 `SidebarNavigation`，改由白板内 `ProfileSideBands` 承担 Profile 页面里的视觉导航。

### 窄屏：`max-width: 980px`

- 保留现有 `.profile-board` 单列流式布局或参考示例移动布局单独调整。
- 头像仍保持 1:1。
- 不启用大屏 `side-bands`，继续使用现有移动 Menu。

## 8. 交互与动效

- 封面滚轮进入白板逻辑保持不变。
- 大屏磁贴 hover 旋转照抄示例：hover 增加 `2deg`，奇数项可反向。
- 拖动逻辑继续使用 `useDraggableNotes`，但拖动计算要以 `.profile-whiteboard` 为边界，而不是右侧字段。
- `prefers-reduced-motion: reduce` 下取消 hover transition 和入场 stagger，但保留直接拖动。

## 9. 测试与验收

### 单元测试

更新 `src/components/profile-sticky-board.test.jsx`：

- Profile 数据引用 `Avatar` 资源路径。
- 白板阶段渲染 `.profile-whiteboard`、`.profile-board-title`、`.profile-side-bands`。
- 身份卡仍渲染头像 fallback，头像容器存在。
- 五张磁贴保留 DOM 顺序和 `data-note-id`。

更新或替换 `src/utils/profileLayout.test.js`：

- 如果保留 `profileLayout.js`，测试它输出示例 preset。
- 如果移除碰撞算法，删除对应测试或改为数据 preset 测试。

### 浏览器验收

必须用 Browser 插件验收：

1. 打开 `http://localhost:5173/profile-preview.html`，截图作为参考。
2. 打开 `http://localhost:5173/profile`，滚轮进入白板。
3. 在 1440x900 对比：白板外框、身份卡颜色、磁贴宽度、磁贴文字、右侧栏字体方向、底部 meta chips。
4. 在 1920x1080 对比：磁贴不被拉长，不挤在右侧窄列，白板仍居中完整。
5. 在 390x844 验证移动端无新增遮挡。
6. 检查 console error/warn，无 Vite overlay。

验收标准：

- 大屏第一眼必须像 `profile-preview.html`，而不是当前 grid 版 Profile。
- 磁贴宽度和字体必须接近示例，不再出现“窄而长”的阅读感。
- 身份卡必须是浅青色卡片，头像为 1:1 圆角矩形且能显示 Avatar。
- 背景白板必须存在，并作为所有元素的共同容器。

## 10. 实施边界

本次实现可以覆盖上一轮对大屏磁贴比例的修复，因为新的 spec 以示例为准。需要保留的是：

- Profile 封面进入流程。
- 数据驱动内容。
- 头像 fallback。
- 桌面拖动能力。
- 移动端已有可读性。

不需要保留的是：

- 当前大屏 grid 结构。
- 当前 `preferredSlot` 碰撞式布局算法。
- 当前白色身份卡视觉。
- 当前右侧窄字段内的磁贴布局。

## 11. Spec 自检

- 无 TBD/TODO 占位。
- 大屏目标明确：以 `profile-preview.html` 为视觉事实来源。
- 头像例外明确：保持 1:1 圆角矩形。
- 资源路径规则明确：实施前按真实 Avatar 文件名确认。
- 范围明确：只重做 Profile 白板阶段大屏视觉，移动端只防回归。
