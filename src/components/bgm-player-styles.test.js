// BGM 响应式样式合同用于防止手机端卡片和舞台重新发生重叠。
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");

// 提取手机断点，确保断言只检查移动端覆盖规则。
function getMobileStyles() {
  const marker = "@media (max-width: 830px)";
  const start = styles.indexOf(marker);
  return styles.slice(start);
}

describe("BGM mobile layout styles", () => {
  it("uses the compact mobile width and evenly spaced control anchors", () => {
    const mobileStyles = getMobileStyles();

    expect(mobileStyles).toMatch(/\.bgm-player\s*{[^}]*width:\s*178px;/s);
    expect(mobileStyles).toMatch(/--bgm-previous-left:\s*4px;/);
    expect(mobileStyles).toMatch(/--bgm-play-expanded-left:\s*65px;/);
    expect(mobileStyles).toMatch(/--bgm-next-left:\s*126px;/);
    expect(mobileStyles).toMatch(/\.bgm-collapsed-copy\s*{[^}]*max-width:\s*106px;/s);
  });
});
