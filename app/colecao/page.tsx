"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCollection } from "@/lib/context/collection-context";
import { ComicCard } from "@/components/comic/ComicCard";
import {
  Library,
  Heart,
  CheckCircle2,
  BookmarkCheck,
  Download,
  DollarSign,
  PieChart,
  BookOpen,
  PlusCircle,
  Star,
} from "lucide-react";

type TabType = "tenho" | "wishlist" | "lidos" | "series";

function ColecaoContent() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("aba");

  const [activeTab, setActiveTab] = useState<TabType>(
    urlTab === "wishlist" ? "wishlist" : "tenho"
  );

  const { comics, userComics, stats, showToast } = useCollection();

  // Quadrinhos filtrados por status
  const comicsTenho = comics.filter(
    (c) => userComics[c.id]?.status === "tenho" || userComics[c.id]?.status === "li"
  );
  const comicsWishlist = comics.filter((c) => userComics[c.id]?.status === "quero");
  const comicsLidos = comics.filter((c) => userComics[c.id]?.status === "li");

  // Séries agrupadas para detecção de lacunas (Gap Detection básico)
  const seriesMap: Record<string, { total: number; owned: number; missing: string[] }> = {};
  comics.forEach((comic) => {
    if (!comic.serie) return;
    if (!seriesMap[comic.serie]) {
      seriesMap[comic.serie] = { total: 0, owned: 0, missing: [] };
    }
    seriesMap[comic.serie].total++;
    const isOwned =
      userComics[comic.id]?.status === "tenho" || userComics[comic.id]?.status === "li";
    if (isOwned) {
      seriesMap[comic.serie].owned++;
    } else {
      seriesMap[comic.serie].missing.push(comic.titulo);
    }
  });

  const formattedCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  // Exportação CSV/JSON (RF-016)
  const handleExport = (format: "json" | "csv") => {
    const exportData = Object.values(userComics).map((item) => {
      const comic = comics.find((c) => c.id === item.comic_id);
      return {
        id: item.comic_id,
        titulo: comic?.titulo || "",
        editora: comic?.editora || "",
        status: item.status,
        nota: item.nota_pessoal || "N/A",
        preco_pago: item.preco_pago || comic?.preco_normal || 0,
        data_adicao: item.data_adicao,
      };
    });

    if (exportData.length === 0) {
      showToast("Sua coleção ainda não possui itens para exportar.", "info");
      return;
    }

    let blob: Blob;
    let filename: string;

    if (format === "json") {
      blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      filename = `comixflix_colecao_${Date.now()}.json`;
    } else {
      const headers = "ID,Título,Editora,Status,Nota,Preço Pago,Data Adição\n";
      const rows = exportData
        .map(
          (d) =>
            `"${d.id}","${d.titulo.replace(/"/g, '""')}","${d.editora}","${d.status}","${d.nota}","${d.preco_pago}","${d.data_adicao}"`
        )
        .join("\n");
      blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      filename = `comixflix_colecao_${Date.now()}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Coleção exportada em ${format.toUpperCase()} com sucesso!`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col gap-8">
      {/* 1. Header do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
            <Library className="w-4 h-4" /> Gestão Pessoal de Quadrinhos
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight">
            Minha Coleção
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Acompanhe sua estante física, leituras concluídas, wishlist e valor estimado do seu acervo.
          </p>
        </div>

        {/* Botões de Exportação */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleExport("json")}
            className="px-3 py-2 rounded-lg bg-bg-surface hover:bg-bg-elevated border border-border-default text-xs font-semibold text-text-primary flex items-center gap-1.5 transition-colors shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-text-tertiary" />
            JSON
          </button>
          <button
            type="button"
            onClick={() => handleExport("csv")}
            className="px-3 py-2 rounded-lg bg-bg-surface hover:bg-bg-elevated border border-border-default text-xs font-semibold text-text-primary flex items-center gap-1.5 transition-colors shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-text-tertiary" />
            CSV
          </button>
        </div>
      </div>

      {/* 2. Cards de Estatísticas e Métricas em Tempo Real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total na Estante */}
        <div className="p-4 sm:p-5 rounded-xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-xs font-semibold uppercase">Na Estante</span>
            <Library className="w-4 h-4 text-status-collection" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-text-primary mt-1">
            {stats.totalTenho}
          </span>
          <span className="text-[11px] text-text-secondary">edições cadastradas</span>
        </div>

        {/* Lidos & % de Leitura */}
        <div className="p-4 sm:p-5 rounded-xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-xs font-semibold uppercase">Leituras</span>
            <CheckCircle2 className="w-4 h-4 text-status-success" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {stats.totalLidos}
            </span>
            <span className="text-xs font-bold text-status-success">
              {stats.percentualLidos}% lido
            </span>
          </div>
          <div className="w-full bg-bg-canvas rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-status-success h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.percentualLidos, 100)}%` }}
            />
          </div>
        </div>

        {/* Wishlist */}
        <div className="p-4 sm:p-5 rounded-xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-xs font-semibold uppercase">Lista de Desejos</span>
            <Heart className="w-4 h-4 text-brand-primary fill-brand-primary" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-text-primary mt-1">
            {stats.totalQuero}
          </span>
          <span className="text-[11px] text-text-secondary">edições desejadas</span>
        </div>

        {/* Valor Estimado do Acervo */}
        <div className="p-4 sm:p-5 rounded-xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-1">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-xs font-semibold uppercase">Valor do Acervo</span>
            <DollarSign className="w-4 h-4 text-promo" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-promo mt-1 truncate">
            {formattedCurrency(stats.valorEstimadoTotal)}
          </span>
          <span className="text-[11px] text-text-secondary">investimento estimado</span>
        </div>
      </div>

      {/* 3. Distribuição por Editora (Visualização Gráfica Rápida) */}
      {Object.keys(stats.distribuicaoEditoras).length > 0 && (
        <div className="p-4 rounded-xl bg-bg-surface/60 border border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
            <PieChart className="w-4 h-4 text-brand-primary" />
            Distribuição da Estante:
          </div>
          <div className="flex items-center gap-4 flex-wrap text-xs">
            {Object.entries(stats.distribuicaoEditoras).map(([editora, count]) => (
              <div key={editora} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="font-semibold text-text-primary">{editora}:</span>
                <span className="text-text-secondary">{count} un.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Abas da Coleção (Estante, Wishlist, Lidos, Séries) */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-border-default overflow-x-auto pb-px scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("tenho")}
            className={`min-h-[44px] px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === "tenho"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Library className="w-4 h-4" />
            Estante ({comicsTenho.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`min-h-[44px] px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === "wishlist"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Heart className="w-4 h-4" />
            Wishlist ({comicsWishlist.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lidos")}
            className={`min-h-[44px] px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === "lidos"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Lidos ({comicsLidos.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("series")}
            className={`min-h-[44px] px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === "series"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            Séries & Lacunas ({Object.keys(seriesMap).length})
          </button>
        </div>

        {/* 5. Conteúdo da Aba Ativa */}
        {activeTab === "tenho" && (
          <div>
            {comicsTenho.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {comicsTenho.map((comic) => (
                  <div key={comic.id} className="flex justify-center">
                    <ComicCard comic={comic} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-bg-surface border border-border-default/60">
                <Library className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
                <h3 className="text-base font-bold text-text-primary">Sua estante está vazia</h3>
                <p className="text-xs text-text-secondary max-w-sm mt-1 mb-4">
                  Marque as edições que você possui para acompanhar estatísticas de leitura e valor do seu acervo.
                </p>
                <Link
                  href="/explorar"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-text-primary text-xs font-bold hover:bg-brand-primary-hover flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Explorar e Adicionar Quadrinhos
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            {comicsWishlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {comicsWishlist.map((comic) => (
                  <div key={comic.id} className="flex justify-center">
                    <ComicCard comic={comic} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-bg-surface border border-border-default/60">
                <Heart className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
                <h3 className="text-base font-bold text-text-primary">Sua Wishlist está vazia</h3>
                <p className="text-xs text-text-secondary max-w-sm mt-1 mb-4">
                  Navegue pelo catálogo e clique no coração para salvar os quadrinhos que você deseja adquirir.
                </p>
                <Link
                  href="/explorar"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-text-primary text-xs font-bold hover:bg-brand-primary-hover transition-colors"
                >
                  Ver lançamentos e ofertas
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "lidos" && (
          <div>
            {comicsLidos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {comicsLidos.map((comic) => {
                  const rating = userComics[comic.id]?.nota_pessoal;
                  return (
                    <div key={comic.id} className="flex flex-col items-center gap-1">
                      <ComicCard comic={comic} />
                      {rating && (
                        <div className="flex items-center gap-1 text-promo text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {rating}.0
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-bg-surface border border-border-default/60">
                <CheckCircle2 className="w-12 h-12 text-text-tertiary mb-3 stroke-[1.5]" />
                <h3 className="text-base font-bold text-text-primary">Nenhuma leitura registrada</h3>
                <p className="text-xs text-text-secondary max-w-sm mt-1 mb-4">
                  Conforme terminar de ler suas edições, marque-as como lidas e avalie de 1 a 5 estrelas.
                </p>
                <Link
                  href="/explorar"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-text-primary text-xs font-bold hover:bg-brand-primary-hover transition-colors"
                >
                  Explorar catálogo
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "series" && (
          <div className="flex flex-col gap-4">
            {Object.entries(seriesMap).map(([serieName, data]) => {
              const percent = Math.round((data.owned / data.total) * 100);
              return (
                <div
                  key={serieName}
                  className="p-5 rounded-xl bg-bg-surface border border-border-default flex flex-col gap-3 shadow-card"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-text-primary">{serieName}</h3>
                      <span className="text-xs text-text-secondary">
                        {data.owned} de {data.total} edições na estante ({percent}% completo)
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        percent === 100
                          ? "bg-status-success/20 text-status-success border border-status-success/40"
                          : "bg-status-warning/20 text-status-warning border border-status-warning/40"
                      }`}
                    >
                      {percent === 100 ? "Coleção Completa" : `${data.total - data.owned} Faltando`}
                    </span>
                  </div>

                  {/* Barra de Progresso da Série */}
                  <div className="w-full bg-bg-canvas rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-primary h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Lacunas detectadas */}
                  {data.missing.length > 0 && (
                    <div className="text-xs text-text-tertiary flex items-center gap-1.5 flex-wrap pt-1">
                      <strong className="text-text-secondary">Edições faltantes no catálogo:</strong>
                      {data.missing.map((title) => (
                        <span key={title} className="px-2 py-0.5 rounded bg-bg-elevated text-text-primary text-[11px]">
                          {title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ColecaoPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-text-secondary text-sm">Carregando estante...</div>}>
      <ColecaoContent />
    </Suspense>
  );
}
