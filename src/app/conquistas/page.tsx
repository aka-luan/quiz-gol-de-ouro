"use client";

import Progress from "@/components/Progress";
import { getUnlockedAchievementsFromLocalStorage } from "@/lib/storage";
import {
  Award,
  Check,
  CheckCircle,
  Crown,
  Flag,
  Flame,
  Footprints,
  Gamepad2,
  Gauge,
  Gem,
  Hourglass,
  Key,
  Lock,
  Medal,
  Repeat,
  Sparkles,
  Target,
  ThumbsUp,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Achievement = {
  id: string;
  name: string;
  description: string;
  rarity: "comum" | "incomum" | "raro" | "épico";
  icon: string;
  category: string;
  trigger: {
    type: string;
    value: number;
  };
};

const ICONS_BY_NAME: Record<string, LucideIcon> = {
  award: Award,
  check: Check,
  "check-circle": CheckCircle,
  crown: Crown,
  flame: Flame,
  "flag-checkered": Flag,
  footprints: Footprints,
  "gamepad-2": Gamepad2,
  gauge: Gauge,
  gem: Gem,
  hourglass: Hourglass,
  key: Key,
  medal: Medal,
  repeat: Repeat,
  sparkles: Sparkles,
  target: Target,
  "thumbs-up": ThumbsUp,
  timer: Timer,
  trophy: Trophy,
  zap: Zap,
};

const RARITY_CLASSES: Record<Achievement["rarity"], string> = {
  comum: "text-text-secondary border-surface-2",
  incomum: "text-success-500 border-surface-2",
  raro: "text-accent-amber-400 border-surface-2",
  épico: "text-primary-500 border-surface-2",
};

function Conquistas() {
  const [achievements, setAchievements] = useState([] as Achievement[]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([] as string[]);

  useEffect(() => {
    let isMounted = true;

    fetch("/data/achievements.json")
      .then((res) => res.json())
      .then((data: Achievement[]) => {
        if (!isMounted) return;
        setAchievements(() => data);
      });

    const refreshUnlockedAchievements = () => {
      if (!isMounted) return;
      setUnlockedAchievements(() => getUnlockedAchievementsFromLocalStorage());
    };

    refreshUnlockedAchievements();
    window.addEventListener("focus", refreshUnlockedAchievements);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", refreshUnlockedAchievements);
    };
  }, []);

  const unlockedAchievementsSet = useMemo(
    () => new Set(unlockedAchievements),
    [unlockedAchievements],
  );

  const unlockedTotal = achievements.filter((achievement) =>
    unlockedAchievementsSet.has(achievement.id),
  ).length;

  return (
    <main className="bg-deep card-surface mx-auto flex max-w-4xl flex-col gap-6 px-8 py-10">
      <div className="flex items-center gap-4">
        <Trophy className="text-accent-amber-500 h-12 w-12" />
        <h1 className="font-display text-5xl font-medium">Conquistas</h1>
      </div>

      <p className="text-xl">
        Acompanhe o que j&aacute; foi desbloqueado e o que ainda falta para
        completar sua cole&ccedil;&atilde;o.
      </p>

      <section className="bg-surface-1 card-surface border-surface-2 w-full rounded-2xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-2xl font-medium">Progresso Geral</p>
          <p className="font-mono text-xl font-bold">
            {unlockedTotal}/{achievements.length}
          </p>
        </div>
        {achievements.length > 0 ? (
          <Progress max={achievements.length} value={unlockedTotal} />
        ) : (
          <p className="text-text-secondary text-sm">Carregando conquistas...</p>
        )}
      </section>

      <section className="grid w-full gap-3 md:grid-cols-2">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievementsSet.has(achievement.id);
          const Icon = ICONS_BY_NAME[achievement.icon] ?? Trophy;

          return (
            <article
              key={achievement.id}
              className={`bg-surface-1 card-surface border-surface-2 rounded-2xl border p-4 ${
                isUnlocked ? "" : "opacity-70"
              }`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-deep border-surface-2 flex h-10 w-10 items-center justify-center rounded-xl border">
                    {isUnlocked ? (
                      <Icon className="text-accent-amber-400 h-5 w-5" />
                    ) : (
                      <Lock className="text-text-secondary h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl leading-tight font-medium">
                      {achievement.name}
                    </h2>
                    <p className="text-text-secondary mt-1 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`bg-deep rounded-full border px-2 py-1 font-mono text-xs uppercase ${RARITY_CLASSES[achievement.rarity]}`}>
                  {achievement.rarity}
                </span>
                <span className="font-mono text-text-secondary text-xs uppercase">
                  {achievement.category}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Conquistas;
