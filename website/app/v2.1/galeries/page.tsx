"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../../context/AppStateContextV21";
import { V2_GALLERIES, V2_GALLERY_IDS } from "../../../lib/v2-galleries";
import { theme } from "../../../lib/theme";

const t = theme;

export default function GaleriesPage() {
  const router = useRouter();
  const { collectorProfile, savedGalleries } = useAppStateV21();

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
        <span
          style={{
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: 18,
            color: t.colors.ink,
          }}
        >
          Galeries
        </span>
        <span style={{ width: 32 }} />
      </header>
      {collectorProfile.profileComplete && collectorProfile.bridge && (
        <p
          style={{
            padding: "20px 20px 0",
            fontSize: 14,
            color: t.colors.inkSoft,
            lineHeight: 1.5,
          }}
        >
          {collectorProfile.bridge}
        </p>
      )}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {V2_GALLERY_IDS.map((id) => {
          const g = V2_GALLERIES[id];
          const isSaved = savedGalleries.some((s) => s.id === g.id);
          return (
            <Link
              key={g.id}
              href={`/v2.1/galerie/${g.id}`}
              style={{
                display: "block",
                padding: 20,
                borderRadius: 16,
                backgroundColor: t.colors.surface,
                border: `1px solid ${t.colors.accentBorder}`,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.colors.inkMuted,
                }}
              >
                {g.neighborhood}
              </span>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 17,
                  color: t.colors.ink,
                  marginTop: 4,
                  marginBottom: 4,
                }}
              >
                {g.name}
              </div>
              <p style={{ margin: 0, fontSize: 14, color: t.colors.inkSoft, lineHeight: 1.4 }}>
                {g.exhibition}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: t.colors.inkMuted }}>
                {g.matchReason}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
