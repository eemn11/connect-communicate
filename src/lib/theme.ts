export type ThemeMode = "light" | "dark";
export type Accent = { id: string; name: string; ko: string; primary: string; accent: string; welcome: string };

export const ACCENTS: Accent[] = [
  { id: "green", name: "Green", ko: "초록", primary: "oklch(.48 .086 175)", accent: "oklch(.934 .035 166)", welcome: "oklch(.954 .026 164)" },
  { id: "blue", name: "Blue", ko: "파랑", primary: "oklch(.5 .11 235)", accent: "oklch(.935 .03 233)", welcome: "oklch(.955 .024 233)" },
  { id: "purple", name: "Purple", ko: "보라", primary: "oklch(.5 .12 300)", accent: "oklch(.94 .03 300)", welcome: "oklch(.955 .022 300)" },
  { id: "rose", name: "Rose", ko: "분홍", primary: "oklch(.55 .14 15)", accent: "oklch(.94 .03 15)", welcome: "oklch(.955 .025 15)" },
  { id: "orange", name: "Orange", ko: "주황", primary: "oklch(.55 .12 55)", accent: "oklch(.945 .035 55)", welcome: "oklch(.96 .03 55)" },
];

export const THEME_STORE = "together-theme-v1";
export const THEME_CHANGED = "together-theme-changed";
export type ThemeSettings = { mode: ThemeMode; accent: string };
export const defaultTheme: ThemeSettings = { mode: "light", accent: "green" };

export function accentById(id: string): Accent {
  return ACCENTS.find(option => option.id === id) ?? ACCENTS[0]!;
}

export function normalizeTheme(value: unknown): ThemeSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultTheme;
  const raw = value as Record<string, unknown>;
  const mode: ThemeMode = raw["mode"] === "dark" ? "dark" : "light";
  const accent = typeof raw["accent"] === "string" && ACCENTS.some(option => option.id === raw["accent"]) ? raw["accent"] : defaultTheme.accent;
  return { mode, accent };
}

export function readTheme(): ThemeSettings {
  try {
    return normalizeTheme(JSON.parse(localStorage.getItem(THEME_STORE) ?? "null"));
  } catch { return defaultTheme; }
}

export function applyTheme(settings: ThemeSettings) {
  const root = document.documentElement;
  root.classList.toggle("dark", settings.mode === "dark");
  const accent = accentById(settings.accent);
  if (accent.id === defaultTheme.accent) {
    root.style.removeProperty("--primary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--welcome");
  } else {
    root.style.setProperty("--primary", accent.primary);
    root.style.setProperty("--accent", accent.accent);
    root.style.setProperty("--welcome", accent.welcome);
  }
}

export function writeTheme(settings: ThemeSettings) {
  try { localStorage.setItem(THEME_STORE, JSON.stringify(settings)); } catch { /* Device storage may be unavailable. */ }
  window.dispatchEvent(new Event(THEME_CHANGED));
  applyTheme(settings);
}
