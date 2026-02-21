"use client";

import { useState, useEffect } from "react";
import type { V2Gallery } from "../../lib/v2-galleries";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { V21_ARTWORKS } from "../../lib/v21-artworks";
import { theme } from "../../lib/theme";

const t = theme;
const VISIT_KIT_CARD3_FALLBACK =
  "Avec votre profil, prenez le temps de regarder les œuvres les plus récentes. Ce sont souvent celles qui correspondent le mieux à un regard en formation.";

export function VisitKit({
  gallery,
  onRaconterVisite,
  isFirstOpen,
}: {
  gallery: V2Gallery;
  onRaconterVisite: () => void;
  isFirstOpen: boolean;
}) {
  const { collectorProfile, recordVisitKitOpened } = useAppStateV21();
  const [card3Text, setCard3Text] = useState<string>(VISIT_KIT_CARD3_FALLBACK);
  const [card3Loaded, setCard3Loaded] = useState(false);

  useEffect(() => {
    recordVisitKitOpened(gallery.id);
  }, [gallery.id, recordVisitKitOpened]);

  useEffect(() => {
    const identity = collectorProfile.identity ?? "not yet revealed";
    const keywords = collectorProfile.keywords?.length
      ? collectorProfile.keywords.join(", ")
      : "building...";
    const artists = V21_ARTWORKS.filter((a) => a.galleryId === gallery.id)
      .map((a) => a.artist)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 5)
      .join(", ");

    fetch("/api/visit-kit-suggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity,
        keywords,
        galleryName: gallery.name,
        exhibitionName: gallery.exhibition,
        galleryArtists: artists || "artistes de la galerie",
      }),
    })
      .then((r) => r.json())
      .then((data: { text?: string }) => {
        if (data.text) setCard3Text(data.text);
        setCard3Loaded(true);
      })
      .catch(() => setCard3Loaded(true));
  }, [gallery.id, gallery.name, gallery.exhibition, collectorProfile.identity, collectorProfile.keywords]);

  const kit = gallery.visitKit;
  if (!kit) return null;

  const cardStyle = {
    backgroundColor: t.colors.surface,
    border: `1px solid ${t.colors.border}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  };

  return (
    <section style={{ marginBottom: 24 }}>
      {isFirstOpen && (
        <div
          style={{
            backgroundColor: t.colors.greenSoft,
            color: t.colors.green,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontFamily: t.fonts.sans,
            fontSize: 13,
          }}
        >
          Vous êtes prêt. La plupart des collectionneurs se préparent exactement comme ça.
        </div>
      )}
      <h2
        style={{
          fontFamily: t.fonts.sans,
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: t.colors.inkMuted,
          margin: "0 0 16px",
          paddingBottom: 12,
          borderBottom: `1px solid ${t.colors.border}`,
        }}
      >
        PRÉPARER MA VISITE
      </h2>

      <div style={cardStyle}>
        <span style={{ marginRight: 8 }}>○</span>
        <span style={{ fontFamily: t.fonts.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: t.colors.inkMuted }}>Avant d&apos;entrer</span>
        <p style={{ fontFamily: t.fonts.sans, fontSize: 14, color: t.colors.ink, margin: "8px 0 0", lineHeight: 1.5 }}>
          {kit.beforeEnter}
        </p>
      </div>

      <div style={cardStyle}>
        <span style={{ marginRight: 8 }}>→</span>
        <span style={{ fontFamily: t.fonts.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: t.colors.inkMuted }}>Quand vous entrez</span>
        <p style={{ fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 15, color: t.colors.ink, margin: "8px 0 0" }}>
          &quot;{kit.phraseToSay}&quot;
        </p>
        <p style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.colors.inkMuted, margin: "6px 0 0" }}>
          → La réponse est presque toujours oui.
        </p>
      </div>

      <div style={cardStyle}>
        <span style={{ marginRight: 8 }}>◉</span>
        <span style={{ fontFamily: t.fonts.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: t.colors.inkMuted }}>Ce que vous cherchez</span>
        <p style={{ fontFamily: t.fonts.sans, fontSize: 14, color: t.colors.ink, margin: "8px 0 0", lineHeight: 1.5 }}>
          {card3Loaded ? card3Text : VISIT_KIT_CARD3_FALLBACK}
        </p>
      </div>

      <div style={cardStyle}>
        <span style={{ marginRight: 8 }}>◈</span>
        <span style={{ fontFamily: t.fonts.sans, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: t.colors.inkMuted }}>Si quelqu&apos;un vous parle</span>
        <p style={{ fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 15, color: t.colors.ink, margin: "8px 0 0" }}>
          {kit.icebreaker}
        </p>
      </div>

      <button
        type="button"
        onClick={onRaconterVisite}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: t.fonts.sans,
          fontSize: 14,
          color: t.colors.accent,
          cursor: "pointer",
          marginTop: 4,
        }}
      >
        ◈ Racontez votre visite à Curateur →
      </button>
    </section>
  );
}
