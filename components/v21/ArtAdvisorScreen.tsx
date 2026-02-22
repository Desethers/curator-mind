"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { agentTheme } from "../../lib/agent-theme";
import { theme } from "../../lib/theme";
import { filterArtists, BUDGET_RANGES, type ArtAdvisorFilters, type BudgetRangeId } from "../../lib/search-artists";
import type { Artist } from "../../lib/v21-artists";
import { V21_ARTWORKS } from "../../lib/v21-artworks";
import { AgentMessageBubble } from "./AgentMessageBubble";
import type { Message } from "../../context/AppStateContextV21";

const at = agentTheme;
const t = theme;

const MEDIUM_CHIPS = ["Peinture", "Photographie", "Sculpture", "Textile"];
const LOCATION_CHIPS = ["Paris", "Berlin", "Lyon", "Bordeaux"];

const ADVISOR_QUESTION_CHIPS = [
  "Qu'est-ce qui me correspond pour un salon ?",
  "Je cherche un premier achat, par où commencer ?",
  "Des œuvres qui apaisent",
  "Comment choisir selon mon budget ?",
  "Un artiste qui travaille la matière",
];

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

type Mode = "search" | "advisor";

export default function ArtAdvisorScreen() {
  const router = useRouter();
  const {
    collectorProfile,
    agent,
    savedArtworks,
    appendAgentMessage,
    updateAgentMessage,
  } = useAppStateV21();

  const [mode, setMode] = useState<Mode>("search");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filtres mode Rechercher
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRangeId | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const history = agent.history;
  const identity = collectorProfile.identity ?? null;
  const keywords = collectorProfile.keywords?.length
    ? collectorProfile.keywords
    : ["contemporain", "émergent"];
  const savedArtworksNames = savedArtworks.map((a) => a.title);
  const top3Memory = agent.memory.keyInsights.slice(-3);

  const filters: ArtAdvisorFilters = {
    query: searchQuery || undefined,
    medium: selectedMedium ?? undefined,
    budgetRangeId: selectedBudget ?? undefined,
    location: selectedLocation ?? undefined,
  };
  const { artists: filteredArtists, reasonByArtist } = filterArtists(filters);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setInput("");
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: trimmed,
        at: Date.now(),
      };
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
      } catch {
        updateAgentMessage(assistantId, "Erreur de connexion. Réessayez.");
      }
      setLoading(false);
    },
    [
      loading,
      history,
      identity,
      keywords,
      agent.currentContext,
      top3Memory,
      savedArtworksNames,
      appendAgentMessage,
      updateAgentMessage,
    ]
  );

  const handleArtistTap = useCallback(
    (artist: Artist) => {
      const firstArtwork = V21_ARTWORKS.find((a) => a.artist === artist.name);
      if (firstArtwork) router.push(`/v2.1/œuvre/${firstArtwork.id}`);
    },
    [router]
  );

  const firstEver = history.length === 0 && !loading;
  const showOpeningQuestion = firstEver;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: at.colors.bg,
        fontFamily: at.fonts.sans,
        color: at.colors.ink,
      }}
    >
      <header
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${at.colors.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
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
            <span style={{ fontFamily: at.fonts.serif, fontSize: 18, color: at.colors.ink }}>
              Art advisor
            </span>
            {identity ? (
              <span style={{ fontSize: 12, fontStyle: "italic", color: at.colors.accent }}>{identity}</span>
            ) : (
              <span style={{ fontSize: 11, color: at.colors.inkMuted }}>Recherche & conseil</span>
            )}
          </div>
          <span style={{ width: 32 }} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            borderRadius: 12,
            border: `1px solid ${at.colors.border}`,
            overflow: "hidden",
            backgroundColor: at.colors.surface,
          }}
        >
          <button
            type="button"
            onClick={() => setMode("search")}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              background: mode === "search" ? at.colors.bg : "transparent",
              color: mode === "search" ? at.colors.ink : at.colors.inkMuted,
              fontFamily: at.fonts.sans,
              fontSize: 13,
              fontWeight: mode === "search" ? 600 : 400,
              cursor: "pointer",
              boxShadow: mode === "search" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => setMode("advisor")}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              background: mode === "advisor" ? at.colors.bg : "transparent",
              color: mode === "advisor" ? at.colors.ink : at.colors.inkMuted,
              fontFamily: at.fonts.sans,
              fontSize: 13,
              fontWeight: mode === "advisor" ? 600 : 400,
              cursor: "pointer",
              boxShadow: mode === "advisor" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            Conseiller IA
          </button>
        </div>
      </header>

      {mode === "search" && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé, humeur, espace…"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: `1px solid ${t.colors.border}`,
              fontFamily: t.fonts.sans,
              fontSize: 15,
              color: t.colors.ink,
              outline: "none",
            }}
          />

          <section>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 8,
              }}
            >
              Médium
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MEDIUM_CHIPS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedMedium(selectedMedium === label ? null : label)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${selectedMedium === label ? t.colors.accent : t.colors.accentBorder}`,
                    background: selectedMedium === label ? t.colors.accentSoft : t.colors.surface,
                    color: selectedMedium === label ? t.colors.accent : t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 8,
              }}
            >
              Budget
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BUDGET_RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedBudget(selectedBudget === r.id ? null : r.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${selectedBudget === r.id ? t.colors.accent : t.colors.accentBorder}`,
                    background: selectedBudget === r.id ? t.colors.accentSoft : t.colors.surface,
                    color: selectedBudget === r.id ? t.colors.accent : t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 8,
              }}
            >
              Lieu
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LOCATION_CHIPS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedLocation(selectedLocation === label ? null : label)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${selectedLocation === label ? t.colors.accent : t.colors.accentBorder}`,
                    background: selectedLocation === label ? t.colors.accentSoft : t.colors.surface,
                    color: selectedLocation === label ? t.colors.accent : t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <div style={{ fontSize: 13, color: t.colors.inkSoft }}>
            {filteredArtists.length} artiste{filteredArtists.length !== 1 ? "s" : ""} correspondent à vos critères.
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredArtists.map((artist) => (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => handleArtistTap(artist)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${t.colors.border}`,
                    background: t.colors.surface,
                    textAlign: "left",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 600, color: t.colors.ink, marginBottom: 2 }}>
                    {artist.name}
                  </div>
                  <div style={{ fontSize: 12, color: t.colors.inkSoft, marginBottom: 4 }}>
                    {artist.medium} · {artist.location}
                  </div>
                  {(reasonByArtist.get(artist.id) || artist.matchReasons[0]) && (
                    <div style={{ fontSize: 12, color: t.colors.inkMuted }}>
                      {reasonByArtist.get(artist.id) || artist.matchReasons[0]}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMode("advisor")}
            style={{
              marginTop: 8,
              padding: "14px 20px",
              borderRadius: 12,
              border: `1px solid ${t.colors.accentBorder}`,
              background: t.colors.accentSoft,
              color: t.colors.accent,
              fontFamily: t.fonts.sans,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Vous voulez aller plus loin ? Parlez au conseiller →
          </button>
        </div>
      )}

      {mode === "advisor" && (
        <>
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
            <div
              style={{
                overflowX: "auto",
                marginBottom: 16,
                paddingBottom: 8,
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {ADVISOR_QUESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendMessage(chip)}
                  style={{
                    flexShrink: 0,
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1px solid ${at.colors.border}`,
                    background: at.colors.surface,
                    color: at.colors.ink,
                    fontFamily: at.fonts.sans,
                    fontSize: 13,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

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
                sendMessage(input);
              }}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question…"
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
        </>
      )}
    </div>
  );
}
