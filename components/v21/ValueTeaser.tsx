"use client";

import { useState, useEffect, useCallback } from "react";
import { theme } from "../../lib/theme";

const t = theme;
const TEASER_BG = "#0C0B0A";
const TEASER_INK = "#F2EDE8";
const MUTED = "rgba(242,237,232,0.6)";

const SLIDES = [
  {
    main: "Vous collectionnez les espaces qui résistent.",
    sub: "Votre profil collectionneur",
    size: 32,
  },
  {
    main: "Trois galeries du Marais vous attendent.",
    sub: "Vos galeries cette semaine",
    size: 32,
  },
  {
    main: "Découvrez qui vous êtes en tant que collectionneur.",
    sub: null,
    size: 24,
  },
];

const SLIDE_DURATION_MS = 1500;
const CTA_FADE_MS = 400;

export function ValueTeaser({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [skipHover, setSkipHover] = useState(false);

  useEffect(() => {
    if (slideIndex < 2) {
      const id = setTimeout(() => setSlideIndex((i) => i + 1), SLIDE_DURATION_MS);
      return () => clearTimeout(id);
    }
    if (slideIndex === 2) {
      const id = setTimeout(() => setCtaVisible(true), 300);
      return () => clearTimeout(id);
    }
  }, [slideIndex]);

  const handleCta = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === 2;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: TEASER_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 9999,
      }}
    >
      <div
        key={slideIndex}
        style={{
          textAlign: "center",
          maxWidth: 320,
          animation: "valueTeaserFade 0.3s ease-out",
        }}
      >
        <p
          style={{
            fontFamily: t.fonts.serif,
            fontStyle: "italic",
            fontSize: slide.size,
            color: TEASER_INK,
            margin: "0 0 12px",
            lineHeight: 1.25,
          }}
        >
          {slide.main}
        </p>
        {slide.sub && (
          <p
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 14,
              color: MUTED,
              margin: 0,
            }}
          >
            {slide.sub}
          </p>
        )}
      </div>

      {isLast && (
        <button
          type="button"
          onClick={handleCta}
          style={{
            marginTop: 32,
            padding: "14px 28px",
            borderRadius: 12,
            border: "none",
            backgroundColor: t.colors.white,
            color: TEASER_BG,
            fontFamily: t.fonts.sans,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            opacity: ctaVisible ? 1 : 0,
            transition: `opacity ${CTA_FADE_MS}ms ease-out`,
          }}
        >
          Commencer →
        </button>
      )}

      <button
        type="button"
        onClick={onSkip}
        onMouseEnter={() => setSkipHover(true)}
        onMouseLeave={() => setSkipHover(false)}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          color: t.colors.inkMuted,
          fontSize: 12,
          fontFamily: t.fonts.sans,
          cursor: "pointer",
          opacity: skipHover ? 0.9 : 1,
        }}
      >
        Passer
      </button>
    </div>
  );
}
