"use client";

import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;

export function OnboardingV21() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAppStateV21();

  const handleExplorer = () => {
    setHasCompletedOnboarding(true);
    router.push("/v2.1/browse");
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.push("/v2.1/browse");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: t.colors.bg,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: t.colors.accentSoft,
          border: `1px solid ${t.colors.accentBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          color: t.colors.accent,
          fontSize: 22,
        }}
      >
        ◉
      </div>
      <h1
        style={{
          fontFamily: t.fonts.serif,
          fontStyle: "italic",
          fontSize: 36,
          fontWeight: 400,
          color: t.colors.ink,
          margin: 0,
          marginBottom: 16,
        }}
      >
        Curator Mind
      </h1>
      <p
        style={{
          fontFamily: t.fonts.sans,
          fontSize: 16,
          color: t.colors.inkSoft,
          margin: 0,
          marginBottom: 48,
          lineHeight: 1.5,
        }}
      >
        Les œuvres qui vous correspondent.
        <br />
        Les galeries qui vous attendent.
      </p>
      <button
        type="button"
        onClick={handleExplorer}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "18px 24px",
          borderRadius: 12,
          border: "none",
          backgroundColor: t.colors.ink,
          color: t.colors.white,
          fontFamily: t.fonts.sans,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        Explorer
      </button>
      <button
        type="button"
        onClick={handleSkip}
        style={{
          background: "none",
          border: "none",
          color: t.colors.inkMuted,
          fontSize: 14,
          fontFamily: t.fonts.sans,
          cursor: "pointer",
        }}
      >
        Passer →
      </button>
    </div>
  );
}
