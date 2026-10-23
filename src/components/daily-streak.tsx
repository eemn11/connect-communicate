import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CalendarCheck, Star } from "lucide-react";
import { DAILY_POINTS, STREAK_STORE, readStreak, recordDailyVisit, type StreakProgress } from "@/lib/streak";

const StreakContext = createContext<{ progress: StreakProgress | null; saved: boolean }>({ progress: null, saved: true });

export function DailyStreakProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StreakProgress | null>(null);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function visit() {
      if (document.visibilityState !== "visible") return;
      const now = new Date();
      const previous = readStreak();
      const next = recordDailyVisit(previous, now);
      try { localStorage.setItem(STREAK_STORE, JSON.stringify(next)); setSaved(true); }
      catch { setSaved(false); }
      setProgress(next);
      clearTimeout(timer);
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(visit, midnight.getTime() - now.getTime() + 100);
    }
    function sync(event: StorageEvent) { if (event.key === STREAK_STORE || event.key === null) setProgress(readStreak()); }
    visit();
    document.addEventListener("visibilitychange", visit);
    window.addEventListener("focus", visit);
    window.addEventListener("storage", sync);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", visit); window.removeEventListener("focus", visit); window.removeEventListener("storage", sync); };
  }, []);
  return <StreakContext.Provider value={{ progress, saved }}>{children}</StreakContext.Provider>;
}

export function DailyStreak() {
  const { progress, saved } = useContext(StreakContext);
  if (!progress) return null;
  return <aside className="daily-streak" aria-label="Daily streak and points">
    <div className="daily-streak-stat"><CalendarCheck aria-hidden="true" /><div><strong>{progress.days} {progress.days === 1 ? "day" : "days"}</strong><span>Streak · <span lang="ko">연속 방문</span></span></div></div>
    <div className="daily-streak-stat"><Star aria-hidden="true" /><div><strong>{progress.points} points</strong><span lang="ko">포인트</span></div></div>
    <p className="daily-streak-reward" role="status">{saved ? <>+{DAILY_POINTS} today <span lang="ko">오늘</span></> : "Progress couldn't be saved on this device."}</p>
  </aside>;
}