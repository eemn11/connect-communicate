import { describe, expect, it } from "vitest";
import { tasksForDate } from "@/lib/planning";

describe("Planning tasks on the calendar", () => {
  const today = new Date(2026, 9, 23);
  it("shows weekday tasks on matching dates, not other weekdays", () => {
    const plans = { Monday: [{ time: "09:30", text: "Swimming", ko: "수영" }] };
    expect(tasksForDate(plans, new Date(2026, 9, 26), today)).toEqual(plans.Monday);
    expect(tasksForDate(plans, new Date(2026, 9, 27), today)).toEqual([]);
    expect(tasksForDate(plans, new Date(2026, 10, 2), today)).toEqual(plans.Monday);
  });
  it("shows Today tasks only on the actual current date", () => {
    const plans = { Today: [{ time: "10:00", text: "Appointment" }] };
    expect(tasksForDate(plans, today, today)).toEqual(plans.Today);
    expect(tasksForDate(plans, new Date(2026, 9, 24), today)).toEqual([]);
  });
  it("combines today's weekday schedule and Today tasks chronologically, with untimed tasks last", () => {
    const plans = { Today: [{ time: "", text: "Rest" }, { time: "08:30", text: "Breakfast" }], Friday: [{ time: "13:00", text: "Lunch" }] };
    expect(tasksForDate(plans, today, today).map(t => t.text)).toEqual(["Breakfast", "Lunch", "Rest"]);
  });
});