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
    <main className="flex flex-col items-center justify-center gap-8 bg-deep pt-16 pb-10 px-8 rounded-3xl border border-surface-1 shadow-card max-w-xl mx-auto">
      <div className="flex gap-4 items-center justify-center">
        <Trophy className="w-22 h-22 text-accent-amber-500" />
        <h1 className="text-5xl font-medium font-display">
          Quiz Gol <br /> de Ouro
        </h1>
      </div>
      <p className="text-xl">
        Teste seus conhecimentos sobre futebol, ganhe XP, suba de nível e
        desbloqueie conquista!
      </p>
      <Button
        className="text-xl bg-gradient-button font-medium flex items-center justify-center gap-2 shadow-elevated hover:scale-[1.02] active:scale-[0.98] transition"
        onClick={() => router.push("/quiz")}>
        <CirclePlay />
        Jogar Agora
      </Button>
      <div className="w-full p-4 rounded-2xl bg-surface-1 card-surface shadow-elevated border border-surface-2">
        <ul className="flex flex-col text-xl gap-2 font-mono">
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
