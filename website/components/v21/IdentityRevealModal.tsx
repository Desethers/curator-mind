"use client";

import { useEffect } from "react";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";
import { IdentityRevealConfetti } from "./IdentityRevealConfetti";

const t = theme;

export function IdentityRevealModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { collectorProfile, recordIdentityRevealed } = useAppStateV21();
  const { identity, keywords, bridge } = collectorProfile;

  useEffect(() => {
    if (open) recordIdentityRevealed();
  }, [open, recordIdentityRevealed]);

  if (!open) return null;

  return (
    <>
      <IdentityRevealConfetti active={open} />
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: "0 auto",
          backgroundColor: t.colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: "28px 20px 36px",
          zIndex: 50,
          boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
          animation: "v21SlideUp 0.35s ease-out",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: t.colors.accent,
            marginBottom: 12,
          }}
        >
          Votre profil collectionneur
        </div>
        <p
          style={{
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 22,
            color: t.colors.ink,
            lineHeight: 1.35,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {identity || "Vous collectionnez l'inattendu."}
        </p>
        {bridge && (
          <p
            style={{
              fontSize: 14,
              color: t.colors.inkSoft,
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 20,
            }}
          >
            {bridge}
          </p>
        )}
        {keywords.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  backgroundColor: t.colors.accentSoft,
                  color: t.colors.accent,
                  fontSize: 12,
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "16px 24px",
            borderRadius: 12,
            border: "none",
            backgroundColor: t.colors.ink,
            color: t.colors.bg,
            fontFamily: t.fonts.sans,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuer l&apos;exploration
        </button>
      </div>
    </>
  );
}
