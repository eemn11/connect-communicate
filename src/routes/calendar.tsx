import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Together" },
      { name: "description", content: "See this year's months and days in English and Korean." },
      { property: "og:title", content: "Calendar — Together" },
      { property: "og:description", content: "See this year's months and days in English and Korean." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalendarPage,
});

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = [["Sun", "일"], ["Mon", "월"], ["Tue", "화"], ["Wed", "수"], ["Thu", "목"], ["Fri", "금"], ["Sat", "토"]] as const;

function CalendarPage() {
  // Read the real date after load so the server and the device agree.
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState(0);
  useEffect(() => { const d = new Date(); setToday(d); setMonth(d.getMonth()); }, []);

  if (!today) return <main className="calendar-page" />;
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const isToday = (d: number) => month === today.getMonth() && d === today.getDate();

  return (
    <main className="calendar-page">
      <header className="calendar-head">
        <Button variant="navigation" asChild><Link to="/"><ArrowLeft /><span>Back</span></Link></Button>
        <div className="calendar-title">
          <h1>{MONTHS[month]} {year}</h1>
          <p lang="ko">{year}년 {month + 1}월</p>
        </div>
        <div className="calendar-arrows">
          <Button variant="navigation" aria-label="Previous month" disabled={month === 0} onClick={() => setMonth(m => m - 1)}><ChevronLeft /></Button>
          <Button variant="navigation" onClick={() => setMonth(today.getMonth())}><span>Today</span></Button>
          <Button variant="navigation" aria-label="Next month" disabled={month === 11} onClick={() => setMonth(m => m + 1)}><ChevronRight /></Button>
        </div>
      </header>
      <div className="calendar-months" role="tablist" aria-label="Months">
        {MONTHS.map((m, i) => (
          <button key={m} role="tab" aria-selected={i === month} className={`calendar-month-chip ${i === month ? "is-active" : ""}`} onClick={() => setMonth(i)}>{m.slice(0, 3)}<span lang="ko">{i + 1}월</span></button>
        ))}
      </div>
      <div className="calendar-grid" role="grid" aria-label={`${MONTHS[month]} ${year}`}>
        {DAYS.map(([en, ko]) => <div key={en} className="calendar-weekday" role="columnheader">{en}<span lang="ko">{ko}</span></div>)}
        {cells.map((d, i) => (
          <div key={i} role="gridcell" className={`calendar-day ${d === null ? "is-empty" : ""} ${d !== null && isToday(d) ? "is-today" : ""} ${i % 7 === 0 || i % 7 === 6 ? "is-weekend" : ""}`} aria-current={d !== null && isToday(d) ? "date" : undefined}>
            {d}
          </div>
        ))}
      </div>
      <nav className="calendar-foot">
        <Button variant="aac" asChild className="home-button"><Link to="/"><Home /><span>Home</span></Link></Button>
      </nav>
    </main>
  );
}
