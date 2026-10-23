import { describe, expect, it } from "vitest";
import { insertSuggestedWord, wordSuggestions } from "@/lib/word-suggestions";

describe("Optional word completions", () => {
  it("offers English words without changing typed text", () => {
    const text = "I want to swi";
    expect(wordSuggestions(text, text.length, "en")).toContain("swimming");
    expect(text).toBe("I want to swi");
  });
  it("offers Korean completions", () => {
    expect(wordSuggestions("수영", 2, "ko")).toContain("수영장");
  });
  it("changes only the current word when selected, keeping surrounding text", () => {
    expect(insertSuggestedWord("I swi today", 5, "swim")).toEqual({ text: "I swim today", caret: 6 });
  });
  it("replaces the entire word at a cursor in its middle", () => {
    expect(insertSuggestedWord("swiming today", 3, "swimming")).text.toBe("swimming today");
  });
  it("does not offer suggestions for empty or numeric entries", () => {
    expect(wordSuggestions("", 0, "en")).toEqual([]);
    expect(wordSuggestions("09", 2, "en")).toEqual([]);
  });
});