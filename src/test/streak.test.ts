import { describe, expect, it } from "vitest";
import { emptyStreak, recordDailyVisit } from "@/lib/streak";

describe("Daily opening rewards", () => {
  const first = new Date(2026, 9, 23, 9);
  it("earns 10 points and begins a one-day streak on first open", () => {
    expect(recordDailyVisit(emptyStreak, first)).toEqual({ lastVisit: "2026-10-23", days: 1, longest: 1, points: 10 });
  });
  it("awards only once on the same local calendar day", () => {
    const progress = recordDailyVisit(emptyStreak, first);
    expect(recordDailyVisit(progress, new Date(2026, 9, 23, 23, 59))).toEqual(progress);
  });
  it("increments the streak and points on the next day", () => {
    const progress = recordDailyVisit(emptyStreak, first);
    expect(recordDailyVisit(progress, new Date(2026, 9, 24))).toEqual({ lastVisit: "2026-10-24", days: 2, longest: 2, points: 20 });
  });
  it("restarts a missed streak without removing points or longest streak", () => {
    const progress = { lastVisit: "2026-10-23", days: 5, longest: 5, points: 50 };
    expect(recordDailyVisit(progress, new Date(2026, 9, 25))).toEqual({ lastVisit: "2026-10-25", days: 1, longest: 5, points: 60 });
  });
  it("treats month and year boundaries as consecutive days", () => {
    const progress = recordDailyVisit(emptyStreak, new Date(2026, 11, 31));
    expect(recordDailyVisit(progress, new Date(2027, 0, 1)).days).toBe(2);
  });
  it("does not reward moving the clock backwards", () => {
    const progress = recordDailyVisit(emptyStreak, first);
    expect(recordDailyVisit(progress, new Date(2026, 9, 22))).toEqual(progress);
  });
});