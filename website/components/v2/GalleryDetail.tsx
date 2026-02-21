"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";
import { V2_GALLERIES } from "../../lib/v2-galleries";

export function GalleryDetail({ galleryId }: { galleryId: string }) {
  const { collectorIdentity, keywords } = useAppState();
  const [conversationStarter, setConversationStarter] = useState<string | null>(null);

  const gallery = V2_GALLERIES[galleryId] || V2_GALLERIES.perrotin;

  useEffect(() => {
    fetch("/api/gallery-conversation-starter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        galleryId,
        identity: collectorIdentity,
        keywords,
      }),
    })
      .then((r) => r.json())
      .then((data) => setConversationStarter(data.sentence || null))
      .catch(() => setConversationStarter(null));
  }, [galleryId, collectorIdentity, keywords]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gallery.address)}`;

  return (
    <div style={{ width: "100%", maxWidth: theme.layout.maxWidth }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: 26,
            color: theme.colors.ink,
            marginBottom: 6,
          }}
        >
          {gallery.name}
        </h1>
        <p
          style={{
            fontFamily: theme.fonts.serif,
            fontStyle: "italic",
            fontSize: 16,
            color: theme.colors.inkSoft,
            marginBottom: 16,
          }}
        >
          {gallery.exhibition}
        </p>
        <p style={{ fontSize: 14, color: theme.colors.inkMuted, lineHeight: 1.5 }}>
          {gallery.matchReason}
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: theme.colors.inkMuted,
            marginBottom: 12,
          }}
        >
          Ce qu&apos;on y voit
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {gallery.bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontSize: 14,
                color: theme.colors.inkSoft,
                lineHeight: 1.6,
                marginBottom: 6,
              }}
            >
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: theme.colors.inkMuted,
            marginBottom: 12,
          }}
        >
          Comment y aller
        </h2>
        <p style={{ fontSize: 14, color: theme.colors.ink, marginBottom: 4 }}>
          {gallery.address}
        </p>
        <p style={{ fontSize: 13, color: theme.colors.inkSoft }}>
          {gallery.arrondissement} · Métro {gallery.metro}
        </p>
      </section>

      {conversationStarter && (
        <section style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.colors.inkMuted,
              marginBottom: 12,
            }}
          >
            Ce que vous pourriez dire en entrant
          </h2>
          <p
            style={{
              fontFamily: theme.fonts.serif,
              fontStyle: "italic",
              fontSize: 15,
              color: theme.colors.ink,
              lineHeight: 1.5,
            }}
          >
            {conversationStarter}
          </p>
        </section>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            padding: "16px 24px",
            borderRadius: 12,
            backgroundColor: theme.colors.ink,
            color: theme.colors.bg,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
          }}
        >
          Ouvrir dans Plans
        </a>
        <Link
          href="/v2/curateur"
          style={{
            display: "block",
            padding: "16px 24px",
            borderRadius: 12,
            border: `1px solid ${theme.colors.accentBorder}`,
            color: theme.colors.ink,
            textAlign: "center",
            fontWeight: 500,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          En parler avec Curateur
        </Link>
      </div>
    </div>
  );
}
