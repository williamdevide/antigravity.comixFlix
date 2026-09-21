"use client";

import React, { useState, useEffect } from "react";
import { Comic } from "@/lib/types/comic";
import { useCollection } from "@/lib/context/collection-context";
import { Heart, Library, CheckCircle2, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCarouselProps {
  featuredComics: Comic[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ featuredComics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { openComicDetail, toggleStatus, getComicStatus } = useCollection();

  const activeComic = featuredComics[currentIndex] || featuredComics[0];
  const { isQuero, isTenho, isLido } = activeComic
    ? getComicStatus(activeComic.id)
    : { isQuero: false, isTenho: false, isLido: false };

  // Auto avanço a cada 7 segundos
  useEffect(() => {
    if (featuredComics.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredComics.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredComics.length]);

  if (!activeComic) return null;

  const discount =
    activeComic.preco_promocional && activeComic.preco_normal > activeComic.preco_promocional
      ? Math.round(((activeComic.preco_normal - activeComic.preco_promocional) / activeComic.preco_normal) * 100)
      : null;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <section className="relative w-full overflow-hidden bg-bg-canvas min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-end">
      {/* Background Image Imersiva com Gradientes Scrim Cinematográficos */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeComic.url_backdrop || activeComic.url_capa}
          alt={activeComic.titulo}
          className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
        />
        {/* Scrims: Escurecimento inferior e lateral para contraste de leitura impecável */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-canvas via-bg-canvas/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-canvas/95 via-bg-canvas/50 to-transparent" />
      </div>

      {/* Conteúdo Principal do Slide */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14 pt-24">
        <div className="max-w-2xl flex flex-col gap-3">
          {/* Badge & Editora */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-promo text-bg-canvas text-xs font-black uppercase tracking-wider shadow-md">
              Destaque da Semana
            </span>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {activeComic.editora} • {activeComic.formato}
            </span>
          </div>

          {/* Título de Destaque */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-tight drop-shadow-md">
            {activeComic.titulo}
          </h1>

          {/* Sinopse resumida */}
          <p className="text-xs sm:text-sm md:text-base text-text-secondary line-clamp-2 leading-relaxed drop-shadow-sm">
            {activeComic.resumo_sinopse}
          </p>

          {/* Preço e Desconto */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-promo tracking-tight">
              {formattedPrice(activeComic.preco_promocional ?? activeComic.preco_normal)}
            </span>
            {activeComic.preco_promocional && (
              <span className="text-xs sm:text-sm text-text-tertiary line-through">
                {formattedPrice(activeComic.preco_normal)}
              </span>
            )}
            {discount && (
              <span className="px-1.5 py-0.5 rounded bg-brand-primary/20 border border-brand-primary/40 text-brand-primary text-xs font-bold">
                -{discount}%
              </span>
            )}
          </div>

          {/* CTAs & QuickActions */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button
              type="button"
              onClick={() => openComicDetail(activeComic)}
              className="h-11 px-6 rounded-lg bg-brand-primary text-text-primary hover:bg-brand-primary-hover active:bg-brand-primary-active font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver detalhes
            </button>

            {/* Ações Rápidas em Círculo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleStatus(activeComic.id, "quero")}
                title={isQuero ? "Remover da Wishlist" : "Adicionar à Wishlist (Quero)"}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${
                  isQuero
                    ? "bg-brand-primary text-text-primary"
                    : "bg-bg-surface/80 backdrop-blur-md text-text-secondary hover:text-brand-primary hover:bg-bg-surface border border-border-default/60"
                }`}
              >
                <Heart className={`w-5 h-5 ${isQuero ? "fill-current" : ""}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleStatus(activeComic.id, "tenho")}
                title={isTenho ? "Remover da Estante" : "Marcar como Tenho"}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${
                  isTenho
                    ? "bg-status-collection text-bg-canvas font-bold"
                    : "bg-bg-surface/80 backdrop-blur-md text-text-secondary hover:text-status-collection hover:bg-bg-surface border border-border-default/60"
                }`}
              >
                <Library className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => toggleStatus(activeComic.id, "li")}
                title={isLido ? "Desmarcar Lido" : "Marcar como Lido"}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${
                  isLido
                    ? "bg-status-success text-bg-canvas font-bold"
                    : "bg-bg-surface/80 backdrop-blur-md text-text-secondary hover:text-status-success hover:bg-bg-surface border border-border-default/60"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Navegação do Carousel (Setas e Dots) */}
      {featuredComics.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? featuredComics.length - 1 : prev - 1))
              }
              aria-label="Slide anterior"
              className="p-1.5 rounded-full bg-bg-surface/80 backdrop-blur-md text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border-default/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredComics.length)}
              aria-label="Próximo slide"
              className="p-1.5 rounded-full bg-bg-surface/80 backdrop-blur-md text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border-default/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-bg-canvas/80 backdrop-blur-md border border-border-default/40">
            {featuredComics.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir para destaque ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? "w-4 h-1.5 bg-brand-primary"
                    : "w-1.5 h-1.5 bg-text-tertiary hover:bg-text-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
