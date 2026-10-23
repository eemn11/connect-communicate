export const DAILY_POINTS = 10;
export const STREAK_STORE = "together-streak-v1";
export type StreakProgress = { lastVisit: string; days: number; longest: number; points: number };
export const emptyStreak: StreakProgress = { lastVisit: "", days: 0, longest: 0, points: 0 };

export function localDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayNumber(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  if (y === undefined || m === undefined || d === undefined) return NaN;
  return Date.UTC(y, m - 1, d) / 86400000;
}

export function recordDailyVisit(progress: StreakProgress, now: Date): StreakProgress {
  const today = localDay(now);
  const gap = dayNumber(today) - dayNumber(progress.lastVisit);
  // Repeated opens and a clock moved backwards cannot earn more points.
  if (progress.lastVisit && gap <= 0) return progress;
  const days = gap === 1 ? progress.days + 1 : 1;
  return { lastVisit: today, days, longest: Math.max(progress.longest, days), points: progress.points + DAILY_POINTS };
}

export function readStreak(): StreakProgress {
  try {
    const value = JSON.parse(localStorage.getItem(STREAK_STORE) ?? "null");
    if (value && typeof value.lastVisit === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.lastVisit)
      && [value.days, value.longest, value.points].every(n => Number.isSafeInteger(n) && n >= 0)) return value;
  } catch { /* Device storage may be unavailable. */ }
  return emptyStreak;
}