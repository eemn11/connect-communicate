import { describe, expect, it } from "vitest";
import { FALLBACK_NAME, greetingName } from "@/lib/nickname";

describe("Greeting name", () => {
  it("uses the English line of a saved name", () => {
    expect(greetingName("Munee\n무니")).toBe("Munee");
  });
  it("uses a name with no Korean line", () => {
    expect(greetingName("Munee")).toBe("Munee");
  });
  it("uses the Korean line when no English name was saved", () => {
    expect(greetingName("무니")).toBe("무니");
  });
  it("greets as friend when no name exists", () => {
    expect(greetingName(null)).toBe(FALLBACK_NAME);
    expect(greetingName("   ")).toBe(FALLBACK_NAME);
  });
});
