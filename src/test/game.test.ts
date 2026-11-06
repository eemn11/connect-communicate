import { describe, expect, it } from "vitest";
import { pairsFromCards, rewardGame } from "@/lib/game";

const day = new Date(2026, 10, 6, 12);
describe("Word game points", () => {
  it("gives 5 points for a finished game", () => {
    expect(rewardGame({ day: "", games: 0 }, day).earned).toBe(5);
  });
  it("stops giving points after 3 games in one day", () => {
    expect(rewardGame({ day: "2026-11-06", games: 3 }, day).earned).toBe(0);
  });
  it("gives points again the next day", () => {
    expect(rewardGame({ day: "2026-11-05", games: 3 }, day).earned).toBe(5);
  });
  it("uses only cards that have both English and Korean", () => {
    expect(pairsFromCards([{ label: "Water", ko: "물" }, { label: "Play", ko: "" }])).toEqual([{ en: "Water", ko: "물" }]);
  });
});
