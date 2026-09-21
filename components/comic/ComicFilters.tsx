"use client";

import React from "react";
import { FilterOptions } from "@/lib/types/comic";
import { Search, X, ArrowUpDown, Tag, Bookmark } from "lucide-react";

interface ComicFiltersProps {
  filters: FilterOptions;
  onChange: (updated: FilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

const IMPRINTS_BY_PUBLISHER: Record<string, string[]> = {
  "Panini Comics": [
    "Todos os Selos",
    "Marvel Comics",
    "DC Comics",
    "Planet Manga",
    "Vertigo / Black Label",
    "Mauricio de Sousa Produções (MSP)",
    "Star Wars",
    "Disney",
  ],
  "Mythos Editora": [
    "Todos os Selos",
    "Sergio Bonelli Editore",
    "Dark Horse Comics",
    "2000 AD",
    "Mythos Books",
  ],
  "Pipoca & Nanquim": [
    "Todos os Selos",
    "Graphic Novels",
    "Mangás",
    "Clássicos Europeus / Franco-Belgas",
    "Quadrinhos Nacionais / Originais PN",
  ],
  "Quadrinhos na Cia": [
    "Todos os Selos",
    "Clássicos e Ficção Literária",
    "Biografias Gráficas",
    "Não-Ficção e Jornalismo",
    "Autores Brasileiros",
    "Mangá Alternativo",
  ],
};

export const ComicFilters: React.FC<ComicFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const publishers = [
    "Todas",
    "Panini Comics",
    "Pipoca & Nanquim",
    "Mythos Editora",
    "Quadrinhos na Cia",
  ];
  const formats = ["Todos", "Capa Dura", "Omnibus", "Edição de Luxo", "Brochura"];
  const sortOptions = [
    { value: "relevancia", label: "Relevância" },
    { value: "recentes", label: "Mais Recentes" },
    { value: "menor_preco", label: "Menor Preço" },
    { value: "maior_preco", label: "Maior Preço" },
    { value: "titulo_az", label: "Título (A-Z)" },
  ];

  const currentImprints = filters.editora ? IMPRINTS_BY_PUBLISHER[filters.editora] || [] : [];

  const hasActiveFilters =
    filters.busca ||
    (filters.editora && filters.editora !== "Todas") ||
    (filters.selo && filters.selo !== "Todos os Selos") ||
    (filters.formato && filters.formato !== "Todos") ||
    filters.somentePromocao;

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-xl bg-bg-surface border border-border-default/60 shadow-card">
      {/* Busca Textual Principal */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título, autor, herói, selo ou ISBN..."
            value={filters.busca}
            onChange={(e) => onChange({ ...filters, busca: e.target.value })}
            className="w-full h-11 pl-10 pr-10 rounded-lg bg-bg-canvas border border-border-default text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary"
          />
          {filters.busca && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, busca: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-text-tertiary shrink-0 hidden sm:block" />
          <select
            value={filters.ordenacao}
            onChange={(e) =>
              onChange({ ...filters, ordenacao: e.target.value as FilterOptions["ordenacao"] })
            }
            className="h-11 px-3 rounded-lg bg-bg-canvas border border-border-default text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary w-full sm:w-44"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chips de Editoras */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
          Editoras
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {publishers.map((pub) => {
            const isSelected =
              filters.editora === pub || (!filters.editora && pub === "Todas");
            return (
              <button
                key={pub}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    editora: pub === "Todas" ? "" : pub,
                    selo: "", // Reseta o selo ao alternar editora
                  })
                }
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-brand-primary text-text-primary shadow-md scale-105"
                    : "bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-bg-elevated/80 border border-border-default/60"
                }`}
              >
                {pub}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBFILTRO DE SELOS (Aparece dinamicamente ao selecionar uma editora específica) */}
      {filters.editora && filters.editora !== "Todas" && currentImprints.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 animate-fadeIn border-t border-border-default/30">
          <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            Selos de {filters.editora}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {currentImprints.map((selo) => {
              const isSelected =
                filters.selo === selo ||
                (!filters.selo && selo === "Todos os Selos");
              return (
                <button
                  key={selo}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      selo: selo === "Todos os Selos" ? "" : selo,
                    })
                  }
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-text-primary text-bg-canvas font-bold shadow-sm"
                      : "bg-bg-elevated/70 text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-border-default/50"
                  }`}
                >
                  {selo}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtro Rápido de Promoções & Formatos */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-default/40">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Promoção */}
          <button
            type="button"
            onClick={() =>
              onChange({ ...filters, somentePromocao: !filters.somentePromocao })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              filters.somentePromocao
                ? "bg-promo text-bg-canvas shadow-md"
                : "bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default/60"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Somente com Desconto
          </button>

          {/* Formatos */}
          {formats.map((fmt) => {
            const isFmtSelected =
              filters.formato === fmt || (!filters.formato && fmt === "Todos");
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => onChange({ ...filters, formato: fmt === "Todos" ? "" : fmt })}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isFmtSelected
                    ? "bg-text-primary text-bg-canvas font-bold"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>

        {/* Contador de Resultados e Botão Limpar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-tertiary">
            {totalResults} {totalResults === 1 ? "edição encontrada" : "edições encontradas"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover underline underline-offset-2"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
