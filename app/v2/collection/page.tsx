"use client";

import Link from "next/link";
import { useAppState } from "../../../context/AppStateContext";
import { theme } from "../../../lib/theme";

export default function V2CollectionPage() {
  const { savedGalleries } = useAppState();

  return (
    <div style={{ width: "100%", maxWidth: theme.layout.maxWidth }}>
      <h1
        style={{
          fontFamily: theme.fonts.serif,
          fontSize: 24,
          color: theme.colors.ink,
          marginBottom: 8,
        }}
      >
        Ma Collection
      </h1>
      <p
        style={{
          fontSize: 14,
          color: theme.colors.inkMuted,
          marginBottom: 24,
        }}
      >
        Les galeries que vous avez sauvegardées et votre profil de collectionneur.
      </p>

      {savedGalleries.length === 0 ? (
        <div
          style={{
            padding: 32,
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.accentBorder}`,
            textAlign: "center",
            color: theme.colors.inkMuted,
            fontSize: 14,
          }}
        >
          Aucune galerie sauvegardée. Utilisez « Préparer ma visite » sur une galerie
          pour la retrouver ici.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {savedGalleries.map((g) => (
            <Link
              key={g.id}
              href={`/v2/galerie/${g.id}`}
              style={{
                display: "block",
                padding: 16,
                borderRadius: 24,
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.accentBorder}`,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontFamily: theme.fonts.serif, fontSize: 18, color: theme.colors.ink }}>
                {g.name}
              </div>
              <div style={{ fontSize: 13, color: theme.colors.inkSoft }}>{g.exhibition}</div>
              <div style={{ fontSize: 12, color: theme.colors.inkMuted, marginTop: 4 }}>
                {g.neighborhood}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
