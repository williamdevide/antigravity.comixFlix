"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCollection } from "@/lib/context/collection-context";
import {
  Heart,
  Library,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  BookOpen,
  Calendar,
  Layers,
  Barcode,
  Star,
} from "lucide-react";

export default function EdicaoDetalheClient() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { comics, getComicStatus, toggleStatus, setRating } = useCollection();

  const comic = comics.find((c) => c.id === id);

  if (!comic) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Edição não encontrada</h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          A edição que você está procurando não foi encontrada em nosso catálogo nacional.
        </p>
        <Link
          href="/explorar"
          className="px-4 py-2 rounded-lg bg-brand-primary text-text-primary text-xs font-bold hover:bg-brand-primary-hover"
        >
          Voltar para Explorar
        </Link>
      </div>
    );
  }

  const { isQuero, isTenho, isLido, nota } = getComicStatus(comic.id);

  const discount =
    comic.preco_promocional && comic.preco_normal > comic.preco_promocional
      ? Math.round(((comic.preco_normal - comic.preco_promocional) / comic.preco_normal) * 100)
      : null;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 flex flex-col gap-8">
      {/* Botão Voltar */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-text-primary self-start transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Grid Principal da Edição */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Capa 2:3 com Sombra e Borda */}
        <div className="w-56 sm:w-64 md:w-72 aspect-[2/3] shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden bg-bg-surface border border-border-default shadow-elevated">
          <img
            src={comic.imagem_base64 || comic.url_capa}
            alt={comic.titulo}
            className="w-full h-full object-cover"
            decoding="async"
          />
        </div>

        {/* Informações Principais */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-bold uppercase tracking-wider">
                {comic.editora}
              </span>
              {comic.serie && (
                <span className="text-xs text-text-tertiary">Série: {comic.serie}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight leading-tight mt-1">
              {comic.titulo}
            </h1>

            {comic.autores.length > 0 && (
              <p className="text-xs sm:text-sm text-text-secondary">
                Por <strong className="text-text-primary">{comic.autores.join(", ")}</strong>
              </p>
            )}

            {/* Preço e Desconto */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-promo">
                {formattedPrice(comic.preco_promocional ?? comic.preco_normal)}
              </span>
              {comic.preco_promocional && (
                <span className="text-sm sm:text-base text-text-tertiary line-through">
                  {formattedPrice(comic.preco_normal)}
                </span>
              )}
              {discount && (
                <span className="px-2 py-0.5 rounded bg-brand-primary text-text-primary text-xs font-bold">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Botões de Ação de Status */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "quero")}
              className={`flex-1 min-h-[44px] px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 ${
                isQuero
                  ? "bg-brand-primary text-text-primary shadow-md"
                  : "bg-bg-surface text-text-secondary hover:text-brand-primary hover:bg-bg-elevated border border-border-default"
              }`}
            >
              <Heart className={`w-4 h-4 ${isQuero ? "fill-current" : ""}`} />
              {isQuero ? "Na Wishlist" : "Adicionar à Wishlist"}
            </button>

            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "tenho")}
              className={`flex-1 min-h-[44px] px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 ${
                isTenho
                  ? "bg-status-collection text-bg-canvas font-black shadow-md"
                  : "bg-bg-surface text-text-secondary hover:text-status-collection hover:bg-bg-elevated border border-border-default"
              }`}
            >
              <Library className="w-4 h-4" />
              {isTenho ? "Na Minha Estante" : "Marcar como Tenho"}
            </button>

            <button
              type="button"
              onClick={() => toggleStatus(comic.id, "li")}
              className={`flex-1 min-h-[44px] px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 ${
                isLido
                  ? "bg-status-success text-bg-canvas font-black shadow-md"
                  : "bg-bg-surface text-text-secondary hover:text-status-success hover:bg-bg-elevated border border-border-default"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLido ? "Lido" : "Já Li Esta Edição"}
            </button>
          </div>

          {/* Seção de Avaliação se Lido */}
          {isLido && (
            <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/20 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-status-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Sua Avaliação:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(comic.id, star)}
                    className="p-1 text-text-tertiary hover:text-promo transition-colors"
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

          {/* Sinopse Completa */}
          <div className="flex flex-col gap-2 pt-2">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Sinopse Oficial
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {comic.resumo_sinopse || "Sinopse não informada para esta edição."}
            </p>
          </div>

          {/* Ficha Técnica em Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-bg-surface border border-border-default mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Formato
              </span>
              <span className="text-xs font-bold text-text-primary">{comic.formato}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Layers className="w-3 h-3" /> Páginas
              </span>
              <span className="text-xs font-bold text-text-primary">
                {comic.paginas ? `${comic.paginas} págs.` : "Não informado"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Lançamento
              </span>
              <span className="text-xs font-bold text-text-primary">
                {comic.data_lancamento
                  ? new Date(comic.data_lancamento).toLocaleDateString("pt-BR")
                  : "Não informado"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <Barcode className="w-3 h-3" /> ISBN
              </span>
              <span className="text-xs font-bold text-text-primary truncate">
                {comic.isbn || "Não informado"}
              </span>
            </div>
          </div>

          {/* Link externo para a editora */}
          {comic.url_produto && (
            <div className="pt-2">
              <a
                href={comic.url_produto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-hover underline underline-offset-4"
              >
                Ver na loja oficial da {comic.editora}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
