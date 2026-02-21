"use client";

import { useParams } from "next/navigation";
import { GalleryDetail } from "../../../../components/v2/GalleryDetail";

export default function V2GaleriePage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  return <GalleryDetail galleryId={id} />;
}
