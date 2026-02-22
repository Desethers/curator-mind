"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "../../lib/theme";

export function V21Header() {
  const pathname = usePathname();
  const isBrowse = pathname === "/v2.1" || pathname === "/v2.1/browse";
  const isSearch = pathname === "/v2.1/search";
  const isGaleries = pathname === "/v2.1/galeries";
  const isCurateur = pathname?.startsWith("/v2.1/curateur");
  const isCollection = pathname === "/v2.1/collection";
  return (
    <header
      style={{
        marginBottom: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: theme.layout.maxWidth,
      }}
    >
      <Link
        href="/v2.1/browse"
        style={{
          fontWeight: 700,
          letterSpacing: 2,
          color: theme.colors.ink,
          textDecoration: "none",
        }}
      >
        CURATOR MIND
      </Link>
      <nav style={{ display: "flex", gap: 16, fontSize: 14, alignItems: "center" }}>
        <Link
          href="/v2.1/browse"
          style={{
            color: isBrowse ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Découvrir
        </Link>
        <Link
          href="/v2.1/search"
          style={{
            color: isSearch ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Recherche
        </Link>
        <Link
          href="/v2.1/curateur"
          style={{
            color: isCurateur ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Art advisor
        </Link>
        <Link
          href="/v2.1/galeries"
          style={{
            color: isGaleries ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Galeries
        </Link>
        <Link
          href="/v2.1/collection"
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            border: `1px solid ${theme.colors.accentBorder}`,
            backgroundColor: isCollection ? theme.colors.accentSoft : "transparent",
            color: theme.colors.accent,
            fontFamily: theme.fonts.sans,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Ma collection
        </Link>
      </nav>
    </header>
  );
}
