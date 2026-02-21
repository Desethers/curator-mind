"use client";

import { agentTheme } from "../../lib/agent-theme";
import type { AgentContext } from "../../context/AppStateContextV21";

const at = agentTheme;

const SCREEN_LABELS: Record<string, string> = {
  browse: "Explorer",
  artwork: "Œuvre",
  gallery: "Galerie",
  collection: "Collection",
  profile: "Profil",
};

export function AgentContextIndicator({
  context,
  onDismiss,
}: {
  context: AgentContext;
  onDismiss: () => void;
}) {
  const icon = context.entityType === "artwork" ? "◉" : "○";
  const label = SCREEN_LABELS[context.screen] ?? context.screen;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: at.colors.surface,
        border: `1px solid ${at.colors.border}`,
        borderRadius: 100,
        marginBottom: 12,
        flexShrink: 0,
      }}
    >
      <span style={{ color: at.colors.inkSoft, fontSize: 12 }}>{icon}</span>
      <span
        style={{
          flex: 1,
          fontSize: 12,
          fontFamily: at.fonts.sans,
          color: at.colors.inkSoft,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        &quot;{context.entityName}&quot; · {label}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Retirer le contexte"
        style={{
          width: 24,
          height: 24,
          border: "none",
          background: "none",
          color: at.colors.inkMuted,
          fontSize: 16,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
