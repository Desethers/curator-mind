"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import type { Message } from "../../context/AppStateContextV21";
import { useAgentContextV21 } from "../../hooks/useAgentContextV21";
import { AgentFloatingBar } from "./AgentFloatingBar";
import { AgentPanel } from "./AgentPanel";
import { agentTheme } from "../../lib/agent-theme";

const at = agentTheme;

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

const PULSE_INTERVAL_MS = 30000;
const DRAG_DISMISS_THRESHOLD = 80;

export function AgentFloatingLayer() {
  useAgentContextV21();

  const {
    agent,
    collectorProfile,
    savedArtworks,
    setAgentOpen,
    setAgentContext,
    setAgentMemory,
    setSuggestedChips,
    setAgentPreloadQuestion,
    appendAgentMessage,
    updateAgentMessage,
  } = useAppStateV21();

  useEffect(() => {
    if (agent.isOpen && agent.preloadQuestion) {
      setInputValue(agent.preloadQuestion);
      setAgentPreloadQuestion(null);
    }
  }, [agent.isOpen, agent.preloadQuestion, setAgentPreloadQuestion]);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);

  const screen = agent.currentContext?.screen ?? "browse";
  const entityName = agent.currentContext?.entityName ?? null;
  const history = agent.history;
  const suggestedChips = agent.suggestedChips;
  const identity = collectorProfile.identity ?? "not yet revealed";
  const keywords = collectorProfile.keywords?.length
    ? collectorProfile.keywords
    : ["contemporain", "émergent"];
  const savedArtworksNames = savedArtworks.map((a) => a.title);
  const top3Memory = agent.memory.keyInsights.slice(-3);

  const fetchChips = useCallback(() => {
    const last2 = history.slice(-2).map((m) => ({ role: m.role, content: m.content }));
    fetch("/api/curateur-v2/chips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        screen,
        entityName: agent.currentContext?.entityName ?? null,
        entityType: agent.currentContext?.entityType ?? null,
        identity,
        keywords,
        last2Messages: last2,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.chips)) setSuggestedChips(data.chips.slice(0, 3));
      })
      .catch(() => {});
  }, [
    screen,
    agent.currentContext?.entityName,
    agent.currentContext?.entityType,
    history,
    identity,
    keywords,
    setSuggestedChips,
  ]);

  useEffect(() => {
    fetchChips();
  }, [screen, agent.currentContext?.entityId, agent.currentContext?.entityName, fetchChips]);

  useEffect(() => {
    const t = setInterval(() => setPulse(true), PULSE_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!pulse) return;
    const t = setTimeout(() => setPulse(false), 2000);
    return () => clearTimeout(t);
  }, [pulse]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setInputValue("");
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

      fetch("/api/curateur-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          identity,
          keywords,
          context: agent.currentContext,
          memoryInsights: top3Memory,
          savedArtworksNames,
        }),
      })
        .then((res) => {
          if (!res.ok || !res.body) {
            updateAgentMessage(assistantId, "Désolé, une erreur s'est produite.");
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";
          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                setLoading(false);
                fetchChips();
                setAgentMemory((prev) => ({
                  ...prev,
                  lastActive: new Date().toISOString(),
                }));
                fetch("/api/curateur-v2/memory", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    lastUserMessage: trimmed,
                    lastAssistantMessage: acc,
                    existingMemory: agent.memory,
                  }),
                })
                  .then((r) => r.json())
                  .then((data: { newInsight?: string | null; newMilestone?: string | null }) => {
                    setAgentMemory((prev) => {
                      const next = { ...prev };
                      if (data.newInsight) {
                        next.keyInsights = [...prev.keyInsights, data.newInsight].slice(-10);
                      }
                      if (data.newMilestone) {
                        next.collectorMilestones = [...prev.collectorMilestones, data.newMilestone];
                      }
                      return next;
                    });
                    if (data.newInsight || data.newMilestone) fetchChips();
                  })
                  .catch(() => {});
                return;
              }
              acc += decoder.decode(value, { stream: true });
              updateAgentMessage(assistantId, acc);
              read();
            });
          }
          read();
        })
        .catch(() => {
          updateAgentMessage(assistantId, "Erreur de connexion. Réessayez.");
          setLoading(false);
        });
    },
    [
      loading,
      history,
      identity,
      keywords,
      agent.currentContext,
      agent.memory,
      top3Memory,
      savedArtworksNames,
      appendAgentMessage,
      updateAgentMessage,
      setAgentMemory,
      fetchChips,
    ]
  );

  const handleBarSubmit = useCallback(() => {
    if (inputValue.trim()) {
      setAgentOpen(true);
      sendMessage(inputValue);
    }
  }, [inputValue, setAgentOpen, sendMessage]);

  const handlePanelSubmit = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleSelectChip = useCallback(
    (chip: string) => {
      setInputValue(chip);
      setAgentOpen(true);
    },
    [setAgentOpen]
  );

  const handleDragDown = useCallback(() => {
    setAgentOpen(false);
  }, [setAgentOpen]);

  const displayMessages = history;

  return (
    <>
      <AgentFloatingBar
        screen={screen}
        entityName={entityName}
        placeholderIndex={placeholderIndex}
        onPlaceholderIndexChange={setPlaceholderIndex}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onFocus={() => setAgentOpen(true)}
        onSubmit={handleBarSubmit}
        pulse={pulse}
      />

      {agent.isOpen && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setAgentOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setAgentOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              animation: "backdropFade 300ms ease-out",
            }}
          />
          <div
            ref={panelRef}
            className="agent-panel-slide"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
            }}
          >
            <AgentPanel
              context={agent.currentContext}
              onDismissContext={() => setAgentContext(null)}
              messages={displayMessages}
              loading={loading}
              suggestedChips={suggestedChips}
              onSelectChip={handleSelectChip}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handlePanelSubmit}
              onDragDown={handleDragDown}
            />
          </div>
        </>
      )}

    </>
  );
}
