"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { V21_ARTWORKS } from "../../../../lib/v21-artworks";
import { useAppStateV21 } from "../../../../context/AppStateContextV21";
import { theme } from "../../../../lib/theme";
import { agentTheme } from "../../../../lib/agent-theme";

const t = theme;
const at = agentTheme;

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const artwork = V21_ARTWORKS.find((a) => a.id === id);
  const { toggleSavedArtwork, isArtworkSaved, addImplicitSignal, setAgentContext, setAgentOpen } = useAppStateV21();
  const saved = artwork ? isArtworkSaved(artwork.id) : false;

  const openCurateur = () => {
    if (!artwork) return;
    setAgentContext({
      screen: "artwork",
      entityId: String(artwork.id),
      entityName: artwork.title,
      entityType: "artwork",
      description: `${artwork.artist}, ${artwork.gallery}, ${artwork.price}`,
    });
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
      {artwork.socialProof && (
        <div style={{ padding: "12px 20px 0" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              backgroundColor: t.colors.greenSoft,
              color: t.colors.green,
              fontFamily: t.fonts.sans,
              fontSize: 12,
            }}
          >
            ♡ {artwork.socialProof.saves} collectionneurs ont sauvegardé cette œuvre
          </span>
        </div>
      )}
      <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt=""
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }}>
            {artwork.palette.map((color, i) => (
              <div
                key={i}
                style={{ width: "50%", height: "50%", backgroundColor: color }}
              />
            ))}
          </div>
        )}
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
            onClick={openCurateur}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              fontFamily: t.fonts.sans,
              fontSize: 14,
              color: at.colors.accent,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            ◈ En parler avec Curateur →
          </button>
        </div>
      </div>
    </div>
  );
}
