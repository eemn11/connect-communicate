// The second language shown next to English on cards, tasks and game words.
// Stored content keeps its Korean line; other languages are translated on
// demand and cached on this device (see second-line.tsx).
export type Language = "ko" | "es" | "zh" | "ja" | "vi" | "hmn";

export const LANGUAGES: { id: Language; name: string; native: string }[] = [
  { id: "ko", name: "Korean", native: "한국어" },
  { id: "es", name: "Spanish", native: "Español" },
  { id: "zh", name: "Chinese", native: "中文" },
  { id: "ja", name: "Japanese", native: "日本語" },
  { id: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { id: "hmn", name: "Hmong", native: "Hmoob" },
];

export const LANG_STORE = "together-language-v1";
export const LANG_CHANGED = "together-language-changed";
export const defaultLanguage: Language = "ko";

export function normalizeLanguage(value: unknown): Language {
  return LANGUAGES.some(l => l.id === value) ? (value as Language) : defaultLanguage;
}

export function readLanguage(): Language {
  try { return normalizeLanguage(localStorage.getItem(LANG_STORE)); } catch { return defaultLanguage; }
}

export function writeLanguage(lang: Language) {
  try { localStorage.setItem(LANG_STORE, lang); } catch { /* storage full/blocked */ }
  window.dispatchEvent(new Event(LANG_CHANGED));
}
