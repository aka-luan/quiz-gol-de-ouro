"use client";
import Button from "@/components/Button";
import Progress from "@/components/Progress";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { number } from "zod";

type Question = {
  id: number;
  categoria: string;
  pergunta: string;
  opcoes: string[];
  resposta_certa: string;
  dificuldade: "Fácil" | "Médio" | "Difícil";
};

function quiz() {
  const [questions, setQuestions] = useState([] as Question[]);
  const [idx, setIdx] = useState(0 as number);
  const [picked, setPicked] = useState(null as number | null);
  const [timer, setTimer] = useState(20 as number);
  const [locked, setLocked] = useState(false as boolean);

  useEffect(() => {
    fetch("data/questions.json")
      .then((res) => res.json())
      .then((data) => {
        getRandomQuestionsIndex(data.length).forEach((index) => {
          setQuestions((prevQuestions) => [...prevQuestions, data[index]]);
        });
      });

    let timer = setInterval(() => {
      setTimer((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, []);

  function getRandomQuestionsIndex(questionsLength: number) {
    const indexes = [] as number[];

    while (indexes.length < 10) {
      const randomIndex = Math.floor(Math.random() * questionsLength);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  }

  function pickAnswer(index: number) {
    if (locked) return;
    console.log(index);
    setPicked(index);
    setLocked(true);
  }

  return (
    <main className="bg-surface-1 border-surface-2 shadow-card mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border px-8 py-10">
      <div className="border-surface-2 w-full border-b pb-4">
        <div className="mb-2 flex justify-between">
          <p>Pergunta {idx + 1} / 10</p>
          <p>XP: 80</p>
          <p>Streak: 4</p>
        </div>
        <Progress max={10} value={3} />
      </div>
      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-between">
          <p>ICONE Copa do Mundo</p>
          <p>{questions[idx]?.dificuldade}</p>
        </div>
      </div>
      <h2 className="font-display mb-2 text-4xl font-medium">
        {questions[idx]?.pergunta}
      </h2>
      <div className="flex w-full flex-col gap-2">
        {questions[idx]?.opcoes.map((opcao, index) => {
          return (
            <Button
              className={`${picked === index ? "bg-gradient-selected" : "bg-deep"} border-surface-1 text-text-primary px-6 text-left text-xl font-medium`}
              onClick={() => pickAnswer(index)}
              key={index}>
              {opcao}
            </Button>
          );
        })}
        {/* <Button
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
        </Button> */}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-1/2 gap-2 px-4">
          <Clock />
          <p>Tempo: {timer}s</p>
        </div>
        <div className="w-1/2">
          <Button
            className="bg-gradient-button shadow-elevated flex items-center justify-center gap-2 text-lg font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => {}}>
            Próxima Pergunta {">"}
          </Button>
        </div>
      </div>
      <div className="flex gap-2"></div>
    </main>
  );
}

export default quiz;
