"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStateV21 } from "../../../../context/AppStateContextV21";
import { V2_GALLERIES } from "../../../../lib/v2-galleries";
import { theme } from "../../../../lib/theme";
import { agentTheme } from "../../../../lib/agent-theme";

const t = theme;
const at = agentTheme;

export default function GalerieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id ?? "");
  const gallery = V2_GALLERIES[id] || V2_GALLERIES.perrotin;
  const { addSavedGallery, setAgentContext, setAgentOpen, setAgentPreloadQuestion } = useAppStateV21();

  const openCurateurForVisit = () => {
    setAgentContext({
      screen: "gallery",
      entityId: gallery.id,
      entityName: gallery.name,
      entityType: "gallery",
      description: gallery.exhibition,
    });
    setAgentPreloadQuestion(`Je visite ${gallery.name} bientôt.`);
    setAgentOpen(true);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gallery.address)}`;

  const handleSave = () => {
    addSavedGallery(gallery);
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <header
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${t.colors.accentBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
        <span style={{ width: 32 }} />
      </header>
      <div style={{ padding: "20px 20px 24px" }}>
        <h1
          style={{
            fontFamily: t.fonts.serif,
            fontSize: 24,
            color: t.colors.ink,
            margin: "0 0 8px",
          }}
        >
          {gallery.name}
        </h1>
        <p
          style={{
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 16,
            color: t.colors.inkSoft,
            margin: "0 0 16px",
          }}
        >
          {gallery.exhibition}
        </p>
        <p style={{ fontSize: 14, color: t.colors.inkMuted, lineHeight: 1.5, margin: "0 0 24px" }}>
          {gallery.matchReason}
        </p>
        <section style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: t.colors.inkMuted,
              marginBottom: 12,
            }}
          >
            Ce qu&apos;on y voit
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {gallery.bullets.map((b, i) => (
              <li key={i} style={{ fontSize: 14, color: t.colors.inkSoft, lineHeight: 1.6, marginBottom: 6 }}>
                {b}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: t.colors.inkMuted,
              marginBottom: 12,
            }}
          >
            Comment y aller
          </h2>
          <p style={{ fontSize: 14, color: t.colors.ink, margin: "0 0 4px" }}>{gallery.address}</p>
          <p style={{ fontSize: 13, color: t.colors.inkSoft }}>
            {gallery.arrondissement} · Métro {gallery.metro}
          </p>
        </section>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "16px 24px",
              borderRadius: 12,
              backgroundColor: t.colors.ink,
              color: t.colors.bg,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Ouvrir dans Plans
          </a>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "16px 24px",
              borderRadius: 12,
              border: `1px solid ${t.colors.accentBorder}`,
              backgroundColor: "transparent",
              color: t.colors.accent,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Ajouter à ma collection
          </button>
          <button
            type="button"
            onClick={openCurateurForVisit}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 0",
              border: "none",
              background: "none",
              color: at.colors.accent,
              fontSize: 14,
              fontFamily: t.fonts.sans,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            ◈ Préparer avec Curateur →
          </button>
        </div>
      </div>
    </div>
  );
}
