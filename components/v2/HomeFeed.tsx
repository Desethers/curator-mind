"use client";

import Link from "next/link";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";
import { V2_GALLERIES, V2_GALLERY_IDS } from "../../lib/v2-galleries";

function identityToTwoWords(identity: string): string {
  if (!identity.trim()) return "—";
  const match = identity.match(/Vous collectionnez (.+?)\.?$/i);
  const part = match ? match[1].trim() : identity.trim();
  const words = part.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return part;
  return words.slice(-2).join(" ");
}

export function HomeFeed() {
  const { collectorIdentity, savedGalleries, agentHistory } = useAppState();
  const identityBadge = identityToTwoWords(collectorIdentity);
  const lastMessage = agentHistory.filter((m) => m.role === "assistant").pop();
  const preview = lastMessage
    ? lastMessage.content.slice(0, 60) + (lastMessage.content.length > 60 ? "…" : "")
    : null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: theme.layout.maxWidth,
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {collectorIdentity && (
        <section>
          <h2
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.colors.inkMuted,
              marginBottom: 12,
            }}
          >
            Votre identité
          </h2>
          <p
            style={{
              fontFamily: theme.fonts.serif,
              fontSize: 18,
              color: theme.colors.ink,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Vous collectionnez {identityBadge}.
          </p>
        </section>
      )}

      <section>
        <h2
          style={{
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: theme.colors.inkMuted,
            marginBottom: 16,
          }}
        >
          Galeries
        </h2>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {V2_GALLERY_IDS.map((id) => {
            const g = V2_GALLERIES[id];
            return (
              <li key={g.id}>
                <Link
                  href={`/v2/galerie/${g.id}`}
                  style={{
                    display: "block",
                    padding: 20,
                    borderRadius: 16,
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.accentBorder}`,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: theme.colors.inkMuted,
                    }}
                  >
                    {g.neighborhood}
                  </span>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 17,
                      color: theme.colors.ink,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    {g.name}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: theme.colors.inkSoft,
                      lineHeight: 1.4,
                    }}
                  >
                    {g.exhibition}
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 13,
                      color: theme.colors.inkMuted,
                      lineHeight: 1.45,
                    }}
                  >
                    {g.matchReason}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {savedGalleries.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.colors.inkMuted,
              marginBottom: 16,
            }}
          >
            Vos galeries sauvegardées
          </h2>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {savedGalleries.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/v2/galerie/${g.id}`}
                  style={{
                    display: "block",
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.accentBorder}`,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span style={{ fontWeight: 600, color: theme.colors.ink }}>{g.name}</span>
                  <span style={{ fontSize: 14, color: theme.colors.inkSoft }}> — {g.exhibition}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2
          style={{
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: theme.colors.inkMuted,
            marginBottom: 16,
          }}
        >
          Votre agent
        </h2>
        <Link
          href="/v2/curateur"
          style={{
            display: "block",
            borderRadius: 24,
            padding: 24,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.accentBorder}`,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: theme.colors.inkMuted,
              marginBottom: 4,
            }}
          >
            CURATEUR
          </div>
          <div style={{ fontSize: 16, color: theme.colors.ink, marginBottom: 8 }}>
            Continuez votre exploration
          </div>
          {preview && (
            <p style={{ fontSize: 14, color: theme.colors.inkSoft, margin: 0, lineHeight: 1.4 }}>
              {preview}
            </p>
          )}
          <span
            style={{
              display: "inline-block",
              marginTop: 12,
              fontSize: 14,
              fontWeight: 600,
              color: theme.colors.accent,
            }}
          >
            {agentHistory.length > 1 ? "Reprendre la conversation" : "Commencer"}
          </span>
        </Link>
      </section>
    </div>
  );
}
