"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../../context/AppStateContext";
import { theme } from "../../lib/theme";

const TYPEWRITER_MS = 40;
const INTERSTITIAL_MIN_MS = 3000;
const KEYWORD_STAGGER_MS = 180;

export function InterstitialScreen() {
  const router = useRouter();
  const { quizAnswers, setCollectorProfile } = useAppState();
  const [identity, setIdentity] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [bridge, setBridge] = useState("");
  const [displayedIdentity, setDisplayedIdentity] = useState("");
  const [visibleKeywordCount, setVisibleKeywordCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!quizAnswers || quizAnswers.length !== 3) {
      router.replace("/v2/quiz");
      return;
    }
    fetch("/api/collector-identity-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: quizAnswers }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIdentity((data.identity || "Vous collectionnez l'inattendu.").trim());
        setKeywords(Array.isArray(data.keywords) ? data.keywords : []);
        setBridge((data.bridge || "").trim());
      })
      .catch(() => {
        setIdentity("Vous collectionnez l'inattendu.");
        setKeywords(["contemporain", "émergent", "paris"]);
        setBridge("Les galeries parisiennes ont quelque chose pour vous.");
      });
  }, [quizAnswers, router]);

  useEffect(() => {
    if (!identity) return;
    setDisplayedIdentity("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setDisplayedIdentity(identity.slice(0, i));
      if (i >= identity.length) clearInterval(t);
    }, TYPEWRITER_MS);
    return () => clearInterval(t);
  }, [identity]);

  useEffect(() => {
    if (identity.length === 0 || displayedIdentity !== identity) return;
    const maxCount = Math.min(3, keywords.length);
    if (visibleKeywordCount >= maxCount) return;
    const t = setTimeout(
      () => setVisibleKeywordCount((c) => Math.min(c + 1, maxCount)),
      KEYWORD_STAGGER_MS
    );
    return () => clearTimeout(t);
  }, [identity, displayedIdentity, keywords.length, visibleKeywordCount]);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), INTERSTITIAL_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  const handleExplore = () => {
    setCollectorProfile(identity, keywords, bridge);
    router.push("/v2/home");
  };

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        textAlign: "center",
        backgroundColor: theme.colors.bg,
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: theme.colors.inkMuted,
          marginBottom: 20,
          fontFamily: theme.fonts.sans,
        }}
      >
        VOTRE PROFIL DE COLLECTIONNEUR
      </p>
      <p
        style={{
          fontFamily: theme.fonts.serif,
          fontStyle: "italic",
          fontSize: "clamp(22px, 5vw, 28px)",
          lineHeight: 1.35,
          color: theme.colors.ink,
          marginBottom: 24,
          minHeight: "1.4em",
        }}
      >
        {displayedIdentity}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {keywords.slice(0, 3).map((kw, index) => (
          <span
            key={kw}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: theme.colors.accentSoft,
              color: theme.colors.accent,
              opacity: index < visibleKeywordCount ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          >
            {kw}
          </span>
        ))}
      </div>
      {bridge && (
        <p
          style={{
            fontSize: 14,
            color: theme.colors.inkMuted,
            lineHeight: 1.5,
            marginBottom: 32,
          }}
        >
          {bridge}
        </p>
      )}
      {showButton && (
        <button
          type="button"
          onClick={handleExplore}
          style={{
            padding: "14px 28px",
            borderRadius: 12,
            border: "none",
            backgroundColor: theme.colors.ink,
            color: theme.colors.white,
            fontFamily: theme.fonts.sans,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            animation: "v2FadeIn 0.4s ease-out",
          }}
        >
          Explorer les galeries →
        </button>
      )}
    </div>
  );
}
