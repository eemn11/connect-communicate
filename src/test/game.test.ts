import { describe, expect, it } from "vitest";
import { canFlipTile, pairsFromCards, PEEK_MS, rewardGame } from "@/lib/game";

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

describe("Matching game memorize moment", () => {
  it("shows every card face up for two seconds before play", () => {
    expect(PEEK_MS).toBe(2000);
  });
  it("keeps cards unturnable while every card is face up", () => {
    expect(canFlipTile({ peek: true, open: [], found: new Set<number>(), tile: { id: 0, pair: 0 } })).toBe(false);
  });
  it("lets one card be turned once the memorize moment ends", () => {
    expect(canFlipTile({ peek: false, open: [], found: new Set<number>(), tile: { id: 0, pair: 0 } })).toBe(true);
  });
  it("does not let a third card be turned while two are open", () => {
    expect(canFlipTile({ peek: false, open: [0, 1], found: new Set<number>(), tile: { id: 2, pair: 1 } })).toBe(false);
  });
  it("does not let a matched pair be turned again", () => {
    expect(canFlipTile({ peek: false, open: [], found: new Set([0]), tile: { id: 0, pair: 0 } })).toBe(false);
  });
});
