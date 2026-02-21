"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "../lib/theme";

const STEPS = [
  {
    question: "Qu'est-ce qui vous attire dans une œuvre ?",
    options: ["La couleur", "La matière", "Le concept", "L'émotion"],
  },
  {
    question: "Quel univers vous parle le plus ?",
    options: ["Abstrait", "Figuratif", "Photographie", "Sculpture"],
  },
  {
    question: "Votre budget pour une première œuvre ?",
    options: ["< 1 000 €", "1 000 – 3 000 €", "3 000 – 6 000 €", "6 000 € +"],
  },
];

export function QuizPreview() {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const current = STEPS[step];

  const handlePick = () => {
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      style={{
        borderRadius: 22,
        padding: 18,
        backgroundColor: theme.colors.elevated,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ fontSize: 12, color: theme.colors.inkMuted }}>
        {step + 1} sur {STEPS.length}
      </div>
      <div style={{ height: 3, borderRadius: 999, backgroundColor: theme.colors.accentSoft, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", backgroundColor: theme.colors.accent }} />
      </div>
      <h2 style={{ fontSize: 20, marginTop: 8, color: theme.colors.ink }}>{current.question}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current.options.map((label) => (
          <button
            key={label}
            type="button"
            onClick={handlePick}
            style={{
              borderRadius: 18,
              padding: "12px 16px",
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.accentBorder}`,
              fontSize: 14,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {showResults && (
        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            onClick={() => {
              router.push("/selection");
            }}
            style={{
              marginTop: 8,
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              backgroundColor: theme.colors.ink,
              color: theme.colors.white,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Afficher la liste d&apos;œuvres
          </button>
        </div>
      )}
    </div>
  );
}

