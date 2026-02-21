"use client";

import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;

export function QuizLeadCard({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const { collectorProfile } = useAppStateV21();
  const profileComplete = collectorProfile.profileComplete;
  const signalCount = collectorProfile.implicitSignals.length;

  if (profileComplete) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenQuiz}
      onKeyDown={(e) => e.key === "Enter" && onOpenQuiz()}
      style={{
        display: "block",
        padding: 24,
        marginBottom: 16,
        borderRadius: 16,
        border: `1px solid ${t.colors.accentBorder}`,
        backgroundColor: t.colors.accentSoft,
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.colors.accent;
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,160,122,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.colors.accentBorder;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.colors.accent,
          marginBottom: 8,
        }}
      >
        Personnalisez votre exploration
      </div>
      <h3
        style={{
          fontFamily: t.fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: t.colors.ink,
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}
      >
        Des recommandations qui vous ressemblent
      </h3>
      <p
        style={{
          fontSize: 14,
          color: t.colors.inkSoft,
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        {signalCount > 0
          ? `Vous avez exploré ${signalCount} œuvre${signalCount > 1 ? "s" : ""} — 3 questions pour affiner votre fil.`
          : "3 questions pour que les œuvres et les galeries correspondent à votre sensibilité."}
      </p>
      <span
        style={{
          display: "inline-block",
          fontSize: 14,
          fontWeight: 600,
          color: t.colors.accent,
        }}
      >
        Commencer →
      </span>
    </div>
  );
}
