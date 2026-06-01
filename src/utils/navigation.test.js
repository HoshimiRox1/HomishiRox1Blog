import { describe, expect, it } from "vitest";
import {
  getNextCharacterIndex,
  getPageById,
  getPageByPath,
} from "./navigation";

const pages = [
  { id: "home", path: "/" },
  { id: "profile", path: "/profile" },
  { id: "portfolio", path: "/portfolio" },
  { id: "blog", path: "/blog" },
];

describe("getNextCharacterIndex", () => {
  it("advances one character for a downward wheel gesture", () => {
    expect(getNextCharacterIndex(0, 1200, 3)).toBe(1);
  });

  it("moves back one character for an upward wheel gesture", () => {
    expect(getNextCharacterIndex(2, -900, 3)).toBe(1);
  });

  it("wraps from the last character to the first on downward gestures", () => {
    expect(getNextCharacterIndex(2, 100, 3)).toBe(0);
  });

  it("wraps from the first character to the last on upward gestures", () => {
    expect(getNextCharacterIndex(0, -100, 3)).toBe(2);
  });
});

describe("page lookup helpers", () => {
  it("finds pages by path and falls back to Home", () => {
    expect(getPageByPath(pages, "/portfolio")?.id).toBe("portfolio");
    expect(getPageByPath(pages, "/missing")?.id).toBe("home");
  });

  it("finds pages by id and falls back to Home", () => {
    expect(getPageById(pages, "blog")?.path).toBe("/blog");
    expect(getPageById(pages, "missing")?.path).toBe("/");
  });
});
