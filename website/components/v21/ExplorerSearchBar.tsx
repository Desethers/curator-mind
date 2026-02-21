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
      {/* Où */}
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

      {/* Quand */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "16px 20px",
          borderRight: `1px solid ${t.colors.accentBorder}`,
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
          Quand
        </div>
        <div style={{ fontSize: 15, color: t.colors.inkMuted }}>Quand ?</div>
      </div>

      {/* Profil — Quiz (clic pour ouvrir) */}
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
            : "3 questions pour personnaliser"}
        </div>
      </button>

      {/* Bouton Rechercher / Explorer */}
      <button
        type="button"
        onClick={onOpenQuiz}
        aria-label="Personnaliser votre exploration"
        style={{
          width: 56,
          flexShrink: 0,
          border: "none",
          backgroundColor: t.colors.accent,
          color: t.colors.white,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}
