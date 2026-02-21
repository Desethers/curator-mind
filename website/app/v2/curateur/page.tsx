"use client";

import dynamic from "next/dynamic";

const CurateurV2 = dynamic(
  () => import("../../../components/v2/CurateurV2").then((m) => m.default),
  { ssr: false }
);

export default function V2CurateurPage() {
  return <CurateurV2 />;
}
