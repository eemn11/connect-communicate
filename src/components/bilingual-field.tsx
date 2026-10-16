import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBilingual } from "@/lib/use-bilingual";
import type { BilingualText } from "@/lib/bilingual";

export function BilingualField({ id, label, value, onChange, multiline = false }: {
  id: string; label: string; value: BilingualText; onChange: (value: BilingualText) => void; multiline?: boolean;
}) {
  const { complete, busy, error } = useBilingual();
  const latest = useRef(value); latest.current = value;
  const revision = useRef(0);
  const Control = multiline ? Textarea : Input;
  async function finish() {
    if (busy) return;
    const version = revision.current;
    const translated = await complete(latest.current);
    if (translated && version === revision.current) onChange(translated);
  }
  return <div className="grid gap-1.5">
    <Label htmlFor={id}>{label} (English)</Label>
    <Control id={id} value={value.en} onChange={e => { revision.current++; onChange({ ...value, en: e.target.value }); }} onBlur={() => void finish()} />
    <Label htmlFor={`${id}-ko`}>{label} (한국어)</Label>
    <Control id={`${id}-ko`} lang="ko" value={value.ko} onChange={e => { revision.current++; onChange({ ...value, ko: e.target.value }); }} onBlur={() => void finish()} />
    {busy && <p role="status" className="text-sm text-muted-foreground">Translating…</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}