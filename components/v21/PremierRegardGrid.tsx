"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { V21_ARTWORKS } from "../../lib/v21-artworks";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { ArtPiece } from "./ArtPiece";
import { theme } from "../../lib/theme";

const t = theme;
const PREMIER_REGARD_ARTWORKS = V21_ARTWORKS.slice(0, 6);

export function PremierRegardGrid({ onTransition }: { onTransition: () => void }) {
  const router = useRouter();
  const { addImplicitSignal, completeOnboardingWithSignals } = useAppStateV21();
  const [tappedIds, setTappedIds] = useState<Set<number>>(new Set());
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleTap = useCallback(
    (artworkId: number, keywords: string[]) => {
      addImplicitSignal({ type: "dwell", artworkId, keywords });
      setTappedIds((prev) => {
        const next = new Set(prev);
        next.add(artworkId);
        if (next.size >= 5) {
          const signals = Array.from(next).map((id) => {
            const a = PREMIER_REGARD_ARTWORKS.find((x) => x.id === id);
            return { type: "dwell" as const, artworkId: id, keywords: a?.keywords ?? [], at: Date.now() };
          });
          completeOnboardingWithSignals(signals.slice(0, 5));
          setOverlayVisible(true);
          setTimeout(() => {
            setTransitioning(true);
            onTransition();
            router.replace("/v2.1/browse");
          }, 800);
          return next;
        }
        if (next.size >= 3) {
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
          const signals = Array.from(next).map((id) => {
            const a = PREMIER_REGARD_ARTWORKS.find((x) => x.id === id);
            return { type: "dwell" as const, artworkId: id, keywords: a?.keywords ?? [], at: Date.now() };
          });
          completeOnboardingWithSignals(signals);
          setOverlayVisible(true);
          setTimeout(() => {
            setTransitioning(true);
            onTransition();
            router.replace("/v2.1/browse");
          }, 1500);
        }
        return next;
      });
    },
    [addImplicitSignal, completeOnboardingWithSignals, onTransition, router]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: t.colors.bg,
        display: "flex",
        flexDirection: "column",
        paddingTop: 20,
        paddingBottom: 24,
      }}
    >
      <p
        style={{
          fontFamily: t.fonts.serif,
          fontStyle: "italic",
          fontSize: 18,
          color: t.colors.inkSoft,
          textAlign: "center",
          margin: "0 20px 16px",
          padding: "0 20px",
        }}
      >
        Prenez le temps de regarder.
        <br />
        Tapez ce qui vous parle.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          flex: 1,
          minHeight: 0,
        }}
      >
        {PREMIER_REGARD_ARTWORKS.map((artwork) => (
          <ArtPiece
            key={artwork.id}
            artwork={artwork}
            selected={tappedIds.has(artwork.id)}
            onTap={() => handleTap(artwork.id, artwork.keywords)}
          />
        ))}
      </div>

      {overlayVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            animation: "valueTeaserFade 0.3s ease-out",
            pointerEvents: transitioning ? "none" : "auto",
          }}
        >
          <p
            style={{
              fontFamily: t.fonts.serif,
              fontStyle: "italic",
              fontSize: 26,
              color: t.colors.ink,
              textAlign: "center",
              margin: 0,
              padding: 24,
            }}
          >
            On commence à vous connaître.
          </p>
        </div>
      )}
    </div>
  );
}
