"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "../lib/theme";

const STEPS = [
  {
    title: "Attirance",
    question: "Qu'est-ce qui vous attire dans une œuvre ?",
    options: ["La couleur", "La matière", "Le concept", "L'émotion"],
  },
  {
    title: "Univers",
    question: "Quel univers vous parle le plus ?",
    options: ["Abstrait", "Figuratif", "Photographie", "Sculpture"],
  },
  {
    title: "Budget",
    question: "Votre budget pour une première œuvre ?",
    options: ["< 1 000 €", "1 000 – 3 000 €", "3 000 – 6 000 €", "6 000 € +"],
  },
] as const;

const GREY_PILL = "#f7f7f7";
const GREY_BAR_BG = "#f0f0f0";
const GREY_BORDER = "rgba(0,0,0,0.08)";
const PILL_RADIUS = 28;

export function QuizCard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<1 | 2 | 3, string | null>>({
    1: null,
    2: null,
    3: null,
  });
  const router = useRouter();
  const currentStepIndex = step - 1;
  const current = STEPS[currentStepIndex];
  const isLastStep = step === 3;

  const handlePick = (option: string) => {
    setAnswers((prev) => ({ ...prev, [step]: option }));
    if (!isLastStep) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleRechercher = () => {
    router.push("/selection");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Barre en pilule : fond gris + indicateur blanc qui glisse */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          backgroundColor: GREY_BAR_BG,
          borderRadius: PILL_RADIUS,
          overflow: "hidden",
          height: 60,
        }}
      >
        {/* Wrapper des 3 étapes */}
        <div
          style={{
            flex: 1,
            display: "flex",
            minWidth: 0,
          }}
        >
          {STEPS.map((s, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3;
            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => setStep(stepNum)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "8px 16px",
                  backgroundColor: step === stepNum ? theme.colors.white : "transparent",
                  border: "none",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  textAlign: "center",
                  minHeight: 60,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: step === stepNum ? theme.colors.ink : theme.colors.inkMuted,
                  }}
                >
                  {s.title}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: step === stepNum ? theme.colors.inkMuted : theme.colors.inkSoft,
                  }}
                >
                  Question {stepNum}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleRechercher}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "0 24px",
            height: 50,
            margin: "5px 0",
            backgroundImage: "linear-gradient(90deg, #FF385C, #E61E4D)",
            color: theme.colors.white,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: "9999px",
            outline: "none",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: "9999px",
              border: "2px solid rgba(255,255,255,0.9)",
              marginRight: 2,
              fontSize: 10,
            }}
          >
            🔍
          </span>
          <span>Rechercher</span>
        </button>
      </div>

      {/* Carré arrondi : question + réponses (affiché au clic sur une partie) */}
      <div
        style={{
          backgroundColor: theme.colors.white,
          borderRadius: 24,
          boxShadow: "none",
          border: `1px solid ${GREY_BORDER}`,
          padding: 28,
          minHeight: 260,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: theme.colors.ink,
            lineHeight: 1.35,
            margin: 0,
            marginBottom: 20,
          }}
        >
          {current.question}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.options.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handlePick(label)}
              style={{
                padding: "14px 18px",
                borderRadius: 14,
                backgroundColor: GREY_PILL,
                border: `1px solid ${GREY_BORDER}`,
                fontSize: 14,
                fontWeight: 500,
                textAlign: "left",
                cursor: "pointer",
                color: theme.colors.ink,
                transition: "background-color 0.15s, border-color 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {isLastStep && (
          <p
            style={{
              fontSize: 12,
              color: theme.colors.inkMuted,
              margin: 0,
              marginTop: 16,
            }}
          >
            Cliquez sur une option pour voir votre sélection.
          </p>
        )}
      </div>
    </div>
  );
}
