# Profile Sticky Board Design

## 1. 目标

将 Profile 从 Phase 1 占位页升级为正式个人页面。页面不做普通简历，也不做纯数据卡片，而是做成一块 **Brutalist Sticky Board**：左侧固定身份大方块展示用户身份，右侧白板区域贴上能力、技术栈、喜好、当前主线和链接贴纸。

Profile 的第一印象应是：

- 这是一个有审美和表达欲的人。
- 技术栈和能力仍在成长，但方向清楚。
- 兴趣不是装饰，而是驱动这个网站成立的燃料。
- 页面有个人特色，不像招聘简历模板。

参考稿：

- `docs/superpowers/mockups/profile-sticky-board-preview.html`

参考稿用于确认结构、气质和交互，不要求后续实现逐像素复刻。

## 2. 页面结构

### 整体布局

Profile 继承全站清爽新粗野主义视觉语法：

- 冷白背景。
- 黑色粗边框。
- 有层级的粗野形态：个人信息边栏使用圆角矩形和硬阴影，贴纸保持偏方形便利贴感，小标签使用胶囊。
- 低透明网格。
- Profile 页面主色 `#B9F5FF`。
- pastel 辅助色作为贴纸色块。
- 右侧保留 Home / Profile / Portfolio / Blog 色带导航。

### 页面进入机制

Profile 不直接从导航转场进入白板正文。点击 Profile 色带后，先保留当前 Phase 1 已有的纯色背景 + 大标题占位页，将它升级为 Profile 的 **章节封面 / 门面页**。

进入流程：

1. 点击 Profile 色带。
2. 色带转场完成后进入 Profile 封面页。
3. 封面页保持纯色背景、大标题和极简说明，延续现在占位页的酷感。
4. 浏览者进行滚轮、触控板滚动或手机屏幕上滑后，才进入实际 Sticky Board 展示区域。

这个规则后续应推广到 Portfolio / Blog：

- Portfolio 先进入作品章节封面，再滚动进入作品展示。
- Blog 先进入收藏库章节封面，再滚动进入书架/索引系统。

封面页不是临时占位，而是正式页面的一段舞台式开场。实现时不要删除现有占位页气质，也不要改成普通内容页首屏。

桌面端 Sticky Board 主体是一个大白板区域：

- 左侧固定身份大方块。
- 右侧散布多张可交互贴纸。
- 底部可有短状态标签，例如 `NOT A RESUME`、`INTEREST-DRIVEN BUILDER`。

移动端不保留自由拖动布局，改为固定错位贴纸流，保证可读性和触控稳定。

### 左侧身份大方块

身份大方块承担“我是谁”的主视觉，不让右侧贴纸承担全部页面重心。

内容：

- 顶部小标签：`PROFILE / 02` 与 `HoshimiRox1`。
- 头像区域。
- 主显示名：`HoshimiRox1`，视觉排版可拆成两行 `Hoshimi` / `Rox1`。
- 一句个人定位文案。

建议文案：

```txt
审美、兴趣、技术栈和正在升级的能力，都贴在这块个人白板上。
```

头像加载失败时，头像区域显示占位文本：

```txt
???
```

### 右侧贴纸

贴纸是 Profile 的内容主体。每张贴纸使用纯色底和黑色粗边，保持偏方形便利贴感；贴纸不使用白色贴条，不使用阴影，不统一做成大圆角卡片。

贴纸内容结构固定为：

1. 右上角英文小标题。
2. 大号中文说明。
3. 正文、标签或子卡片。

不使用左上角编号，不做数据库式条目编号。

初始贴纸建议：

| 英文小标题 | 大号中文说明 | 内容形式 |
| --- | --- | --- |
| `IDENTITY` | 审美和表达欲先行。 | 一段短正文 |
| `LOADOUT` | 技术栈像装备栏。 | React / CSS / GSAP / Vite / UI Motion 标签 |
| `TASTE` | 兴趣是燃料。 | Anime / Games / Personal Site / Music / Cool UI 标签 |
| `CURRENT QUEST` | 把品味变成能跑的界面。 | 一段短正文 |
| `LINKS` | GitHub / Blog / Mail | 子卡片或链接按钮 |

这些文案可以后续在数据文件中改，不应硬编码散落在组件 JSX 里。

## 3. 交互规则

### 桌面端

贴纸支持：

- 鼠标 hover 时轻微旋转，角度保持在 `2deg` 左右，只作为可交互提示。
- 鼠标或触控板拖动贴纸。

贴纸不支持：

- 鼠标靠近时推开贴纸。
- 碰撞物理模拟。
- 大幅旋转或弹性晃动。

原因：推开效果会干扰阅读，并让 Profile 变成物理玩具感；本页面需要保留信息展示的稳定感。

