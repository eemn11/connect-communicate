import { useEffect, useState } from "react";
import { defaultLanguage, readLanguage, writeLanguage, LANG_CHANGED, LANG_STORE, type Language } from "./language";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  useEffect(() => {
    const refresh = () => setLanguage(readLanguage());
    const onStorage = (event: StorageEvent) => { if (event.key === LANG_STORE || event.key === null) refresh(); };
    refresh();
    window.addEventListener(LANG_CHANGED, refresh);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(LANG_CHANGED, refresh); window.removeEventListener("storage", onStorage); };
  }, []);
  function saveLanguage(next: Language) { writeLanguage(next); setLanguage(next); }
  return { language, saveLanguage };
}
