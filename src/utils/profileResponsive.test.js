import { describe, expect, it } from "vitest";
import {
  PROFILE_DESKTOP_RESPONSIVE_VARS,
  buildResponsiveClamp,
} from "./profileResponsive";

describe("profile responsive tokens", () => {
  it("builds a stable linear clamp expression from viewport and size bounds", () => {
    expect(
      buildResponsiveClamp({
        maxSize: 510,
        maxViewport: 1920,
        minSize: 430,
        minViewport: 1160,
      }),
    ).toBe("clamp(430px, calc(307.8947px + 10.5263vw), 510px)");
  });

  it("keeps identity card, avatar, title, and footer offset on one desktop scaling track", () => {
    expect(PROFILE_DESKTOP_RESPONSIVE_VARS).toEqual({
      "--profile-avatar-size": "clamp(374px, calc(306.8421px + 5.7895vw), 418px)",
      "--profile-card-width": "clamp(430px, calc(307.8947px + 10.5263vw), 510px)",
      "--profile-footer-offset": "calc(var(--profile-card-width) + 54px)",
      "--profile-identity-title-size": "clamp(68px, calc(40.5263px + 2.3684vw), 86px)",
    });
  });
});
