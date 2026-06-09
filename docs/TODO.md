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
11. 完成视觉风格刷新：切换为冷白底、黑色粗边框、淡紫/浅青/奶黄/嫩绿配色，并同步首页、导航和 BGM 文案。
12. 对齐 `visual-style-hybrid-mockup.html` 的 Home 内容区：双标签、换行大标题、滚轮提示卡、常驻空人物舞台壳、密网格背景和 mock 风格 BGM 卡片。
13. 平滑化桌面到平板的 Home 舞台响应式：取消滚轮标题缩小，人物/舞台同步缩放，并移除 `1100px` 左右的提示卡和舞台跳变。
14. 解耦 Home 标题与提示卡的响应式轨迹：标题保留海报缩放趋势，提示卡从约 `1600px` 开始独立下沉并在平板前贴近 BGM 上方。
15. 拆分 `docs/modules/` 模块文档：以 `README.md` 建立索引，将通用模块归入 `universal/`，将 Home、Profile、Portfolio、Blog 页面专有模块归入各自页面目录，并标记冻结/待扩展状态。
16. 根据 `2026-06-09-profile-sticky-board-design.md` 将 Profile 占位页升级为章节封面 + Sticky Board 正式页面。
17. 完成 Profile Sticky Board 一轮 refinement：补齐布局工具、Profile 路由滚动 ownership、identity card 宽度/头像比例/标题单行、胶囊色彩语义与相关测试。
18. 单点修复 Profile 大屏 Sticky Board 磁贴长条化与内容溢出问题，桌面端贴纸改用稳定视觉尺寸和紧凑内部排版。
19. 根据 `2026-06-09-profile-preview-alignment-design.md` 将 Profile 桌面白板重构为 preview 对齐版本：整块 whiteboard、浅青身份卡、Avatar 资源切换、固定磁贴 preset 和内部 side-bands。
20. 收敛 Profile 响应式阈值：桌面身份卡改为统一响应 token 联动缩放，并将手机态阈值从 `760px` 提前到 `830px`，同步沉淀通用响应式分段文档。

## 下一步任务

1. 为 BGM 接入真实曲目、音量控制和状态持久化。
2. 补齐 5 个角色 IP 的素材、顺序、标题和配色。
3. 制定 Portfolio 作品滚动擦除切换 spec。
4. 制定 Blog 四类书架内容系统 spec。
5. 为 BGM 接入真实曲目、音量控制和状态持久化后的浏览器验收。

## 已知问题

- 暂无新的已确认视觉阻塞项。

## 暂不做

- Portfolio 完整作品数据和滚动擦除切换。
- Profile 完整个人档案设计。
- Blog 四类书架内容系统。
- 5 个角色 IP 的完整素材系统。
- Astro 迁移或内容集合。
