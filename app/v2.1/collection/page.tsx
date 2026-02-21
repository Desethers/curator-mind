"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAppStateV21 } from "../../../context/AppStateContextV21";
import { theme } from "../../../lib/theme";
import { V2_GALLERIES, V2_GALLERY_IDS } from "../../../lib/v2-galleries";
import { ShareIdentityCard } from "../../../components/v21/ShareIdentityCard";

const t = theme;
const COLLECTION_INSIGHT_FALLBACK =
  "Ces œuvres partagent quelque chose. Un goût pour ce qui ne se résout pas facilement. Vous construisez quelque chose.";

export default function CollectionPage() {
  const {
    savedArtworks,
    collectorProfile,
    setAgentContext,
    setAgentOpen,
  } = useAppStateV21();
  const [insightText, setInsightText] = useState(COLLECTION_INSIGHT_FALLBACK);
  const [shareCardOpen, setShareCardOpen] = useState(false);
  const galleryMatchesRef = useRef<HTMLDivElement>(null);

  const openCurateurForCollection = useCallback(() => {
    setAgentContext({
      screen: "collection",
      entityId: null,
      entityName: null,
      entityType: null,
      description: null,
    });
    setAgentOpen(true);
  }, [setAgentContext, setAgentOpen]);

  useEffect(() => {
    if (savedArtworks.length < 2) return;
    const payload = {
      identity: collectorProfile.identity ?? "not yet revealed",
      savedArtworks: savedArtworks.map((a) => ({ title: a.title, keywords: a.keywords })),
    };
    fetch("/api/collection-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data: { text?: string }) => {
        if (data.text) setInsightText(data.text);
      })
      .catch(() => {});
  }, [savedArtworks.length, collectorProfile.identity, savedArtworks]);

  const galleryIdsFromSaved = Array.from(
    new Set(savedArtworks.map((a) => a.galleryId).filter(Boolean))
  ).slice(0, 3);
  const galleryMatches = V2_GALLERY_IDS.filter((id) => galleryIdsFromSaved.includes(id)).map(
    (id) => V2_GALLERIES[id]
  );

  const identityForShare =
    collectorProfile.identity ?? "Vous construisez quelque chose.";
  const keywordsForShare =
    collectorProfile.keywords?.length >= 3
      ? collectorProfile.keywords.slice(0, 3)
      : Array.from(
          new Set(savedArtworks.flatMap((a) => a.keywords))
        ).slice(0, 3);

  return (
    <div style={{ paddingBottom: 100 }}>
      {savedArtworks.length > 0 && (
        <>
          <div
            style={{
              marginBottom: 24,
              padding: 20,
              backgroundColor: t.colors.accentSoft,
              border: `1px solid ${t.colors.accentBorder}`,
              borderRadius: 16,
            }}
          >
            <h2
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: t.colors.inkMuted,
                marginBottom: 8,
              }}
            >
              CURATEUR SUR VOTRE COLLECTION
            </h2>
            <p
              style={{
                fontFamily: t.fonts.serif,
                fontStyle: "italic",
                fontSize: 16,
                color: t.colors.ink,
                margin: "0 0 16px",
                lineHeight: 1.45,
              }}
            >
              {savedArtworks.length >= 2 ? insightText : COLLECTION_INSIGHT_FALLBACK}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                onClick={openCurateurForCollection}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${t.colors.border}`,
                  backgroundColor: t.colors.surface,
                  fontFamily: t.fonts.sans,
                  fontSize: 12,
                  color: t.colors.inkSoft,
                  cursor: "pointer",
                }}
              >
                ◈ En parler
              </button>
              <button
                type="button"
                onClick={() => galleryMatchesRef.current?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${t.colors.border}`,
                  backgroundColor: t.colors.surface,
                  fontFamily: t.fonts.sans,
                  fontSize: 12,
                  color: t.colors.inkSoft,
                  cursor: "pointer",
                }}
              >
                ○ Mes galeries
              </button>
              <button
                type="button"
                onClick={() => setShareCardOpen(true)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${t.colors.border}`,
                  backgroundColor: t.colors.surface,
                  fontFamily: t.fonts.sans,
                  fontSize: 12,
                  color: t.colors.inkSoft,
                  cursor: "pointer",
                }}
              >
                ↗ Partager
              </button>
            </div>
          </div>
        </>
      )}

      {savedArtworks.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40vh",
            textAlign: "center",
            padding: 24,
          }}
        >
          <p
            style={{
              fontFamily: t.fonts.serif,
              fontStyle: "italic",
              fontSize: 24,
              color: t.colors.inkSoft,
              margin: "0 0 16px",
              lineHeight: 1.35,
            }}
          >
            Votre collection commence
            <br />
            au prochain regard.
          </p>
          <Link
            href="/v2.1/browse"
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 14,
              color: t.colors.accent,
              fontWeight: 500,
            }}
          >
            Explorer les œuvres →
          </Link>
        </div>
      ) : (
        <>
          <h1
            style={{
              fontFamily: t.fonts.serif,
              fontSize: 22,
              color: t.colors.ink,
              marginBottom: 16,
            }}
          >
            Vos œuvres sauvegardées
          </h1>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {savedArtworks.map((a) => (
              <li key={a.id} style={{ marginBottom: 12 }}>
                <Link
                  href={`/v2.1/œuvre/${a.id}`}
                  style={{
                    display: "block",
                    padding: 16,
                    background: t.colors.surface,
                    border: `1px solid ${t.colors.accentBorder}`,
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <span style={{ fontFamily: t.fonts.serif, fontWeight: 500 }}>{a.title}</span>
                  <span style={{ fontSize: 13, color: t.colors.inkSoft }}>
                    {" "}
                    — {a.artist}, {a.gallery}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {galleryMatches.length > 0 && (
            <div ref={galleryMatchesRef} style={{ marginTop: 32, paddingTop: 24 }}>
              <h2
                style={{
                  fontFamily: t.fonts.sans,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.colors.inkMuted,
                  marginBottom: 12,
                }}
              >
                GALERIES POUR VOTRE COLLECTION
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {galleryMatches.map((g) => (
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
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {shareCardOpen && (
        <ShareIdentityCard
          identity={identityForShare}
          keywords={keywordsForShare.length ? keywordsForShare : ["contemporain", "émergent", "regard"]}
          onClose={() => setShareCardOpen(false)}
        />
      )}
    </div>
  );
}
