"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Artwork } from "../../lib/v21-artworks";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";
import { agentTheme } from "../../lib/agent-theme";

const t = theme;
const at = agentTheme;
const DWELL_MS = 5000;
const LONG_PRESS_MS = 500;

export function ArtworkCard({
  artwork,
  onDwellRecorded,
}: {
  artwork: Artwork;
  onDwellRecorded?: (artworkId: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dwellRecorded, setDwellRecorded] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addImplicitSignal, toggleSavedArtwork, isArtworkSaved, setAgentContext, setAgentOpen } =
    useAppStateV21();
  const saved = isArtworkSaved(artwork.id);

  const openCurateurWithArtwork = useCallback(() => {
    setAgentContext({
      screen: "artwork",
      entityId: String(artwork.id),
      entityName: artwork.title,
      entityType: "artwork",
      description: `${artwork.artist}, ${artwork.gallery}, ${artwork.price}`,
    });
    setAgentOpen(true);
    setActionSheetOpen(false);
  }, [artwork, setAgentContext, setAgentOpen]);

  const handleLongPress = useCallback(() => {
    setActionSheetOpen(true);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      cancelLongPress();
      longPressTimer.current = setTimeout(handleLongPress, LONG_PRESS_MS);
    },
    [handleLongPress, cancelLongPress]
  );

  const endLongPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      cancelLongPress();
    },
    [cancelLongPress]
  );

  useEffect(() => () => cancelLongPress(), [cancelLongPress]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || dwellRecorded) return;
    let timeoutId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e) return;
        if (e.isIntersecting) {
          timeoutId = window.setTimeout(() => {
            addImplicitSignal({
              type: "dwell",
              artworkId: artwork.id,
              keywords: artwork.keywords,
            });
            setDwellRecorded(true);
            onDwellRecorded?.(artwork.id);
            timeoutId = null;
          }, DWELL_MS);
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [artwork.id, artwork.keywords, addImplicitSignal, dwellRecorded, onDwellRecorded]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addImplicitSignal({ type: "save", artworkId: artwork.id, keywords: artwork.keywords });
    toggleSavedArtwork(artwork);
  };

  return (
    <>
      <Link
        href={`/v2.1/œuvre/${artwork.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div
          ref={cardRef}
          onMouseDown={startLongPress}
          onMouseUp={endLongPress}
          onMouseLeave={endLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={endLongPress}
          onTouchCancel={endLongPress}
          style={{
            width: "100%",
            borderRadius: 0,
            overflow: "hidden",
            position: "relative",
            aspectRatio: "3/4",
          }}
        >
        {/* Palette color block */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {artwork.palette.map((color, i) => (
            <div
              key={i}
              style={{
                width: "50%",
                height: "50%",
                backgroundColor: color,
              }}
            />
          ))}
        </div>
        {/* Gradient overlay bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(transparent 30%, rgba(0,0,0,0.85) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Retirer des favoris" : "Sauvegarder"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(0,0,0,0.4)",
            color: saved ? t.colors.accent : t.colors.ink,
            fontSize: 20,
            cursor: "pointer",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
        {/* Artist + gallery bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            right: 100,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: t.fonts.serif,
              fontSize: 15,
              color: t.colors.ink,
              fontWeight: 500,
            }}
          >
            {artwork.artist}
          </div>
          <div style={{ fontSize: 12, color: t.colors.inkSoft }}>{artwork.gallery}</div>
          {artwork.socialProof && (
            <div
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}
            >
              {(() => {
                const sp = artwork.socialProof;
                const variant = artwork.id % 3;
                if (variant === 0) return `${sp.saves} collectionneurs ont sauvegardé cette œuvre`;
                if (variant === 1) return `Vu ${sp.weeklyViews} fois cette semaine`;
                return `${sp.similarProfiles} profils similaires au vôtre suivent cet artiste`;
              })()}
            </div>
          )}
        </div>
        {/* Price bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 16,
            fontSize: 12,
            color: t.colors.inkSoft,
            zIndex: 1,
          }}
        >
          {artwork.price}
        </div>
      </div>
    </Link>

      {actionSheetOpen && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActionSheetOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 800,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 16,
              right: 16,
              bottom: 100,
              zIndex: 801,
              background: at.colors.bg,
              borderRadius: 16,
              padding: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              display: "flex",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => {
                addImplicitSignal({ type: "save", artworkId: artwork.id, keywords: artwork.keywords });
                toggleSavedArtwork(artwork);
                setActionSheetOpen(false);
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${at.colors.border}`,
                background: at.colors.surface,
                color: at.colors.ink,
                fontSize: 14,
                fontFamily: at.fonts.sans,
                cursor: "pointer",
              }}
            >
              ♡ Sauvegarder
            </button>
            <button
              type="button"
              onClick={openCurateurWithArtwork}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                background: at.colors.ink,
                color: at.colors.bg,
                fontSize: 14,
                fontFamily: at.fonts.sans,
                cursor: "pointer",
              }}
            >
              ◈ En parler avec Curateur
            </button>
          </div>
        </>
      )}
    </>
  );
}
