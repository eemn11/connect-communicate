import { describe, expect, it, vi } from "vitest";
import { playBilingualSpeech, speechSegments } from "@/lib/bilingual-speech";

describe("Bilingual speaking", () => {
  it("reads English first, then Korean with the correct language", () => {
    expect(speechSegments("I want to eat", "먹고 싶어요")).toEqual([
      { text: "I want to eat", lang: "en-US" }, { text: "먹고 싶어요", lang: "ko-KR" },
    ]);
  });
  it("skips missing translations without reading blank text", () => {
    expect(speechSegments("", "도와주세요")).toEqual([{ text: "도와주세요", lang: "ko-KR" }]);
  });
  it("waits until English finishes before speaking Korean and completing", () => {
    class Utterance {
      text: string; lang = ""; rate = 1; voice: unknown; onend?: () => void;
      constructor(text: string) { this.text = text; }
    }
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    const queued: Utterance[] = [];
    const koreanVoice = { lang: "ko-KR" };
    const synthesis = { cancel: vi.fn(), getVoices: () => [koreanVoice], speak: (u: Utterance) => queued.push(u) };
    const done = vi.fn();
    const stop = playBilingualSpeech(synthesis as unknown as SpeechSynthesis, "Hello", "안녕하세요", 0.85, done, vi.fn());
    expect(queued.map(u => u.text)).toEqual(["Hello"]);
    queued[0]?.onend?.();
    expect(queued.map(u => u.text)).toEqual(["Hello", "안녕하세요"]);
    expect(queued[1]?.lang).toBe("ko-KR");
    expect(queued[1]?.voice).toBe(koreanVoice);
    expect(queued[1]?.rate).toBe(0.85);
    expect(done).not.toHaveBeenCalled();
    queued[1]?.onend?.();
    expect(done).toHaveBeenCalledOnce();
    stop(); vi.unstubAllGlobals();
  });
});