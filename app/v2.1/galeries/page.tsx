"use client";

import { useRouter } from "next/navigation";
import { useAppStateV21 } from "../../../context/AppStateContextV21";
import { PARIS_GALLERIES_PGMAP } from "../../../lib/paris-galleries-pgmap";
import { theme } from "../../../lib/theme";
import { V2_GALLERIES } from "../../../lib/v2-galleries";

const t = theme;

function getExhibitionForGalleryName(name: string): string | null {
  const v2 = Object.values(V2_GALLERIES).find(
    (g) => g.name === name || g.name.endsWith(" " + name)
  );
  return v2?.exhibition ?? null;
}

export default function GaleriesPage() {
  const router = useRouter();
  const { collectorProfile } = useAppStateV21();

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
      <p
        style={{
          padding: "16px 20px 0",
          fontSize: 12,
          color: t.colors.inkMuted,
          margin: 0,
        }}
      >
        Paris Gallery Map — A→Z
      </p>
      <div style={{ padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {PARIS_GALLERIES_PGMAP.map((name) => {
          const exhibition = getExhibitionForGalleryName(name);
          return (
            <div
              key={name}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                backgroundColor: t.colors.surface,
                border: `1px solid ${t.colors.border}`,
                color: t.colors.ink,
                fontFamily: t.fonts.sans,
                fontSize: 15,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontWeight: 600 }}>{name}</span>
              {exhibition && (
                <span style={{ fontSize: 13, color: t.colors.inkSoft }}>
                  {exhibition}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
