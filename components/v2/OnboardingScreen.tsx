"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";

export function OnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAppState();

  const handleDiscover = () => {
    setHasCompletedOnboarding(true);
    router.push("/v2/quiz");
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.push("/v2/home");
  };

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
        backgroundColor: theme.colors.bg,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `2px solid ${theme.colors.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          color: theme.colors.accent,
          fontSize: 20,
        }}
      >
        ◉
      </div>
      <h1
        style={{
          fontFamily: theme.fonts.serif,
          fontStyle: "italic",
          fontSize: 32,
          fontWeight: 400,
          color: theme.colors.ink,
          margin: 0,
          marginBottom: 12,
        }}
      >
        Curator Mind
      </h1>
      <p
        style={{
          fontFamily: theme.fonts.sans,
          fontSize: 15,
          color: theme.colors.inkMuted,
          margin: 0,
          marginBottom: 40,
          lineHeight: 1.5,
        }}
      >
        Votre premier pas dans les galeries parisiennes.
      </p>
      <button
        type="button"
        onClick={handleDiscover}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "16px 24px",
          borderRadius: 12,
          border: "none",
          backgroundColor: theme.colors.ink,
          color: theme.colors.white,
          fontFamily: theme.fonts.sans,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Découvrir mon profil
      </button>
      <button
        type="button"
        onClick={handleSkip}
        style={{
          background: "none",
          border: "none",
          color: theme.colors.inkMuted,
          fontSize: 14,
          fontFamily: theme.fonts.sans,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        Passer →
      </button>
    </div>
  );
}
