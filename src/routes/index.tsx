import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Heart, Settings2, Volume2, VolumeX, MessageCircle, Grid2X2, Utensils, Smile, Users, Shapes, Hand, ArrowLeft, X, Check, ThumbsUp, ThumbsDown, Handshake, Apple, CupSoda, Toilet, Leaf, Plus, Frown, Gamepad2, PartyPopper, Gift } from "lucide-react";
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

const words = [
  { label: "I want", icon: Hand, category: "Needs", tone: "mint" },
  { label: "I feel", icon: Heart, category: "Feelings", tone: "yellow" },
  { label: "Yes", icon: ThumbsUp, category: "Needs", tone: "mint" },
  { label: "No", icon: ThumbsDown, category: "Needs", tone: "rose" },
  { label: "Help", icon: Handshake, category: "People", tone: "blue" },
  { label: "Eat", icon: Apple, category: "Food & drink", tone: "peach" },
  { label: "Drink", icon: CupSoda, category: "Food & drink", tone: "blue" },
  { label: "Toilet", icon: Toilet, category: "Needs", tone: "lavender" },
  { label: "A break", icon: Leaf, category: "Needs", tone: "mint" },
  { label: "More", icon: Plus, category: "Needs", tone: "yellow" },
  { label: "Happy", icon: Smile, category: "Feelings", tone: "yellow" },
  { label: "Sad", icon: Frown, category: "Feelings", tone: "blue" },
  { label: "Play", icon: Gamepad2, category: "Activities", tone: "peach" },
  { label: "All done", icon: PartyPopper, category: "Activities", tone: "lavender" },
  { label: "Thank you", icon: Gift, category: "People", tone: "rose" },
];
const categories = [
  { label: "All words", icon: Grid2X2 }, { label: "Needs", icon: Hand },
  { label: "Feelings", icon: Smile }, { label: "Food & drink", icon: Utensils },
  { label: "People", icon: Users }, { label: "Activities", icon: Shapes },
];

function Index() {
  const [category, setCategory] = useState("All words");
  const [sentence, setSentence] = useState<typeof words>([]);
  const [favorites, setFavorites] = useState(false);
  const [sound, setSound] = useState(true);
  const [settings, setSettings] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState("0.85");
  const [speechError, setSpeechError] = useState("");
  const favoriteLabels = ["I want", "Yes", "No", "Help", "Drink", "A break"];
  const visibleWords = words.filter(word => favorites ? favoriteLabels.includes(word.label) : category === "All words" || word.category === category);
  function speak(text: string) {
    if (!("speechSynthesis" in window)) { setSpeechError("Speaking isn't available in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Number(rate);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setSpeechError("Couldn't speak. Please try again."); };
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
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand-icon" href="/" aria-label="Together home"><MessageCircle /></a>
        <div className="sidebar-links">
          <Button variant="navigation" className={!favorites ? "is-active" : ""} onClick={() => { setFavorites(false); setCategory("All words"); }} aria-pressed={!favorites}><Home /><span>Home</span></Button>
          <Button variant="navigation" className={favorites ? "is-active" : ""} onClick={() => setFavorites(true)} aria-pressed={favorites}><Heart /><span>Favorites</span></Button>
        </div>
        <div className="sidebar-bottom">
          <Button variant="navigation" onClick={() => setSettings(true)} title="Settings"><Settings2 /><span>Settings</span></Button>
          <div className="profile-avatar" aria-label="My profile">Me</div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="wordmark">together<span className="brand-dot">.</span><span className="wordmark-divider" /><span className="page-label">My voice</span></div>
          <Button variant="aac" className="sound-button" onClick={() => setSound(!sound)} aria-pressed={sound} title="Toggle word audio">{sound ? <Volume2 /> : <VolumeX />}<span>Sound {sound ? "on" : "off"}</span></Button>
        </header>
        <main className="home-content">
          <section className="welcome">
            <div><div className="welcome-eyebrow"><span className="welcome-dot" /> A space for your voice</div><h1>Hello, friend <Hand className="wave" aria-hidden="true" /></h1><p>What’s on your mind today?</p></div>
            <img src={mascot} alt="A friendly green speech bubble waving hello" width={512} height={512} className="welcome-mascot" />
          </section>
          <nav className="category-bar" aria-label="Word categories">
            {categories.map(({ label, icon: Icon }) => <Button key={label} variant="aac" className={`category-button ${!favorites && category === label ? "is-active" : ""}`} aria-pressed={!favorites && category === label} onClick={() => { setFavorites(false); setCategory(label); }}><Icon /><span>{label}</span></Button>)}
          </nav>
          <div className="words-heading"><h2>{favorites ? "Favorite words" : category === "All words" ? "Everyday words" : category}</h2><span>{visibleWords.length} words <span className="heading-dot">·</span> A little connection starts here</span></div>
          <section className="word-grid" aria-label="Communication words">
            {visibleWords.map(word => <Button key={word.label} variant="word" className={`tone-${word.tone}`} onClick={() => addWord(word)}><span className="word-symbol" aria-hidden="true"><word.icon /></span><span className="word-label">{word.label}</span></Button>)}
          </section>
          <section className="sentence-section" aria-label="Sentence builder">
            <div className="sentence-heading"><span><MessageCircle />My sentence</span><Button variant="ghost" className="clear-button" disabled={!sentence.length} onClick={() => setSentence([])}><X />Clear</Button></div>
            <div className="sentence-row">
              <div className="sentence-preview" aria-live="polite">{sentence.length ? sentence.map((word, index) => <span className={`sentence-word tone-${word.tone}`} key={`${word.label}-${index}`}><word.icon aria-hidden="true" />{word.label}</span>) : <span className="sentence-placeholder">I have something to say…</span>}</div>
              <Button variant="aac" className="backspace-button" title="Remove last word" aria-label="Remove last word" disabled={!sentence.length} onClick={() => setSentence(current => current.slice(0, -1))}><ArrowLeft /></Button>
              <Button variant="aac" className="speak-button" disabled={!sentence.length} onClick={() => speak(sentence.map(word => word.label).join(" "))}><Volume2 /><span>{speaking ? "Speaking…" : "Speak"}</span></Button>
            </div>
            {speechError && <p role="alert" className="speech-error">{speechError}</p>}
          </section>
          <footer className="home-footer"><span><Heart /> Every voice matters.</span><span>Made for connection, at your pace.</span></footer>
        </main>
      </div>
      <Dialog open={settings} onOpenChange={setSettings}><DialogContent className="settings-dialog"><DialogHeader><DialogTitle>Voice settings</DialogTitle><DialogDescription>Make your voice feel right for you.</DialogDescription></DialogHeader><label className="settings-label" htmlFor="speech-rate">Speaking speed</label><select id="speech-rate" className="settings-select" value={rate} onChange={event => setRate(event.target.value)}><option value="0.65">Slow</option><option value="0.85">Gentle</option><option value="1">Normal</option></select><Button variant="outline" onClick={() => setSound(!sound)}>{sound ? <Volume2 /> : <VolumeX />}Word audio {sound ? "on" : "off"}</Button><Button onClick={() => setSettings(false)}><Check />Done</Button></DialogContent></Dialog>
    </div>
  );
}
