"use client";

import Link from "next/link";
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

export function ExplorerSearchBar({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const { collectorProfile } = useAppStateV21();
  const profileComplete = collectorProfile.profileComplete;
  const identity = collectorProfile.identity;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        maxWidth: t.layout.maxWidth,
        backgroundColor: t.colors.white,
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: `1px solid ${t.colors.accentBorder}`,
        overflow: "hidden",
        marginBottom: 28,
      }}
    >
      <Link
        href="/v2.1/galeries"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "16px 20px",
          borderRight: `1px solid ${t.colors.accentBorder}`,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.colors.inkMuted,
            marginBottom: 4,
          }}
        >
          Où
        </div>
        <div style={{ fontSize: 15, color: t.colors.ink, fontWeight: 500 }}>
          Paris, galeries
        </div>
      </Link>

      <button
        type="button"
        onClick={onOpenQuiz}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "16px 20px",
          border: "none",
          background: profileComplete ? t.colors.accentSoft : "transparent",
          cursor: "pointer",
          textAlign: "left",
          font: "inherit",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: profileComplete ? t.colors.accent : t.colors.inkMuted,
            marginBottom: 4,
          }}
        >
          Votre profil
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: profileComplete ? t.colors.accent : t.colors.ink,
          }}
        >
          {profileComplete && identity
            ? identityToTwoWords(identity)
            : "Affiner mon profil"}
        </div>
      </button>
    </div>
  );
}
