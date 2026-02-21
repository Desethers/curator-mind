"use client";

import { useState } from "react";
import { agentTheme } from "../../lib/agent-theme";

const at = agentTheme;

export function AgentSuggestedChips({
  chips,
  onSelectChip,
}: {
  chips: string[];
  onSelectChip: (text: string) => void;
}) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  if (chips.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
      }}
    >
      {chips.map((chip, i) => (
        <button
          key={`${i}-${chip}`}
          type="button"
          onClick={() => onSelectChip(chip)}
          onTouchStart={() => setPressedIndex(i)}
          onTouchEnd={() => setPressedIndex(null)}
          style={{
            padding: "8px 14px",
            fontSize: 12,
            fontFamily: at.fonts.sans,
            color: at.colors.inkSoft,
            background: pressedIndex === i ? at.colors.accentSoft : at.colors.surface,
            border: `1px solid ${pressedIndex === i ? at.colors.accent : at.colors.border}`,
            borderRadius: 100,
            cursor: "pointer",
            transition: "background 150ms, border-color 150ms",
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
