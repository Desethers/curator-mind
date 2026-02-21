"use client";

import React from "react";
import Link from "next/link";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;

const THREAD_MOCK: Array<{
  type: "gallery" | "artist" | "agent";
  gallery?: string;
  text: string;
  cta: string;
  galleryId?: string;
  artworkId?: number;
  agentPrompt?: string;
}> = [
  {
    type: "gallery",
    gallery: "Galerie Mennour",
    text: "Ouvre une nouvelle série jeudi. Correspond à 3 de vos mots-clés.",
    cta: "Voir",
    galleryId: "mennour",
  },
  {
    type: "artist",
    text: "Camille Renault vient de vendre 2 œuvres cette semaine. Son marché monte.",
    cta: "Explorer",
    artworkId: 1,
  },
  {
    type: "agent",
    text: "Vous revenez toujours aux mêmes silences.",
    cta: "En parler",
    agentPrompt:
      "Je remarque que vous revenez toujours aux mêmes silences dans vos choix.",
  },
];

export function CollectorThread() {
  const { collectorProfile, setAgentContext, setAgentOpen, setAgentPreloadQuestion } =
    useAppStateV21();

  if (!collectorProfile.onboardingComplete) return null;

  return (
    <section style={{ marginBottom: 20 }}>
      <h2
        style={{
          fontFamily: t.fonts.sans,
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: t.colors.inkMuted,
          padding: "0 16px",
          marginBottom: 10,
        }}
      >
        CETTE SEMAINE
      </h2>
      <div className="v21-thread-scroll" style={{ display: "flex", gap: 12, padding: "0 16px" }}>
        {THREAD_MOCK.map((card, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 280,
              minHeight: 100,
              backgroundColor: t.colors.surface,
              border: `1px solid ${t.colors.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {card.type === "gallery" && (
              <>
                <span
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.colors.accent,
                  }}
                >
                  {card.gallery}
                </span>
                <p
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 13,
                    color: t.colors.ink,
                    margin: "4px 0 8px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  } as React.CSSProperties}
                >
                  {card.text}
                </p>
                <Link
                  href={card.galleryId ? `/v2.1/galerie/${card.galleryId}` : "/v2.1/browse"}
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    color: t.colors.accent,
                  }}
                >
                  Voir →
                </Link>
              </>
            )}
            {card.type === "artist" && (
              <>
                <span
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.colors.inkMuted,
                  }}
                >
                  ARTISTE QUE VOUS SUIVEZ
                </span>
                <p
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 13,
                    color: t.colors.ink,
                    margin: "4px 0 8px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  } as React.CSSProperties}
                >
                  {card.text}
                </p>
                <Link
                  href={card.artworkId ? `/v2.1/œuvre/${card.artworkId}` : "/v2.1/browse"}
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    color: t.colors.accent,
                  }}
                >
                  Explorer →
                </Link>
              </>
            )}
            {card.type === "agent" && (
              <>
                <span
                  style={{
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.colors.inkMuted,
                  }}
                >
                  CURATEUR
                </span>
                <p
                  style={{
                    fontFamily: t.fonts.serif,
                    fontStyle: "italic",
                    fontSize: 13,
                    color: t.colors.ink,
                    margin: "4px 0 8px",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  } as React.CSSProperties}
                >
                  {card.text}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAgentContext({
                      screen: "browse",
                      entityId: null,
                      entityName: null,
                      entityType: null,
                      description: null,
                    });
                    setAgentPreloadQuestion(card.agentPrompt ?? card.text);
                    setAgentOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontFamily: t.fonts.sans,
                    fontSize: 10,
                    color: t.colors.accent,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  En parler →
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
