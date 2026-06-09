# Home Marquee

## 模块性质

- 类型：Home 页面专用组件，可作为未来局部通用视觉元素参考。
- 实现状态：已实现，稳定。
- 冻结状态：Home 底部 marquee 的位置和基础运动稳定；文案可按内容阶段调整。

## 模块功能

底部 marquee 为 Home 首屏提供持续运动感和压场感。它强化 Fresh Brutalist Stage 的舞台氛围，并帮助平衡右侧色带和左下 BGM。

## 相关文件

- `src/components/MarqueeBar.jsx`
- `src/data/site.js`
- `src/styles.css`

## 实现细节

- `MarqueeBar` 从 `marqueeText` 读取文案。
- 渲染两份相同文本，形成无缝循环。
- 容器使用黑底白字和顶部粗黑边。
- `aria-hidden="true"`，不作为主要可读内容暴露给辅助技术。

## 动画效果实现

- CSS `@keyframes marquee` 驱动横向循环。
- `.marquee-track` 使用 `animation: marquee 18s linear infinite`。
- 两份文本首尾衔接，减少循环断点感。

## 响应式行为

- 高度通过 `--marquee-height` 控制。
- 桌面当前为 `58px`。
- 移动端当前为 `48px`。
- Home 的 BGM 和角色舞台会根据该高度避让。

## 后续开发边界

- 不要在每个页面都滥用 marquee。
- 如果其他页面使用 marquee，应作为章节状态条或内容分隔，而不是复制 Home 底部压场方式。
- 不要让 marquee 遮挡主要导航、BGM 或页面内容。
