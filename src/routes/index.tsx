import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserRound, Home, Heart, Settings2, Volume2, VolumeX, MessageCircle, Grid2X2, Utensils, Smile, Users, Shapes, Hand, ArrowLeft, X, Check, ThumbsUp, ThumbsDown, Handshake, Apple, CupSoda, Toilet, Leaf, Plus, Frown, Gamepad2, PartyPopper, Gift, CalendarDays, Compass, CalendarClock, Pencil, Trash2, Star, Music, Bed, Car, Sun } from "lucide-react";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import mascot from "@/assets/hello-mascot.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Together — Communication home" },
    { name: "description", content: "Find your words with Together. An accessible picture communication board for everyday needs, feelings, and connection." },
    { property: "og:title", content: "Together — Communication home" },
    { property: "og:description", content: "A calm, welcoming picture communication board for everyday connection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const defaultWords: { label: string; ko?: string | undefined; icon: LucideIcon; category: string; section: string; tone: string; group?: string | undefined }[] = [
  { label: "I want this, please", ko: "이거 주세요", icon: Hand, category: "Needs", section: "Daily", tone: "mint", group: "Things I want to do" },
  { label: "I feel", ko: "나는 느껴요", icon: Heart, category: "Feelings", section: "Situation", tone: "yellow" },
  { label: "Yes, please", ko: "네, 좋아요", icon: ThumbsUp, category: "Needs", section: "Daily", tone: "mint", group: "Things I want to do" },
  { label: "No, thank you", ko: "아니요, 괜찮아요", icon: ThumbsDown, category: "Needs", section: "Daily", tone: "rose", group: "Things I should not do" },
  { label: "Help", ko: "도와주세요", icon: Handshake, category: "People", section: "Situation", tone: "blue" },
  { label: "I want to eat", ko: "먹고 싶어요", icon: Apple, category: "Food & drink", section: "Daily", tone: "peach", group: "Food I want to eat" },
  { label: "I want a drink", ko: "마시고 싶어요", icon: CupSoda, category: "Food & drink", section: "Daily", tone: "blue", group: "Food I want to eat" },
  { label: "Toilet", ko: "화장실", icon: Toilet, category: "Needs", section: "Situation", tone: "lavender" },
  { label: "A break", ko: "쉬는 시간", icon: Leaf, category: "Needs", section: "Daily", tone: "mint", group: "Things I need to do" },
  { label: "More", ko: "더", icon: Plus, category: "Needs", section: "Planning", tone: "yellow" },
  { label: "Happy", ko: "행복해요", icon: Smile, category: "Feelings", section: "Situation", tone: "yellow" },
  { label: "Sad", ko: "슬퍼요", icon: Frown, category: "Feelings", section: "Situation", tone: "blue" },
  { label: "Play", ko: "놀이", icon: Gamepad2, category: "Activities", section: "Planning", tone: "peach" },
  { label: "All done", ko: "다 했어요", icon: PartyPopper, category: "Activities", section: "Planning", tone: "lavender" },
  { label: "Thank you so much", ko: "정말 고마워요", icon: Gift, category: "People", section: "Daily", tone: "rose", group: "Things I want to do" },
];
const iconChoices: Record<string, LucideIcon> = { Star, Heart, Hand, Smile, Frown, Apple, CupSoda, Music, Bed, Car, Sun, Gamepad2, Gift, Users, MessageCircle };
const iconName = (icon: LucideIcon) => Object.keys(iconChoices).find(k => iconChoices[k] === icon) ?? "";
const allIcons: Record<string, LucideIcon> = { ...iconChoices, ThumbsUp, ThumbsDown, Handshake, Toilet, Leaf, Plus, PartyPopper };
const tones = ["mint", "yellow", "rose", "blue", "peach", "lavender"];
type Word = typeof defaultWords[number];
type Draft = { index: number | null; label: string; ko: string; icon: string; category: string; section: string; tone: string; group: string };
const STORE = "together-words-v3";
const categories = [
  { label: "All words", icon: Grid2X2 }, { label: "Needs", icon: Hand },
  { label: "Feelings", icon: Smile }, { label: "Food & drink", icon: Utensils },
  { label: "People", icon: Users }, { label: "Activities", icon: Shapes },
];
const sections = [
  { label: "Daily", icon: CalendarDays, tone: "mint" },
  { label: "Situation", icon: Compass, tone: "blue" },
  { label: "Planning", icon: CalendarClock, tone: "lavender" },
];
const dailyGroups = ["Things I want to do", "Things I need to do", "Food I want to eat", "Things I should not do"] as const;
const dailyGroupCards = [
  { label: "Things I want to do", ko: "하고 싶은 것", icon: Star, tone: "mint" },
  { label: "Things I need to do", ko: "해야 할 일", icon: Check, tone: "yellow" },
  { label: "Food I want to eat", ko: "먹고 싶은 음식", icon: Apple, tone: "peach" },
  { label: "Things I should not do", ko: "하지 말아야 할 것", icon: X, tone: "rose" },
] as const;

