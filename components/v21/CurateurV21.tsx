"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { agentTheme } from "../../lib/agent-theme";
import { AgentMessageBubble } from "./AgentMessageBubble";
import type { Message } from "../../context/AppStateContextV21";

const at = agentTheme;

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

export default function CurateurV21() {
  const router = useRouter();
  const {
    collectorProfile,
    agent,
    savedArtworks,
    appendAgentMessage,
    updateAgentMessage,
  } = useAppStateV21();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const history = agent.history;
  const identity = collectorProfile.identity ?? null;
  const keywords = collectorProfile.keywords?.length
    ? collectorProfile.keywords
    : ["contemporain", "émergent"];
  const savedArtworksNames = savedArtworks.map((a) => a.title);
  const top3Memory = agent.memory.keyInsights.slice(-3);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { id: generateId(), role: "user", content: text, at: Date.now() };
    appendAgentMessage(userMsg);
    const assistantId = generateId();
    appendAgentMessage({ id: assistantId, role: "assistant", content: "", at: Date.now() });
    setLoading(true);

    const historyForApi = [...history, userMsg]
      .filter((m) => m.content)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/curateur-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          identity: identity ?? "not yet revealed",
          keywords,
          context: agent.currentContext,
          memoryInsights: top3Memory,
          savedArtworksNames,
        }),
      });
      if (!res.ok || !res.body) {
        updateAgentMessage(assistantId, "Désolé, une erreur s'est produite.");
        setLoading(false);
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
      setLoading(false);
    } catch {
      updateAgentMessage(assistantId, "Erreur de connexion. Réessayez.");
      setLoading(false);
    }
  };

  const firstEver = history.length === 0 && !loading;
  const showOpeningQuestion = firstEver;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        backgroundColor: at.colors.bg,
        fontFamily: at.fonts.sans,
        color: at.colors.ink,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${at.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              color: at.colors.ink,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ←
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span
              style={{
                fontFamily: at.fonts.serif,
                fontSize: 18,
                color: at.colors.ink,
              }}
            >
              Curateur
            </span>
            {identity ? (
              <span
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: at.colors.accent,
                }}
              >
                {identity}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: at.colors.inkMuted }}>
                Votre espace de réflexion
              </span>
            )}
          </div>
          <span style={{ width: 32 }} />
        </header>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {showOpeningQuestion && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                textAlign: "center",
                fontFamily: at.fonts.serif,
                fontSize: 22,
                fontStyle: "italic",
                color: at.colors.inkSoft,
                lineHeight: 1.5,
              }}
            >
              Qu&apos;est-ce qui vous a amené ici aujourd&apos;hui ?
            </div>
          )}
          {history.map((m) => (
            <AgentMessageBubble key={m.id} message={m} />
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
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            padding: 16,
            borderTop: `1px solid ${at.colors.border}`,
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
                border: `1px solid ${at.colors.border}`,
                backgroundColor: at.colors.bg,
                color: at.colors.ink,
                fontSize: 15,
                fontFamily: at.fonts.sans,
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: "none",
                backgroundColor: at.colors.ink,
                color: at.colors.bg,
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

      {/* Memory sidebar — desktop only */}
      <aside
        style={{
          display: "none",
          width: 280,
          borderLeft: `1px solid ${at.colors.border}`,
          padding: 20,
          flexShrink: 0,
        }}
        className="agent-memory-sidebar"
      >
        <h2
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: at.colors.inkMuted,
            marginBottom: 12,
            fontFamily: at.fonts.sans,
          }}
        >
          CE QUE JE SAIS DE VOUS
        </h2>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {agent.memory.keyInsights.map((insight, i) => (
            <li
              key={i}
              style={{
                fontFamily: at.fonts.serif,
                fontSize: 13,
                fontStyle: "italic",
                color: at.colors.inkSoft,
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {insight}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
