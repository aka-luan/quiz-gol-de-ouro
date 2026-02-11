/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Button from "@/components/Button";
import Progress from "@/components/Progress";
import {
  calculateDifficultyXP,
  calculateStreakBonusXP,
  computeLevel,
} from "@/lib/game";
import { BarChart3, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUESTIONS_PER_ROUND = 10;

type Question = {
  id: number;
  categoria: string;
  pergunta: string;
  opcoes: string[];
  resposta: string;
  dificuldade: "fácil" | "média" | "difícil";
};

type RoundResult = {
  acertos: number;
  total: number;
  xpGanho: number;
  dataISO: string;
};

function quiz() {
  const [allQuestions, setAllQuestions] = useState([] as Question[]);
  const [questions, setQuestions] = useState([] as Question[]);
  const [idx, setIdx] = useState(0 as number);
  const [picked, setPicked] = useState(-1 as number);
  const [timer, setTimer] = useState(20 as number);
  const [locked, setLocked] = useState(false as boolean);
  const [acertos, setAcertos] = useState(0 as number);
  const [streak, setStreak] = useState(0 as number);
  const [xpGanho, setXpGanho] = useState(0 as number);
  const [xpTotal, setXpTotal] = useState(0 as number);
  const [showResults, setShowResults] = useState(false as boolean);

  useEffect(() => {
    fetch("/data/questions.json")
      .then((res) => res.json())
      .then((data: Question[]) => {
        setAllQuestions(() => data);
        setQuestions(() => getRandomRoundQuestions(data));
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

  function getRandomRoundQuestions(
    questionList: Question[],
    excludedIds: number[] = [],
  ) {
    const filteredQuestions = questionList.filter(
      (question) => !excludedIds.includes(question.id),
    );
    const roundPool =
      filteredQuestions.length >= QUESTIONS_PER_ROUND
        ? filteredQuestions
        : questionList;

    const indexes = [] as number[];
    if (roundPool.length === 0) return [] as Question[];
    const roundSize = Math.min(QUESTIONS_PER_ROUND, roundPool.length);

    while (indexes.length < roundSize) {
      const randomIndex = Math.floor(Math.random() * roundPool.length);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }

    return indexes.map((index) => roundPool[index]);
  }

  function pickAnswer(index: number) {
    if (locked) return;

    setPicked(index);
    setLocked(true);

    const alternativa = questions[idx].opcoes[index];
    const resposta = questions[idx].resposta;

    if (alternativa === resposta) {
      const dificuldade = questions[idx].dificuldade;
      const updatedStreak = streak + 1;
      setAcertos((value) => value + 1);
      setStreak(() => updatedStreak);
      setXpGanho(
        (value) =>
          value
          + calculateDifficultyXP(dificuldade)
          + calculateStreakBonusXP(updatedStreak),
      );
    } else {
      setStreak(() => 0);
    }
  }

  function onClickNext() {
    if (idx + 1 === questions.length) {
      const updatedXpTotal = sendResultsToStorage();
      setXpTotal(() => updatedXpTotal);
      setShowResults(() => true);
      return;
    }

    setIdx((value) => value + 1);

    resetQuestion();
  }

  function sendResultsToStorage() {
    const qboBest = localStorage.getItem("qbo_best");
    const qboXp = localStorage.getItem("qbo_xp");
    const qboResult = localStorage.getItem("qbo_results");
    let qboBestInt = 0,
      qboXpInt = 0,
      qboResultArr = [] as RoundResult[];
    const resultObj = {
      acertos,
      total: questions.length,
      xpGanho,
      dataISO: new Date().toISOString(),
    };

    if (qboBest !== null) qboBestInt = parseInt(qboBest, 10);
    if (qboXp !== null) qboXpInt = parseInt(qboXp, 10);
    if (qboResult !== null) {
      try {
        qboResultArr = JSON.parse(qboResult) as RoundResult[];
      } catch {
        qboResultArr = [] as RoundResult[];
      }
    }

    if (acertos > qboBestInt) {
      localStorage.setItem("qbo_best", `${acertos}`);
    }

    qboResultArr.push(resultObj);
    const updatedXpTotal = qboXpInt + xpGanho;

    localStorage.setItem("qbo_xp", `${updatedXpTotal}`);
    localStorage.setItem("qbo_results", JSON.stringify(qboResultArr));

    return updatedXpTotal;
  }

  function startNewRound() {
    if (allQuestions.length === 0) return;

    const currentRoundIds = questions.map((question) => question.id);
    const newRoundQuestions = getRandomRoundQuestions(
      allQuestions,
      currentRoundIds,
    );

    setQuestions(() => newRoundQuestions);
    setIdx(() => 0);
    setPicked(() => -1);
    setTimer(() => 20);
    setLocked(() => false);
    setAcertos(() => 0);
    setStreak(() => 0);
    setXpGanho(() => 0);
    setShowResults(() => false);
  }

  function resetQuestion() {
    setPicked(-1);
    setLocked(false);
  }

  const nivel = computeLevel(xpTotal);

  return (
    <>
      <main
        className={`bg-surface-1 border-surface-2 shadow-card mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border px-8 py-10 ${
          showResults ? "pointer-events-none opacity-50" : ""
        }`}>
        <div className="border-surface-2 w-full border-b pb-4">
          <div className="mb-2 flex justify-between">
            <p>Pergunta {idx + 1} / 10</p>
            <p>XP: {xpGanho}</p>
            <p>Streak: {streak}</p>
          </div>
          <Progress max={QUESTIONS_PER_ROUND} value={idx + 1} />
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

      <AnimatePresence>
        {showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="result-modal-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-surface-1 card-surface border-surface-2 relative w-full max-w-xl overflow-hidden rounded-3xl border p-6">
              <h2
                id="result-modal-title"
                className="font-display text-center text-5xl font-semibold">
                Resultado
              </h2>
              <div className="border-surface-2 my-4 border-b"></div>
              <div className="border-surface-2 mb-4 flex justify-center border-b pb-4">
                <div className="bg-gradient-button shadow-elevated rounded-full p-4">
                  <Trophy className="text-deep h-10 w-10" />
                </div>
              </div>
              <p className="mb-6 text-center text-3xl font-medium">
                Parabéns! Você concluiu o quiz!
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">Acertos</p>
                  <p className="font-mono text-success-500 text-3xl font-bold">
                    {acertos}/{QUESTIONS_PER_ROUND}
                  </p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">XP ganhos</p>
                  <p className="font-mono text-accent-amber-400 text-3xl font-bold">
                    +{xpGanho} XP
                  </p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">XP total</p>
                  <p className="font-mono text-3xl font-bold">{xpTotal} XP</p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">Nível</p>
                  <p className="font-mono text-3xl font-bold">{nivel}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  className="bg-gradient-button shadow-elevated flex items-center justify-center gap-2 text-xl font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
                  onClick={startNewRound}>
                  Jogar novamente
                </Button>
                <Link
                  href="/ranking"
                  className="bg-deep border-surface-2 text-text-primary shadow-elevated inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-center text-xl font-semibold transition hover:scale-[1.02] active:scale-[0.98]">
                  <BarChart3 className="h-5 w-5" />
                  Ver ranking
                </Link>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default quiz;
