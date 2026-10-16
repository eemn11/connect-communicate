import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { completeBilingual, type BilingualText } from "./bilingual";
import { translate } from "./translation.functions";

// Share only active requests so blurring a field and immediately saving cannot
// charge twice; resolved text is not retained in a global cache.
const pending = new Map<string, Promise<{ translation: string; error: string }>>();

export function useBilingual() {
  const call = useServerFn(translate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function complete(value: BilingualText) {
    setBusy(true); setError("");
    try {
      return await completeBilingual(value, async (text, target) => {
        const key = JSON.stringify([text, target]);
        let request = pending.get(key);
        if (!request) {
          request = call({ data: { text, target } }).finally(() => pending.delete(key));
          pending.set(key, request);
        }
        const result = await request;
        if (result.error) throw new Error(result.error);
        return result.translation;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't translate. Please try again.");
      return null;
    } finally { setBusy(false); }
  }
  return { complete, busy, error };
}