import { beforeEach, describe, expect, it } from "@jest/globals";
import type { RoundResult } from "@/lib/storage";
import {
  getBestScoreFromLocalStorage,
  getBestStreakFromLocalStorage,
  getExpFromLocalStorage,
  getRoundResultsFromLocalStorage,
  getRoundsPlayedFromLocalStorage,
  getUnlockedAchievementsFromLocalStorage,
  saveBestScoreToLocalStorage,
  saveBestStreakToLocalStorage,
  saveCorrectAnswerProgressToLocalStorage,
  saveExpToLocalStorage,
  saveRoundResultToLocalStorage,
} from "@/lib/storage";

function createRoundResult(overrides: Partial<RoundResult> = {}): RoundResult {
  return {
    melhorSequencia: 0,
    acertos: 0,
    total: 10,
    xpGanho: 0,
    dataISO: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns defaults when localStorage is empty", () => {
    expect(getBestScoreFromLocalStorage()).toBe(0);
    expect(getBestStreakFromLocalStorage()).toBe(0);
    expect(getExpFromLocalStorage()).toBe(0);
    expect(getRoundResultsFromLocalStorage()).toEqual([]);
    expect(getRoundsPlayedFromLocalStorage()).toBe(0);
    expect(getUnlockedAchievementsFromLocalStorage()).toEqual([]);
  });

  it("persists score, streak and xp values", () => {
    saveBestScoreToLocalStorage(8);
    saveBestStreakToLocalStorage(6);
    saveExpToLocalStorage(145);

    expect(getBestScoreFromLocalStorage()).toBe(8);
    expect(getBestStreakFromLocalStorage()).toBe(6);
    expect(getExpFromLocalStorage()).toBe(145);
  });

  it("unlocks streak achievements at the right milestones", () => {
    const baseContext = {
      timerLeft: 15,
      questionIndex: 2,
      totalQuestions: 10,
    };

    expect(
      saveCorrectAnswerProgressToLocalStorage({
        ...baseContext,
        streak: 4,
      }),
    ).toEqual([]);

    expect(
      saveCorrectAnswerProgressToLocalStorage({
        ...baseContext,
        streak: 5,
      }),
    ).toEqual(["streak5"]);

    expect(
      saveCorrectAnswerProgressToLocalStorage({
        ...baseContext,
        streak: 10,
      }),
    ).toEqual(["streak5", "streak10"]);

    expect(getUnlockedAchievementsFromLocalStorage()).toEqual([
      "streak5",
      "streak10",
    ]);
  });

  it("saves a round result and computes aggregate data", () => {
    saveExpToLocalStorage(195);
    saveBestScoreToLocalStorage(6);
    saveBestStreakToLocalStorage(4);

    const output = saveRoundResultToLocalStorage(
      createRoundResult({
        acertos: 10,
        total: 10,
        xpGanho: 10,
        melhorSequencia: 8,
      }),
    );

    expect(output.xpTotal).toBe(205);
    expect(output.bestScore).toBe(10);
    expect(output.roundsPlayed).toBe(1);
    expect(output.unlockedAchievements).toEqual(
      expect.arrayContaining(["firstGame", "perfect10", "xp200"]),
    );
    expect(getBestStreakFromLocalStorage()).toBe(8);
    expect(getRoundResultsFromLocalStorage()).toHaveLength(1);
  });

  it("keeps only the latest 50 round results", () => {
    for (let i = 0; i < 50; i += 1) {
      saveRoundResultToLocalStorage(
        createRoundResult({
          dataISO: `2026-01-01T00:00:${String(i).padStart(2, "0")}.000Z`,
        }),
      );
    }

    const before = getRoundResultsFromLocalStorage();
    expect(before).toHaveLength(50);

    const firstBefore = before[0]?.dataISO;
    const latestRound = createRoundResult({
      dataISO: "2026-01-01T00:10:00.000Z",
    });

    saveRoundResultToLocalStorage(latestRound);

    const after = getRoundResultsFromLocalStorage();
    expect(after).toHaveLength(50);
    expect(after[0]?.dataISO).not.toBe(firstBefore);
    expect(after[after.length - 1]?.dataISO).toBe(latestRound.dataISO);
  });
});