### 移动端

移动端建议：

- 关闭贴纸拖动。
- 关闭 hover 交互。
- 使用固定错位便签流。
- 左侧身份大方块改为顶部身份卡。
- 右侧色带导航按现有移动端全屏菜单规则处理。

### Reduced Motion

如果用户启用 `prefers-reduced-motion: reduce`：

- hover 旋转可取消或缩短。
- 贴纸入场动效使用无位移或极短过渡。
- 拖动功能仍可保留，因为它是直接操作，不是自动动效。

## 4. 内容与资产配置

### 用户可改内容

正式实现时应把 Profile 内容集中到一个数据文件，建议：

- `src/data/profile.js`

该文件负责：

- 显示名：`HoshimiRox1`。
- 身份大方块描述。
- 头像路径。
- 贴纸列表。
- 技术栈标签。
- 喜好标签。
- 链接列表。

页面组件只负责渲染，不直接散落维护文案。

### 全站资产目录

全站公开资源根目录定为：

```txt
public/assets/
```

不同页面读取各自子目录：

```txt
public/assets/profile/
public/assets/portfolio/
public/assets/blog/
public/assets/characters/
public/assets/audio/
```

Profile 默认头像路径：

```txt
public/assets/profile/avatar.png
```

组件中使用的公开 URL：

```txt
/assets/profile/avatar.png
```

如果头像加载失败，显示 `???` 占位文本。

后续修改位置需要在模块文档中明确：

- 改名字：`src/data/profile.js`。
- 改身份描述：`src/data/profile.js`。
- 改贴纸文案：`src/data/profile.js`。
- 改头像：替换 `public/assets/profile/avatar.png`。
- 增加 Profile 图片：放入 `public/assets/profile/`，再在 `src/data/profile.js` 引用。

## 5. 组件边界

建议新增或调整组件：

- `ProfilePage`：Profile 页面主体。
- `SectionCover` 或页面内封面组件：复用现有占位页气质，承载 Profile / Portfolio / Blog 的章节封面。
- `ProfileIdentityCard`：左侧身份大方块。
- `ProfileStickyNote`：单张贴纸。
- `DraggableNoteLayer` 或轻量 hook：管理桌面端贴纸拖动。

数据流：

```txt
src/data/profile.js
  -> ProfilePage
    -> ProfileIdentityCard
    -> ProfileStickyNote[]
```

拖动状态只存在于前端内存中，不需要持久化。刷新后贴纸回到默认布局。

## 6. 视觉规则

必须保留：

- 冷白 / 纸白背景。
- 黑色粗边框。
- 物件层级差异：个人信息边栏使用圆角矩形 + 硬阴影；贴纸使用偏方形粗框色块；标签/小状态使用胶囊。
- Profile 浅青主色 `#B9F5FF`。
- pastel 贴纸色块。
- 强字体、短文案、高字重。
- 清晰的白板结构。
- Profile 封面页的纯色背景 + 大标题压场感。

不要使用：

- 玻璃态。
- 渐变背景。
- 霓虹光效。
- 柔光阴影。
- 白色贴条。
- 贴纸阴影。
- 鼠标推开贴纸。
- 普通简历卡片网格。
- 所有模块同质化成同一种圆角卡片。
- 直接跳过 Profile 封面进入内容区。

## 7. 验收标准

内容验收：

- 页面能展示 `HoshimiRox1`。
- 没有头像文件时，头像区域显示 `???`。
- 能展示能力、技术栈、喜好、当前主线和链接。
- 文案不是招聘式简历，也不是过度中二设定卡。

视觉验收：

- 点击 Profile 后先看到保留下来的章节封面，而不是直接进入白板内容。
- 第一眼像一块粗野风格个人白板。
- 左侧身份大方块是稳定视觉重心，并使用圆角矩形 + 硬阴影与贴纸区拉开层级。
- 右侧贴纸有错位、色块和个人感，贴纸本体保持偏方形便利贴感。
- 标签和小状态可以使用胶囊，但贴纸、身份卡和标签不能全部同质化成同一种圆角。
- 没有贴条、阴影和鼠标推开效果。
- 与 `docs/DESIGN.md` 的 Profile 页面方向一致。

交互验收：

- 在 Profile 封面页滚动或移动端上滑后，进入 Sticky Board 展示区域。
- 桌面端贴纸可拖动。
- 桌面端 hover 贴纸只轻微旋转。
- 拖动后不影响页面导航。
- 移动端贴纸固定排列且文本不遮挡。
- `prefers-reduced-motion` 下不会出现明显自动运动。

实现验收：

- 修改后运行测试或构建。
- 使用浏览器验证桌面与移动视口。
- 对动效和拖动任务，必须实际验证可见交互，而不是只检查代码存在。
