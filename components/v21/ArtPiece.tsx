"use client";

import Image from "next/image";
import type { Artwork } from "../../lib/v21-artworks";

export function ArtPiece({
  artwork,
  selected,
  onTap,
}: {
  artwork: Artwork;
  selected: boolean;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={artwork.title}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "33vh",
        padding: 0,
        border: "none",
        cursor: "pointer",
        overflow: "hidden",
        transform: selected ? "scale(0.96)" : "scale(1)",
        borderWidth: selected ? 2 : 0,
        borderStyle: "solid",
        borderColor: "rgba(193,123,94,0.6)",
        borderRadius: 0,
        transition: "transform 200ms ease-out, border 150ms ease-out",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt=""
            fill
            sizes="280px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          artwork.palette.map((color, i) => (
            <div
              key={i}
              style={{
                width: "50%",
                height: "50%",
                backgroundColor: color,
              }}
            />
          ))
        )}
      </div>
    </button>
  );
}
