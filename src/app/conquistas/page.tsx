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
  rarity: "comum" | "incomum" | "raro" | "epico";
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
  epico: "text-primary-500 border-surface-2",
};

function Conquistas() {
  const [achievements, setAchievements] = useState([] as Achievement[]);
  const [unlockedAchievements, setUnlockedAchievements] = useState(
    [] as string[],
  );

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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-2">
      <section className="card-surface border-surface-2 relative overflow-hidden border px-5 py-5 sm:px-6">
        <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-accent-amber-400 font-mono text-xs tracking-[0.14em] uppercase">
              Colecao
            </p>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Conquistas
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              Acompanhe seus desbloqueios e escolha seu proximo objetivo.
            </p>
          </div>

          <div className="bg-surface-1 border-surface-2 rounded-2xl border px-4 py-3">
            <p className="text-text-secondary text-xs">Concluidas</p>
            <p className="text-accent-amber-400 font-mono text-2xl font-bold">
              {unlockedTotal}/{achievements.length}
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface border-surface-2 border p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-display text-2xl font-semibold">Progresso geral</p>
          <span className="badge text-[11px]">temporada</span>
        </div>
        {achievements.length > 0 ?
          <Progress max={achievements.length} value={unlockedTotal} />
        : <p className="text-text-secondary text-sm">
            Carregando conquistas...
          </p>
        }
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievementsSet.has(achievement.id);
          const Icon = ICONS_BY_NAME[achievement.icon] ?? Trophy;

          return (
            <article
              key={achievement.id}
              className={`bg-surface-1 border-surface-2 shadow-elevated rounded-2xl border p-4 transition ${
                isUnlocked ? "" : "opacity-70"
              }`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="bg-deep border-surface-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border">
                    {isUnlocked ?
                      <Icon className="text-accent-amber-400 h-5 w-5" />
                    : <Lock className="text-text-secondary h-5 w-5" />}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display truncate text-xl font-semibold">
                      {achievement.name}
                    </h2>
                    <p className="text-text-secondary mt-1 text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${
                    isUnlocked ?
                      "border-success-500 text-success-500"
                    : "border-surface-2 text-text-secondary"
                  }`}>
                  {isUnlocked ? "ativo" : "bloqueado"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span
                  className={`bg-deep rounded-full border px-2 py-1 font-mono text-[11px] uppercase ${RARITY_CLASSES[achievement.rarity]}`}>
                  {achievement.rarity}
                </span>
                <span className="text-text-secondary font-mono text-[11px] uppercase">
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
