// Profile 贴纸布局使用确定性槽位，避免首屏默认重叠。
const NOTE_SIZE_RECTS = {
  large: { width: 36, height: 27 },
  medium: { width: 31, height: 24 },
  small: { width: 27, height: 20 },
};

const NOTE_DESKTOP_SIZES = {
  large: {
    width: "clamp(200px, 14vw, 270px)",
    minHeight: "clamp(160px, 11vw, 218px)",
  },
  medium: {
    width: "clamp(188px, 12vw, 240px)",
    minHeight: "clamp(145px, 9vw, 190px)",
  },
  small: {
    width: "clamp(176px, 11vw, 230px)",
    minHeight: "clamp(126px, 8vw, 168px)",
  },
};

const SLOT_CANDIDATES = {
  "top-left": [
    { x: 0, y: 0 },
    { x: 3, y: 30 },
    { x: 38, y: 0 },
  ],
  "top-right": [
    { x: 57, y: 3 },
    { x: 63, y: 29 },
    { x: 6, y: 31 },
  ],
  "middle-left": [
    { x: 7, y: 38 },
    { x: 0, y: 63 },
    { x: 36, y: 31 },
  ],
  "middle-right": [
    { x: 55, y: 47 },
    { x: 41, y: 66 },
    { x: 0, y: 37 },
  ],
  "bottom-center": [
    { x: 34, y: 75 },
    { x: 0, y: 74 },
    { x: 65, y: 72 },
  ],
};

const FALLBACK_CANDIDATES = [
  { x: 0, y: 0 },
  { x: 38, y: 0 },
  { x: 0, y: 31 },
  { x: 39, y: 31 },
  { x: 0, y: 63 },
  { x: 34, y: 73 },
  { x: 66, y: 5 },
  { x: 68, y: 46 },
];

// 判断两个百分比矩形是否相交。
export function doRectsOverlap(left, right) {
  return !(
    left.x + left.width <= right.x ||
    right.x + right.width <= left.x ||
    left.y + left.height <= right.y ||
    right.y + right.height <= left.y
  );
}

// 解析单张贴纸的尺寸。
export function getNoteRectSize(size) {
  return NOTE_SIZE_RECTS[size] ?? NOTE_SIZE_RECTS.medium;
}

// 解析单张贴纸在桌面端的视觉体块尺寸。
export function getNoteDesktopSize(size) {
  return NOTE_DESKTOP_SIZES[size] ?? NOTE_DESKTOP_SIZES.medium;
}

// 给每张贴纸分配第一个不碰撞的候选位置。
export function resolveProfileNoteLayout(notes) {
  const placed = [];

  for (const note of notes) {
    const size = getNoteRectSize(note.size);
    const desktopSize = getNoteDesktopSize(note.size);
    const candidates = [
      ...(SLOT_CANDIDATES[note.preferredSlot] ?? []),
      ...FALLBACK_CANDIDATES,
    ];
    const candidate =
      candidates.find((item) => {
        const rect = { ...item, ...size };
        return !placed.some((placedItem) => doRectsOverlap(rect, placedItem.rect));
      }) ?? { x: 0, y: 0 };
    const rect = { ...candidate, ...size };

    placed.push({
      id: note.id,
      rect,
      style: {
        "--note-left": `${rect.x}%`,
        "--note-top": `${rect.y}%`,
        "--note-width": `${rect.width}%`,
        "--note-height": `${rect.height}%`,
        "--note-aspect-ratio": `${rect.width} / ${rect.height}`,
        "--note-desktop-width": desktopSize.width,
        "--note-desktop-min-height": desktopSize.minHeight,
      },
    });
  }

  return placed;
}
