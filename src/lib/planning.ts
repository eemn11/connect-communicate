export type PlanningTask = { time: string; text: string; ko?: string };
export type PlanningSchedules = Record<string, PlanningTask[]>;
export const PLANNING_STORE = "together-plans-v1";
export const PLANNING_CHANGED = "together-planning-changed";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function readPlanning(): PlanningSchedules {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PLANNING_STORE) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const schedules: PlanningSchedules = {};
    for (const [day, tasks] of Object.entries(value)) {
      if (Array.isArray(tasks)) schedules[day] = tasks.filter((task): task is PlanningTask =>
        task && typeof task === "object" && typeof task.time === "string" && typeof task.text === "string" && (task.ko === undefined || typeof task.ko === "string"));
    }
    return schedules;
  } catch { return {}; }
}

export function writePlanning(schedules: PlanningSchedules) {
  localStorage.setItem(PLANNING_STORE, JSON.stringify(schedules));
  window.dispatchEvent(new Event(PLANNING_CHANGED));
}

export function tasksForDate(schedules: PlanningSchedules, date: Date, today: Date): PlanningTask[] {
  const weekday = weekdays[date.getDay()];
  const sameDate = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  return [...(weekday ? schedules[weekday] ?? [] : []), ...(sameDate ? schedules.Today ?? [] : [])]
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
}

export function planningTime(time: string) {
  if (!time) return "—";
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  return `${h % 12 || 12}:${minute} ${h < 12 ? "AM" : "PM"}`;
}