"use client";

import { computeLevel } from "@/lib/game";
import {
  getBestScoreFromLocalStorage,
  getBestStreakFromLocalStorage,
  getExpFromLocalStorage,
  getRoundResultsFromLocalStorage,
} from "@/lib/storage";
import { Calendar, Crown, Flame, Medal, Target } from "lucide-react";

function ranking() {
  const results = getRoundResultsFromLocalStorage();
  const best = getBestScoreFromLocalStorage();
  const exp = getExpFromLocalStorage();
  const bestStreak = getBestStreakFromLocalStorage();
  const acertosArr = results.map((result) => result.acertos);
  const totalRoundsArr = results.map((result) => result.total);
  const totalAcertos = acertosArr.reduce((acc, curr) => (acc += curr));
  const totalRounds = totalRoundsArr.reduce((acc, curr) => (acc += curr));
  const taxaAcertos = ((totalAcertos / totalRounds) * 100).toFixed(2);
  const level = computeLevel(exp);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-2">
      <section className="card-surface border-surface-2 relative overflow-hidden border px-5 py-5 sm:px-6">
        <div className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-12 h-32 w-32 rounded-full bg-emerald-300/15 blur-2xl" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-accent-amber-400 font-mono text-xs tracking-[0.14em] uppercase">Desempenho</p>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Ranking</h1>
            <p className="text-text-secondary mt-1 text-sm">Painel com seus principais numeros da temporada.</p>
          </div>

          <div className="bg-surface-1 border-surface-2 flex items-center gap-3 rounded-2xl border px-4 py-3">
            <span className="bg-gradient-button text-deep rounded-full p-2">
              <Crown className="h-4 w-4" />
            </span>
            <div>
              <p className="text-text-secondary text-xs">Nivel atual</p>
              <p className="font-mono text-xl font-bold">{level}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-surface-1 border-surface-2 shadow-elevated rounded-2xl border p-4">
          <p className="text-text-secondary text-xs">XP total</p>
          <p className="font-mono mt-2 text-3xl font-bold text-accent-amber-400">{exp}</p>
        </article>

        <article className="bg-surface-1 border-surface-2 shadow-elevated rounded-2xl border p-4">
          <p className="text-text-secondary text-xs">Melhor partida</p>
          <p className="font-mono mt-2 text-3xl font-bold">{best}/10</p>
        </article>

        <article className="bg-surface-1 border-surface-2 shadow-elevated rounded-2xl border p-4">
          <p className="text-text-secondary text-xs">Maior sequencia</p>
          <p className="font-mono mt-2 inline-flex items-center gap-2 text-3xl font-bold">
            <Flame className="h-6 w-6 text-accent-amber-400" />
            {bestStreak}
          </p>
        </article>

        <article className="bg-surface-1 border-surface-2 shadow-elevated rounded-2xl border p-4">
          <p className="text-text-secondary text-xs">Taxa de acerto</p>
          <p className="font-mono mt-2 inline-flex items-center gap-2 text-3xl font-bold">
            <Target className="h-6 w-6 text-accent-amber-400" />
            {taxaAcertos}%
          </p>
        </article>
      </section>

      <section className="card-surface border-surface-2 border p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="bg-deep rounded-lg p-2">
              <Medal className="h-4 w-4 text-accent-amber-400" />
            </span>
            <h2 className="font-display text-2xl font-semibold">Historico de partidas</h2>
          </div>
          <p className="text-text-secondary text-sm">{results.length} rodadas</p>
        </div>

        {results.length ? (
          <ul className="space-y-2">
            {results.map((result) => (
              <li
                key={result.dataISO}
                className="bg-surface-1 border-surface-2 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Calendar className="text-text-secondary h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{new Date(result.dataISO).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-text-secondary text-xs">acertos</span>
                  <span className="font-mono text-base font-semibold">
                    {result.acertos}/{result.total}
                  </span>
                  <span className="font-mono text-accent-amber-400 text-sm">+{result.xpGanho} XP</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-surface-1 border-surface-2 rounded-xl border px-4 py-8 text-center">
            <p className="text-text-secondary text-sm">Nenhuma rodada registrada ainda.</p>
            <p className="mt-1 text-sm">Jogue uma partida para preencher seu historico.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default ranking;
