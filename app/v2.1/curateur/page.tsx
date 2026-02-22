"use client";

import dynamic from "next/dynamic";

const ArtAdvisorScreen = dynamic(
  () => import("../../../components/v21/ArtAdvisorScreen").then((m) => m.default),
  { ssr: false }
);

export default function V21CurateurPage() {
  return <ArtAdvisorScreen />;
}
