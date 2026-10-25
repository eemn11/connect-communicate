import { localDay } from "./streak";

export type PlanningTask = { time: string; text: string; ko?: string };
export type PlanningSchedules = Record<string, PlanningTask[]>;
export const PLANNING_STORE = "together-plans-v1";
export const PLANNING_META = "together-plans-meta-v1";
export const PLANNING_CHANGED = "together-planning-changed";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type PlanningMeta = { today: string; week: string };

// Weeks run Sunday to Saturday, so a new week starts on Sunday.
export function weekStartDay(date: Date) {
  return localDay(new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()));
}

// "Today" tasks belong to one calendar day; every other schedule belongs to one week.
export function prunePlanning(schedules: PlanningSchedules, meta: PlanningMeta, now: Date): PlanningSchedules {
  const today = localDay(now);
  const week = weekStartDay(now);
  const next: PlanningSchedules = {};
  for (const [day, tasks] of Object.entries(schedules)) {
    if (day === "Today") { if (meta.today === today) next[day] = tasks; }
    else if (meta.week === week) next[day] = tasks;
  }
  return next;
}

function readMeta(): PlanningMeta {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PLANNING_META) ?? "null");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const meta = value as Record<string, unknown>;
      if (typeof meta["today"] === "string" && typeof meta["week"] === "string") return { today: meta["today"], week: meta["week"] };
    }
  } catch { /* Device storage may be unavailable. */ }
  return { today: "", week: "" };
}

export function readPlanning(now = new Date()): PlanningSchedules {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PLANNING_STORE) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const schedules: PlanningSchedules = {};
    for (const [day, tasks] of Object.entries(value)) {
      if (Array.isArray(tasks)) schedules[day] = tasks.filter((task): task is PlanningTask =>
        task && typeof task === "object" && typeof task.time === "string" && typeof task.text === "string" && (task.ko === undefined || typeof task.ko === "string"));
    }
    const pruned = prunePlanning(schedules, readMeta(), now);
    if (Object.keys(pruned).length !== Object.keys(schedules).length) writePlanning(pruned, now);
    return pruned;
  } catch { return {}; }
}

export function writePlanning(schedules: PlanningSchedules, now = new Date()) {
  localStorage.setItem(PLANNING_STORE, JSON.stringify(schedules));
  localStorage.setItem(PLANNING_META, JSON.stringify({ today: localDay(now), week: weekStartDay(now) }));
  window.dispatchEvent(new Event(PLANNING_CHANGED));
}

export function tasksForDate(schedules: PlanningSchedules, date: Date, today: Date): PlanningTask[] {
  const weekday = weekdays[date.getDay()];
  const sameDate = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  return [...(weekday ? schedules[weekday] ?? [] : []), ...(sameDate ? schedules["Today"] ?? [] : [])]
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
}

export function planningTime(time: string) {
  if (!time) return "—";
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  return `${h % 12 || 12}:${minute} ${h < 12 ? "AM" : "PM"}`;
}