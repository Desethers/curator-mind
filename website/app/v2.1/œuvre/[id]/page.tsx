"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { V21_ARTWORKS } from "../../../../lib/v21-artworks";
import { useAppStateV21 } from "../../../../context/AppStateContextV21";
import { theme } from "../../../../lib/theme";
import { agentTheme } from "../../../../lib/agent-theme";

const t = theme;
const at = agentTheme;

const ARTWORK_QUESTION_CHIPS = [
  "Cette œuvre me correspond ?",
  "Comment savoir si c'est le bon prix ?",
  "Qu'est-ce que je ressentirais avec ça chez moi ?",
];

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const artwork = V21_ARTWORKS.find((a) => a.id === id);
  const { toggleSavedArtwork, isArtworkSaved, addImplicitSignal, setAgentContext, setAgentOpen, setAgentPreloadQuestion } = useAppStateV21();
  const saved = artwork ? isArtworkSaved(artwork.id) : false;

  const openCurateurWithQuestion = (question: string) => {
    if (!artwork) return;
    setAgentContext({
      screen: "artwork",
      entityId: String(artwork.id),
      entityName: artwork.title,
      entityType: "artwork",
      description: `${artwork.artist}, ${artwork.gallery}, ${artwork.price}`,
    });
    setAgentPreloadQuestion(question);
    setAgentOpen(true);
  };

  if (!artwork) {
    return (
      <div style={{ padding: 24, color: t.colors.ink }}>
        <button type="button" onClick={() => router.back()} style={{ marginBottom: 16 }}>
          ← Retour
        </button>
        <p>Œuvre introuvable.</p>
      </div>
    );
  }

  const handleSave = () => {
    addImplicitSignal({ type: "save", artworkId: artwork.id, keywords: artwork.keywords });
    toggleSavedArtwork(artwork);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${t.colors.accentBorder}`,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: t.colors.ink,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Retirer des favoris" : "Sauvegarder"}
          style={{
            background: "none",
            border: "none",
            color: saved ? t.colors.accent : t.colors.ink,
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
      </header>
      <div style={{ aspectRatio: "3/4", position: "relative", display: "flex", flexWrap: "wrap" }}>
        {artwork.palette.map((color, i) => (
          <div
            key={i}
            style={{ width: "50%", height: "50%", backgroundColor: color }}
          />
        ))}
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <h1
          style={{
            fontFamily: t.fonts.serif,
            fontSize: 24,
            color: t.colors.ink,
            margin: "0 0 8px",
          }}
        >
          {artwork.title}
        </h1>
        <p style={{ fontSize: 16, color: t.colors.inkSoft, margin: "0 0 4px" }}>
          {artwork.artist}
        </p>
        <p style={{ fontSize: 14, color: t.colors.inkMuted, margin: "0 0 20px" }}>
          {artwork.gallery} · {artwork.price}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {ARTWORK_QUESTION_CHIPS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => openCurateurWithQuestion(q)}
              style={{
                padding: "8px 14px",
                fontSize: 12,
                fontFamily: at.fonts.sans,
                color: at.colors.inkSoft,
                background: at.colors.surface,
                border: `1px solid ${at.colors.border}`,
                borderRadius: 100,
                cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link
            href={`/v2.1/galerie/${artwork.galleryId}`}
            style={{
              display: "block",
              padding: "16px 24px",
              borderRadius: 12,
              backgroundColor: t.colors.ink,
              color: t.colors.bg,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Voir la galerie
          </Link>
          <button
            type="button"
            onClick={() => openCurateurWithQuestion("")}
            style={{
              display: "block",
              width: "100%",
              padding: "16px 24px",
              borderRadius: 12,
              border: `1px solid ${at.colors.border}`,
              color: t.colors.ink,
              textAlign: "center",
              fontSize: 15,
              fontFamily: t.fonts.sans,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            En parler avec Curateur
          </button>
        </div>
      </div>
    </div>
  );
}
