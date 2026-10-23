import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertSuggestedWord, wordSuggestions } from "@/lib/word-suggestions";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  lang?: string;
  placeholder?: string;
  "aria-label"?: string;
  multiline?: boolean;
  onBlur?: () => void;
};

export function SuggestionInput({ value, onValueChange, multiline = false, onBlur, ...props }: Props) {
  const control = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [composing, setComposing] = useState(false);
  const [caret, setCaret] = useState(0);
  const suggestions = focused && !dismissed && !composing ? wordSuggestions(value, caret, props.lang === "ko" ? "ko" : "en") : [];
  const Control = multiline ? Textarea : Input;

  function choose(word: string) {
    const next = insertSuggestedWord(value, caret, word);
    onValueChange(next.text);
    setCaret(next.caret);
    setDismissed(true);
    requestAnimationFrame(() => { control.current?.focus(); control.current?.setSelectionRange(next.caret, next.caret); });
  }

  return <div className="min-w-0" onBlur={e => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    setFocused(false);
    onBlur?.();
  }}>
    <Control {...props} value={value} autoComplete="off" ref={el => { control.current = el; }}
      onFocus={e => { setFocused(true); setCaret(e.currentTarget.selectionStart ?? value.length); }}
      onSelect={e => setCaret(e.currentTarget.selectionStart ?? value.length)}
      onChange={e => { onValueChange(e.target.value); setCaret(e.target.selectionStart ?? e.target.value.length); setDismissed(false); }}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={e => { setComposing(false); setCaret(e.currentTarget.selectionStart ?? value.length); }}
      onKeyDown={e => { if (e.key === "Escape" && suggestions.length) { e.preventDefault(); e.stopPropagation(); setDismissed(true); } }} />
    {suggestions.length > 0 && <div role="group" aria-label="Word suggestions" className="mt-1.5 flex flex-wrap items-center gap-1">
      {suggestions.map(word => <Button key={word} type="button" variant="outline" size="sm" className="max-w-full whitespace-normal break-words" onPointerDown={e => e.preventDefault()} onClick={() => choose(word)}>{word}</Button>)}
      <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground" aria-label="Dismiss word suggestions" title="Dismiss word suggestions" onPointerDown={e => e.preventDefault()} onClick={() => { setDismissed(true); control.current?.focus(); }}><X /></Button>
    </div>}
  </div>;
}