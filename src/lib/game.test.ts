import { describe, expect, it } from "@jest/globals";
import {
  calculateDifficultyXP,
  calculateStreakBonusXP,
  computeLevel,
} from "@/lib/game";

describe("calculateStreakBonusXP", () => {
  it("returns the streak value when divisible by 5", () => {
    expect(calculateStreakBonusXP(5)).toBe(5);
    expect(calculateStreakBonusXP(10)).toBe(10);
    expect(calculateStreakBonusXP(25)).toBe(25);
  });

  it("returns 0 for non-multiples of 5", () => {
    expect(calculateStreakBonusXP(0)).toBe(0);
    expect(calculateStreakBonusXP(1)).toBe(0);
    expect(calculateStreakBonusXP(9)).toBe(0);
  });
});

describe("calculateDifficultyXP", () => {
  it("maps each difficulty to the expected XP", () => {
    expect(calculateDifficultyXP("fácil")).toBe(10);
    expect(calculateDifficultyXP("média")).toBe(20);
    expect(calculateDifficultyXP("difícil")).toBe(30);
  });
});

describe("computeLevel", () => {
  it("changes levels at the expected XP boundaries", () => {
    const level1 = computeLevel(0);
    expect(computeLevel(199)).toBe(level1);

    const level2 = computeLevel(200);
    expect(level2).not.toBe(level1);
    expect(computeLevel(599)).toBe(level2);

    const level3 = computeLevel(600);
    expect(level3).not.toBe(level2);
    expect(computeLevel(999)).toBe(level3);

    const level4 = computeLevel(1000);
    expect(level4).not.toBe(level3);
    expect(computeLevel(5000)).toBe(level4);
  });
});
