import { describe, expect, it } from "vitest";
import { matchScore, recordGame } from "@/lib/game";

const day = new Date(2026, 10, 13, 10);
const nextDay = new Date(2026, 10, 14, 10);
const base = { goal: 5, day: "", played: 0, best: 0 };

describe("game goals", () => {
  it("scores 100 for perfect match and 10 less per miss, min 10", () => {
    expect(matchScore(0)).toBe(100);
    expect(matchScore(3)).toBe(70);
    expect(matchScore(20)).toBe(10);
  });
  it("keeps the best score of the day", () => {
    const a = recordGame(base, 70, day);
    const b = recordGame(a, 50, day);
    expect(b.best).toBe(70);
    expect(b.played).toBe(2);
  });
  it("resets played and best on a new day but keeps the goal", () => {
    const a = recordGame(recordGame(base, 90, day), null, nextDay);
    expect(a).toMatchObject({ goal: 5, played: 1, best: 0 });
  });
});
