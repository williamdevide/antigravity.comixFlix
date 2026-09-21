"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCollection } from "@/lib/context/collection-context";
import { ComicFilters } from "@/components/comic/ComicFilters";
import { ComicCard } from "@/components/comic/ComicCard";
import { FilterOptions } from "@/lib/types/comic";
import { Compass, BookDashed } from "lucide-react";

function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const PAGE_SIZE = 36;

function ExplorarContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialEditora = searchParams.get("editora") || "";
  const initialSelo = searchParams.get("selo") || "";

  const { comics } = useCollection();

  const [filters, setFilters] = useState<FilterOptions>({
    busca: initialQuery,
    editora: initialEditora,
    selo: initialSelo,
    formato: "",
    status: "",
    disponibilidade: "",
    ordenacao: "relevancia",
    somentePromocao: false,
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reseta a quantidade visível sempre que os filtros mudarem
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      busca: "",
      editora: "",
      selo: "",
      formato: "",
      status: "",
      disponibilidade: "",
      ordenacao: "relevancia",
      somentePromocao: false,
    });
  };

  // Filtragem e ordenação computada com busca inteligente por múltiplos termos (ex: venom 2025)
  const filteredComics = useMemo(() => {
    return comics
      .filter((comic) => {
        // Busca textual inteligente tokenizada
        if (filters.busca) {
          const tokens = normalizeSearchText(filters.busca).split(" ").filter(Boolean);
          if (tokens.length > 0) {
            const searchable = normalizeSearchText(
              [
                comic.titulo,
                comic.editora,
                comic.selo || "",
                comic.personagem_principal || "",
                ...(comic.autores || []),
                ...(comic.tags || []),
                comic.serie || "",
                comic.isbn || "",
              ].join(" ")
            );

            const matchAllTokens = tokens.every((token) => searchable.includes(token));
            if (!matchAllTokens) {
              return false;
            }
          }
        }

        // Filtro por editora
        if (filters.editora && filters.editora !== "Todas") {
          const editoraNorm = normalizeSearchText(filters.editora);
          const comicEditoraNorm = normalizeSearchText(comic.editora);
          if (!comicEditoraNorm.includes(editoraNorm)) {
            return false;
          }
        }

        // Filtro por selo (imprint)
        if (filters.selo && filters.selo !== "Todos os Selos") {
          const seloQuery = normalizeSearchText(filters.selo);
          const matchSelo = comic.selo && normalizeSearchText(comic.selo) === seloQuery;
          const matchTag = comic.tags?.some((t) => normalizeSearchText(t) === seloQuery);
          if (!matchSelo && !matchTag) {
            return false;
          }
        }

        // Filtro por formato
        if (filters.formato && filters.formato !== "Todos") {
          if (comic.formato !== filters.formato) {
            return false;
          }
        }

        // Somente promoção
        if (filters.somentePromocao) {
          if (!comic.preco_promocional) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.preco_promocional ?? a.preco_normal;
        const priceB = b.preco_promocional ?? b.preco_normal;

        switch (filters.ordenacao) {
          case "menor_preco":
            return priceA - priceB;
          case "maior_preco":
            return priceB - priceA;
          case "titulo_az":
            return a.titulo.localeCompare(b.titulo);
          case "recentes":
            return (
              new Date(b.data_lancamento || 0).getTime() -
              new Date(a.data_lancamento || 0).getTime()
            );
          default:
            return 0;
        }
      });
  }, [comics, filters]);

  // Paginação progressiva para evitar renderização simultânea de 10.000 nós no DOM
  const displayedComics = useMemo(() => {
    return filteredComics.slice(0, visibleCount);
  }, [filteredComics, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredComics.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col gap-6">
      {/* Título da Página */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" /> Catálogo Nacional Unificado
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight">
          Explorar Quadrinhos
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Descubra edições físicas de Panini Comics, Mythos Editora, Pipoca & Nanquim e Quadrinhos na Cia com capas em alta resolução, selos editoriais e dados 100% autênticos.
        </p>
      </div>

      {/* Painel de Filtros e Busca */}
      <ComicFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={filteredComics.length}
      />

      {/* Grade de Resultados Paginada */}
      {filteredComics.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {displayedComics.map((comic) => (
              <div key={comic.id} className="flex justify-center">
                <ComicCard comic={comic} />
              </div>
            ))}
          </div>

          {/* Controle de Paginação Progressiva */}
          <div className="flex flex-col items-center justify-center gap-2 pt-4 pb-8">
            <span className="text-xs text-text-secondary">
              Exibindo <strong className="text-text-primary">{displayedComics.length}</strong> de{" "}
              <strong className="text-text-primary">{filteredComics.length}</strong> edições encontradas
            </span>

            {visibleCount < filteredComics.length && (
              <button
                type="button"
                onClick={handleLoadMore}
                className="mt-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-text-primary text-xs font-bold transition-all shadow-card hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Carregar mais 36 edições
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Estado Vazio */
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-bg-surface border border-border-default/60">
          <BookDashed className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-text-primary">Nenhuma edição encontrada</h3>
          <p className="text-xs text-text-secondary max-w-sm mt-1 mb-4">
            Nenhum quadrinho corresponde aos filtros selecionados. Tente ajustar os termos de busca, selecionar outro selo ou limpar os filtros.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-brand-primary text-text-primary text-xs font-bold hover:bg-brand-primary-hover transition-colors"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div>
        </div>
      }
    >
      <ExplorarContent />
    </Suspense>
  );
}
