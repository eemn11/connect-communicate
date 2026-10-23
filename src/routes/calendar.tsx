import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanning } from "@/lib/use-planning";
import { planningTime, tasksForDate } from "@/lib/planning";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Together" },
      { name: "description", content: "See your Together Planning tasks on a calendar with English and Korean daily schedules." },
      { property: "og:title", content: "Calendar — Together" },
      { property: "og:description", content: "See your Together Planning tasks on a calendar with English and Korean daily schedules." },
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
  const [selectedDay, setSelectedDay] = useState(1);
  const { plans } = usePlanning();
  useEffect(() => { const d = new Date(); setToday(d); setMonth(d.getMonth()); setSelectedDay(d.getDate()); }, []);

  if (!today) return <main className="calendar-page" />;
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const isToday = (d: number) => month === today.getMonth() && d === today.getDate();
  const selectedDate = new Date(year, month, Math.min(selectedDay, daysInMonth));
  const selectedTasks = tasksForDate(plans, selectedDate, today);
  const dateTitle = selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
          <Button variant="navigation" onClick={() => { setMonth(today.getMonth()); setSelectedDay(today.getDate()); }}><span>Today</span></Button>
          <Button variant="navigation" aria-label="Next month" disabled={month === 11} onClick={() => setMonth(m => m + 1)}><ChevronRight /></Button>
        </div>
      </header>
      <div className="calendar-months" role="tablist" aria-label="Months">
        {MONTHS.map((m, i) => (
          <Button variant="ghost" key={m} role="tab" aria-selected={i === month} className={`calendar-month-chip ${i === month ? "is-active" : ""}`} onClick={() => setMonth(i)}>{m.slice(0, 3)}<span lang="ko">{i + 1}월</span></Button>
        ))}
      </div>
      <div className="calendar-grid" role="grid" aria-label={`${MONTHS[month]} ${year}`}>
        {DAYS.map(([en, ko]) => <div key={en} className="calendar-weekday" role="columnheader">{en}<span lang="ko">{ko}</span></div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} role="gridcell" className="calendar-day is-empty" />;
          const date = new Date(year, month, d);
          const tasks = tasksForDate(plans, date, today);
          return <div key={i} role="gridcell" aria-selected={d === selectedDate.getDate()}>
            <Button variant="ghost" className={`calendar-day ${isToday(d) ? "is-today" : ""} ${d === selectedDate.getDate() ? "is-selected" : ""} ${i % 7 === 0 || i % 7 === 6 ? "is-weekend" : ""}`} aria-current={isToday(d) ? "date" : undefined} aria-label={`${MONTHS[month]} ${d}, ${year}, ${tasks.length} tasks`} onClick={() => setSelectedDay(d)}>
              <span className="calendar-day-number">{d}</span>
              <span className="calendar-task-previews">{tasks.slice(0, 2).map((task, n) => <span className="calendar-task-preview" key={n}><span>{planningTime(task.time)}</span><span>{task.text || task.ko}</span></span>)}{tasks.length > 2 && <span className="calendar-more">+{tasks.length - 2}</span>}</span>
            </Button>
          </div>;
        })}
      </div>
      <section className="calendar-agenda" aria-label="Selected day schedule">
        <header><div><h2>{dateTitle}</h2><p lang="ko">{selectedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}</p></div><span>{selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"}</span></header>
        {selectedTasks.length ? <ol>{selectedTasks.map((task, i) => <li key={i}><span className="calendar-agenda-time">{planningTime(task.time)}</span><div><p>{task.text}</p>{task.ko && <p lang="ko">{task.ko}</p>}</div></li>)}</ol> : <p className="text-muted-foreground">No tasks / 할 일 없음</p>}
      </section>
      <nav className="calendar-foot">
        <Button variant="aac" asChild className="home-button"><Link to="/"><Home /><span>Home</span></Link></Button>
      </nav>
    </main>
  );
}
