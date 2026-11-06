import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Star, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { awardFinishedGame, BUILT_IN_SETS, GAME_POINTS, pairsFromCards, shuffle, type VocabPair } from "@/lib/game";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Word game — Together" },
      { name: "description", content: "Play English and Korean vocabulary card games: matching pairs and flashcards." },
      { property: "og:title", content: "Word game — Together" },
      { property: "og:description", content: "Play English and Korean vocabulary card games: matching pairs and flashcards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GamePage,
});

type Mode = "match" | "flash";
type Tile = { id: number; pair: number; text: string; lang: "en" | "ko" };

function speak(text: string, lang: "en" | "ko") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = lang === "ko" ? "ko-KR" : "en-US";
  window.speechSynthesis.speak(u);
}

function GamePage() {
  const [myWords, setMyWords] = useState<VocabPair[]>([]);
  const [setId, setSetId] = useState("food");
  const [mode, setMode] = useState<Mode>("match");
  useEffect(() => {
    try { setMyWords(pairsFromCards(JSON.parse(localStorage.getItem("together-words-v4") || "null"))); } catch { /* keep empty */ }
  }, []);
  const sets = [...(myWords.length >= 2 ? [{ id: "mine", name: "My cards", ko: "내 카드", words: myWords }] : []), ...BUILT_IN_SETS];
  const active = sets.find(s => s.id === setId) ?? sets[0]!;

  return (
    <main className="game-page">
      <header className="calendar-head">
        <Button variant="navigation" asChild><Link to="/"><ArrowLeft /><span>Back</span></Link></Button>
        <div className="calendar-title"><h1>Word game</h1><p lang="ko">단어 게임</p></div>
        <div className="theme-modes">
          <Button variant={mode === "match" ? "default" : "outline"} aria-pressed={mode === "match"} onClick={() => setMode("match")}>Match · <span lang="ko">짝 맞추기</span></Button>
          <Button variant={mode === "flash" ? "default" : "outline"} aria-pressed={mode === "flash"} onClick={() => setMode("flash")}>Flashcards · <span lang="ko">카드</span></Button>
        </div>
      </header>
      <div className="game-sets" role="group" aria-label="Word set">
        {sets.map(s => <Button key={s.id} variant={s.id === active.id ? "default" : "outline"} aria-pressed={s.id === active.id} onClick={() => setSetId(s.id)}>{s.name} <span lang="ko">{s.ko}</span></Button>)}
      </div>
      {mode === "match" ? <MatchGame key={active.id} words={active.words} /> : <Flashcards key={active.id} words={active.words} />}
    </main>
  );
}

function MatchGame({ words }: { words: VocabPair[] }) {
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [earned, setEarned] = useState<number | null>(null);
  useEffect(() => {
    const picked = shuffle(words).slice(0, 6);
    setTiles(shuffle(picked.flatMap((w, i) => [{ id: i * 2, pair: i, text: w.en, lang: "en" as const }, { id: i * 2 + 1, pair: i, text: w.ko, lang: "ko" as const }])));
    setOpen([]); setFound(new Set()); setEarned(null);
  }, [words, round]);

  function flip(tile: Tile) {
    if (open.length === 2 || open.includes(tile.id) || found.has(tile.pair)) return;
    speak(tile.text, tile.lang);
    const next = [...open, tile.id];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next.map(id => tiles.find(t => t.id === id)!);
    if (a!.pair === b!.pair) {
      const nf = new Set(found).add(a!.pair);
      setFound(nf); setOpen([]);
      if (nf.size * 2 === tiles.length) setEarned(awardFinishedGame());
    } else setTimeout(() => setOpen([]), 1000);
  }

  return <section className="game-board" aria-label="Matching pairs">
    <p className="game-hint">Find the English and Korean words that go together · <span lang="ko">같은 뜻을 찾아요</span></p>
    <div className="match-grid">
      {tiles.map(t => {
        const shown = open.includes(t.id) || found.has(t.pair);
        return <button key={t.id} type="button" className={`match-tile ${shown ? "is-open" : ""} ${found.has(t.pair) ? "is-found" : ""}`} onClick={() => flip(t)} aria-label={shown ? t.text : "Hidden card"} lang={shown ? t.lang : undefined}>
          {shown ? t.text : "?"}
        </button>;
      })}
    </div>
    {earned !== null && <div className="game-done" role="status">
      <Star aria-hidden="true" />
      <strong>All matched! · <span lang="ko">다 찾았어요!</span></strong>
      <span>{earned ? `+${earned} points` : "No more points today — keep playing for fun!"}</span>
      <Button onClick={() => setRound(r => r + 1)}><RotateCcw /> Play again</Button>
    </div>}
  </section>;
}

function Flashcards({ words }: { words: VocabPair[] }) {
  const [deck, setDeck] = useState(words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [earned, setEarned] = useState<number | null>(null);
  const card = deck[index]!;
  function go(step: number) {
    const next = index + step;
    if (next >= deck.length) { if (earned === null) setEarned(awardFinishedGame()); return; }
    if (next < 0) return;
    setIndex(next); setFlipped(false);
  }
  return <section className="game-board" aria-label="Flashcards">
    <p className="game-hint">Tap the card to see the other language · <span lang="ko">카드를 눌러요</span></p>
    <button type="button" className={`flash-card ${flipped ? "is-open" : ""}`} onClick={() => { const nf = !flipped; setFlipped(nf); speak(nf ? card.ko : card.en, nf ? "ko" : "en"); }} lang={flipped ? "ko" : "en"}>
      {flipped ? card.ko : card.en}
    </button>
    <div className="flash-controls">
      <Button variant="outline" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous card"><ChevronLeft /></Button>
      <span>{index + 1} / {deck.length}</span>
      <Button variant="outline" onClick={() => speak(flipped ? card.ko : card.en, flipped ? "ko" : "en")} aria-label="Say it"><Volume2 /></Button>
      <Button variant="outline" onClick={() => { setDeck(shuffle(words)); setIndex(0); setFlipped(false); setEarned(null); }} aria-label="Shuffle"><Shuffle /></Button>
      <Button onClick={() => go(1)} aria-label={index === deck.length - 1 ? "Finish" : "Next card"}>{index === deck.length - 1 ? "Finish" : <ChevronRight />}</Button>
    </div>
    {earned !== null && <div className="game-done" role="status">
      <Star aria-hidden="true" />
      <strong>Deck finished! · <span lang="ko">다 했어요!</span></strong>
      <span>{earned ? `+${earned} points` : `No more points today (up to ${GAME_POINTS * 3} a day) — keep playing for fun!`}</span>
    </div>}
  </section>;
}
