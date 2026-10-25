import { describe, expect, it } from "vitest";
import { accentById, defaultTheme, normalizeTheme } from "@/lib/theme";

describe("Display theme settings", () => {
  it("defaults to light mode with the green main color", () => {
    expect(normalizeTheme(null)).toEqual({ mode: "light", accent: "green" });
    expect(normalizeTheme("garbage")).toEqual(defaultTheme);
  });
  it("keeps a valid dark mode and color choice", () => {
    expect(normalizeTheme({ mode: "dark", accent: "blue" })).toEqual({ mode: "dark", accent: "blue" });
  });
  it("falls back to light mode and green for unknown values", () => {
    expect(normalizeTheme({ mode: "neon", accent: "invisible" })).toEqual(defaultTheme);
  });
  it("always resolves a color; unknown ids become green", () => {
    expect(accentById("purple").name).toBe("Purple");
    expect(accentById("nope").id).toBe("green");
  });
});
