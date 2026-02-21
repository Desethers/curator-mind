"use client";

import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;

function identityToTwoWords(identity: string): string {
  const match = identity.match(/Vous collectionnez (.+?)\.?$/i);
  const part = match ? match[1].trim() : identity.trim();
  const words = part.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return part;
  return words.slice(-2).join(" ");
}

export function BrowseHeader({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
  const { collectorProfile } = useAppStateV21();
  const profileComplete = collectorProfile.profileComplete;
  const identity = collectorProfile.identity;

  const progressLabel =
    profileComplete && identity
      ? identityToTwoWords(identity)
      : "Affiner mon profil";

  return (
    <div
      style={{
        marginBottom: 24,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (profileComplete) return;
          onOpenQuiz?.();
        }}
        style={{
          padding: "8px 14px",
          borderRadius: 999,
          border: `1px solid ${t.colors.accentBorder}`,
          fontFamily: t.fonts.sans,
          fontSize: 12,
          cursor: profileComplete ? "default" : "pointer",
          backgroundColor: profileComplete ? t.colors.accentSoft : "transparent",
          color: profileComplete ? t.colors.accent : t.colors.inkMuted,
        }}
      >
        {progressLabel}
      </button>
    </div>
  );
}
