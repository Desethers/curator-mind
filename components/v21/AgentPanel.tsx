"use client";

import { useRef, useEffect } from "react";
import { agentTheme } from "../../lib/agent-theme";
import { theme } from "../../lib/theme";
import { AgentContextIndicator } from "./AgentContextIndicator";
import { AgentMessageBubble } from "./AgentMessageBubble";
import { AgentSuggestedChips } from "./AgentSuggestedChips";
import type { Message } from "../../context/AppStateContextV21";
import type { AgentContext } from "../../context/AppStateContextV21";

const at = agentTheme;
const t = theme;

function formatDateSeparator(atMs: number): string {
  const d = new Date(atMs);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return `Il y a ${diffDays} jours`;
}

export function AgentPanel({
  context,
  onDismissContext,
  messages,
  loading,
  suggestedChips,
  onSelectChip,
  inputValue,
  onInputChange,
  onSubmit,
  onDragDown,
  postVisitRitual,
}: {
  context: AgentContext | null;
  onDismissContext: () => void;
  messages: Message[];
  loading: boolean;
  suggestedChips: string[];
  onSelectChip: (text: string) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  onDragDown: () => void;
  postVisitRitual?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  let lastDay = "";
  const messageBlocks: { dateLabel?: string; messages: Message[] }[] = [];
  let currentBlock: Message[] = [];

  messages.forEach((m) => {
    const atMs = m.at ?? 0;
    const dayLabel = atMs ? formatDateSeparator(atMs) : "";
    if (dayLabel && dayLabel !== lastDay) {
      if (currentBlock.length > 0) {
        messageBlocks.push({ messages: currentBlock });
        currentBlock = [];
      }
      lastDay = dayLabel;
      messageBlocks.push({ dateLabel: dayLabel, messages: [] });
    }
    currentBlock.push(m);
  });
  if (currentBlock.length > 0) messageBlocks.push({ messages: currentBlock });

  return (
    <div
      style={{
        height: "65vh",
        maxHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        background: at.colors.bg,
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -4px 40px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          paddingTop: 12,
          paddingBottom: 8,
          flexShrink: 0,
          cursor: "grab",
        }}
        onMouseDown={() => onDragDown()}
        role="button"
        tabIndex={0}
        aria-label="Fermer"
      >
        <div
          style={{
            width: 32,
            height: 4,
            margin: "0 auto",
            background: at.colors.border,
            borderRadius: 2,
          }}
        />
      </div>

      <div style={{ padding: "0 16px 16px", flexShrink: 0 }}>
        {context && (
          <AgentContextIndicator context={context} onDismiss={onDismissContext} />
        )}
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 && !loading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
              fontFamily: postVisitRitual ? t.fonts.serif : at.fonts.serif,
              fontSize: postVisitRitual ? 20 : 22,
              fontStyle: "italic",
              color: at.colors.inkSoft,
              lineHeight: 1.5,
            }}
          >
            {postVisitRitual ? "Alors — qu'est-ce que vous avez ressenti ?" : "Qu'est-ce qui vous a amené ici aujourd'hui ?"}
          </div>
        )}
        {messageBlocks.map((block, bi) => (
          <div key={bi}>
            {block.dateLabel && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  fontFamily: at.fonts.sans,
                  color: at.colors.inkMuted,
                  margin: "12px 0",
                }}
              >
                {block.dateLabel}
              </div>
            )}
            {block.messages.map((m) => (
              <AgentMessageBubble key={m.id} message={m} />
            ))}
          </div>
        ))}
        {loading && (
          <div
            style={{
              paddingLeft: 14,
              borderLeft: `2px solid ${at.colors.border}`,
              fontFamily: at.fonts.serif,
              fontSize: 16,
              color: at.colors.inkMuted,
            }}
          >
            …
          </div>
        )}
      </div>

      <div style={{ padding: "0 16px 16px", flexShrink: 0 }}>
        {!postVisitRitual && <AgentSuggestedChips chips={suggestedChips} onSelectChip={onSelectChip} />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Écrivez votre question…"
            rows={2}
            style={{
              flex: 1,
              minHeight: 44,
              padding: "10px 14px",
              border: `1px solid ${at.colors.border}`,
              borderRadius: 16,
              background: at.colors.bg,
              fontFamily: at.fonts.sans,
              fontSize: 14,
              color: at.colors.ink,
              resize: "none",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: at.colors.ink,
              color: at.colors.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: inputValue.trim() ? "pointer" : "not-allowed",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
