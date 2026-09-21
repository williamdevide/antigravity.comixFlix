import React from "react";
import EdicaoDetalheClient from "@/components/comic/EdicaoDetalheClient";

export function generateStaticParams() {
  return [
    { id: "pn-tartarugas-ninja-o-ultimo-ronin" },
    { id: "panini-venom-2025-01" },
    { id: "panini-venom-2025-09" },
    { id: "mythos-tex-ouro-135" },
    { id: "cia-monica-forca" },
  ];
}

export default function EdicaoPage() {
  return <EdicaoDetalheClient />;
}
