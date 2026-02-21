"use client";

import dynamic from "next/dynamic";

const CurateurV21 = dynamic(
  () => import("../../../components/v21/CurateurV21").then((m) => m.default),
  { ssr: false }
);

export default function V21CurateurPage() {
  return <CurateurV21 />;
}
