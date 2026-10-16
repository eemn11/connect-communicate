import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { completeBilingual, type BilingualText } from "./bilingual";
import { translate } from "./translation.functions";

export function useBilingual() {
  const call = useServerFn(translate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function complete(value: BilingualText) {
    setBusy(true); setError("");
    try {
      return await completeBilingual(value, async (text, target) => {
        const result = await call({ data: { text, target } });
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