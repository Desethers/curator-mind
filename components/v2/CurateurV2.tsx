"use client";

import { useState, useRef, useEffect } from "react";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";
import type { Message } from "../../context/AppStateContext";

const INITIAL_PROMPT =
  "Quelle est la dernière image à laquelle vous ne pouviez plus cesser de penser ?";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function CurateurV2({
  embedded = false,
  onClose,
}: {
  embedded?: boolean;
  onClose?: () => void;
}) {
  const {
    collectorIdentity,
    keywords,
    agentHistory,
    setAgentHistory,
    appendAgentMessage,
    updateAgentMessage,
  } = useAppState();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agentHistory.length === 0) {
      setAgentHistory([
        {
          id: "welcome",
          role: "assistant",
          content: INITIAL_PROMPT,
        },
      ]);
    }
  }, [agentHistory.length, setAgentHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentHistory]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { id: generateId(), role: "user", content: text };
    appendAgentMessage(userMsg);
    const assistantId = generateId();
    appendAgentMessage({
      id: assistantId,
      role: "assistant",
      content: "",
    });
    setLoading(true);
    const historyForApi = [...agentHistory, userMsg]
      .filter((m) => m.content)
      .map((m) => ({ role: m.role, content: m.content }));
    try {
      const res = await fetch("/api/curateur-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          identity: collectorIdentity || "Vous collectionnez l'inattendu.",
          keywords: keywords?.length ? keywords : ["contemporain", "émergent"],
        }),
      });
      if (!res.ok || !res.body) {
        updateAgentMessage(assistantId, "Désolé, une erreur s’est produite.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        updateAgentMessage(assistantId, acc);
      }
    } catch {
      updateAgentMessage(assistantId, "Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const messages = agentHistory.length
    ? agentHistory
    : [{ id: "welcome", role: "assistant" as const, content: INITIAL_PROMPT }];

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: embedded ? "100%" : theme.layout.maxWidth,
    margin: "0 auto",
    backgroundColor: theme.colors.bg,
    fontFamily: theme.fonts.sans,
    color: theme.colors.ink,
    overflow: "hidden",
    borderRadius: embedded ? 24 : 0,
    ...(embedded
      ? { minHeight: 420, maxHeight: "70vh" }
      : { minHeight: "60vh" }),
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${theme.colors.accentBorder}`,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: theme.colors.inkMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span>Curateur</span>
        {embedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            style={{
              background: "none",
              border: "none",
              color: theme.colors.inkMuted,
              cursor: "pointer",
              padding: 4,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minHeight: 0,
        }}
      >
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: theme.colors.inkSoft,
                  maxWidth: "85%",
                  textAlign: "right",
                }}
              >
                {m.content}
              </p>
            </div>
          ) : (
            <div key={m.id}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: theme.colors.ink,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content || (loading ? "…" : "")}
              </p>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>
      <div
        style={{
          padding: 16,
          borderTop: `1px solid ${theme.colors.accentBorder}`,
          flexShrink: 0,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Répondre…"
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1px solid ${theme.colors.accentBorder}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.ink,
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              backgroundColor: theme.colors.accent,
              color: theme.colors.bg,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