function Index() {
  const [words, setWords] = useState<Word[]>(defaultWords);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (Array.isArray(saved)) setWords(saved.map((w: any) => ({ ...w, icon: allIcons[w.icon] ?? MessageCircle })));
    } catch { /* ignore */ }
  }, []);
  function saveWords(next: Word[]) {
    setWords(next);
    localStorage.setItem(STORE, JSON.stringify(next.map(w => ({ ...w, icon: Object.keys(allIcons).find(k => allIcons[k] === w.icon) ?? "MessageCircle" }))));
  }
  function openNew(section: string, group?: string) {
    setDraft({ index: null, label: "", ko: "", icon: "Star", category: category === "All words" || favorites ? "Needs" : category, section, tone: "mint", group: group ?? dailyGroups[0] });
  }
  function openEdit(word: Word) {
    setDraft({ index: words.indexOf(word), label: word.label, ko: word.ko ?? "", icon: iconName(word.icon) || "Star", category: word.category, section: word.section, tone: word.tone, group: word.section === "Daily" ? (word.group ?? dailyGroups[0]) : dailyGroups[0] });
  }
  function commitDraft() {
    if (!draft || !draft.label.trim()) return;
    const w: Word = { label: draft.label.trim(), ko: draft.ko.trim() || undefined, icon: iconChoices[draft.icon] ?? Star, category: draft.category, section: draft.section, tone: draft.tone, group: draft.section === "Daily" ? draft.group : undefined };
    saveWords(draft.index === null ? [...words, w] : words.map((x, i) => i === draft.index ? w : x));
    setDraft(null);
  }
  function deleteDraft() {
    if (!draft || draft.index === null) return;
    saveWords(words.filter((_, i) => i !== draft.index)); setDraft(null);
  }
  const [category, setCategory] = useState("All words");
  const [sentence, setSentence] = useState<typeof words>([]);
  const [favorites, setFavorites] = useState(false);
  const [sound, setSound] = useState(true);
  const [settings, setSettings] = useState(false);
  const [dailyOpen, setDailyOpen] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<{ favorites: boolean; category: string; daily: string | null }[]>([]);
  function goTo(next: { favorites: boolean; category: string }) {
    setViewHistory(h => [...h, { favorites, category, daily: dailyOpen }]);
    setDailyOpen(null);
    if (next.favorites === favorites && next.category === category) return;
    setFavorites(next.favorites); setCategory(next.category);
  }
  function goBack() {
    const prev = viewHistory[viewHistory.length - 1];
    if (prev) {
      setViewHistory(h => h.slice(0, -1));
      setFavorites(prev.favorites); setCategory(prev.category); setDailyOpen(prev.daily);
    } else if (dailyOpen) setDailyOpen(null);
    else if (favorites || category !== "All words") { setFavorites(false); setCategory("All words"); }
    else if (window.history.length > 1) window.history.back();
  }
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState("0.85");
  const [speechError, setSpeechError] = useState("");
  const favoriteLabels = ["I want this, please", "Yes, please", "No, thank you", "Help", "I want a drink", "A break"];
  const visibleWords = words.filter(word => favorites ? favoriteLabels.includes(word.label) : category === "All words" || word.category === category);
  function speak(text: string) {
    if (!("speechSynthesis" in window)) { setSpeechError("Speaking isn't available in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Number(rate);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (event) => { setSpeaking(false); if (event.error !== "canceled" && event.error !== "interrupted") setSpeechError("Couldn't speak. Please try again."); };
    setSpeechError("");
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }
  function addWord(word: typeof words[number]) {
    setSentence(current => [...current, word]);
    if (sound) speak(word.label);
  }
  return (
    <div className="aac-app">
      <div className="app-main">
        <header className="topbar">
          <div className="wordmark">together<span className="brand-dot">.</span><span className="wordmark-divider" /><span className="page-label">My voice</span></div>
          <div className="topbar-actions">
            <Button variant="aac" className="sound-button" onClick={() => setSound(!sound)} aria-pressed={sound} title="Toggle word audio">{sound ? <Volume2 /> : <VolumeX />}<span>Sound {sound ? "on" : "off"}</span></Button>
            <Button variant="aac" className="sound-button" asChild><Link to="/profile" aria-label="My profile"><UserRound /><span>Profile</span></Link></Button>
          </div>
        </header>
        <main className="home-content">
          <section className="welcome">
            <div><div className="welcome-eyebrow"><span className="welcome-dot" /> A space for your voice</div><h1>Hello, friend <Hand className="wave" aria-hidden="true" /></h1><p>What’s on your mind today?</p></div>
            <img src={mascot} alt="A friendly green speech bubble waving hello" width={512} height={512} className="welcome-mascot" />
          </section>
          <nav className="category-bar" aria-label="Word categories">
            {categories.map(({ label, icon: Icon }) => <Button key={label} variant="aac" className={`category-button ${!favorites && category === label ? "is-active" : ""}`} aria-pressed={!favorites && category === label} onClick={() => goTo({ favorites: false, category: label })}><Icon /><span>{label}</span></Button>)}
          </nav>
          <div className="words-heading"><h2>{favorites ? "Favorite words" : category === "All words" ? "Everyday words" : category}</h2><span className="words-heading-meta"><Button variant="aac" className={`edit-toggle ${editing ? "is-active" : ""}`} aria-pressed={editing} onClick={() => setEditing(!editing)}>{editing ? <Check /> : <Pencil />}<span>{editing ? "Done editing" : "Edit words"}</span></Button>{visibleWords.length} words <span className="heading-dot">·</span> A little connection starts here</span></div>
          <div className="word-sections">
            {sections.map(({ label, icon: SectionIcon, tone }) => {
              const sectionWords = visibleWords.filter(word => word.section === label);
              if (!sectionWords.length && favorites) return null;
              const renderWord = (word: Word, i: number) => <Button key={`${word.label}-${i}`} variant="word" className={`tone-${word.tone} ${editing ? "is-editing" : ""}`} aria-label={editing ? `Edit ${word.label}` : undefined} onClick={() => editing ? openEdit(word) : addWord(word)}>{editing && <span className="edit-badge" aria-hidden="true"><Pencil /></span>}<span className="word-symbol" aria-hidden="true"><word.icon /></span><span className="word-label">{word.label}</span>{word.ko && <span className="word-label-ko" lang="ko">{word.ko}</span>}</Button>;
              const addCard = (group: string) => <Button variant="word" className="add-word-card" aria-label={group ? `Add a phrase to ${group}` : `Add a word to ${label}`} onClick={() => openNew(label, group || undefined)}><span className="word-symbol" aria-hidden="true"><Plus /></span><span className="word-label">{group || label === "Daily" ? "Add phrase" : "Add word"}</span><span className="word-label-ko" lang="ko">{group || label === "Daily" ? "문장 추가" : "단어 추가"}</span></Button>;
              return (
                <section className={`word-section tone-${tone}`} key={label} aria-label={`${label} words`}>
                  <header className="section-head">
                    <h2 className="section-label"><SectionIcon aria-hidden="true" />{label}</h2>
                    <span className="section-rule" aria-hidden="true" />
                    <span className="section-count">{sectionWords.length} words</span>
                  </header>
                  {label === "Daily" ? (dailyOpen ? (
                    <>
                      <Button variant="aac" className="daily-back" onClick={() => setDailyOpen(null)} aria-label="Back to all Daily labels"><ArrowLeft /><span>All Daily labels</span><span className="word-label-ko" lang="ko">전체</span></Button>
                      <div className="word-grid">
                        {sectionWords.filter(word => word.group === dailyOpen).map(renderWord)}
                        {addCard(dailyOpen)}
                      </div>
                    </>
                  ) : (
                    <div className="word-grid daily-group-cards">
                      {dailyGroupCards.map(({ label: groupLabel, ko, icon: GroupIcon, tone }) => (
                        <Button key={groupLabel} variant="word" className={`tone-${tone}`} aria-label={`Open ${groupLabel}`} onClick={() => setDailyOpen(groupLabel)}>
                          <span className="word-symbol" aria-hidden="true"><GroupIcon /></span>
                          <span className="word-label">{groupLabel}</span>
                          <span className="word-label-ko" lang="ko">{ko}</span>
                        </Button>
                      ))}
                    </div>
                  )) : (
                    <div className="word-grid">
                      {sectionWords.map(renderWord)}
                      {addCard("")}
                    </div>
                  )}
                </section>
              );
            })}
            {!visibleWords.length && <p className="words-empty">No words here yet. Try another category.</p>}
          </div>
          <section className="sentence-section" aria-label="Sentence builder">
            <div className="sentence-heading"><span><MessageCircle />My sentence</span><Button variant="ghost" className="clear-button" disabled={!sentence.length} onClick={() => setSentence([])}><X />Clear</Button></div>
            <div className="sentence-row">
              <div className="sentence-preview" aria-live="polite">{sentence.length ? sentence.map((word, index) => <span className={`sentence-word tone-${word.tone}`} key={`${word.label}-${index}`}><word.icon aria-hidden="true" />{word.label}{word.ko && <span className="sentence-ko" lang="ko">{word.ko}</span>}</span>) : <span className="sentence-placeholder">I have something to say…</span>}</div>
              <Button variant="aac" className="speak-button" disabled={!sentence.length} onClick={() => speak(sentence.map(word => word.label).join(" "))}><Volume2 /><span>{speaking ? "Speaking…" : "Speak"}</span></Button>
            </div>
            {speechError && <p role="alert" className="speech-error">{speechError}</p>}
          </section>
          <footer className="home-footer"><span><Heart /> Every voice matters.</span><span>Made for connection, at your pace.</span></footer>
        </main>
      </div>
      <nav className="bottom-bar" aria-label="Main navigation">
        <div className="bottom-bar-side">
          <Button variant="navigation" className="back-button" title="Go back" aria-label="Go back to previous screen" onClick={goBack}><ArrowLeft /><span>Back</span></Button>
          <Button variant="navigation" className={favorites ? "is-active" : ""} onClick={() => goTo({ favorites: true, category })} aria-pressed={favorites}><Heart /><span>Favorites</span></Button>
        </div>
        <Button variant="navigation" className={`home-button ${!favorites ? "is-active" : ""}`} onClick={() => goTo({ favorites: false, category: "All words" })} aria-pressed={!favorites}><Home /><span>Home</span></Button>
        <div className="bottom-bar-side">
          <Button variant="navigation" onClick={() => setSettings(true)} title="Settings"><Settings2 /><span>Settings</span></Button>
        </div>
      </nav>
      <Dialog open={!!draft} onOpenChange={open => !open && setDraft(null)}><DialogContent className="settings-dialog">{draft && <>
        <DialogHeader><DialogTitle>{draft.index === null ? "Add a word" : "Edit word"}</DialogTitle><DialogDescription>Choose the word, picture, and where it goes.</DialogDescription></DialogHeader>
        <label className="settings-label" htmlFor="word-label">{draft.section === "Daily" ? "Phrase (English)" : "Word (English)"}</label>
        <input id="word-label" className="settings-select" value={draft.label} maxLength={30} autoFocus onChange={e => setDraft({ ...draft, label: e.target.value })} onKeyDown={e => e.key === "Enter" && commitDraft()} />
        <label className="settings-label" htmlFor="word-ko">Korean</label>
        <input id="word-ko" lang="ko" className="settings-select" value={draft.ko} maxLength={30} onChange={e => setDraft({ ...draft, ko: e.target.value })} />
        <span className="settings-label">Picture</span>
        <div className="icon-picker">{Object.entries(iconChoices).map(([name, Icon]) => <button type="button" key={name} className={`icon-choice ${draft.icon === name ? "is-active" : ""}`} aria-label={name} aria-pressed={draft.icon === name} onClick={() => setDraft({ ...draft, icon: name })}><Icon /></button>)}</div>
        <span className="settings-label">Color</span>
        <div className="icon-picker">{tones.map(t => <button type="button" key={t} className={`tone-choice tone-${t} ${draft.tone === t ? "is-active" : ""}`} aria-label={t} aria-pressed={draft.tone === t} onClick={() => setDraft({ ...draft, tone: t })} />)}</div>
        <label className="settings-label" htmlFor="word-section">Section</label>
        <select id="word-section" className="settings-select" value={draft.section} onChange={e => setDraft({ ...draft, section: e.target.value })}>{sections.map(s => <option key={s.label}>{s.label}</option>)}</select>
        <label className="settings-label" htmlFor="word-category">Category</label>
        <select id="word-category" className="settings-select" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{categories.filter(c => c.label !== "All words").map(c => <option key={c.label}>{c.label}</option>)}</select>
        {draft.section === "Daily" && <><label className="settings-label" htmlFor="word-group">Daily label</label><select id="word-group" className="settings-select" value={draft.group} onChange={e => setDraft({ ...draft, group: e.target.value })}>{dailyGroups.map(g => <option key={g}>{g}</option>)}</select></>}
        <Button onClick={commitDraft} disabled={!draft.label.trim()}><Check />Save</Button>
        {draft.index !== null && <Button variant="outline" onClick={deleteDraft}><Trash2 />Delete word</Button>}
      </>}</DialogContent></Dialog>
      <Dialog open={settings} onOpenChange={setSettings}><DialogContent className="settings-dialog"><DialogHeader><DialogTitle>Voice settings</DialogTitle><DialogDescription>Make your voice feel right for you.</DialogDescription></DialogHeader><label className="settings-label" htmlFor="speech-rate">Speaking speed</label><select id="speech-rate" className="settings-select" value={rate} onChange={event => setRate(event.target.value)}><option value="0.65">Slow</option><option value="0.85">Gentle</option><option value="1">Normal</option></select><Button variant="outline" onClick={() => setSound(!sound)}>{sound ? <Volume2 /> : <VolumeX />}Word audio {sound ? "on" : "off"}</Button><Button onClick={() => setSettings(false)}><Check />Done</Button></DialogContent></Dialog>
    </div>
  );
}
