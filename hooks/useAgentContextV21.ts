"use client";

import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useAppStateV21 } from "../context/AppStateContextV21";
import type { AgentContext, AgentScreen } from "../context/AppStateContextV21";
import { V21_ARTWORKS } from "../lib/v21-artworks";
import { V2_GALLERIES } from "../lib/v2-galleries";

export function useAgentContextV21() {
  const pathname = usePathname();
  const params = useParams();
  const { setAgentContext } = useAppStateV21();

  useEffect(() => {
    let ctx: AgentContext | null = null;

    if (pathname === "/v2.1" || pathname === "/v2.1/browse") {
      ctx = {
        screen: "browse",
        entityId: null,
        entityName: null,
        entityType: null,
        description: null,
      };
    } else if (pathname?.startsWith("/v2.1/œuvre/") && params?.id) {
      const id = Number(params.id);
      const artwork = V21_ARTWORKS.find((a) => a.id === id);
      ctx = {
        screen: "artwork",
        entityId: String(id),
        entityName: artwork?.title ?? null,
        entityType: "artwork",
        description: artwork ? `${artwork.artist}, ${artwork.gallery}, ${artwork.price}` : null,
      };
    } else if (pathname?.startsWith("/v2.1/galerie/") && params?.id) {
      const id = String(params.id ?? "");
      const gallery = V2_GALLERIES[id];
      ctx = {
        screen: "gallery",
        entityId: id,
        entityName: gallery?.name ?? null,
        entityType: "gallery",
        description: gallery?.exhibition ?? null,
      };
    } else if (pathname === "/v2.1/collection") {
      ctx = {
        screen: "collection",
        entityId: null,
        entityName: null,
        entityType: null,
        description: null,
      };
    } else if (pathname === "/v2.1/profil") {
      ctx = {
        screen: "profile",
        entityId: null,
        entityName: null,
        entityType: null,
        description: null,
      };
    }

    setAgentContext(ctx);
  }, [pathname, params?.id, setAgentContext]);
}
