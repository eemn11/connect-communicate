import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { translate } from "./translation.functions";
import { useLanguage } from "./use-language";
import type { Language } from "./language";

// On-demand translations of English text into the chosen second language,
// cached on this device so each phrase is translated only once.
const CACHE_STORE = "together-i18n-v1";
type Cache = Record<string, string>;
let cache: Cache | null = null;

function readCache(): Cache {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(CACHE_STORE) || "{}"); } catch { cache = {}; }
  return cache ?? {};
}

const cacheKey = (lang: Language, text: string) => `${lang}:${text}`;

export function cachedSecondLine(lang: Language, text: string): string {
  const hit = readCache()[cacheKey(lang, text)];
  return typeof hit === "string" ? hit : "";
}

function writeCache(lang: Language, text: string, translation: string) {
  const next = { ...readCache(), [cacheKey(lang, text)]: translation };
  cache = next;
  try { localStorage.setItem(CACHE_STORE, JSON.stringify(next)); } catch { /* storage full */ }
}

const pending = new Map<string, Promise<void>>();

function useTranslateMissing(language: Language, sources: string[]) {
  const call = useServerFn(translate);
  const [, bump] = useState(0);
  const signature = sources.join("");
  useEffect(() => {
    if (language === "ko") return;
    for (const source of sources) {
      if (!source || cachedSecondLine(language, source)) continue;
      const key = cacheKey(language, source);
      if (pending.has(key)) continue;
      const request = call({ data: { text: source, target: language } })
        .then(result => { if (!result.error && result.translation.trim()) writeCache(language, source, result.translation.trim()); })
        .catch(() => { /* leave uncached; a later render retries */ })
        .finally(() => { pending.delete(key); bump(n => n + 1); });
      pending.set(key, request);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, signature]);
}

// The second-language line for one English text: the stored Korean when Korean
// is chosen, otherwise a cached on-demand translation ("" while it loads).
export function useSecondText(text: string, storedKo: string | undefined): string {
  const { language } = useLanguage();
  const source = text.trim();
  useTranslateMissing(language, [source]);
  if (language === "ko") return storedKo?.trim() ?? "";
  return cachedSecondLine(language, source);
}

// Batch variant for lists such as game word sets.
export function useSecondTexts(items: { en: string; ko: string }[]): string[] {
  const { language } = useLanguage();
  useTranslateMissing(language, items.map(item => item.en.trim()));
  return items.map(item => language === "ko" ? item.ko.trim() : cachedSecondLine(language, item.en.trim()));
}

export function SecondLine({ text, storedKo, className }: { text: string; storedKo?: string | undefined; className?: string | undefined }) {
  const { language } = useLanguage();
  const line = useSecondText(text, storedKo);
  if (!line) return null;
  return <span className={className} lang={language}>{line}</span>;
}
