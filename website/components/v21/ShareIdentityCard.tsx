"use client";

import { useRef, useCallback } from "react";
import { theme } from "../../lib/theme";

const t = theme;
const CARD_SIZE = 390;

export function ShareIdentityCard({
  identity,
  keywords,
  onClose,
}: {
  identity: string;
  keywords: string[];
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CARD_SIZE;
    canvas.height = CARD_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
    ctx.fillStyle = t.colors.ink;
    ctx.font = "italic 28px 'Instrument Serif', Georgia, serif";
    ctx.textAlign = "center";
    const lines = identity.split(/(?<=\.)\s+/).filter(Boolean);
    let y = 140;
    const lineHeight = 40;
    const maxWidth = CARD_SIZE - 48;
    lines.forEach((line) => {
      const words = line.split(" ");
      let current = "";
      const toDraw: string[] = [];
      words.forEach((w) => {
        const test = current ? `${current} ${w}` : w;
        const m = ctx.measureText(test);
        if (m.width > maxWidth && current) {
          toDraw.push(current);
          current = w;
        } else current = test;
      });
      if (current) toDraw.push(current);
      toDraw.forEach((l) => {
        ctx.fillText(l, CARD_SIZE / 2, y);
        y += lineHeight;
      });
    });
    y += 24;
    const kw = keywords.slice(0, 3);
    kw.forEach((k, i) => {
      ctx.font = "12px 'Manrope', sans-serif";
      ctx.fillStyle = t.colors.accent;
      const x = CARD_SIZE / 2 - (kw.length * 60) / 2 + i * 70 + 35;
      ctx.fillText(k, x, y);
    });
    ctx.fillStyle = t.colors.inkMuted;
    ctx.font = "11px 'Manrope', sans-serif";
    ctx.fillText("Curator Mind", CARD_SIZE / 2, CARD_SIZE - 24);
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "curator-mind-identite.png";
    a.click();
  }, [identity, keywords]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            ref={cardRef}
            style={{
              width: CARD_SIZE,
              height: CARD_SIZE,
              backgroundColor: t.colors.white,
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              boxSizing: "border-box",
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
                lineHeight: 1.35,
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              {identity}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              {keywords.slice(0, 3).map((k) => (
                <span
                  key={k}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: t.colors.accentSoft,
                    color: t.colors.accent,
                    fontFamily: t.fonts.sans,
                    fontSize: 12,
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
            <p
              style={{
                fontFamily: t.fonts.sans,
                fontSize: 11,
                color: t.colors.inkMuted,
                marginTop: "auto",
                paddingTop: 24,
              }}
            >
              Curator Mind
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              backgroundColor: t.colors.ink,
              color: t.colors.white,
              fontFamily: t.fonts.sans,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Télécharger
          </button>
        </div>
      </div>
    </>
  );
}
