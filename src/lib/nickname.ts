import { splitBilingual } from "@/lib/bilingual";

/** Who we greet when no name has been saved yet. */
export const FALLBACK_NAME = "friend";

/**
 * The name shown in the greeting. Profile names are stored as English and Korean
 * lines in one field, so prefer the English line and fall back to the Korean one.
 */
export function greetingName(profileName: string | null | undefined) {
  const pair = splitBilingual(profileName ?? "");
  return pair.en.trim() || pair.ko.trim() || FALLBACK_NAME;
}
