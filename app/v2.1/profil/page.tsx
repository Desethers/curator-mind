"use client";

import { useAppStateV21 } from "../../../context/AppStateContextV21";
import { agentTheme } from "../../../lib/agent-theme";
import { theme } from "../../../lib/theme";

const t = theme;
const at = agentTheme;

export default function ProfilPage() {
  const { collectorProfile, agent, setAgentContext, setAgentOpen, setAgentPreloadQuestion } =
    useAppStateV21();
  const identity = collectorProfile.identity;

  const openCurateurForIdentity = () => {
    if (!identity) return;
    setAgentContext({
      screen: "profile",
      entityId: null,
      entityName: null,
      entityType: null,
      description: null,
    });
    setAgentPreloadQuestion(`Qu'est-ce que « ${identity} » signifie pour vous ?`);
    setAgentOpen(true);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <h1
        style={{
          fontFamily: t.fonts.serif,
          fontSize: 22,
          color: t.colors.ink,
          marginBottom: 24,
        }}
      >
        Profil
      </h1>
      {identity ? (
        <div>
          <p style={{ fontSize: 11, color: t.colors.inkMuted, marginBottom: 6 }}>
            VOTRE IDENTITÉ DE COLLECTIONNEUR
          </p>
          <button
            type="button"
            onClick={openCurateurForIdentity}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              fontFamily: at.fonts.serif,
              fontSize: 18,
              fontStyle: "italic",
              color: at.colors.accent,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {identity}
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: t.colors.inkMuted }}>
          Complétez le quiz pour révéler votre profil de collectionneur.
        </p>
      )}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 11, color: t.colors.inkMuted, marginBottom: 12 }}>
          CE QUE CURATEUR SAIT DE VOUS
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {agent.memory.keyInsights.length === 0 ? (
            <li style={{ fontSize: 13, color: t.colors.inkSoft }}>
              Aucune insight pour l&apos;instant. Parlez avec Curateur pour qu&apos;il vous connaisse mieux.
            </li>
          ) : (
            agent.memory.keyInsights.map((insight, i) => (
              <li key={i} style={{ fontSize: 13, color: t.colors.inkSoft, marginBottom: 6 }}>
                {insight}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
