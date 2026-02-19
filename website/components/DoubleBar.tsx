"use client";

import { theme } from "../lib/theme";
import { NavPill } from "./NavPill";

export function DoubleBar({
  currentStep = 1,
  onStepChange,
}: {
  currentStep?: 1 | 2 | 3;
  onStepChange?: (step: 1 | 2 | 3) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 18px",
          borderRadius: 999,
          backgroundColor: "#f7f7f7",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          minWidth: 520,
          maxWidth: 640,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme.colors.inkMuted,
          }}
        >
          Questionnaire
        </span>
        <span
          style={{
            fontSize: 13,
            color: theme.colors.inkSoft,
          }}
        >
          Étape {currentStep} sur 3
        </span>
      </div>

      <div
        style={{
          borderRadius: 28,
          backgroundColor: theme.colors.surface,
          boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
          border: `1px solid ${theme.colors.accentBorder}`,
          padding: 20,
          minWidth: 520,
          maxWidth: 720,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <NavPill currentStep={currentStep} />
        </div>
        <div
          style={{
            borderRadius: 20,
            padding: "28px 24px",
            minHeight: 140,
          }}
        >
          {currentStep === 1 && (
            <>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: theme.colors.ink,
                  lineHeight: 1.4,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Qu&apos;est-ce qui vous attire dans une œuvre ?
              </p>
              {onStepChange && (
                <button
                  type="button"
                  onClick={() => onStepChange(2)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    backgroundColor: theme.colors.ink,
                    color: theme.colors.white,
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Suivant
                </button>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: theme.colors.ink,
                  lineHeight: 1.4,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Étape 2 — à venir
              </p>
              {onStepChange && (
                <button
                  type="button"
                  onClick={() => onStepChange(3)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    backgroundColor: theme.colors.ink,
                    color: theme.colors.white,
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Suivant
                </button>
              )}
            </>
          )}
          {currentStep === 3 && (
            <p
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: theme.colors.ink,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Étape 3 — à venir
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
