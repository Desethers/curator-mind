"use client";

import { useRouter } from "next/navigation";
import { QuizCard, type QuizAnswers } from "./QuizCard";

const STORAGE_KEY = "curator-mind-quiz-result";

export function QuizSection() {
  const router = useRouter();

  const handleComplete = (
    answers: QuizAnswers,
    identity: string,
    keywords: string[]
  ) => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ identity, keywords, answers })
      );
    } catch {
      // ignore
    }
    router.push("/selection");
  };

  return <QuizCard onComplete={handleComplete} />;
}
