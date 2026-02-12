const STORAGE_KEYS = {
  xp: "qbo_xp",
  best: "qbo_best",
  results: "qbo_results",
  achievements: "qbo_conquistas",
  roundsPlayed: "qbo_rounds_played",
} as const;

const LEGACY_ACHIEVEMENT_IDS: Record<string, string> = {
  streak3: "streak3",
  streak5: "streak5",
  streak10: "streak10",
};

type RoundResult = {
  acertos: number;
  total: number;
  xpGanho: number;
  dataISO: string;
};

type SaveRoundResultOutput = {
  xpTotal: number;
  bestScore: number;
  roundsPlayed: number;
  unlockedAchievements: string[];
};

type CorrectAnswerContext = {
  streak: number;
  timerLeft: number;
  questionIndex: number;
  totalQuestions: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readNumber(key: string): number {
  if (!canUseStorage()) return 0;

  const value = localStorage.getItem(key);
  if (value === null) return 0;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function writeNumber(key: string, value: number): void {
  if (!canUseStorage()) return;
  localStorage.setItem(key, `${value}`);
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [] as T[];

  const value = localStorage.getItem(key);
  if (value === null) return [] as T[];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : ([] as T[]);
  } catch {
    return [] as T[];
  }
}

function writeArray<T>(key: string, values: T[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(values));
}

function normalizeAchievementId(achievementId: string): string {
  return LEGACY_ACHIEVEMENT_IDS[achievementId] ?? achievementId;
}

function getExpFromLocalStorage(): number {
  return readNumber(STORAGE_KEYS.xp);
}

function saveExpToLocalStorage(exp: number): void {
  writeNumber(STORAGE_KEYS.xp, exp);
}

function getBestScoreFromLocalStorage(): number {
  return readNumber(STORAGE_KEYS.best);
}

function saveBestScoreToLocalStorage(score: number): void {
  writeNumber(STORAGE_KEYS.best, score);
}

function getRoundResultsFromLocalStorage(): RoundResult[] {
  return readArray<RoundResult>(STORAGE_KEYS.results);
}

function saveRoundResultsToLocalStorage(results: RoundResult[]): void {
  if (results.length > 50) results.shift()

  writeArray<RoundResult>(STORAGE_KEYS.results, results);
}

function getRoundsPlayedFromLocalStorage(): number {
  return readNumber(STORAGE_KEYS.roundsPlayed);
}

function saveRoundsPlayedToLocalStorage(roundsPlayed: number): void {
  writeNumber(STORAGE_KEYS.roundsPlayed, roundsPlayed);
}

function getUnlockedAchievementsFromLocalStorage(): string[] {
  const unlocked = readArray<string>(STORAGE_KEYS.achievements).map(
    normalizeAchievementId,
  );
  const uniqueUnlocked = Array.from(new Set(unlocked));

  if (uniqueUnlocked.length !== unlocked.length) {
    writeArray<string>(STORAGE_KEYS.achievements, uniqueUnlocked);
  }

  return uniqueUnlocked;
}

function saveUnlockedAchievementsToLocalStorage(achievementIds: string[]): string[] {
  const normalizedIds = achievementIds.map(normalizeAchievementId);
  const uniqueIds = Array.from(new Set(normalizedIds));
  writeArray<string>(STORAGE_KEYS.achievements, uniqueIds);
  return uniqueIds;
}

function unlockAchievementInLocalStorage(achievementId: string): string[] {
  return unlockAchievementsInLocalStorage([achievementId]);
}

function unlockAchievementsInLocalStorage(achievementIds: string[]): string[] {
  const currentUnlocked = getUnlockedAchievementsFromLocalStorage();
  const combined = [...currentUnlocked, ...achievementIds];
  return saveUnlockedAchievementsToLocalStorage(combined);
}

function saveCorrectAnswerProgressToLocalStorage(
  context: CorrectAnswerContext,
): string[] {
  const achievementsToUnlock = [] as string[];

  if (context.streak === 5) achievementsToUnlock.push("streak5");
  if (context.streak === 10) achievementsToUnlock.push("streak10");

  return unlockAchievementsInLocalStorage(achievementsToUnlock);
}

function getRoundAchievementsToUnlock(
  result: RoundResult,
  xpTotal: number,
  roundsPlayed: number,
): string[] {
  const achievementsToUnlock = [] as string[];

  if (roundsPlayed === 1) achievementsToUnlock.push("firstGame");
  if (roundsPlayed >= 10) achievementsToUnlock.push("games10");

  if (result.acertos >= result.total) achievementsToUnlock.push("perfect10");

  if (xpTotal >= 200) achievementsToUnlock.push("xp200");
  if (xpTotal >= 1000) achievementsToUnlock.push("xp1000");

  return achievementsToUnlock;
}

function saveRoundResultToLocalStorage(result: RoundResult): SaveRoundResultOutput {
  const currentBest = getBestScoreFromLocalStorage();
  const bestScore = Math.max(currentBest, result.acertos);
  saveBestScoreToLocalStorage(bestScore);

  const xpTotal = getExpFromLocalStorage() + result.xpGanho;
  saveExpToLocalStorage(xpTotal);

  const roundsPlayed = getRoundsPlayedFromLocalStorage() + 1;
  saveRoundsPlayedToLocalStorage(roundsPlayed);

  const results = getRoundResultsFromLocalStorage();
  saveRoundResultsToLocalStorage([...results, result]);

  const unlockedAchievements = unlockAchievementsInLocalStorage(
    getRoundAchievementsToUnlock(result, xpTotal, roundsPlayed),
  );

  return {
    xpTotal,
    bestScore,
    roundsPlayed,
    unlockedAchievements,
  };
}

export type { CorrectAnswerContext, RoundResult, SaveRoundResultOutput };
export {
  getBestScoreFromLocalStorage,
  getExpFromLocalStorage,
  getRoundResultsFromLocalStorage,
  getRoundsPlayedFromLocalStorage,
  getUnlockedAchievementsFromLocalStorage,
  saveBestScoreToLocalStorage,
  saveCorrectAnswerProgressToLocalStorage,
  saveExpToLocalStorage,
  saveRoundResultToLocalStorage,
  saveRoundsPlayedToLocalStorage,
  saveUnlockedAchievementsToLocalStorage,
  unlockAchievementInLocalStorage,
  unlockAchievementsInLocalStorage,
};
