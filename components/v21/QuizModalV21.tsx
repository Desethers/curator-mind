"use client";

import { useState, useCallback } from "react";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;

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

const AUTO_ADVANCE_MS = 300;

export function QuizModalV21({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const { setCollectorProfileFromQuiz } = useAppStateV21();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<1 | 2 | 3, string | null>>({
    1: null,
    2: null,
    3: null,
  });
  const [slideOut, setSlideOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const current = STEPS[step - 1];
  const isLastStep = step === 3;

  const handlePick = useCallback(
    async (option: string) => {
      const nextAnswers = { ...answers, [step]: option };
      setAnswers(nextAnswers);
      if (!isLastStep) {
        setSlideOut(true);
        setTimeout(() => {
          setStep((prev) => (prev + 1) as 1 | 2 | 3);
          setSlideOut(false);
        }, AUTO_ADVANCE_MS);
      } else {
        setSlideOut(true);
        setLoading(true);
        const arr = [nextAnswers[1], nextAnswers[2], option].filter(
          Boolean
        ) as [string, string, string];
        try {
          const res = await fetch("/api/collector-identity-v2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: arr }),
          });
          const data = await res.json();
          setCollectorProfileFromQuiz(
            data.identity || "Vous collectionnez l'inattendu.",
            data.keywords || ["contemporain", "émergent"],
            data.bridge || "Les galeries parisiennes ont quelque chose pour vous.",
            arr
          );
          onComplete();
        } catch {
          setCollectorProfileFromQuiz(
            "Vous collectionnez l'inattendu.",
            ["contemporain", "émergent"],
            "Les galeries parisiennes ont quelque chose pour vous.",
            arr
          );
          onComplete();
        } finally {
          setLoading(false);
        }
      }
    },
    [step, isLastStep, answers, setCollectorProfileFromQuiz, onComplete]
  );

  if (!open) return null;

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
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
          padding: "24px 20px 32px",
          zIndex: 50,
          boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
          animation: "v21SlideUp 0.3s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: t.colors.inkMuted,
            }}
          >
            {current.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            style={{
              background: "none",
              border: "none",
              color: t.colors.inkMuted,
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <h2
          style={{
            fontFamily: t.fonts.serif,
            fontSize: 18,
            fontWeight: 400,
            color: t.colors.ink,
            lineHeight: 1.4,
            margin: 0,
            marginBottom: 20,
          }}
        >
          {current.question}
        </h2>
        <div
          style={{
            opacity: slideOut ? 0 : 1,
            transform: slideOut ? "translateX(-8px)" : "translateX(0)",
            transition: "opacity 0.25s, transform 0.25s",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {current.options.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handlePick(label)}
                disabled={loading}
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  backgroundColor: t.colors.elevated,
                  border: `1px solid ${t.colors.accentBorder}`,
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: "left",
                  cursor: loading ? "wait" : "pointer",
                  color: t.colors.ink,
                  fontFamily: t.fonts.sans,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            height: 4,
            borderRadius: 2,
            backgroundColor: t.colors.accentBorder,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(step / 3) * 100}%`,
              height: "100%",
              backgroundColor: t.colors.accent,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </>
  );
}
