# Roxy Blog

Roxy Blog 是一个以「冷白底 + 粗黑边 + pastel 色带 + 动漫角色舞台」为核心视觉的个人站。

这个 README 主要是给“改内容”用的。你如果只是想替换文案、图片、头像、歌单、磁贴内容，优先看下面的 **内容入口地图**，通常不需要先去翻组件源码。

## 先读这几个文件

- `docs/DESIGN.md`：全站视觉规则。
- `docs/TODO.md`：当前阶段做到了哪里、下一步要做什么。
- `docs/modules/README.md`：模块文档索引。
- `src/data/site.js`：Home、导航、角色系统的静态数据入口。
- `src/data/profile.js`：Profile 页面内容入口。

## 内容入口地图

| 你想改什么 | 去改哪里 |
| --- | --- |
| Home 页滚动人物图片 | `src/data/site.js` 的 `characters` |
| Home 页标题 / 简介 / 底部滚动文案 | `src/data/site.js` 的 `pages` 和 `marqueeText`，以及 `src/components/HomePage.jsx` |
| BGM 播放器按钮和文案 | `src/components/BgmPlayer.jsx` |
| Profile 页头像 | `src/data/profile.js` 的 `avatarSrc`，图片放在 `public/assets/` |
| Profile 页身份文案 / 名字 / 介绍 | `src/data/profile.js` |
| Profile 页磁贴标题 / 正文 / 标签 / 链接 | `src/data/profile.js` 的 `notes` |
| Profile 页磁贴默认位置 / 旋转 / 底色 | `src/data/profile.js` 的 `notes[*].layout.desktop` |
| 右侧四条色带的名称 / 页面色 | `src/data/site.js` 的 `pages` |
| 页面路由 / 壳层结构 | `src/components/AppShell.jsx` |

## Home 页怎么加新的滚动人物

Home 页的角色数据统一放在 `src/data/site.js` 的 `characters` 数组里。

### 你通常要做的事情

1. 把新的角色图片放进 `waifus/`。
2. 在 `src/data/site.js` 里新增一个角色对象。
3. 保持数组顺序，就是 Home 页滚轮切换的顺序。

### 角色对象长什么样

`characters` 里的每一项一般会包含这些字段：

- `id`：角色唯一标识。
- `name`：角色名。
- `title`：角色入场文案。
- `accent`：角色强调色。
- `image`：角色 cutout 图片路径。

### 图片怎么引用

当前项目里已经用这种方式引用本地图片：

```js
image: new URL("../../waifus/珂莱塔-cutout.png", import.meta.url).href
```

如果你新增图片，建议继续放在 `waifus/`，然后照这个写法补一条。

### 相关文件

- `src/data/site.js`
- `src/components/HomePage.jsx`
- `src/components/CharacterStage.jsx`
- `waifus/`

## BGM 怎么加

现在的 BGM 播放器还是 Phase 1 的占位实现，按钮和状态都在 `src/components/BgmPlayer.jsx`。

### 当前状态

- 只有 `PLAY / PAUSE` 的视觉状态切换。
- 没有接真实音频文件。
- 没有曲目列表、音量控制和持久化。

### 如果你要继续往下做

你主要会改这几个地方：

- `src/components/BgmPlayer.jsx`：播放器 UI 和播放逻辑。
- `src/components/AppShell.jsx`：全站固定挂载 BGM 的位置。
- 如果要把曲目数据独立出来，可以新建一个数据文件，比如 `src/data/bgm.js`。

### 如果你只是想换文案

直接改 `src/components/BgmPlayer.jsx` 里的按钮文字和状态文字就行。

### 如果你要接真实音频

建议先准备：

- 音频文件放到 `public/` 或 `public/assets/`
- 曲目列表数据独立出来
- 保留“用户主动点击后再播放”的交互

## Profile 页头像怎么换

Profile 页头像数据在 `src/data/profile.js` 的 `avatarSrc`。

当前默认头像路径是：

```js
avatarSrc: "/assets/Avatar.jpg"
```

### 你可以怎么改

1. 把新头像图片放到 `public/assets/`。
2. 修改 `src/data/profile.js` 里的 `avatarSrc`。

因为头像是通过 `ProfileIdentityCard` 读取 `profile.avatarSrc` 来渲染的，所以一般不需要改组件本身。

### 相关文件

- `src/data/profile.js`
- `src/components/ProfileIdentityCard.jsx`
- `public/assets/`

## Profile 页磁贴内容怎么改

Profile 页的磁贴内容也都在 `src/data/profile.js`。

### 你通常会改这些字段

每张磁贴都在 `notes` 数组里，常见可改字段如下：

- `kicker`：磁贴左上角小标题
- `title`：磁贴主标题
- `body`：正文内容
- `tags`：标签列表
- `links`：链接列表
- `size`：磁贴尺寸类型
- `tone`：颜色语义
- `layout.desktop`：桌面端默认位置和外观

### 磁贴默认位置怎么调

如果你想改磁贴的默认摆放，不要直接去改 JSX 里的位置。

优先改：

- `layout.desktop.left`
- `layout.desktop.top`
- `layout.desktop.width`
- `layout.desktop.minHeight`
- `layout.desktop.rotate`
- `layout.desktop.background`

### 其他 Profile 文案入口

除了磁贴本身，Profile 页还有这些常改内容：

- `displayName`
- `displayNameLines`
- `handle`
- `indexLabel`
- `identityCopy`
- `cover.title`
- `cover.description`
- `footerTags`

### 相关文件

- `src/data/profile.js`
- `src/components/ProfilePage.jsx`
- `src/components/ProfileStickyNote.jsx`
- `src/components/ProfileIdentityCard.jsx`
- `src/utils/profileLayout.js`
- `src/utils/profileResponsive.js`

## 右侧导航怎么改

四条竖向色带和移动端菜单都来自 `src/data/site.js` 的 `pages` 数组。

你可以在这里改：

- 页面名字
- 路由地址
- 页面识别色
- hover 色
- 页面标题
- 页面描述
- Blog 的分区文案

相关组件：

- `src/components/SidebarAccordion.jsx`
- `src/components/AppShell.jsx`

## 常见内容修改建议

- 想改“文字”，先找 `src/data/`。
- 想改“图片”，先找 `public/assets/`、`waifus/` 或 `src/data/site.js` / `src/data/profile.js` 里的资源引用。
- 想改“页面结构”，再看 `src/components/`。
- 想改“动画和交互”，再看对应组件和 `docs/modules/`。

## 修改后怎么检查

最少跑一次：

```bash
npm run build
```

如果你改了页面内容、图片路径或 Profile 布局，建议再打开浏览器确认：

- Home 角色是否正常显示
- BGM 入口是否还在左下角
- Profile 头像是否能正常加载
- Profile 磁贴文案是否溢出

## 备注

如果你以后要继续把 Blog / Portfolio 从占位页升级成正式内容页，建议也沿用这种方式：

- 数据放 `src/data/`
- 结构放 `src/components/`
- 规则和边界放 `docs/modules/`

