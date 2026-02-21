"use client";

import type React from "react";
import { agentTheme } from "../../lib/agent-theme";
import type { Message } from "../../context/AppStateContextV21";

const at = agentTheme;

const MIRROR_PATTERNS = [
  /Vous collectionnez [^.]*[.]?/gi,
  /Vous êtes attiré par [^.]*[.]?/gi,
  /Votre œil cherche [^.]*[.]?/gi,
];

function parseAssistantContent(text: string): React.ReactNode {
  if (!text) return null;
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let key = 0;

  for (const pattern of MIRROR_PATTERNS) {
    const re = new RegExp(pattern.source, "gi");
    let match: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((match = re.exec(text)) !== null) {
      const fullMatch = match[0];
      const start = match.index;
      if (start > lastIndex) {
        parts.push(
          <span key={key++}>{text.slice(lastIndex, start)}</span>
        );
      }
      parts.push(
        <span
          key={key++}
          style={{
            fontStyle: "italic",
            color: at.colors.accent,
            fontSize: 17,
          }}
        >
          {fullMatch}
        </span>
      );
      lastIndex = start + fullMatch.length;
    }
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return parts.length > 0 ? <>{parts}</> : text;
}

export function AgentMessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            maxWidth: "80%",
            padding: "10px 14px",
            background: at.colors.surface,
            border: `1px solid ${at.colors.border}`,
            borderRadius: "16px 16px 4px 16px",
            fontSize: 14,
            fontFamily: at.fonts.sans,
            color: at.colors.inkSoft,
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: "88%",
          paddingLeft: 14,
          borderLeft: `2px solid ${at.colors.border}`,
          fontFamily: at.fonts.serif,
          fontSize: 16,
          color: at.colors.ink,
          lineHeight: 1.7,
        }}
      >
        {parseAssistantContent(message.content)}
      </div>
    </div>
  );
}
