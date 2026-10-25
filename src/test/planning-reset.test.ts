import { describe, expect, it } from "vitest";
import { prunePlanning, weekStartDay, type PlanningSchedules } from "@/lib/planning";

// Friday Oct 23 2026; its week starts Sunday Oct 18 2026.
const friday = new Date(2026, 9, 23, 10);
const meta = { today: "2026-10-23", week: "2026-10-18" };
const schedules: PlanningSchedules = {
  Today: [{ time: "09:00", text: "Brush teeth" }],
  Monday: [{ time: "15:00", text: "Swimming" }],
  "My trip": [{ time: "", text: "Pack bag" }],
};

describe("Planning schedule resets", () => {
  it("keeps every schedule while the day and week are current", () => {
    expect(prunePlanning(schedules, meta, friday)).toEqual(schedules);
  });
  it("resets only the Today schedule when the day passes", () => {
    const saturday = new Date(2026, 9, 24, 8);
    const pruned = prunePlanning(schedules, meta, saturday);
    expect(pruned["Today"]).toBeUndefined();
    expect(pruned["Monday"]).toEqual(schedules["Monday"]);
    expect(pruned["My trip"]).toEqual(schedules["My trip"]);
  });
  it("resets the weekday and custom schedules after Saturday, when a new week starts", () => {
    const nextSunday = new Date(2026, 9, 25, 8);
    const pruned = prunePlanning(schedules, meta, nextSunday);
    expect(pruned["Today"]).toBeUndefined();
    expect(pruned["Monday"]).toBeUndefined();
    expect(pruned["My trip"]).toBeUndefined();
  });
  it("keeps weekday schedules saved earlier the same week", () => {
    const savedMonday = { today: "2026-10-19", week: "2026-10-18" };
    expect(prunePlanning(schedules, savedMonday, friday)["Monday"]).toEqual(schedules["Monday"]);
  });
  it("treats Sunday as the first day of the week", () => {
    expect(weekStartDay(new Date(2026, 9, 25))).toBe("2026-10-25");
    expect(weekStartDay(new Date(2026, 9, 24))).toBe("2026-10-18");
  });
});
