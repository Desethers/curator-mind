"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { OnboardingV21 } from "../../components/v21/OnboardingV21";

export default function V21Page() {
  const router = useRouter();
  const { hasCompletedOnboarding, hydrated } = useAppStateV21();

  useEffect(() => {
    if (hydrated && hasCompletedOnboarding) {
      router.replace("/v2.1/browse");
    }
  }, [hasCompletedOnboarding, hydrated, router]);

  if (!hydrated) {
    return <div style={{ minHeight: "100vh", background: "#0C0B0A" }} />;
  }
  return <OnboardingV21 />;
}
