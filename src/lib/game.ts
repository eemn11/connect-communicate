import { localDay, readStreak, STREAK_STORE } from "./streak";

export type VocabPair = { en: string; ko: string };
export const GAME_POINTS = 5;
export const GAME_DAILY_LIMIT = 3;
export const GAME_STORE = "together-game-v1";
export const STREAK_CHANGED = "together-streak-changed";

export const BUILT_IN_SETS: { id: string; name: string; ko: string; words: VocabPair[] }[] = [
  { id: "food", name: "Food", ko: "음식", words: [
    { en: "Apple", ko: "사과" }, { en: "Water", ko: "물" }, { en: "Rice", ko: "밥" }, { en: "Milk", ko: "우유" }, { en: "Bread", ko: "빵" }, { en: "Egg", ko: "계란" }] },
  { id: "animals", name: "Animals", ko: "동물", words: [
    { en: "Dog", ko: "개" }, { en: "Cat", ko: "고양이" }, { en: "Bird", ko: "새" }, { en: "Fish", ko: "물고기" }, { en: "Rabbit", ko: "토끼" }, { en: "Horse", ko: "말" }] },
  { id: "colors", name: "Colors", ko: "색깔", words: [
    { en: "Red", ko: "빨간색" }, { en: "Blue", ko: "파란색" }, { en: "Yellow", ko: "노란색" }, { en: "Green", ko: "초록색" }, { en: "White", ko: "흰색" }, { en: "Black", ko: "검은색" }] },
  { id: "body", name: "Body", ko: "몸", words: [
    { en: "Hand", ko: "손" }, { en: "Eye", ko: "눈" }, { en: "Ear", ko: "귀" }, { en: "Nose", ko: "코" }, { en: "Mouth", ko: "입" }, { en: "Foot", ko: "발" }] },
];

/** Words from the user's saved cards that have both English and Korean. */
export function pairsFromCards(saved: unknown): VocabPair[] {
  if (!Array.isArray(saved)) return [];
  const seen = new Set<string>();
  const out: VocabPair[] = [];
  for (const item of saved) {
    const en = typeof item?.label === "string" ? item.label.trim() : "";
    const ko = typeof item?.ko === "string" ? item.ko.trim() : "";
    if (!en || !ko || seen.has(en.toLowerCase())) continue;
    seen.add(en.toLowerCase()); out.push({ en, ko });
  }
  return out;
}

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}

export type GameRewards = { day: string; games: number };

/** How long every card stays face-up at the start of a round so the user can memorize the spots. */
export const PEEK_MS = 2000;

export type FlipState = { peek: boolean; open: number[]; found: Set<number>; tile: { id: number; pair: number } };

/** A card may only be turned once the memorize moment is over, it is not already face-up, and its pair is not matched. */
export function canFlipTile({ peek, open, found, tile }: FlipState): boolean {
  if (peek) return false;
  if (open.length === 2) return false;
  if (open.includes(tile.id)) return false;
  if (found.has(tile.pair)) return false;
  return true;
}

/** Points for one finished game; only the first few games each day earn points. */
export function rewardGame(rewards: GameRewards, now: Date): { rewards: GameRewards; earned: number } {
  const day = localDay(now);
  const games = rewards.day === day ? rewards.games : 0;
  if (games >= GAME_DAILY_LIMIT) return { rewards: { day, games }, earned: 0 };
  return { rewards: { day, games: games + 1 }, earned: GAME_POINTS };
}

export function awardFinishedGame(now = new Date()): number {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_STORE) ?? "null");
    const current: GameRewards = saved && typeof saved.day === "string" && Number.isSafeInteger(saved.games) ? saved : { day: "", games: 0 };
    const { rewards, earned } = rewardGame(current, now);
    localStorage.setItem(GAME_STORE, JSON.stringify(rewards));
    if (earned) {
      const streak = readStreak();
      localStorage.setItem(STREAK_STORE, JSON.stringify({ ...streak, points: streak.points + earned }));
      window.dispatchEvent(new Event(STREAK_CHANGED));
    }
    return earned;
  } catch { return 0; }
}
