"use client";

import Link from "next/link";
import { useAppStateV21 } from "../../../context/AppStateContextV21";
import { agentTheme } from "../../../lib/agent-theme";
import { theme } from "../../../lib/theme";

const t = theme;
const at = agentTheme;

export default function CollectionPage() {
  const { savedArtworks, setAgentContext, setAgentOpen } = useAppStateV21();

  const openCurateurForCollection = () => {
    setAgentContext({
      screen: "collection",
      entityId: null,
      entityName: null,
      entityType: null,
      description: null,
    });
    setAgentOpen(true);
  };

  const summarySentence =
    savedArtworks.length === 0
      ? "Sauvegardez des œuvres pour voir votre collection."
      : savedArtworks.length === 1
        ? "Une œuvre vous attire pour l’instant."
        : `${savedArtworks.length} œuvres composent votre sélection.`;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          marginBottom: 24,
          padding: 20,
          background: at.colors.surface,
          border: `1px solid ${at.colors.border}`,
          borderRadius: 16,
        }}
      >
        <h2
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: at.colors.inkMuted,
            marginBottom: 8,
            fontFamily: t.fonts.sans,
          }}
        >
          CURATEUR SUR VOTRE COLLECTION
        </h2>
        <p
          style={{
            fontSize: 14,
            color: at.colors.inkSoft,
            margin: "0 0 12px",
            lineHeight: 1.5,
          }}
        >
          {summarySentence}
        </p>
        <button
          type="button"
          onClick={openCurateurForCollection}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            fontFamily: t.fonts.sans,
            fontSize: 14,
            color: at.colors.accent,
            cursor: "pointer",
          }}
        >
          Explorer avec Curateur →
        </button>
      </div>

      <h1
        style={{
          fontFamily: t.fonts.serif,
          fontSize: 22,
          color: t.colors.ink,
          marginBottom: 16,
        }}
      >
        Vos œuvres sauvegardées
      </h1>
      {savedArtworks.length === 0 ? (
        <p style={{ fontSize: 14, color: t.colors.inkMuted }}>
          Vous n&apos;avez pas encore sauvegardé d&apos;œuvre. Explorez le fil pour en ajouter.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {savedArtworks.map((a) => (
            <li key={a.id} style={{ marginBottom: 12 }}>
              <Link
                href={`/v2.1/œuvre/${a.id}`}
                style={{
                  display: "block",
                  padding: 16,
                  background: t.colors.surface,
                  border: `1px solid ${t.colors.accentBorder}`,
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span style={{ fontFamily: t.fonts.serif, fontWeight: 500 }}>{a.title}</span>
                <span style={{ fontSize: 13, color: t.colors.inkSoft }}> — {a.artist}, {a.gallery}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
