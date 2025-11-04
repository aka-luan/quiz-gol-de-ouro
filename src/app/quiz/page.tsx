"use client";
import Button from "@/components/Button";
import Progress from "@/components/Progress";
import { Clock } from "lucide-react";
function quiz() {
  return (
    <main className="bg-surface-1 border-surface-2 shadow-card mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border px-8 pt-16 pb-10">
      <div className="border-surface-2 w-full border-b pb-4">
        <div className="mb-2 flex justify-between">
          <p>Perguntas 3 / 10</p>
          <p>XP: 80</p>
          <p>Streak: 4</p>
        </div>
        <Progress max={10} value={3} />
      </div>
      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-between">
          <p>ICONE Copa do Mundo</p>
          <p>Fácil</p>
        </div>
      </div>
      <h2 className="font-display mb-2 text-4xl font-medium">
        Quem venceu a copa do mundo de 2018?
      </h2>
      <div className="flex w-full flex-col gap-2">
        <Button
          className="bg-gradient-right-answer border-surface-2 text-text-primary px-6 text-left text-xl font-medium"
          onClick={() => {}}>
          França
        </Button>
        <Button
          className="bg-deep border-surface-1 text-text-primary px-6 text-left text-xl font-medium"
          onClick={() => {}}>
          Bélgica
        </Button>
        <Button
          className="bg-deep border-surface-1 text-text-primary px-6 text-left text-xl font-medium"
          onClick={() => {}}>
          Inglaterra
        </Button>
        <Button
          className="bg-gradient-wrong-answer border-surface-2 text-text-primary px-6 text-left text-xl font-medium"
          onClick={() => {}}>
          Croácia
        </Button>
      </div>
      <div className="flex gap-2">
        <Clock />
        <p>Tempo: 15s</p>
      </div>
    </main>
  );
}

export default quiz;
