/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Button from "@/components/Button";
import Progress from "@/components/Progress";
import {
  calculateDifficultyXP,
  calculateStreakBonusXP,
  computeLevel,
} from "@/lib/game";
import {
  getUnlockedAchievementsFromLocalStorage,
  saveCorrectAnswerProgressToLocalStorage,
  saveRoundResultToLocalStorage,
} from "@/lib/storage";
import { useQuizFeedbackSound } from "@/lib/useQuizFeedbackSound";
import { BarChart3, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const QUESTIONS_PER_ROUND = 10;

type Question = {
  id: number;
  categoria: string;
  pergunta: string;
  opcoes: string[];
  resposta: string;
  dificuldade: "facil" | "media" | "dificil";
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
  const [bestStreak, setBestStreak] = useState(0 as number);
  const [xpGanho, setXpGanho] = useState(0 as number);
  const [xpTotal, setXpTotal] = useState(0 as number);
  const [showResults, setShowResults] = useState(false as boolean);
  const [answerFeedback, setAnswerFeedback] = useState(
    null as "correct" | "wrong" | null,
  );
  const [floatingXp, setFloatingXp] = useState(0 as number);
  const [xpFeedbackKey, setXpFeedbackKey] = useState(0 as number);
  const roundStartUnlockedAchievements = useRef(new Set<string>());
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatingXpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { playFeedbackSound } = useQuizFeedbackSound();

  useEffect(() => {
    roundStartUnlockedAchievements.current = new Set(
      getUnlockedAchievementsFromLocalStorage(),
    );

    fetch("/data/questions.json")
      .then((res) => res.json())
      .then((data: Question[]) => {
        setAllQuestions(() => data);
        setQuestions(() => getRandomRoundQuestions(data));
      });
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }

      if (floatingXpTimeoutRef.current) {
        clearTimeout(floatingXpTimeoutRef.current);
      }
    };
  }, []);

  function triggerFeedback(type: "correct" | "wrong", gainedXp = 0) {
    setAnswerFeedback(type);
    playFeedbackSound(type);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setAnswerFeedback(null);
    }, 420);

    if (type !== "correct") return;

    setFloatingXp(gainedXp);
    setXpFeedbackKey((value) => value + 1);

    if (floatingXpTimeoutRef.current) {
      clearTimeout(floatingXpTimeoutRef.current);
    }

    floatingXpTimeoutRef.current = setTimeout(() => {
      setFloatingXp(0);
    }, 650);
  }

  function getRandomRoundQuestions(
    questionList: Question[],
    excludedIds: number[] = [],
  ) {
    const filteredQuestions = questionList.filter(
      (question) => !excludedIds.includes(question.id),
    );
    const roundPool =
      filteredQuestions.length >= QUESTIONS_PER_ROUND ?
        filteredQuestions
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
      const updatedBestStreak = Math.max(updatedStreak, bestStreak);
      const gainedXp =
        calculateDifficultyXP(dificuldade)
        + calculateStreakBonusXP(updatedStreak);
      setAcertos((value) => value + 1);
      setStreak(() => updatedStreak);

      setBestStreak(() => updatedBestStreak);
      setXpGanho((value) => value + gainedXp);
      triggerFeedback("correct", gainedXp);
      saveCorrectAnswerProgressToLocalStorage({
        streak: updatedStreak,
        timerLeft: timer,
        questionIndex: idx,
        totalQuestions: questions.length,
      });
    } else {
      setStreak(() => 0);
      triggerFeedback("wrong");
    }
  }

  function onClickNext() {
    if (idx + 1 === questions.length) {
      const { xpTotal: updatedXpTotal, unlockedAchievements } =
        saveRoundResultToLocalStorage({
          melhorSequencia: bestStreak,
          acertos,
          total: questions.length,
          xpGanho,
          dataISO: new Date().toISOString(),
        });

      const hasNewAchievement = unlockedAchievements.some(
        (achievementId) =>
          !roundStartUnlockedAchievements.current.has(achievementId),
      );

      toast.success(`+${xpGanho} XP`, {
        position: "top-right",
      });

      if (hasNewAchievement) {
        toast.success("Nova conquista!", {
          position: "top-right",
        });
      }

      roundStartUnlockedAchievements.current = new Set(unlockedAchievements);
      setXpTotal(() => updatedXpTotal);
      setShowResults(() => true);
      return;
    }

    setIdx((value) => value + 1);

    resetQuestion();
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
    setFloatingXp(() => 0);
    setAnswerFeedback(() => null);
    setShowResults(() => false);
    roundStartUnlockedAchievements.current = new Set(
      getUnlockedAchievementsFromLocalStorage(),
    );
  }

  function resetQuestion() {
    setPicked(-1);
    setLocked(false);
    setFloatingXp(0);
    setAnswerFeedback(null);
  }

  const nivel = computeLevel(xpTotal);

  return (
    <>
      <motion.main
        animate={
          answerFeedback === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`card-surface border-surface-2 shadow-card mx-auto flex w-full max-w-5xl flex-col gap-4 border px-4 py-4 sm:px-6 sm:py-5 ${
          showResults ? "pointer-events-none opacity-50" : ""
        } ${answerFeedback === "wrong" ? "border-danger-500/60" : ""}`}>
        <div className="bg-surface-1 border-surface-2 w-full rounded-2xl border p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
            <p className="text-text-secondary">Pergunta {idx + 1}/10</p>
            <motion.div
              animate={
                answerFeedback === "correct" ?
                  { scale: [1, 1.08, 1] }
                : { scale: 1 }
              }
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative rounded-full border border-white/10 px-3 py-1">
              <p
                className={
                  answerFeedback === "correct" ? "text-success-500" : ""
                }>
                XP: {xpGanho}
              </p>
              <AnimatePresence>
                {floatingXp > 0 ?
                  <motion.span
                    key={xpFeedbackKey}
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: -18, scale: 1 }}
                    exit={{ opacity: 0, y: -26, scale: 0.92 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="text-success-500 pointer-events-none absolute -top-5 -right-2 text-xs font-semibold whitespace-nowrap">
                    +{floatingXp} XP
                  </motion.span>
                : null}
              </AnimatePresence>
            </motion.div>
            <p
              className={`rounded-full border border-white/10 px-3 py-1 ${
                answerFeedback === "wrong" ? "text-danger-500" : ""
              }`}>
              Streak: {streak}
            </p>
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
            className="bg-surface-1 border-surface-2 flex w-full flex-col gap-5 rounded-2xl border p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
              <p className="badge text-[11px]">rodada oficial</p>
              <p className="text-text-secondary">
                Dificuldade:{" "}
                <span className="text-text-primary capitalize">
                  {questions[idx]?.dificuldade}
                </span>
              </p>
            </div>
            <h2 className="font-display text-2xl leading-tight font-semibold sm:text-3xl">
              {questions[idx]?.pergunta}
            </h2>
            <motion.div
              className="flex w-full flex-col gap-2.5"
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
                      className={`${className} border-surface-1 text-text-primary px-5 py-4 text-left text-lg font-medium`}
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

        <div className="bg-surface-1 border-surface-2 flex w-full items-center justify-between gap-2 rounded-2xl border p-3 sm:p-4">
          <div className="text-text-secondary inline-flex items-center gap-2 font-mono text-sm">
            <Clock className="h-4 w-4" />
            <p>Tempo: {timer}s</p>
          </div>
          <div className={`${!locked ? "hidden" : ""}`}>
            <Button
              className="bg-gradient-button shadow-elevated text-deep flex min-w-52 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
              onClick={onClickNext}>
              Proxima pergunta {">"}
            </Button>
          </div>
        </div>
      </motion.main>

      <AnimatePresence>
        {showResults ?
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
              className="card-surface border-surface-2 relative w-full max-w-2xl overflow-hidden border p-5 sm:p-6">
              <h2
                id="result-modal-title"
                className="font-display text-center text-4xl font-semibold sm:text-5xl">
                Resultado
              </h2>
              <div className="border-surface-2 my-4 border-b"></div>
              <div className="border-surface-2 mb-4 flex justify-center border-b pb-4">
                <div className="bg-gradient-button shadow-elevated rounded-full p-4">
                  <Trophy className="text-deep h-10 w-10" />
                </div>
              </div>
              <p className="mb-5 text-center text-2xl font-medium sm:text-3xl">
                Parabens! Voce concluiu o quiz!
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">Acertos</p>
                  <p className="text-success-500 font-mono text-3xl font-bold">
                    {acertos}/{QUESTIONS_PER_ROUND}
                  </p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">XP ganhos</p>
                  <p className="text-accent-amber-400 font-mono text-3xl font-bold">
                    +{xpGanho} XP
                  </p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">XP total</p>
                  <p className="font-mono text-3xl font-bold">{xpTotal} XP</p>
                </div>
                <div className="bg-deep border-surface-2 shadow-elevated rounded-2xl border p-4">
                  <p className="text-text-secondary text-sm">Nivel</p>
                  <p className="font-mono text-3xl font-bold">{nivel}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  className="bg-gradient-button shadow-elevated text-deep flex items-center justify-center gap-2 text-base font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
                  onClick={startNewRound}>
                  Jogar novamente
                </Button>
                <Link
                  href="/ranking"
                  className="bg-deep border-surface-2 text-text-primary shadow-elevated inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-center text-base font-semibold transition hover:scale-[1.02] active:scale-[0.98]">
                  <BarChart3 className="h-5 w-5" />
                  Ver ranking
                </Link>
              </div>
            </motion.section>
          </motion.div>
        : null}
      </AnimatePresence>
    </>
  );
}

export default quiz;
