"use client";

import { theme } from "../lib/theme";

const steps = [1, 2, 3] as const;

type Step = (typeof steps)[number];

export function NavPill({
  currentStep = 1,
}: {
  currentStep?: Step;
}) {
  return (
    <div
      className="nav-pill"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={3}
      aria-label="Progression du questionnaire"
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        backgroundColor: "#f7f7f7",
        borderRadius: 999,
        padding: 4,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {steps.map((step) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div
            key={step}
            className="nav-pill-segment"
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              color: isActive
                ? theme.colors.ink
                : isCompleted
                  ? theme.colors.ink
                  : theme.colors.inkMuted,
              backgroundColor: isActive
                ? theme.colors.white
                : isCompleted
                  ? theme.colors.accentSoft
                  : "transparent",
              boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              border: isActive
                ? "1px solid rgba(0,0,0,0.08)"
                : "1px solid transparent",
              transition:
                "background-color 0.15s, color 0.15s, box-shadow 0.15s",
            }}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}
