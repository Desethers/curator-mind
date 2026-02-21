"use client";

import { useState, useEffect, useRef } from "react";
import { agentTheme } from "../../lib/agent-theme";
import type { AgentScreen } from "../../context/AppStateContextV21";

const at = agentTheme;

const BROWSE_PLACEHOLDERS = [
  "Demandez à Curateur…",
  "Qu'est-ce que j'aime vraiment ?",
  "Comment visiter une galerie pour la première fois ?",
  "Est-ce que j'ai un style ?",
];

function getArtworkPlaceholders(_entityName: string) {
  return [
    "Cette œuvre me correspond ?",
    "Comment savoir si c'est le bon prix ?",
    "Qu'est-ce que je ressentirais avec ça chez moi ?",
    "Cet artiste va-t-il prendre de la valeur ?",
  ];
}

function getGalleryPlaceholders(_entityName: string) {
  return [
    "On peut entrer sans intention d'acheter ?",
    "Qu'est-ce qu'on dit en arrivant ?",
    "C'est intimidant comme galerie ?",
    "Qu'est-ce que je dois savoir avant d'y aller ?",
  ];
}

const COLLECTION_PLACEHOLDERS = [
  "Ces œuvres ont-elles quelque chose en commun ?",
  "Est-ce que j'ai un style ?",
  "Laquelle achèterait quelqu'un comme moi ?",
  "Suis-je prêt pour ma première acquisition ?",
];

function getPlaceholders(
  screen: AgentScreen,
  entityName: string | null
): string[] {
  switch (screen) {
    case "artwork":
      return getArtworkPlaceholders(entityName ?? "");
    case "gallery":
      return getGalleryPlaceholders(entityName ?? "");
    case "collection":
      return COLLECTION_PLACEHOLDERS;
    default:
      return BROWSE_PLACEHOLDERS;
  }
}

const ROTATE_MS = 4000;

export function AgentFloatingBar({
  screen,
  entityName,
  placeholderIndex,
  onPlaceholderIndexChange,
  inputValue,
  onInputChange,
  onFocus,
  onSubmit,
  pulse,
}: {
  screen: AgentScreen;
  entityName: string | null;
  placeholderIndex: number;
  onPlaceholderIndexChange: (i: number) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
  pulse: boolean;
}) {
  const placeholders = getPlaceholders(screen, entityName);
  const [visibleIndex, setVisibleIndex] = useState(placeholderIndex);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisibleIndex(placeholderIndex);
  }, [placeholderIndex, screen, entityName]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (placeholderIndex + 1) % placeholders.length;
      onPlaceholderIndexChange(next);
    }, ROTATE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders.length, placeholderIndex, onPlaceholderIndexChange]);

  const canSend = inputValue.trim().length > 0;

  return (
    <div
      className={pulse ? "agent-bar-pulse" : "agent-bar-enter"}
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 72,
        height: 48,
        maxWidth: 430,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 6px 0 14px",
        background: at.colors.bg,
        border: `1px solid ${at.colors.border}`,
        borderRadius: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        zIndex: 900,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          color: at.colors.accent,
          fontSize: 14,
          flexShrink: 0,
        }}
        aria-hidden
      >
        ◈
      </span>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholders[visibleIndex]}
        aria-label="Demander à Curateur"
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          background: "transparent",
          fontSize: 13,
          fontFamily: at.fonts.sans,
          color: at.colors.ink,
          outline: "none",
        }}
      />
      {canSend && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSubmit();
          }}
          aria-label="Envoyer"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: at.colors.ink,
            color: at.colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14 }}>→</span>
        </button>
      )}
    </div>
  );
}
