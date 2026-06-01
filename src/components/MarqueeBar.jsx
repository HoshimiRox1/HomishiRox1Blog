// 底部滚动文字提供 Home 首屏的持续运动感。
import { marqueeText } from "../data/site";

// 渲染两份相同文本以形成无缝循环。
export default function MarqueeBar() {
  return (
    <div className="marquee-bar" aria-hidden="true">
      <div className="marquee-track">
        <span>{marqueeText}</span>
        <span>{marqueeText}</span>
      </div>
    </div>
  );
}
