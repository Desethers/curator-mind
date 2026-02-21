"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { OnboardingScreen } from "../../components/v2/OnboardingScreen";

export default function V2Page() {
  const router = useRouter();
  const { hasCompletedOnboarding, hydrated } = useAppState();

  useEffect(() => {
    if (hydrated && hasCompletedOnboarding) {
      router.replace("/v2/home");
    }
  }, [hasCompletedOnboarding, hydrated, router]);

  if (!hydrated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0C0B0A" }} />
    );
  }
  return <OnboardingScreen />;
}
