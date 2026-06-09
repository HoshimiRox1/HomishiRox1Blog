// Profile 桌面白板的关键尺寸使用同一条线性响应轨迹，避免卡片和字体各自漂移。
export function buildResponsiveClamp({
  minViewport,
  maxViewport,
  minSize,
  maxSize,
}) {
  const slope = ((maxSize - minSize) / (maxViewport - minViewport)) * 100;
  const intercept = minSize - (slope * minViewport) / 100;

  return `clamp(${minSize}px, calc(${intercept.toFixed(4)}px + ${slope.toFixed(
    4,
  )}vw), ${maxSize}px)`;
}

export const PROFILE_DESKTOP_RESPONSIVE_VARS = {
  "--profile-card-width": buildResponsiveClamp({
    minViewport: 1160,
    maxViewport: 1920,
    minSize: 430,
    maxSize: 510,
  }),
  "--profile-avatar-size": buildResponsiveClamp({
    minViewport: 1160,
    maxViewport: 1920,
    minSize: 374,
    maxSize: 418,
  }),
  "--profile-identity-title-size": buildResponsiveClamp({
    minViewport: 1160,
    maxViewport: 1920,
    minSize: 68,
    maxSize: 86,
  }),
  "--profile-footer-offset": "calc(var(--profile-card-width) + 54px)",
};
