import React from "react";
import SeriesClient from "@/components/comic/SeriesClient";

export function generateStaticParams() {
  return [
    { slug: "batman-snyder-novos-52" },
    { slug: "venom-2025" },
    { slug: "tartarugas-ninja-idw" },
    { slug: "tex-edicao-historica" },
  ];
}

export default function SeriesPage() {
  return <SeriesClient />;
}
