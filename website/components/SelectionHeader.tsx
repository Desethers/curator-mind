"use client";

import { useState, useEffect } from "react";
import { theme } from "../lib/theme";

const STORAGE_KEY = "curator-mind-quiz-result";

export function SelectionHeader() {
  const [identity, setIdentity] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as {
        identity?: string;
        keywords?: string[];
      };
      if (data.identity) setIdentity(data.identity);
      if (Array.isArray(data.keywords)) setKeywords(data.keywords);
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      {/* Sticky anchor: identity + keywords — stays visible on scroll */}
      <section
        className="sticky top-0 z-10 pb-4 -mx-2 px-2 pt-2"
        style={{
          marginBottom: 12,
          backgroundColor: theme.colors.bg,
          borderBottom: identity
            ? `1px solid rgba(0,0,0,0.06)`
            : "none",
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: theme.colors.inkMuted,
            marginBottom: 8,
            fontFamily: theme.fonts.sans,
          }}
        >
          Sélection personnalisée
        </p>
        {identity ? (
          <>
            <h1
              className="font-serif italic leading-snug"
              style={{
                fontSize: "clamp(22px, 4vw, 30px)",
                color: theme.colors.ink,
                fontFamily: theme.fonts.serif,
                marginBottom: 12,
              }}
            >
              {identity}
            </h1>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                    style={{
                      backgroundColor: theme.colors.accentSoft,
                      color: theme.colors.accent,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.2,
              marginBottom: 10,
              color: theme.colors.ink,
              fontFamily: theme.fonts.serif,
            }}
          >
            Une première proposition construite à partir de vos réponses.
          </h1>
        )}
      </section>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          color: theme.colors.inkSoft,
          marginTop: 12,
        }}
      >
        Voici un exemple de grille telle que pourrait la générer Curator Mind
        après le quizz. Les œuvres sont illustratives : dans la version produit,
        elles seraient reliées à de vrais artistes et à votre profil.
      </p>
    </>
  );
}
