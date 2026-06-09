// Profile 白板布局直接使用 spec 对齐的显式 preset，不再走碰撞排版。
const DEFAULT_NOTE_LAYOUT = {
  left: "50%",
  top: "50%",
  width: "230px",
  minHeight: "160px",
  rotate: "0deg",
  background: "#FFFFFF",
};

// 解析单张磁贴的大屏 preset，并映射成统一的 CSS 变量。
export function resolveProfileNoteLayout(notes) {
  return notes.map((note) => {
    const desktopLayout = note.layout?.desktop ?? DEFAULT_NOTE_LAYOUT;

    return {
      id: note.id,
      style: {
        "--note-left": desktopLayout.left,
        "--note-top": desktopLayout.top,
        "--note-width": desktopLayout.width,
        "--note-min-height": desktopLayout.minHeight,
        "--note-rotate": desktopLayout.rotate,
        "--note-color": desktopLayout.background,
      },
    };
  });
}
