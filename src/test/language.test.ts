import { describe, expect, it } from "vitest";
import { defaultLanguage, LANGUAGES, normalizeLanguage } from "@/lib/language";
import { cachedSecondLine } from "@/lib/second-line";

describe("Second language setting", () => {
  it("offers Korean, Spanish, Chinese, Japanese, Vietnamese and Hmong", () => {
    expect(LANGUAGES.map(l => l.id)).toEqual(["ko", "es", "zh", "ja", "vi", "hmn"]);
  });
  it("defaults to Korean and rejects unknown values", () => {
    expect(defaultLanguage).toBe("ko");
    expect(normalizeLanguage(null)).toBe("ko");
    expect(normalizeLanguage("fr")).toBe("ko");
  });
  it("keeps each offered language", () => {
    for (const l of LANGUAGES) expect(normalizeLanguage(l.id)).toBe(l.id);
  });
  it("reads nothing from an empty translation cache", () => {
    expect(cachedSecondLine("es", "never translated phrase xyz")).toBe("");
  });
});
