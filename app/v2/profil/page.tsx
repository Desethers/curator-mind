"use client";

import Link from "next/link";
import { useAppState } from "../../../context/AppStateContext";
import { theme } from "../../../lib/theme";

export default function V2ProfilPage() {
  const { collectorIdentity, keywords, quizAnswers, bridgeSentence } = useAppState();

  return (
    <div style={{ width: "100%", maxWidth: theme.layout.maxWidth }}>
      <h1
        style={{
          fontFamily: theme.fonts.serif,
          fontSize: 24,
          color: theme.colors.ink,
          marginBottom: 24,
        }}
      >
        Mon Profil
      </h1>

      {collectorIdentity ? (
        <>
          <section style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: theme.colors.inkMuted,
                marginBottom: 8,
              }}
            >
              VOTRE IDENTITÉ DE COLLECTIONNEUR
            </p>
            <p
              style={{
                fontFamily: theme.fonts.serif,
                fontStyle: "italic",
                fontSize: 20,
                color: theme.colors.ink,
                lineHeight: 1.4,
                marginBottom: 12,
              }}
            >
              {collectorIdentity}
            </p>
            {bridgeSentence && (
              <p style={{ fontSize: 14, color: theme.colors.inkSoft, lineHeight: 1.5 }}>
                {bridgeSentence}
              </p>
            )}
          </section>

          {keywords.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: theme.colors.inkMuted,
                  marginBottom: 12,
                }}
              >
                VOS MOTS-CLÉS
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                      backgroundColor: theme.colors.accentSoft,
                      color: theme.colors.accent,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {quizAnswers && quizAnswers.length === 3 && (
            <section>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: theme.colors.inkMuted,
                  marginBottom: 12,
                }}
              >
                VOS RÉPONSES AU QUIZ
              </p>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {quizAnswers.map((a, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 14,
                      color: theme.colors.inkSoft,
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  >
                    {a}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      ) : (
        <p style={{ fontSize: 14, color: theme.colors.inkMuted, marginBottom: 20 }}>
          Vous n&apos;avez pas encore complété le quiz. Découvrez votre profil de
          collectionneur.
        </p>
      )}

      <Link
        href="/v2/quiz"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "12px 20px",
          borderRadius: 12,
          border: `1px solid ${theme.colors.accentBorder}`,
          color: theme.colors.accent,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        {collectorIdentity ? "Refaire le quiz" : "Découvrir mon profil"}
      </Link>
    </div>
  );
}
