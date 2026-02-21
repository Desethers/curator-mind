"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "../../lib/theme";

export function V2Header() {
  const pathname = usePathname();
  const isCurateur = pathname?.startsWith("/v2/curateur");

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
        href="/v2"
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
          href="/v2/home"
          style={{
            color: pathname === "/v2/home" ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Galeries
        </Link>
        <Link
          href="/v2/curateur"
          style={{
            color: isCurateur ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Curateur
        </Link>
        <Link
          href="/v2/collection"
          style={{
            color: pathname === "/v2/collection" ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Ma collection
        </Link>
        <Link
          href="/v2/profil"
          style={{
            color: pathname === "/v2/profil" ? theme.colors.ink : theme.colors.inkSoft,
            textDecoration: "none",
          }}
        >
          Mon profil
        </Link>
      </nav>
    </header>
  );
}
