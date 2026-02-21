"use client";

import { useState, useEffect } from "react";
import { theme } from "../../lib/theme";

const t = theme;
const DURATION_MS = 1500;

export function IdentityRevealConfetti({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(id);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9990,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="identity-confetti-circle"
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: t.colors.accent,
            opacity: 0.35,
            animation: `identityConfettiExpand ${DURATION_MS}ms ease-out forwards`,
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}
