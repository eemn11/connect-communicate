import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type React from "react";
import { UserRound, Home, Heart, Settings2, Volume2, VolumeX, MessageCircle, Grid2X2, Utensils, Smile, Users, Shapes, Hand, ArrowLeft, X, Check, ThumbsUp, ThumbsDown, Handshake, Apple, CupSoda, Toilet, Leaf, Plus, Frown, Gamepad2, PartyPopper, Gift, CalendarDays, Compass, CalendarClock, Pencil, Trash2, Star, Music, Bed, Car, Sun, Hospital, Waves, HeartPulse, Soup, Speech, Lightbulb, Megaphone, Bell, School, Store, ShoppingBag, GraduationCap, Building2, Landmark, Tent, Church, Pizza, Sandwich, IceCreamCone, Coffee, UtensilsCrossed, CookingPot, Refrigerator, Droplet, Brain, Eye, Ear, Stethoscope, Pill, Bandage, Syringe, Bath, PersonStanding, Accessibility, Cross, Plane, TrainFront, Bus, Bike, Ship, Map, MapPin, Luggage, Backpack, Calendar, Clock, AlarmClock, Moon, Volleyball, Puzzle, Blocks, Palette, Film, Radio, Tv, Balloon, Drum, Dog, Cat, Fish, Bird, PawPrint, TreePine, Flower2, Mountain, Cloud, CloudRain, Umbrella, Snowflake, Flame, Bug, BookOpen, Phone, Camera, Mail, Wallet, Key, Shirt, WashingMachine, Baby, Armchair, Newspaper, Lock, Ruler, Microscope, Rocket, Search } from "lucide-react";
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
  { label: "I want this, please", ko: "이거 주세요", icon: Hand, category: "Needs", section: "Daily", tone: "white", group: "Things I want to do" },
  { label: "I feel", ko: "나는 느껴요", icon: Heart, category: "Feelings", section: "Situation", tone: "white", group: "Hospital" },
  { label: "Yes, please", ko: "네, 좋아요", icon: ThumbsUp, category: "Needs", section: "Daily", tone: "white", group: "Things I want to do" },
  { label: "No, thank you", ko: "아니요, 괜찮아요", icon: ThumbsDown, category: "Needs", section: "Daily", tone: "white", group: "Things I should not do" },
  { label: "Help", ko: "도와주세요", icon: Handshake, category: "People", section: "Situation", tone: "white", group: "Hospital" },
  { label: "I want to eat", ko: "먹고 싶어요", icon: Apple, category: "Food & drink", section: "Daily", tone: "white", group: "Food I want to eat" },
  { label: "I want a drink", ko: "마시고 싶어요", icon: CupSoda, category: "Food & drink", section: "Daily", tone: "white", group: "Food I want to eat" },
  { label: "Toilet", ko: "화장실", icon: Toilet, category: "Needs", section: "Situation", tone: "white", group: "Swimming pool" },
  { label: "A break", ko: "쉬는 시간", icon: Leaf, category: "Needs", section: "Daily", tone: "white", group: "Things I need to do" },
  { label: "More", ko: "더", icon: Plus, category: "Needs", section: "Planning", tone: "white" },
  { label: "Happy", ko: "행복해요", icon: Smile, category: "Feelings", section: "Situation", tone: "white", group: "Swimming pool" },
  { label: "Sad", ko: "슬퍼요", icon: Frown, category: "Feelings", section: "Situation", tone: "white", group: "Hospital" },
  { label: "Play", ko: "놀이", icon: Gamepad2, category: "Activities", section: "Planning", tone: "white" },
  { label: "All done", ko: "다 했어요", icon: PartyPopper, category: "Activities", section: "Planning", tone: "white" },
  { label: "Thank you so much", ko: "정말 고마워요", icon: Gift, category: "People", section: "Daily", tone: "white", group: "Things I want to do" },
  { label: "It hurts", ko: "아파요", icon: HeartPulse, category: "Needs", section: "Situation", tone: "white", group: "Hospital" },
  { label: "I want to swim", ko: "수영하고 싶어요", icon: Waves, category: "Activities", section: "Situation", tone: "white", group: "Swimming pool" },
  { label: "Menu, please", ko: "메뉴 주세요", icon: Utensils, category: "Food & drink", section: "Situation", tone: "white", group: "Restaurant" },
  { label: "More, please", ko: "더 주세요", icon: Plus, category: "Needs", section: "Situation", tone: "white", group: "Restaurant" },
  { label: "I'm full", ko: "배 불러요", icon: Soup, category: "Food & drink", section: "Situation", tone: "white", group: "Restaurant" },
];
const iconGroups: { name: string; icons: Record<string, LucideIcon> }[] = [
  { name: "Everyday", icons: { Star, Heart, Hand, Smile, Frown, ThumbsUp, ThumbsDown, Check, X, Plus, MessageCircle, Users, Handshake, Gift, Speech, Lightbulb, Megaphone, Bell } },
  { name: "Places", icons: { Hospital, Waves, Utensils, Home, School, Store, ShoppingBag, GraduationCap, Building2, Landmark, Tent, Church } },
  { name: "Food & drink", icons: { Apple, CupSoda, Soup, Pizza, Sandwich, IceCreamCone, Coffee, UtensilsCrossed, CookingPot, Refrigerator, Droplet } },
  { name: "Body & health", icons: { HeartPulse, Brain, Eye, Ear, Stethoscope, Pill, Bandage, Syringe, Toilet, Bath, Bed, PersonStanding, Accessibility, Cross } },
  { name: "Travel", icons: { Plane, TrainFront, Bus, Car, Bike, Ship, Map, MapPin, Luggage, Backpack } },
  { name: "Calendar & time", icons: { CalendarDays, CalendarClock, Calendar, Clock, AlarmClock, Sun, Moon } },
  { name: "Play & music", icons: { Music, Gamepad2, Volleyball, Puzzle, Blocks, Palette, Film, Radio, Tv, Balloon, Drum, PartyPopper } },
  { name: "Animals & nature", icons: { Dog, Cat, Fish, Bird, PawPrint, TreePine, Flower2, Mountain, Cloud, CloudRain, Umbrella, Snowflake, Flame, Leaf, Bug } },
  { name: "Things & learning", icons: { BookOpen, Pencil, Phone, Camera, Mail, Wallet, Key, Shirt, WashingMachine, Baby, Armchair, Newspaper, Lock, Ruler, Microscope, Rocket, Search } },
];
const iconChoices: Record<string, LucideIcon> = Object.assign({}, ...iconGroups.map(g => g.icons));
const iconName = (icon: LucideIcon) => Object.keys(iconChoices).find(k => iconChoices[k] === icon) ?? "";
const allIcons = iconChoices;
const iconLabel = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2").toLowerCase();
const tones = ["white", "mint", "yellow", "rose", "blue", "peach", "lavender"];
type Word = typeof defaultWords[number];
type Draft = { index: number | null; label: string; ko: string; icon: string; category: string; section: string; tone: string; group: string };
const STORE = "together-words-v4";
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
type SectionLabel = { label: string; ko: string; icon: LucideIcon; tone: string; section: string };
const LABEL_STORE = "together-labels-v3";
const baseLabels: SectionLabel[] = [
  ...[
    { label: "Things I want to do", ko: "하고 싶은 것", icon: Star, tone: "white" },
    { label: "Things I need to do", ko: "해야 할 일", icon: Check, tone: "white" },
    { label: "Food I want to eat", ko: "먹고 싶은 음식", icon: Apple, tone: "white" },
    { label: "Things I should not do", ko: "하지 말아야 할 것", icon: X, tone: "white" },
  ].map(g => ({ ...g, section: "Daily" })),
  ...[
    { label: "Hospital", ko: "병원 갔을 때", icon: Hospital, tone: "white" },
    { label: "Swimming pool", ko: "수영장 갔을 때", icon: Waves, tone: "white" },
    { label: "Restaurant", ko: "식당 갔을 때", icon: Utensils, tone: "white" },
  ].map(g => ({ ...g, section: "Situation" })),
  ...[
    { label: "Today", ko: "오늘", icon: Sun, tone: "white" },
    { label: "Sunday", ko: "일요일", icon: CalendarDays, tone: "white" },
    { label: "Monday", ko: "월요일", icon: CalendarDays, tone: "white" },
    { label: "Tuesday", ko: "화요일", icon: CalendarDays, tone: "white" },
    { label: "Wednesday", ko: "수요일", icon: CalendarDays, tone: "white" },
    { label: "Thursday", ko: "목요일", icon: CalendarDays, tone: "white" },
    { label: "Friday", ko: "금요일", icon: CalendarDays, tone: "white" },
    { label: "Saturday", ko: "토요일", icon: CalendarDays, tone: "white" },
  ].map(g => ({ ...g, section: "Planning" })),
];

