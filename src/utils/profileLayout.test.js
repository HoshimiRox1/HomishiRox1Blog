import { describe, expect, it } from "vitest";
import {
  doRectsOverlap,
  resolveProfileNoteLayout,
} from "./profileLayout";

const notes = [
  { id: "identity", size: "large", preferredSlot: "top-left" },
  { id: "loadout", size: "medium", preferredSlot: "top-right" },
  { id: "taste", size: "medium", preferredSlot: "middle-left" },
  { id: "current-quest", size: "large", preferredSlot: "middle-right" },
  { id: "links", size: "small", preferredSlot: "bottom-center" },
];

describe("profile note layout", () => {
  it("places all notes without overlapping their default rectangles", () => {
    const layout = resolveProfileNoteLayout(notes);

    expect(layout).toHaveLength(notes.length);

    for (let leftIndex = 0; leftIndex < layout.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < layout.length; rightIndex += 1) {
        expect(
          doRectsOverlap(layout[leftIndex].rect, layout[rightIndex].rect),
        ).toBe(false);
      }
    }
  });

  it("is deterministic for the same note order and metadata", () => {
    expect(resolveProfileNoteLayout(notes)).toEqual(resolveProfileNoteLayout(notes));
  });

  it("keeps every note inside the desktop board coordinate system", () => {
    const layout = resolveProfileNoteLayout(notes);

    for (const item of layout) {
      expect(item.rect.x).toBeGreaterThanOrEqual(0);
      expect(item.rect.y).toBeGreaterThanOrEqual(0);
      expect(item.rect.x + item.rect.width).toBeLessThanOrEqual(100);
      expect(item.rect.y + item.rect.height).toBeLessThanOrEqual(100);
    }
  });

  it("emits stable desktop note dimensions separate from placement percentages", () => {
    const layout = resolveProfileNoteLayout(notes);
    const byId = Object.fromEntries(layout.map((item) => [item.id, item.style]));

    expect(byId.identity["--note-desktop-width"]).toBe("clamp(200px, 14vw, 270px)");
    expect(byId.identity["--note-desktop-min-height"]).toBe(
      "clamp(160px, 11vw, 218px)",
    );
    expect(byId.loadout["--note-desktop-width"]).toBe("clamp(188px, 12vw, 240px)");
    expect(byId.links["--note-desktop-width"]).toBe("clamp(176px, 11vw, 230px)");
  });
});
