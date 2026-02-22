"use client";

import { useRouter } from "next/navigation";
import { SearchScreen } from "../../../components/v21/SearchScreen";
import { V21_ARTWORKS } from "../../../lib/v21-artworks";
import type { Artist } from "../../../lib/v21-artists";

export default function SearchPage() {
  const router = useRouter();

  const handleArtistTap = (artist: Artist) => {
    const firstArtwork = V21_ARTWORKS.find((a) => a.artist === artist.name);
    if (firstArtwork) {
      router.push(`/v2.1/œuvre/${firstArtwork.id}`);
    }
  };

  const handleClose = () => {
    router.push("/v2.1/browse");
  };

  return (
    <SearchScreen
      onArtistTap={handleArtistTap}
      onClose={handleClose}
    />
  );
}
