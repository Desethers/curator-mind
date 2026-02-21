"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { ValueTeaser } from "./ValueTeaser";
import { PremierRegardGrid } from "./PremierRegardGrid";

export function OnboardingV21() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAppStateV21();
  const [phase, setPhase] = useState<"teaser" | "grid">("teaser");

  const handleTeaserComplete = useCallback(() => {
    setPhase("grid");
  }, []);

  const handleSkipTeaser = useCallback(() => {
    setHasCompletedOnboarding(true);
    router.push("/v2.1/browse");
  }, [router, setHasCompletedOnboarding]);

  const handleGridTransition = useCallback(() => {
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  if (phase === "teaser") {
    return (
      <ValueTeaser
        onComplete={handleTeaserComplete}
        onSkip={handleSkipTeaser}
      />
    );
  }

  return <PremierRegardGrid onTransition={handleGridTransition} />;
}
