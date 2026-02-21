"use client";

import { useState } from "react";
import { theme } from "../lib/theme";

const STEPS = [
  {
    title: "Incertitude",
    question:
      "Devant une image que vous ne comprenez pas immédiatement, vous ressentez quoi ?",
    options: [
      "De la curiosité — j'ai envie d'y revenir",
      "De la frustration — je veux que ça signifie quelque chose",
      "Du plaisir — le mystère est le but",
      "De l'indifférence — si ça ne parle pas de suite, ça ne me parle pas",
    ],
  },
  {
    title: "Espace",
    question: "Dans votre espace idéal, une œuvre doit faire quoi ?",
    options: [
      "Créer un silence",
      "Raconter quelque chose à chaque fois qu'on la regarde",
      "Physiquement transformer la pièce",
      "Provoquer une conversation avec ceux qui la voient",
    ],
  },
  {
    title: "Émotion",
    question: "La dernière fois qu'une image vous a touché, c'était comment ?",
    options: [
      "Un choc — immédiat et physique",
      "Une évidence — comme si vous l'aviez toujours connue",
      "Une question — elle a ouvert quelque chose sans répondre",
      "Une mélancolie douce — nostalgie ou beauté triste",
    ],
  },
] as const;

const GREY_PILL = "#f7f7f7";
const GREY_BAR_BG = "#f0f0f0";
const GREY_BORDER = "rgba(0,0,0,0.08)";
const PILL_RADIUS = 28;

export type QuizAnswers = Record<1 | 2 | 3, string | null>;

export function QuizCard({
  onComplete,
}: {
  onComplete?: (answers: QuizAnswers, identity: string, keywords: string[]) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    1: null,
    2: null,
    3: null,
  });
  const [loading, setLoading] = useState(false);
  const currentStepIndex = step - 1;
  const current = STEPS[currentStepIndex];
  const isLastStep = step === 3;
  const canRechercher =
    answers[1] && answers[2] && answers[3];

  const handlePick = (option: string) => {
    setAnswers((prev) => ({ ...prev, [step]: option }));
    if (!isLastStep) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleRechercher = () => {
    if (!canRechercher || loading) return;
    setLoading(true);
    const a = [answers[1], answers[2], answers[3]] as [string, string, string];
    fetch("/api/collector-identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: a }),
    })
      .then((r) => r.json())
      .then((data) => {
        const identity = (data.identity || "Vous collectionnez l'inattendu.").trim();
        const keywords = Array.isArray(data.keywords) ? data.keywords : [];
        onComplete?.(answers, identity, keywords);
      })
      .catch(() => {
        onComplete?.(
          answers,
          "Vous collectionnez l'inattendu.",
          ["contemporain", "émergent", "singulier"]
        );
      })
      .finally(() => setLoading(false));
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
        <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
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
          disabled={!canRechercher || loading}
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
            cursor: canRechercher && !loading ? "pointer" : "not-allowed",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: "9999px",
            outline: "none",
            opacity: canRechercher ? 1 : 0.6,
          }}
        >
          <span>{loading ? "..." : "Rechercher"}</span>
        </button>
      </div>

      {/* Carré arrondi : question + réponses */}
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
