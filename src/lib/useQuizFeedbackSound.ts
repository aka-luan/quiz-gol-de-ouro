"use client";

import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";

type FeedbackSoundType = "correct" | "wrong";

function useQuizFeedbackSound() {
  const soundsRef = useRef<{ correct: Howl; wrong: Howl } | null>(null);

  useEffect(() => {
    soundsRef.current = {
      correct: new Howl({ src: ["/sounds/correct.wav"], volume: 0.28 }),
      wrong: new Howl({ src: ["/sounds/wrong.wav"], volume: 0.25 }),
    };

    return () => {
      if (!soundsRef.current) return;
      soundsRef.current.correct.unload();
      soundsRef.current.wrong.unload();
    };
  }, []);

  const playFeedbackSound = useCallback((type: FeedbackSoundType) => {
    const sound = soundsRef.current?.[type];
    if (!sound) return;
    sound.stop();
    sound.play();
  }, []);

  return { playFeedbackSound };
}

export { useQuizFeedbackSound };
export type { FeedbackSoundType };
