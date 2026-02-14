"use client";
import Button from "@/components/Button";
import { computeLevel } from "@/lib/game";
import {
  getBestScoreFromLocalStorage,
  getBestStreakFromLocalStorage,
  getExpFromLocalStorage,
  getRoundResultsFromLocalStorage,
} from "@/lib/storage";
import {
  ArrowUp,
  Calendar,
  Crown,
  Flame,
  Gamepad2,
  PersonStanding,
  Star,
  Target,
} from "lucide-react";

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

  console.log(results);
  console.log(acertosArr);
  console.log(totalAcertos);
  console.log(best);
  console.log(exp);
  console.log(bestStreak);
  console.log(totalRounds);
  console.log(level);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 px-8 py-10">
      {/* <p className="text-xl">
        Teste seus conhecimentos sobre futebol, ganhe XP, suba de nível e desbloqueie conquista!
      </p> */}
      {/* <Button
        className="bg-gradient-button shadow-elevated flex items-center justify-center gap-2 text-xl font-medium transition hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => {}}>
        <CirclePlay />
        Jogar Agora
      </Button> */}
      <div className="bg-surface-1 card-surface shadow-elevated border-surface-2 w-full rounded-2xl border p-6">
        <ul className="flex flex-col gap-2 font-mono text-xl">
          <li className="flex">
            <div>
              <PersonStanding size={120} color="#E9B23E" />
            </div>
            <div className="flex flex-col gap-4 py-4">
              <span className="text-accent-amber-400 text-3xl font-bold">
                {level}
              </span>
              <span>XP Total: {exp}</span>
            </div>
          </li>
          <li className="flex gap-3">
            <Flame color="#E9B23E" />
            Maior Sequência: {bestStreak}
          </li>
          <li className="flex gap-3">
            <Gamepad2 color="#E9B23E" />
            Melhor Partida: {best}/10
          </li>
          <li className="flex gap-3">
            <Target color="#E9B23E" />
            Taxa de Acerto: {taxaAcertos}%
          </li>
        </ul>
      </div>
      <div className="bg-surface-1 card-surface shadow-elevated border-surface-2 w-full rounded-2xl border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Crown color="#E9B23E" />
          <h2 className="font-display text-2xl font-medium">Histórico</h2>
        </div>
        <ul className="bg-surface-2 card-surface px-3 py-4 font-mono text-lg">
          {results.length ?
            results.map((result) => (
              <li key={result.dataISO} className="flex justify-between p-2">
                <div className="flex gap-2">
                  <Calendar />
                  {new Date(result.dataISO).toLocaleString()}
                </div>
                <div className="flex">
                  <span>
                    {result.acertos}/{result.total}
                  </span>
                </div>
              </li>
            ))
          : ""}
        </ul>
      </div>
    </main>
  );
}

export default ranking;
