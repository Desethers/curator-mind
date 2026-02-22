"use client";

import { useState, useCallback } from "react";
import { theme } from "../../lib/theme";
import { searchArtists } from "../../lib/search-artists";
import type { Artist } from "../../lib/v21-artists";

const t = theme;

const HUMEUR_CHIPS = ["Calme", "Vibrant", "Mystérieux", "Joyeux", "Intime", "Puissant"];
const ESPACE_CHIPS = ["Salon", "Bureau", "Chambre", "Entrée", "Cuisine"];
const INSPIRATIONS = [
  "Quelque chose qui apaise",
  "Une œuvre qui prend tout l'espace",
  "Pour un premier achat",
  "Quelque chose de mystérieux",
  "Des textures que l'on veut toucher",
  "Un cadeau inoubliable",
];

const FALLBACK_KEYWORDS = ["calme", "textures", "cadeau", "moderne"];

export function SearchScreen({
  onArtistTap,
  onClose,
}: {
  onArtistTap: (artist: Artist) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const { artists, reasonByArtist } = searchArtists(query);
  const hasQuery = query.trim().length > 0;
  const hasResults = artists.length > 0;

  const handleChipClick = useCallback(
    (text: string) => {
      setQuery(text);
    },
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: t.colors.ink,
            fontSize: 18,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ←
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par humeur, espace, envie…"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: `1px solid ${t.colors.border}`,
            fontFamily: t.fonts.sans,
            fontSize: 15,
            color: t.colors.ink,
            outline: "none",
          }}
          autoFocus
        />
      </div>

      {!hasQuery && (
        <>
          <section>
            <h3
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 10,
              }}
            >
              Humeur
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {HUMEUR_CHIPS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleChipClick(label)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1px solid ${t.colors.accentBorder}`,
                    background: t.colors.surface,
                    color: t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 10,
              }}
            >
              Espace
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ESPACE_CHIPS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleChipClick(label)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1px solid ${t.colors.accentBorder}`,
                    background: t.colors.surface,
                    color: t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 10,
              }}
            >
              Inspirations
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INSPIRATIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleChipClick(label)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `1px solid ${t.colors.border}`,
                    background: t.colors.surface,
                    color: t.colors.ink,
                    fontFamily: t.fonts.sans,
                    fontSize: 14,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {hasQuery && hasResults && (
        <>
          <p
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 14,
              color: t.colors.inkSoft,
            }}
          >
            {artists.length} artiste{artists.length > 1 ? "s" : ""} correspondant
            {artists.length > 1 ? "s" : ""} avec « {query} »
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {artists.map((artist) => (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => onArtistTap(artist)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: 12,
                    border: `1px solid ${t.colors.border}`,
                    background: t.colors.surface,
                    textAlign: "left",
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 600, color: t.colors.ink, marginBottom: 4 }}>
                    {artist.name}
                  </div>
                  <div style={{ fontSize: 13, color: t.colors.inkSoft, marginBottom: 2 }}>
                    {artist.medium} · {artist.location}
                  </div>
                  {reasonByArtist.get(artist.id) && (
                    <div style={{ fontSize: 13, color: t.colors.inkMuted, marginTop: 6 }}>
                      {reasonByArtist.get(artist.id)}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasQuery && !hasResults && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              fontFamily: t.fonts.serif,
              fontSize: 18,
              fontStyle: "italic",
              color: t.colors.inkSoft,
              lineHeight: 1.5,
            }}
          >
            Aucun résultat pour « {query} ». Pas d'inquiétude — essayez un autre mot, l'art se découvre aussi par tâtonnement.
          </p>
          <p style={{ fontSize: 12, color: t.colors.inkMuted }}>
            Suggestions :
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FALLBACK_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handleChipClick(kw)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: `1px solid ${t.colors.accentBorder}`,
                  background: t.colors.accentSoft,
                  color: t.colors.accent,
                  fontFamily: t.fonts.sans,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
