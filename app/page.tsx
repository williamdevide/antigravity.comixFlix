"use client";

import React from "react";
import Link from "next/link";
import { useCollection } from "@/lib/context/collection-context";
import { HeroCarousel } from "@/components/comic/HeroCarousel";
import { ContentRow } from "@/components/comic/ContentRow";
import { Library, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { comics, stats } = useCollection();

  // Filtragens para as fileiras temáticas
  const featuredComics = comics.filter((c) => c.destaque);
  const weeklyReleases = comics.filter((c) => c.lancamento_semana);
  const paniniComics = comics.filter((c) => c.editora.includes("Panini"));
  const pipocaComics = comics.filter((c) => c.editora.includes("Pipoca"));
  const mythosComics = comics.filter((c) => c.editora.includes("Mythos"));
  const promoComics = comics.filter((c) => c.preco_promocional !== null);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Carousel Estilo Streaming */}
      <HeroCarousel featuredComics={featuredComics.length > 0 ? featuredComics : comics.slice(0, 4)} />

      {/* 2. Banner de Status Pessoal Rápido (Se o usuário tiver itens na estante) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface border border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
              <Library className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-primary">
                Sua Estante Virtual
              </span>
              <p className="text-xs text-text-secondary">
                Você possui <strong className="text-text-primary">{stats.totalTenho} edições</strong> registradas e{" "}
                <strong className="text-status-success">{stats.totalLidos} lidas</strong> ({stats.percentualLidos}% de conclusão).
              </p>
            </div>
          </div>

          <Link
            href="/colecao"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-canvas hover:bg-bg-elevated text-xs font-bold text-text-primary border border-border-default transition-all self-stretch sm:self-auto justify-center group"
          >
            Abrir Minha Coleção
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 3. Fileiras de Conteúdo Temático */}
      <div className="flex flex-col gap-2 mt-4 pb-12">
        <ContentRow
          title="Lançamentos da semana"
          comics={weeklyReleases}
          seeAllHref="/explorar"
        />

        <ContentRow
          title="Grandes Obras com Desconto"
          comics={promoComics}
          seeAllHref="/explorar"
        />

        <ContentRow
          title="Universo Panini Comics"
          comics={paniniComics}
          seeAllHref="/explorar?editora=Panini+Comics"
        />

        <ContentRow
          title="Pipoca & Nanquim — Obras Primas"
          comics={pipocaComics}
          seeAllHref="/explorar?editora=Pipoca+%26+Nanquim"
        />

        <ContentRow
          title="Clássicos da Mythos Editora"
          comics={mythosComics}
          seeAllHref="/explorar?editora=Mythos+Editora"
        />
      </div>
    </div>
  );
}
