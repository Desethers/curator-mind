"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";

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
const AUTO_ADVANCE_MS = 300;

export function V2QuizScreen() {
  const router = useRouter();
  const { setQuizAnswers } = useAppState();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<1 | 2 | 3, string | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [slideOut, setSlideOut] = useState(false);

  const current = STEPS[step - 1];
  const isLastStep = step === 3;

  const handlePick = useCallback(
    (option: string) => {
      setAnswers((prev) => ({ ...prev, [step]: option }));
      if (!isLastStep) {
        setSlideOut(true);
        setTimeout(() => {
          setStep((prev) => (prev + 1) as 1 | 2 | 3);
          setSlideOut(false);
        }, AUTO_ADVANCE_MS);
      } else {
        setSlideOut(true);
        setTimeout(() => {
          const arr = [answers[1], answers[2], option].filter(Boolean) as string[];
          setQuizAnswers(arr);
          router.push("/v2/interstitial");
        }, AUTO_ADVANCE_MS);
      }
    },
    [step, isLastStep, answers, setQuizAnswers, router]
  );

  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      {/* Barre en pilule — style du site */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          backgroundColor: GREY_BAR_BG,
          borderRadius: PILL_RADIUS,
          overflow: "hidden",
          height: 60,
          marginBottom: 12,
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
          opacity: slideOut ? 0 : 1,
          transform: slideOut ? "translateX(-12px)" : "translateX(0)",
          transition: "opacity 0.25s, transform 0.25s",
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
            Cliquez sur une option pour accéder à votre profil.
          </p>
        )}
      </div>
    </div>
  );
}
