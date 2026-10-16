import { hasKorean } from "./bilingual";

export function speechSegments(english: string, korean = "") {
  return [
    { text: english.trim(), lang: hasKorean(english) ? "ko-KR" : "en-US" },
    { text: korean.trim(), lang: "ko-KR" },
  ].filter(segment => segment.text);
}

export function playBilingualSpeech(
  synthesis: SpeechSynthesis,
  english: string,
  korean: string,
  rate: number,
  onDone: () => void,
  onError: (message: string) => void,
) {
  const segments = speechSegments(english, korean);
  let stopped = false;
  // Keep the current utterance alive while browsers play it.
  let current: SpeechSynthesisUtterance | undefined;
  synthesis.cancel();
  function next(index: number) {
    if (stopped) return;
    const segment = segments[index];
    if (!segment) { current = undefined; onDone(); return; }
    const utterance = new SpeechSynthesisUtterance(segment.text);
    current = utterance;
    utterance.lang = segment.lang;
    utterance.rate = rate;
    const voices = synthesis.getVoices();
    const voice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === segment.lang.toLowerCase())
      ?? voices.find(v => v.lang.toLowerCase().startsWith(segment.lang.slice(0, 2)));
    if (voice) utterance.voice = voice;
    utterance.onend = () => next(index + 1);
    utterance.onerror = event => {
      if (stopped) return;
      if (event.error !== "canceled" && event.error !== "interrupted") {
        onError(segment.lang === "ko-KR"
          ? "Couldn't speak Korean. Check that a Korean voice is installed in your device’s speech settings."
          : "Couldn't speak English. Please check your device’s speech settings.");
      }
      next(index + 1);
    };
    synthesis.speak(utterance);
  }
  next(0);
  return () => { stopped = true; current = undefined; synthesis.cancel(); };
}