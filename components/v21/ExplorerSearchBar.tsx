"use client";

import Link from "next/link";
import { theme } from "../../lib/theme";

const t = theme;

export function ExplorerSearchBar({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        maxWidth: t.layout.maxWidth,
        backgroundColor: t.colors.white,
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: `1px solid ${t.colors.accentBorder}`,
        overflow: "hidden",
        marginBottom: 28,
      }}
    >
      <Link
        href="/v2.1/galeries"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "16px 20px",
          borderRight: `1px solid ${t.colors.accentBorder}`,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.colors.inkMuted,
            marginBottom: 4,
          }}
        >
          Où
        </div>
        <div style={{ fontSize: 15, color: t.colors.ink, fontWeight: 500 }}>
          Paris, galeries
        </div>
      </Link>

      <Link
        href="/v2.1/search"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textDecoration: "none",
          color: "inherit",
          background: "transparent",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.colors.inkMuted,
            marginBottom: 4,
          }}
        >
          Recherche
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: t.colors.ink }}>
          Rechercher
        </div>
      </Link>
    </div>
  );
}
