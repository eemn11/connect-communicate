export type BilingualText = { en: string; ko: string };
export const hasKorean = (text: string) => /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u.test(text);

export function missingTranslation(value: BilingualText) {
  const en = value.en.trim(), ko = value.ko.trim();
  if ((!en && !ko) || (en && ko)) return null;
  const text = en || ko;
  return { text, target: hasKorean(text) ? "en" as const : "ko" as const };
}

export async function completeBilingual(value: BilingualText, translate: (text: string, target: "en" | "ko") => Promise<string>): Promise<BilingualText> {
  const request = missingTranslation(value);
  if (!request) return value;
  const translation = await translate(request.text, request.target);
  return request.target === "en" ? { en: translation, ko: request.text } : { en: request.text, ko: translation };
}

export function splitBilingual(text: string): BilingualText {
  const lines = text.split("\n");
  return { en: lines.filter(line => !hasKorean(line)).join("\n"), ko: lines.filter(hasKorean).join("\n") };
}
export const joinBilingual = (value: BilingualText) => [value.en.trim(), value.ko.trim()].filter(Boolean).join("\n");