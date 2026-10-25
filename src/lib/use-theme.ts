import { useEffect, useState } from "react";
import { defaultTheme, readTheme, writeTheme, THEME_CHANGED, THEME_STORE, type ThemeSettings } from "./theme";

export function useThemeSettings() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  useEffect(() => {
    const refresh = () => setTheme(readTheme());
    const onStorage = (event: StorageEvent) => { if (event.key === THEME_STORE || event.key === null) refresh(); };
    refresh();
    window.addEventListener(THEME_CHANGED, refresh);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(THEME_CHANGED, refresh); window.removeEventListener("storage", onStorage); };
  }, []);
  function saveTheme(next: ThemeSettings) { writeTheme(next); setTheme(next); }
  return { theme, saveTheme };
}
