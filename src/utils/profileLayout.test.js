import { describe, expect, it } from "vitest";
import { resolveProfileNoteLayout } from "./profileLayout";

const notes = [
  {
    id: "identity",
    layout: {
      desktop: {
        left: "49%",
        top: "12%",
        width: "270px",
        minHeight: "160px",
        rotate: "3deg",
        background: "#B9F5FF",
      },
    },
  },
  {
    id: "loadout",
    layout: {
      desktop: {
        left: "43%",
        top: "45%",
        width: "230px",
        minHeight: "160px",
        rotate: "-3deg",
        background: "#FFE7A6",
      },
    },
  },
  {
    id: "taste",
    layout: {
      desktop: {
        left: "69%",
        top: "36%",
        width: "230px",
        minHeight: "160px",
        rotate: "4deg",
        background: "#FFD6E8",
      },
    },
  },
  {
    id: "current-quest",
    layout: {
      desktop: {
        left: "53%",
        top: "63%",
        width: "255px",
        minHeight: "160px",
        rotate: "2deg",
        background: "#D7FFF1",
      },
    },
  },
  {
    id: "links",
    layout: {
      desktop: {
        left: "73%",
        top: "69%",
        width: "250px",
        minHeight: "120px",
        rotate: "-2deg",
        background: "#D8CCFF",
      },
    },
  },
];

describe("profile note layout", () => {
  it("emits one preset layout object per note", () => {
    const layout = resolveProfileNoteLayout(notes);

    expect(layout).toHaveLength(notes.length);
    expect(layout.map((item) => item.id)).toEqual([
      "identity",
      "loadout",
      "taste",
      "current-quest",
      "links",
    ]);
  });

  it("is deterministic for the same note order and metadata", () => {
    expect(resolveProfileNoteLayout(notes)).toEqual(resolveProfileNoteLayout(notes));
  });

  it("maps desktop presets to the CSS variable contract used by sticky notes", () => {
    const layout = resolveProfileNoteLayout(notes);
    const byId = Object.fromEntries(layout.map((item) => [item.id, item.style]));

    expect(byId.identity).toEqual({
      "--note-left": "49%",
      "--note-top": "12%",
      "--note-width": "270px",
      "--note-min-height": "160px",
      "--note-rotate": "3deg",
      "--note-color": "#B9F5FF",
    });
    expect(byId.loadout["--note-left"]).toBe("43%");
    expect(byId.taste["--note-color"]).toBe("#FFD6E8");
    expect(byId["current-quest"]["--note-width"]).toBe("255px");
    expect(byId.links["--note-min-height"]).toBe("120px");
  });
});
