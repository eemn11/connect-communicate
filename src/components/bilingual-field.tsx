import { useRef } from "react";
import { SuggestionInput } from "@/components/suggestion-input";
import { Label } from "@/components/ui/label";
import { useBilingual } from "@/lib/use-bilingual";
import { missingTranslation, type BilingualText } from "@/lib/bilingual";

export function BilingualField({ id, label, value, onChange, multiline = false }: {
  id: string; label: string; value: BilingualText; onChange: (value: BilingualText) => void; multiline?: boolean;
}) {
  const { complete, busy, error } = useBilingual();
  const latest = useRef(value); latest.current = value;
  const revision = useRef(0);
  async function finish() {
    if (busy || !missingTranslation(latest.current)) return;
    const version = revision.current;
    const translated = await complete(latest.current);
    if (translated && version === revision.current) onChange(translated);
  }
  return <div className="grid gap-1.5">
    <Label htmlFor={id}>{label} (English)</Label>
    <SuggestionInput id={id} multiline={multiline} value={value.en} onValueChange={en => { revision.current++; onChange({ ...value, en }); }} onBlur={() => void finish()} />
    <Label htmlFor={`${id}-ko`}>{label} (한국어)</Label>
    <SuggestionInput id={`${id}-ko`} multiline={multiline} lang="ko" value={value.ko} onValueChange={ko => { revision.current++; onChange({ ...value, ko }); }} onBlur={() => void finish()} />
    {busy && <p role="status" className="text-sm text-muted-foreground">Translating…</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}