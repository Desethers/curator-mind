"use client";

import { useCallback } from "react";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { PremierRegardGrid } from "./PremierRegardGrid";

export function OnboardingV21() {
  const { setHasCompletedOnboarding } = useAppStateV21();

  const handleGridTransition = useCallback(() => {
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  return <PremierRegardGrid onTransition={handleGridTransition} />;
}
