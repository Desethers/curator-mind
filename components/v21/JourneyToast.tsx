"use client";

import { useState, useEffect } from "react";
import { useAppStateV21 } from "../../context/AppStateContextV21";
import { theme } from "../../lib/theme";

const t = theme;
const TOAST_DURATION_MS = 2500;
const TOAST_BG = "#1A1916";

export function JourneyToast() {
  const {
    journey,
    savedArtworks,
    markFirstSaveToastShown,
    markFifthSaveToastShown,
  } = useAppStateV21();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [which, setWhich] = useState<"first" | "fifth" | null>(null);

  useEffect(() => {
    const total = savedArtworks.length;
    if (total === 1 && !journey.firstSaveToastShown) {
      setMessage("Votre collection commence.");
      setWhich("first");
      setVisible(true);
    } else if (total === 5 && !journey.fifthSaveToastShown) {
      setMessage("5 œuvres. Curateur commence à vous connaître.");
      setWhich("fifth");
      setVisible(true);
    }
  }, [savedArtworks.length, journey.firstSaveToastShown, journey.fifthSaveToastShown]);

  useEffect(() => {
    if (!visible || !which) return;
    const id = setTimeout(() => {
      setVisible(false);
      if (which === "first") markFirstSaveToastShown();
      if (which === "fifth") markFifthSaveToastShown();
      setWhich(null);
      setMessage(null);
    }, TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [visible, which, markFirstSaveToastShown, markFifthSaveToastShown]);

  if (!visible || !message) return null;

  return (
    <div
      className="journey-toast-enter"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 136,
        maxWidth: 430,
        margin: "0 auto",
        padding: "14px 20px",
        backgroundColor: TOAST_BG,
        borderRadius: 12,
        zIndex: 899,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <p
        style={{
          fontFamily: t.fonts.serif,
          fontStyle: "italic",
          fontSize: 16,
          color: t.colors.white,
          margin: 0,
          textAlign: "center",
        }}
      >
        {message}
      </p>
    </div>
  );
}
