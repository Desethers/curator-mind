"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { v2Theme } from "../../lib/v2-theme";

const NAV_ITEMS = [
  { href: "/v2/home", label: "Galeries", symbol: "◉" },
  { href: "/v2/curateur", label: "Curateur", symbol: "◈" },
  { href: "/v2/collection", label: "Ma Collection", symbol: "♡" },
  { href: "/v2/profil", label: "Mon Profil", symbol: "○" },
] as const;

export function V2Shell() {
  const pathname = usePathname();

  const showNav =
    pathname?.startsWith("/v2/home") ||
    pathname?.startsWith("/v2/curateur") ||
    pathname?.startsWith("/v2/collection") ||
    pathname?.startsWith("/v2/profil");

  if (!showNav) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 430,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "12px 8px 24px",
        background: "rgba(12, 11, 10, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `1px solid ${v2Theme.border}`,
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              color: isActive ? v2Theme.accent : v2Theme.inkMuted,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ fontSize: 18 }}>{item.symbol}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
