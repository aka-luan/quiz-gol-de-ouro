/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Button from "@/components/Button";
import {
  Star,
  Trophy,
  ArrowUp,
  Flame,
  Gamepad2,
  CirclePlay,
} from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <main className="bg-deep card-surface mx-auto flex max-w-xl flex-col items-center justify-center gap-8 px-8 py-10">
      <div className="flex items-center justify-center gap-4">
        <Trophy className="text-accent-amber-500 h-22 w-22" />
        <h1 className="font-display text-5xl font-medium">
          Quiz Gol <br /> de Ouro
        </h1>
      </div>
      <p className="text-xl">
        Teste seus conhecimentos sobre futebol, ganhe XP, suba de nível e
        desbloqueie conquista!
      </p>
      <Button
        className="bg-gradient-button shadow-elevated flex items-center justify-center gap-2 text-xl font-medium transition hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => router.push("/quiz")}>
        <CirclePlay />
        Jogar Agora
      </Button>
      <div className="bg-surface-1 card-surface shadow-elevated border-surface-2 w-full rounded-2xl border p-4">
        <ul className="flex flex-col gap-2 font-mono text-xl">
          <li className="flex gap-3">
            <Star color="#E9B23E" />
            Nível: Craque
          </li>
          <li className="flex gap-3">
            <ArrowUp color="#E9B23E" strokeWidth={2} />
            XP Total: 620
          </li>
          <li className="flex gap-3">
            <Flame color="#E9B23E" />
            Maior Sequência: 8
          </li>
          <li className="flex gap-3">
            <Gamepad2 color="#E9B23E" />
            Melhor Partida: 9/10
          </li>
        </ul>
      </div>
    </main>
  );
};

export default page;