function Index() {
  const [words, setWords] = useState<Word[]>(defaultWords);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [labels, setLabels] = useState<SectionLabel[]>(baseLabels);
  const [labelDraft, setLabelDraft] = useState<{ index: number | null; section: string; label: string; ko: string; icon: string; tone: string } | null>(null);
  const [iconQuery, setIconQuery] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (Array.isArray(saved)) {
        setWords(saved.map((w: any) => ({ ...w, icon: allIcons[w.icon] ?? MessageCircle, tone: typeof w.tone === "string" ? w.tone : "white" })));
      }
      const savedLabels = JSON.parse(localStorage.getItem(LABEL_STORE) || "null");
      if (Array.isArray(savedLabels)) {
        setLabels(savedLabels.filter((g: any) => typeof g?.label === "string" && g.label).map((g: any) => ({ label: g.label, ko: typeof g.ko === "string" ? g.ko : "", icon: allIcons[g.icon] ?? Star, tone: typeof g.tone === "string" ? g.tone : "white", section: typeof g.section === "string" ? g.section : "Daily" })));
      }
    } catch { /* ignore */ }
  }, []);
  const allLabels: SectionLabel[] = labels;
  const labelsFor = (section: string) => allLabels.filter(l => l.section === section);
  const labelNamesFor = (section: string) => labelsFor(section).map(l => l.label);
  // Called as a function (not a component) so the search box keeps focus while typing.
  function renderIconPicker(value: string, onPick: (name: string) => void) {
    const q = iconQuery.trim().toLowerCase();
    const groups = iconGroups
      .map(g => ({ name: g.name, entries: Object.entries(g.icons).filter(([name]) => !q || name.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)) }))
      .filter(g => g.entries.length > 0);
    return <div className="icon-picker-box">
      <input type="search" className="settings-select icon-search" aria-label="Search pictures" placeholder="Search pictures…" value={iconQuery} onChange={e => setIconQuery(e.target.value)} />
      <div className="icon-picker-scroll">
        {groups.length ? groups.map(g => <div className="icon-group" key={g.name}>
          <span className="icon-group-name">{g.name}</span>
          <div className="icon-picker">{g.entries.map(([name, Icon]) => <button type="button" key={name} className={`icon-choice ${value === name ? "is-active" : ""}`} aria-label={iconLabel(name)} title={iconLabel(name)} aria-pressed={value === name} onClick={() => onPick(name)}><Icon /></button>)}</div>
        </div>) : <p className="icon-group-empty">No picture called “{iconQuery}”. Try another word.</p>}
      </div>
    </div>;
  }
  function saveWords(next: Word[]) {
    setWords(next);
    localStorage.setItem(STORE, JSON.stringify(next.map(w => ({ ...w, icon: Object.keys(allIcons).find(k => allIcons[k] === w.icon) ?? "MessageCircle" }))));
  }
  function saveLabels(next: SectionLabel[]) {
    setLabels(next);
    localStorage.setItem(LABEL_STORE, JSON.stringify(next.map(g => ({ label: g.label, ko: g.ko, tone: g.tone, section: g.section, icon: Object.keys(allIcons).find(k => allIcons[k] === g.icon) ?? "Star" }))));
  }
  function openNew(section: string, group?: string) {
    setIconQuery(""); setDraft({ index: null, label: "", ko: "", icon: "Star", category: category === "All words" || favorites ? "Needs" : category, section, tone: "white", group: group ?? labelNamesFor(section)[0] ?? "" });
  }
  function openEdit(word: Word) {
    setIconQuery(""); setDraft({ index: words.indexOf(word), label: word.label, ko: word.ko ?? "", icon: iconName(word.icon) || "Star", category: word.category, section: word.section, tone: word.tone, group: labelNamesFor(word.section).length ? (word.group ?? labelNamesFor(word.section)[0] ?? "") : "" });
  }
  function openLabelEdit(l: SectionLabel) {
    setIconQuery(""); setLabelDraft({ index: labels.indexOf(l), section: l.section, label: l.label, ko: l.ko, icon: iconName(l.icon) || "Star", tone: l.tone });
  }
  function commitDraft() {
    if (!draft || !draft.label.trim()) return;
    const w: Word = { label: draft.label.trim(), ko: draft.ko.trim() || undefined, icon: iconChoices[draft.icon] ?? Star, category: draft.category, section: draft.section, tone: draft.tone, group: labelNamesFor(draft.section).length ? draft.group : undefined };
    saveWords(draft.index === null ? [...words, w] : words.map((x, i) => i === draft.index ? w : x));
    setDraft(null);
  }
  function deleteDraft() {
    if (!draft || draft.index === null) return;
    saveWords(words.filter((_, i) => i !== draft.index)); setDraft(null);
  }
  function commitLabel() {
    if (!labelDraft || !labelDraft.label.trim()) return;
    const name = labelDraft.label.trim();
    const entry: SectionLabel = { label: name, ko: labelDraft.ko.trim(), icon: iconChoices[labelDraft.icon] ?? allIcons[labelDraft.icon] ?? Star, tone: labelDraft.tone, section: labelDraft.section };
    if (labelDraft.index === null) {
      if (!labelNamesFor(labelDraft.section).includes(name)) saveLabels([...labels, entry]);
      setOpenLabel({ section: labelDraft.section, label: name });
    } else {
      const old = labels[labelDraft.index];
      saveLabels(labels.map((x, i) => i === labelDraft.index ? entry : x));
      if (old && old.label !== name) saveWords(words.map(w => w.section === old.section && w.group === old.label ? { ...w, group: name } : w));
    }
    setLabelDraft(null);
  }
  function deleteLabel() {
    if (!labelDraft || labelDraft.index === null) return;
    const old = labels[labelDraft.index];
    saveLabels(labels.filter((_, i) => i !== labelDraft.index));
    if (old) saveWords(words.filter(w => !(w.section === old.section && w.group === old.label)));
    setLabelDraft(null);
  }

  // Hold a card ~1s to turn on editing; while editing, drag a card to reorder.
  const press = useRef<{ key: string; x: number; y: number; timer: number | null; long: boolean; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  function moveCard(from: string, to: string) {
    const [fk, fi] = [from[0], Number(from.slice(2))];
    const [tk, ti] = [to[0], Number(to.slice(2))];
    if (fk !== tk || fi === ti) return;
    const reorder = <T,>(list: T[]) => { const next = [...list]; const [item] = next.splice(fi, 1); if (item !== undefined) next.splice(ti, 0, item); return next; };
    if (fk === "w") saveWords(reorder(words)); else saveLabels(reorder(labels));
  }
  function endPress() {
    const p = press.current;
    if (p?.timer) window.clearTimeout(p.timer);
    press.current = null;
    setDragKey(null); setOverKey(null); setDragDelta({ x: 0, y: 0 });
  }
  function cardProps(key: string, onTap: () => void, onLongEdit: () => void) {
    void onLongEdit;
    return {
      "data-card": key,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        if (e.button !== 0) return;
        suppressClick.current = false;
        const p = { key, x: e.clientX, y: e.clientY, timer: null as number | null, long: false, moved: false, id: e.pointerId };
        if (!editing) p.timer = window.setTimeout(() => { p.long = true; setEditing(true); navigator.vibrate?.(30); }, 1000);
        else e.currentTarget.setPointerCapture(e.pointerId);
        press.current = p;
      },
      onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => {
        const p = press.current;
        if (!p || p.key !== key) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        if (!editing) { if (Math.hypot(dx, dy) > 10 && p.timer) { window.clearTimeout(p.timer); p.timer = null; } return; }
        if (!p.moved && Math.hypot(dx, dy) < 8) return;
        p.moved = true;
        setDragKey(key); setDragDelta({ x: dx, y: dy });
        const target = document.elementsFromPoint(e.clientX, e.clientY).map(el => (el as HTMLElement).closest?.("[data-card]") as HTMLElement | null).find(el => el && el.dataset["card"] !== key && el.dataset["card"]?.[0] === key[0]);
        setOverKey(target?.dataset["card"] ?? null);
      },
      onPointerUp: () => {
        const p = press.current;
        if (p && p.key === key) {
          if (p.long || p.moved) suppressClick.current = true;
          if (p.moved && overKey) moveCard(key, overKey);
        }
        endPress();
      },
      onPointerCancel: endPress,
      onClick: () => { if (suppressClick.current) { suppressClick.current = false; return; } onTap(); },
    };
  }

  const [category, setCategory] = useState("All words");
  const [sentence, setSentence] = useState<typeof words>([]);
  const [favorites, setFavorites] = useState(false);
  const [sound, setSound] = useState(true);
  const [settings, setSettings] = useState(false);
  const [openLabel, setOpenLabel] = useState<{ section: string; label: string } | null>(null);
  const [viewHistory, setViewHistory] = useState<{ favorites: boolean; category: string; open: { section: string; label: string } | null }[]>([]);
  function goTo(next: { favorites: boolean; category: string }) {
    setViewHistory(h => [...h, { favorites, category, open: openLabel }]);
    setOpenLabel(null);
    if (next.favorites === favorites && next.category === category) return;
    setFavorites(next.favorites); setCategory(next.category);
  }
  function goBack() {
    const prev = viewHistory[viewHistory.length - 1];
    if (prev) {
      setViewHistory(h => h.slice(0, -1));
      setFavorites(prev.favorites); setCategory(prev.category); setOpenLabel(prev.open);
    } else if (openLabel) setOpenLabel(null);
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
          <div className="words-heading"><h2>{favorites ? "Favorite words" : category === "All words" ? "Everyday words" : category}</h2><span className="words-heading-meta"><Button variant="aac" className={`edit-toggle ${editing ? "is-active" : ""}`} aria-pressed={editing} onClick={() => setEditing(!editing)}>{editing ? <Check /> : <Pencil />}<span>{editing ? "Done editing" : "Edit words"}</span></Button>{editing ? "Tap a card to change it · drag to move it" : <>{visibleWords.length} words <span className="heading-dot">·</span> Hold a card to edit</>}</span></div>
          <div className="word-sections">
            {sections.map(({ label, icon: SectionIcon, tone }) => {
              const sectionWords = visibleWords.filter(word => word.section === label);
              if (!sectionWords.length && favorites) return null;
              const sectionLabels = labelsFor(label);
              const open = openLabel && openLabel.section === label ? openLabel.label : null;
              const renderWord = (word: Word, i: number) => { const key = `w:${words.indexOf(word)}`; return <Button key={`${word.label}-${i}`} {...cardProps(key, () => editing ? openEdit(word) : addWord(word), () => openEdit(word))} variant="word" className={`tone-${word.tone} ${editing ? "is-editing" : ""} ${dragKey === key ? "is-dragging" : ""} ${overKey === key ? "is-drop-target" : ""}`} style={dragKey === key ? { transform: `translate(${dragDelta.x}px, ${dragDelta.y}px)` } : undefined} aria-label={editing ? `Edit ${word.label}` : undefined}>{editing && <span className="edit-badge" aria-hidden="true"><Pencil /></span>}<span className="word-symbol" aria-hidden="true"><word.icon /></span><span className="word-label">{word.label}</span>{word.ko && <span className="word-label-ko" lang="ko">{word.ko}</span>}</Button>; };
              const addCard = (group: string) => <Button variant="word" className="add-word-card" aria-label={group ? `Add a phrase to ${group}` : `Add a word to ${label}`} onClick={() => openNew(label, group || undefined)}><span className="word-symbol" aria-hidden="true"><Plus /></span><span className="word-label">{group || sectionLabels.length ? "Add phrase" : "Add word"}</span><span className="word-label-ko" lang="ko">{group || sectionLabels.length ? "문장 추가" : "단어 추가"}</span></Button>;
              return (
                <section className={`word-section tone-${tone}`} key={label} aria-label={`${label} words`}>
                  <header className="section-head">
                    <h2 className="section-label"><SectionIcon aria-hidden="true" />{label}</h2>
                    <span className="section-rule" aria-hidden="true" />
                    <span className="section-count">{sectionWords.length} words</span>
                  </header>
                  {sectionLabels.length ? (open ? (
                    <>
                      <Button variant="aac" className="daily-back" onClick={() => setOpenLabel(null)} aria-label={`Back to all ${label} labels`}><ArrowLeft /><span>All {label} labels</span><span className="word-label-ko" lang="ko">전체</span></Button>
                      <div className="word-grid">
                        {sectionWords.filter(word => word.group === open).map(renderWord)}
                        {addCard(open)}
                      </div>
                    </>
                  ) : (
                    <div className="word-grid daily-group-cards">
                      {sectionLabels.map((l) => { const { label: groupLabel, ko, icon: GroupIcon, tone: groupTone } = l; const key = `l:${labels.indexOf(l)}`; return (
                        <Button key={groupLabel} {...cardProps(key, () => editing ? openLabelEdit(l) : setOpenLabel({ section: label, label: groupLabel }), () => openLabelEdit(l))} variant="word" className={`tone-${groupTone} ${editing ? "is-editing" : ""} ${dragKey === key ? "is-dragging" : ""} ${overKey === key ? "is-drop-target" : ""}`} style={dragKey === key ? { transform: `translate(${dragDelta.x}px, ${dragDelta.y}px)` } : undefined} aria-label={editing ? `Edit ${groupLabel}` : `Open ${groupLabel}`}>
                          {editing && <span className="edit-badge" aria-hidden="true"><Pencil /></span>}
                          <span className="word-symbol" aria-hidden="true"><GroupIcon /></span>
                          <span className="word-label">{groupLabel}</span>
                          <span className="word-label-ko" lang="ko">{ko}</span>
                        </Button>
                      ); })}
                      <Button variant="word" className="add-word-card" aria-label={`Add a ${label} label`} onClick={() => { setIconQuery(""); setLabelDraft({ index: null, section: label, label: "", ko: "", icon: "Star", tone: "white" }) }}>
                        <span className="word-symbol" aria-hidden="true"><Plus /></span>
                        <span className="word-label">Add label</span>
                        <span className="word-label-ko" lang="ko">라벨 추가</span>
                      </Button>
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
          <footer className="home-footer"><span><Heart /> Every voice matters.</span><span>Made for connection, at your pace.</span></footer>
        </main>
      </div>
      <div className="dock">
        <section className="sentence-section" aria-label="Sentence builder">
          <div className="sentence-heading"><span><MessageCircle />My sentence</span><Button variant="ghost" className="clear-button" disabled={!sentence.length} onClick={() => setSentence([])}><X />Clear</Button></div>
          <div className="sentence-row">
            <div className="sentence-preview" aria-live="polite">{sentence.length ? sentence.map((word, index) => <span className={`sentence-word tone-${word.tone}`} key={`${word.label}-${index}`}><word.icon aria-hidden="true" />{word.label}{word.ko && <span className="sentence-ko" lang="ko">{word.ko}</span>}</span>) : <span className="sentence-placeholder">I have something to say…</span>}</div>
            <Button variant="aac" className="speak-button" disabled={!sentence.length} onClick={() => speak(sentence.map(word => word.label).join(" "))}><Volume2 /><span>{speaking ? "Speaking…" : "Speak"}</span></Button>
          </div>
          {speechError && <p role="alert" className="speech-error">{speechError}</p>}
        </section>
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
      </div>
      <Dialog open={!!draft} onOpenChange={open => !open && setDraft(null)}><DialogContent className="settings-dialog">{draft && <>
        <DialogHeader><DialogTitle>{draft.index === null ? "Add a word" : "Edit word"}</DialogTitle><DialogDescription>Choose the word, picture, and where it goes.</DialogDescription></DialogHeader>
        <label className="settings-label" htmlFor="word-label">{labelsFor(draft.section).length ? "Phrase (English)" : "Word (English)"}</label>
        <input id="word-label" className="settings-select" value={draft.label} maxLength={30} autoFocus onChange={e => setDraft({ ...draft, label: e.target.value })} onKeyDown={e => e.key === "Enter" && commitDraft()} />
        <label className="settings-label" htmlFor="word-ko">Korean</label>
        <input id="word-ko" lang="ko" className="settings-select" value={draft.ko} maxLength={30} onChange={e => setDraft({ ...draft, ko: e.target.value })} />
        <span className="settings-label">Picture</span>
        {renderIconPicker(draft.icon, name => setDraft({ ...draft, icon: name }))}
        <span className="settings-label">Color</span>
        <div className="icon-picker">{tones.map(t => <button type="button" key={t} className={`tone-choice tone-${t} ${draft.tone === t ? "is-active" : ""}`} aria-label={t} aria-pressed={draft.tone === t} onClick={() => setDraft({ ...draft, tone: t })} />)}</div>
        <label className="settings-label" htmlFor="word-section">Section</label>
        <select id="word-section" className="settings-select" value={draft.section} onChange={e => setDraft({ ...draft, section: e.target.value })}>{sections.map(s => <option key={s.label}>{s.label}</option>)}</select>
        <label className="settings-label" htmlFor="word-category">Category</label>
        <select id="word-category" className="settings-select" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{categories.filter(c => c.label !== "All words").map(c => <option key={c.label}>{c.label}</option>)}</select>
        {labelsFor(draft.section).length > 0 && <><label className="settings-label" htmlFor="word-group">{draft.section} label</label><select id="word-group" className="settings-select" value={draft.group} onChange={e => setDraft({ ...draft, group: e.target.value })}>{labelNamesFor(draft.section).map(g => <option key={g}>{g}</option>)}</select></>}
        <div className="dialog-actions">
          <Button onClick={commitDraft} disabled={!draft.label.trim()}><Check />Save</Button>
          {draft.index !== null && <Button variant="outline" onClick={deleteDraft}><Trash2 />Delete word</Button>}
        </div>
      </>}</DialogContent></Dialog>
      <Dialog open={!!labelDraft} onOpenChange={open => !open && setLabelDraft(null)}><DialogContent className="settings-dialog">{labelDraft && <>
        <DialogHeader><DialogTitle>{labelDraft.index === null ? `Add a ${labelDraft.section} label` : `Edit ${labelDraft.label || "label"}`}</DialogTitle><DialogDescription>Choose a name, a picture, and a color.</DialogDescription></DialogHeader>
        <label className="settings-label" htmlFor="group-label">Label (English)</label>
        <input id="group-label" className="settings-select" value={labelDraft.label} maxLength={30} autoFocus onChange={e => setLabelDraft({ ...labelDraft, label: e.target.value })} onKeyDown={e => e.key === "Enter" && commitLabel()} />
        <label className="settings-label" htmlFor="group-ko">Korean</label>
        <input id="group-ko" lang="ko" className="settings-select" value={labelDraft.ko} maxLength={30} onChange={e => setLabelDraft({ ...labelDraft, ko: e.target.value })} />
        <span className="settings-label">Picture</span>
        {renderIconPicker(labelDraft.icon, name => setLabelDraft({ ...labelDraft, icon: name }))}
        <span className="settings-label">Color</span>
        <div className="icon-picker">{tones.map(t => <button type="button" key={t} className={`tone-choice tone-${t} ${labelDraft.tone === t ? "is-active" : ""}`} aria-label={t} aria-pressed={labelDraft.tone === t} onClick={() => setLabelDraft({ ...labelDraft, tone: t })} />)}</div>
        <div className="dialog-actions">
          <Button onClick={commitLabel} disabled={!labelDraft.label.trim()}><Check />Save label</Button>
          {labelDraft.index !== null && <Button variant="outline" onClick={deleteLabel}><Trash2 />Delete label</Button>}
        </div>
      </>}</DialogContent></Dialog>
      <Dialog open={settings} onOpenChange={setSettings}><DialogContent className="settings-dialog"><DialogHeader><DialogTitle>Voice settings</DialogTitle><DialogDescription>Make your voice feel right for you.</DialogDescription></DialogHeader><label className="settings-label" htmlFor="speech-rate">Speaking speed</label><select id="speech-rate" className="settings-select" value={rate} onChange={event => setRate(event.target.value)}><option value="0.65">Slow</option><option value="0.85">Gentle</option><option value="1">Normal</option></select><Button variant="outline" onClick={() => setSound(!sound)}>{sound ? <Volume2 /> : <VolumeX />}Word audio {sound ? "on" : "off"}</Button><Button onClick={() => setSettings(false)}><Check />Done</Button></DialogContent></Dialog>
    </div>
  );
}
