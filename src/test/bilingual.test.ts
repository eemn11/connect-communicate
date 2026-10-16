import { describe, expect, it, vi } from "vitest";
import { completeBilingual, joinBilingual, splitBilingual } from "@/lib/bilingual";

describe("Automatic English–Korean completion", () => {
  it("adds Korean when only English is entered", async () => {
    const translate = vi.fn().mockResolvedValue("수영하고 싶어요");
    expect(await completeBilingual({ en: "I want to swim", ko: "" }, translate)).toEqual({ en: "I want to swim", ko: "수영하고 싶어요" });
    expect(translate).toHaveBeenCalledWith("I want to swim", "ko");
  });
  it("adds English when only Korean is entered, even in the English box", async () => {
    const translate = vi.fn().mockResolvedValue("Hospital");
    expect(await completeBilingual({ en: "병원", ko: "" }, translate)).toEqual({ en: "Hospital", ko: "병원" });
    expect(translate).toHaveBeenCalledWith("병원", "en");
  });
  it("keeps both user-edited translations unchanged", async () => {
    const translate = vi.fn();
    expect(await completeBilingual({ en: "My chosen phrase", ko: "내 문장" }, translate)).toEqual({ en: "My chosen phrase", ko: "내 문장" });
    expect(translate).not.toHaveBeenCalled();
  });
  it("does not translate empty input", async () => {
    const translate = vi.fn();
    await completeBilingual({ en: "", ko: "" }, translate);
    expect(translate).not.toHaveBeenCalled();
  });
  it("retains profile bilingual content through storage", () => {
    const value = { en: "I like music", ko: "음악을 좋아해요" };
    expect(splitBilingual(joinBilingual(value))).toEqual(value);
  });
});