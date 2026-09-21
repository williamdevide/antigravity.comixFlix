"use client";

import React from "react";
import { Comic } from "@/lib/types/comic";
import { useCollection } from "@/lib/context/collection-context";
import { Heart, Library, CheckCircle2, Eye } from "lucide-react";

interface ComicCardProps {
  comic: Comic;
  showActions?: boolean;
}

export const ComicCard: React.FC<ComicCardProps> = ({ comic, showActions = true }) => {
  const { getComicStatus, toggleStatus, openComicDetail } = useCollection();
  const { isQuero, isTenho, isLido } = getComicStatus(comic.id);

  const discount =
    comic.preco_promocional && comic.preco_normal > comic.preco_promocional
      ? Math.round(((comic.preco_normal - comic.preco_promocional) / comic.preco_normal) * 100)
      : null;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div
      onClick={() => openComicDetail(comic)}
      className="group relative flex flex-col gap-1.5 cursor-pointer select-none shrink-0 w-[140px] sm:w-[160px] md:w-[180px] snap-start"
    >
      {/* 2:3 Cover Image Container */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-bg-surface border border-border-default/50 shadow-card transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-elevated group-hover:border-border-default">
        <img
          src={comic.imagem_base64 || comic.url_capa}
          alt={`Capa de ${comic.titulo}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-brand-primary text-text-primary text-[10px] font-extrabold shadow-md">
            -{discount}%
          </span>
        )}

        {/* Status Indicator Badges on Top Right */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end pointer-events-none">
          {isLido && (
            <span className="px-1.5 py-0.5 rounded-full bg-status-success text-bg-canvas text-[9px] font-black flex items-center gap-0.5 shadow-md">
              <CheckCircle2 className="w-2.5 h-2.5" /> Lido
            </span>
          )}
          {isTenho && !isLido && (
            <span className="px-1.5 py-0.5 rounded-full bg-status-collection text-bg-canvas text-[9px] font-black flex items-center gap-0.5 shadow-md">
              <Library className="w-2.5 h-2.5" /> Tenho
            </span>
          )}
          {isQuero && (
            <span className="p-1 rounded-full bg-brand-primary text-text-primary shadow-md">
              <Heart className="w-2.5 h-2.5 fill-current" />
            </span>
          )}
        </div>

        {/* Hover / Touch QuickActions Scrim */}
        {showActions && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-bg-canvas/95 via-bg-canvas/75 to-transparent flex items-center justify-between gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
          >
            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "quero")}
              title={isQuero ? "Remover da Wishlist" : "Adicionar à Wishlist (Quero)"}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isQuero
                  ? "bg-brand-primary text-text-primary shadow-md"
                  : "bg-bg-elevated/90 text-text-secondary hover:text-brand-primary hover:bg-bg-elevated"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isQuero ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "tenho")}
              title={isTenho ? "Remover da Estante" : "Marcar como Tenho"}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isTenho
                  ? "bg-status-collection text-bg-canvas font-bold shadow-md"
                  : "bg-bg-elevated/90 text-text-secondary hover:text-status-collection hover:bg-bg-elevated"
              }`}
            >
              <Library className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "li")}
              title={isLido ? "Desmarcar Lido" : "Marcar como Lido"}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isLido
                  ? "bg-status-success text-bg-canvas font-bold shadow-md"
                  : "bg-bg-elevated/90 text-text-secondary hover:text-status-success hover:bg-bg-elevated"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => openComicDetail(comic)}
              title="Ver Detalhes"
              className="w-7 h-7 rounded-full bg-bg-elevated/90 text-text-secondary hover:text-text-primary hover:bg-bg-elevated flex items-center justify-center transition-transform active:scale-90"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Metadata Info */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider truncate">
          <span>{comic.editora}</span>
          {comic.selo && (
            <>
              <span className="text-text-tertiary/40">•</span>
              <span className="text-brand-primary truncate">{comic.selo}</span>
            </>
          )}
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
          {comic.titulo}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-xs sm:text-sm font-bold text-text-primary">
            {formattedPrice(comic.preco_promocional ?? comic.preco_normal)}
          </span>
          {comic.preco_promocional && (
            <span className="text-[10px] text-text-tertiary line-through">
              {formattedPrice(comic.preco_normal)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
