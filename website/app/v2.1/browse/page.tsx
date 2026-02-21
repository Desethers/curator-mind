"use client";

import { useState, useMemo } from "react";
import { V21_ARTWORKS } from "../../../lib/v21-artworks";
import type { Artwork } from "../../../lib/v21-artworks";
import { ArtworkCard } from "../../../components/v21/ArtworkCard";
import { BrowseHeader } from "../../../components/v21/BrowseHeader";
import { ExplorerSearchBar } from "../../../components/v21/ExplorerSearchBar";
import { QuizLeadCard } from "../../../components/v21/QuizLeadCard";
import { QuizModalV21 } from "../../../components/v21/QuizModalV21";
import { IdentityRevealModal } from "../../../components/v21/IdentityRevealModal";
import { CollectorThread } from "../../../components/v21/CollectorThread";
import { useAppStateV21 } from "../../../context/AppStateContextV21";

const QUIZ_LEAD_AFTER_INDEX = 2;

function sortByOnboardingKeywords(artworks: Artwork[], keywords: string[]): Artwork[] {
  if (keywords.length === 0) return artworks;
  const set = new Set(keywords.map((k) => k.toLowerCase()));
  return [...artworks].sort((a, b) => {
    const scoreA = a.keywords.filter((k) => set.has(k.toLowerCase())).length;
    const scoreB = b.keywords.filter((k) => set.has(k.toLowerCase())).length;
    return scoreB - scoreA;
  });
}

export default function BrowsePage() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [identityRevealOpen, setIdentityRevealOpen] = useState(false);
  const { collectorProfile } = useAppStateV21();

  const onboardingKeywords = useMemo(() => {
    const signals = collectorProfile.implicitSignals?.slice(0, 5) ?? [];
    return Array.from(new Set(signals.flatMap((s) => s.keywords)));
  }, [collectorProfile.implicitSignals]);

  const sortedArtworks = useMemo(
    () => sortByOnboardingKeywords(V21_ARTWORKS, onboardingKeywords),
    [onboardingKeywords]
  );

  const openQuiz = () => setQuizOpen(true);

  return (
    <>
      <BrowseHeader onOpenQuiz={openQuiz} />
      <ExplorerSearchBar onOpenQuiz={openQuiz} />
      <CollectorThread />
      <div style={{ paddingBottom: 24 }}>
        {sortedArtworks.map((artwork, index) => (
          <div key={artwork.id}>
            <ArtworkCard artwork={artwork} />
            {index === QUIZ_LEAD_AFTER_INDEX && (
              <QuizLeadCard onOpenQuiz={openQuiz} />
            )}
          </div>
        ))}
      </div>

      <QuizModalV21
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={() => {
          setQuizOpen(false);
          setIdentityRevealOpen(true);
        }}
      />
      <IdentityRevealModal
        open={identityRevealOpen}
        onClose={() => setIdentityRevealOpen(false)}
      />
    </>
  );
}
