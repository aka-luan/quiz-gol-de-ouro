"use client";
import Button from "@/components/Button"
import { getRoundResultsFromLocalStorage } from "@/lib/storage";
import { ArrowUp, Calendar, Crown, Flame, Gamepad2, PersonStanding, Star, Target } from "lucide-react"

function ranking() {
  const results = getRoundResultsFromLocalStorage()
  console.log(results)
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
              <span className="text-accent-amber-400 font-bold text-3xl" >
            Craque
              </span>
              <span>
            XP Total: 620
              </span>
            </div>
          </li>
          <li className="flex gap-3">
            <Flame color="#E9B23E" />
            Maior Sequência: 8
          </li>
          <li className="flex gap-3">
            <Gamepad2 color="#E9B23E" />
            Melhor Partida: 9/10
          </li>
          <li className="flex gap-3">
            <Target color="#E9B23E" />
            Taxa de Acerto: 75%
          </li>
        </ul>
      </div>
      <div className="bg-surface-1 card-surface shadow-elevated border-surface-2 w-full rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4">
          <Crown color="#E9B23E" />
        <h2 className="font-display text-2xl font-medium">
          Histórico
        </h2>
      </div>
        <ul className="font-mono text-lg bg-surface-2 card-surface px-3 py-4">
        {results.length ? results.map((result) => (
          <li key={result.dataISO} className="flex justify-between p-2">
            <div className="flex gap-2">
              <Calendar />
              {new Date(result.dataISO).toLocaleString()}
            </div>
            <div className="flex gap-2">
              <span>{result.acertos}/{result.total}</span>
              <span>XP: {result.xpGanho}</span>
            </div>
          </li>
        )) : ''}

        </ul>
      </div>
    </main>
  )
}

export default ranking