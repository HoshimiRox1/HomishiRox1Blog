# Modules README

> 本目录按“通用模块 / 页面专有模块”组织 Roxy Blog 的实现文档。后续开发先读 `docs/DESIGN.md`，再按本索引读取对应模块文档。

## 目录结构

```txt
docs/modules/
├─ README.md
├─ universal/
│  ├─ app-shell-routing.md
│  ├─ site-data-and-navigation-utils.md
│  ├─ navigation-page-transition.md
│  ├─ responsive-navigation.md
│  ├─ responsive-layout-thresholds.md
│  └─ bgm-player.md
├─ Home/
│  ├─ home-poster-page.md
│  ├─ character-stage.md
│  └─ home-marquee.md
├─ Profile/
│  ├─ placeholder-page.md
│  └─ profile-sticky-board.md
├─ Portfolio/
│  └─ placeholder-page.md
└─ Blog/
   └─ placeholder-page.md
```

## 通用模块

| 模块 | 文档 | 状态 |
| --- | --- | --- |
| 应用外壳与路由 | `docs/modules/universal/app-shell-routing.md` | 已实现，稳定 |
| 全站数据与导航纯函数 | `docs/modules/universal/site-data-and-navigation-utils.md` | 已实现，稳定 |
| 桌面侧栏色带导航与页面转场 | `docs/modules/universal/navigation-page-transition.md` | 已实现，冻结 |
| 响应式导航与移动端 Menu | `docs/modules/universal/responsive-navigation.md` | 已实现，冻结 |
| 响应式分段与联动缩放原则 | `docs/modules/universal/responsive-layout-thresholds.md` | 已沉淀，供后续页面复用 |
| BGM 播放器 | `docs/modules/universal/bgm-player.md` | Phase 1 已实现，待接真实音频 |

## 页面专有模块

### Home

| 模块 | 文档 | 状态 |
| --- | --- | --- |
| Home 海报首屏 | `docs/modules/Home/home-poster-page.md` | 已实现，稳定 |
| Home 角色舞台与滚轮切换 | `docs/modules/Home/character-stage.md` | 已实现，待扩展 5 个角色 |
| Home 底部 Marquee | `docs/modules/Home/home-marquee.md` | 已实现，稳定 |

### Profile

| 模块 | 文档 | 状态 |
| --- | --- | --- |
| Profile Sticky Board | `docs/modules/Profile/profile-sticky-board.md` | 已实现，待内容继续打磨 |
| Profile 占位页 | `docs/modules/Profile/placeholder-page.md` | Phase 1 历史入口，已被正式页面替换 |

### Portfolio

| 模块 | 文档 | 状态 |
| --- | --- | --- |
| Portfolio 占位页 | `docs/modules/Portfolio/placeholder-page.md` | Phase 1 已实现，待正式内容 spec |

### Blog

| 模块 | 文档 | 状态 |
| --- | --- | --- |
| Blog 占位页 | `docs/modules/Blog/placeholder-page.md` | Phase 1 已实现，待正式内容 spec |

## 冻结规则

- `universal/navigation-page-transition.md` 和 `universal/responsive-navigation.md` 记录的侧栏色带、桌面页面切换动画、移动端下滑竖条菜单与响应式切换行为已验收并冻结；后续开发默认不得修改其结构、节奏和交互逻辑。
- 如果新页面需要接入导航，只能通过现有 `pages` 配置、路由和 `onNavigate` 入口接入，不重写导航组件。
- 如果确实需要调整冻结模块，必须先说明原因、影响范围和回归验证方式，并得到用户确认。

## 模块文档约定

每个模块文档尽量包含：

- 模块性质：通用组件、页面专用组件、基础设施或占位入口。
- 实现状态：已实现、冻结、稳定、Phase 1 已实现、待扩展等。
- 模块功能。
- 相关文件。
- 实现细节。
- 动画效果实现。
- 响应式行为。
- 后续开发边界。

## 事实来源

- 全站视觉风格：`docs/DESIGN.md`
- 当前阶段任务：`docs/TODO.md`
- 产品边界：`docs/brief.md`
- 技术选型：`docs/Technical-Stack.md`
