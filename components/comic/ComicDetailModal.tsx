"use client";

import React, { useEffect } from "react";
import { useCollection } from "@/lib/context/collection-context";
import {
  X,
  Heart,
  Library,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Barcode,
  Star,
  Bookmark,
} from "lucide-react";

export const ComicDetailModal: React.FC = () => {
  const {
    activeModalComic,
    closeComicDetail,
    getComicStatus,
    toggleStatus,
    setRating,
    openComicDetail,
    comics,
  } = useCollection();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeComicDetail();
      }
    };
    if (activeModalComic) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalComic, closeComicDetail]);

  if (!activeModalComic) return null;

  const { isQuero, isTenho, isLido, nota } = getComicStatus(activeModalComic.id);

  const discount =
    activeModalComic.preco_promocional &&
    activeModalComic.preco_normal > activeModalComic.preco_promocional
      ? Math.round(
          ((activeModalComic.preco_normal - activeModalComic.preco_promocional) /
            activeModalComic.preco_normal) *
            100
        )
      : null;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  // Recomendações: quadrinhos da mesma editora ou série
  const relatedComics = comics
    .filter(
      (c) =>
        c.id !== activeModalComic.id &&
        (c.editora === activeModalComic.editora || c.serie === activeModalComic.serie)
    )
    .slice(0, 4);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-comic-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeComicDetail}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-2xl bg-bg-surface border border-border-default shadow-elevated text-text-primary animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-300"
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={closeComicDetail}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-bg-elevated/90 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          aria-label="Fechar ficha técnica"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo do Modal: Capa + Metadados Essenciais */}
        <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 border-b border-border-default/60">
          {/* Capa 2:3 */}
          <div className="w-36 sm:w-44 aspect-[2/3] shrink-0 mx-auto sm:mx-0 rounded-lg overflow-hidden bg-bg-elevated border border-border-default shadow-elevated">
            <img
              src={activeModalComic.imagem_base64 || activeModalComic.url_capa}
              alt={activeModalComic.titulo}
              className="w-full h-full object-cover"
              decoding="async"
            />
          </div>

          {/* Dados Rápidos */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-bold uppercase tracking-wider">
                  {activeModalComic.editora}
                </span>
                {activeModalComic.selo && (
                  <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-default text-text-primary text-xs font-semibold flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-brand-primary" /> {activeModalComic.selo}
                  </span>
                )}
                {activeModalComic.serie && (
                  <span className="text-xs text-text-tertiary">
                    Série: {activeModalComic.serie}
                  </span>
                )}
              </div>

              <h2
                id="modal-comic-title"
                className="text-xl sm:text-2xl font-black text-text-primary leading-tight tracking-tight mt-1"
              >
                {activeModalComic.titulo}
              </h2>

              {activeModalComic.autores.length > 0 && (
                <p className="text-xs text-text-secondary">
                  Por <span className="text-text-primary font-medium">{activeModalComic.autores.join(", ")}</span>
                </p>
              )}

              {/* Preço e Disponibilidade */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-promo">
                  {formattedPrice(activeModalComic.preco_promocional ?? activeModalComic.preco_normal)}
                </span>
                {activeModalComic.preco_promocional && (
                  <span className="text-sm text-text-tertiary line-through">
                    {formattedPrice(activeModalComic.preco_normal)}
                  </span>
                )}
                {discount && (
                  <span className="px-1.5 py-0.5 rounded bg-brand-primary text-text-primary text-xs font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Ações de Status (Quero, Tenho, Li) */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-default/40">
              <button
                type="button"
                onClick={() => toggleStatus(activeModalComic.id, "quero")}
                className={`flex-1 min-h-[40px] px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
                  isQuero
                    ? "bg-brand-primary text-text-primary shadow-md"
                    : "bg-bg-elevated text-text-secondary hover:text-brand-primary hover:bg-bg-elevated/80 border border-border-default"
                }`}
              >
                <Heart className={`w-4 h-4 ${isQuero ? "fill-current" : ""}`} />
                {isQuero ? "Desejado" : "Quero"}
              </button>

              <button
                type="button"
                onClick={() => toggleStatus(activeModalComic.id, "tenho")}
                className={`flex-1 min-h-[40px] px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
                  isTenho
                    ? "bg-status-collection text-bg-canvas font-black shadow-md"
                    : "bg-bg-elevated text-text-secondary hover:text-status-collection hover:bg-bg-elevated/80 border border-border-default"
                }`}
              >
                <Library className="w-4 h-4" />
                {isTenho ? "Na Estante" : "Tenho"}
              </button>

              <button
                type="button"
                onClick={() => toggleStatus(activeModalComic.id, "li")}
                className={`flex-1 min-h-[40px] px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
                  isLido
                    ? "bg-status-success text-bg-canvas font-black shadow-md"
                    : "bg-bg-elevated text-text-secondary hover:text-status-success hover:bg-bg-elevated/80 border border-border-default"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isLido ? "Lido" : "Li"}
              </button>
            </div>
          </div>
        </div>

        {/* Avaliação de Leitura (Se marcado como Lido) */}
        {isLido && (
          <div className="px-6 py-3 bg-status-success/10 border-b border-status-success/20 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-status-success flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Sua Avaliação:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(activeModalComic.id, star)}
                  className="p-1 text-text-tertiary hover:text-promo transition-colors"
                  aria-label={`Avaliar com ${star} estrelas`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      nota && nota >= star ? "text-promo fill-promo" : ""
                    }`}
                  />
                </button>
              ))}
              {nota && <span className="text-xs font-bold text-promo ml-1">{nota}.0</span>}
            </div>
          </div>
        )}

        {/* Sinopse e Ficha Técnica Detalhada */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Sinopse */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Sinopse da Edição
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {activeModalComic.resumo_sinopse || "Sinopse não informada para esta edição."}
            </p>
          </div>

          {/* Grid de Especificações */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-bg-canvas/50 border border-border-default/50">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Formato
              </span>
              <span className="text-xs font-bold text-text-primary">{activeModalComic.formato}</span>
            </div>

            {activeModalComic.selo && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                  <Bookmark className="w-3 h-3" /> Selo Editorial
                </span>
                <span className="text-xs font-bold text-brand-primary">{activeModalComic.selo}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Lançamento
              </span>
              <span className="text-xs font-bold text-text-primary">
                {activeModalComic.data_lancamento
                  ? new Date(activeModalComic.data_lancamento).toLocaleDateString("pt-BR")
                  : "Não informada"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Layers className="w-3 h-3" /> Páginas
              </span>
              <span className="text-xs font-bold text-text-primary">
                {activeModalComic.paginas ? `${activeModalComic.paginas} págs.` : "Não informado"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Barcode className="w-3 h-3" /> ISBN
              </span>
              <span className="text-xs font-bold text-text-primary font-mono">
                {activeModalComic.isbn || "Não informado"}
              </span>
            </div>
          </div>

          {/* Link para Loja Oficial */}
          <div className="flex justify-end pt-2">
            <a
              href={activeModalComic.url_produto}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 border border-border-default text-xs font-bold text-text-primary transition-colors"
            >
              Ver na loja oficial ({activeModalComic.editora})
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quadrinhos Relacionados */}
          {relatedComics.length > 0 && (
            <div className="flex flex-col gap-3 pt-4 border-t border-border-default/60">
              <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                Outras edições de {activeModalComic.editora}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedComics.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => openComicDetail(rel)}
                    className="flex flex-col gap-1 cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded-md overflow-hidden bg-bg-elevated border border-border-default">
                      <img
                        src={rel.url_capa}
                        alt={rel.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors">
                      {rel.titulo}
                    </span>
                    <span className="text-[10px] text-text-tertiary">
                      {formattedPrice(rel.preco_promocional ?? rel.preco_normal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
