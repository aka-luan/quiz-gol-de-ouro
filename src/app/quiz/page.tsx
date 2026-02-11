/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Button from "@/components/Button";
import Progress from "@/components/Progress";
import { calculateDifficultyXP, calculateStreakBonusXP } from "@/lib/game";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Question = {
  id: number;
  categoria: string;
  pergunta: string;
  opcoes: string[];
  resposta: string;
  dificuldade: "fácil" | "média" | "difícil";
};

function quiz() {
  const [questions, setQuestions] = useState([] as Question[]);
  const [idx, setIdx] = useState(0 as number);
  const [picked, setPicked] = useState(-1 as number);
  const [timer, setTimer] = useState(20 as number);
  const [locked, setLocked] = useState(false as boolean);
  const [acertos, setAcertos] = useState(0 as number);
  const [streak, setStreak] = useState(0 as number);
  const [xpGanho, setXpGanho] = useState(0 as number);
  const [showResult, setShowResult] = useState(false as boolean);

  useEffect(() => {
    fetch("/data/questions.json")
      .then((res) => res.json())
      .then((data) => {
        const roundQuestions = [] as Question[];
        getRandomQuestionsIndex(data.length).forEach((index) => {
          roundQuestions.push(data[index]);
        });
        setQuestions(() => roundQuestions);
      });

    // const timer = setInterval(() => {
    //   setTimer((time) => {
    //     if (time === 0) {
    //       clearInterval(timer);
    //       return 0;
    //     } else return time - 1;
    //   });
    // }, 1000);
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

    setPicked(index);
    setLocked(true);

    const alternativa = questions[idx].opcoes[index];
    const resposta = questions[idx].resposta;

    if (alternativa === resposta) {
      const dificuldade = questions[idx].dificuldade;
      console.log("resposta certa");
      setAcertos(() => acertos + 1);
      setStreak(() => streak + 1);
      setXpGanho(
        () =>
          xpGanho
          + calculateDifficultyXP(dificuldade)
          + calculateStreakBonusXP(streak),
      );
    } else {
      setStreak(() => 0);
    }
  }

  function onClickNext() {
    if (idx + 1 === questions.length) {
      return;
    }

    setIdx(() => idx + 1);
    resetQuestion();
  }

  function resetQuestion() {
    setPicked(-1);
    setLocked(false);
  }

  return (
    <main className="bg-surface-1 border-surface-2 shadow-card mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border px-8 py-10">
      <div className="border-surface-2 w-full border-b pb-4">
        <div className="mb-2 flex justify-between">
          <p>Pergunta {idx + 1} / 10</p>
          <p>XP: {xpGanho}</p>
          <p>Streak: {streak}</p>
        </div>
        <Progress max={questions.length} value={idx + 1} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${idx}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            x: -24,
            transition: { duration: 0.25, ease: "easeIn" },
          }}
          className="flex w-full flex-col gap-6">
          <div className="flex justify-between">
            <p>ICONE Copa do Mundo</p>
            <p>
              Dificuldade:{" "}
              <span className="capitalize">{questions[idx]?.dificuldade}</span>
            </p>
          </div>
          <h2 className="font-display mb-2 text-3xl font-medium">
            {questions[idx]?.pergunta}
          </h2>
          <motion.div
            className="flex w-full flex-col gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}>
            {questions[idx]?.opcoes.map((option, index) => {
              let className = "bg-deep";
              let buttonState: "correct" | "wrong" | "disabled" | "default" =
                "default";

              if (locked) {
                const resposta = questions[idx].resposta;
                const respostaIndex = questions[idx].opcoes.indexOf(resposta);

                if (respostaIndex === index) {
                  className = "bg-gradient-right-answer";
                  buttonState = "correct";
                } else if (picked === index) {
                  className = "bg-gradient-wrong-answer";
                  buttonState = "wrong";
                } else {
                  className = "bg-deep";
                  buttonState = "disabled";
                }
              }

              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}>
                  <Button
                    className={`${className} border-surface-1 text-text-primary px-6 text-left text-xl font-medium`}
                    onClick={() => pickAnswer(index)}
                    state={buttonState}>
                    {option}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-1/2 gap-2 p-4">
          <Clock />
          <p>Tempo: {timer}s</p>
        </div>
        <div className={`w-1/2 ${!locked ? "hidden" : ""}`}>
          <Button
            className="bg-gradient-button shadow-elevated flex items-center justify-center gap-2 font-medium transition hover:scale-[1.02] active:scale-[0.98]"
            onClick={onClickNext}>
            Próxima Pergunta {">"}
          </Button>
        </div>
      </div>
      <div className="flex gap-2"></div>
    </main>
  );
}

export default quiz;
