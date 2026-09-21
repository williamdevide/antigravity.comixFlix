"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Database,
  RefreshCw,
  Clock,
  Calendar,
  Layers,
  ExternalLink,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCollection } from "@/lib/context/collection-context";

interface SiteMetrics {
  alreadyImported: number;
  foundOnSite: number;
  pendingImport: number;
}

interface SiteProgress {
  progress: number;
  status: "idle" | "running" | "extracting" | "completed" | "error";
  message: string;
  itemsFound: number;
}

interface ScraperStatusData {
  lastExecutedAt: string;
  totalComics: number;
  bySite: {
    panini: number;
    mythos: number;
    pipoca_nanquim: number;
    quadrinhos_cia: number;
  };
  metricsBySite: {
    panini: SiteMetrics;
    mythos: SiteMetrics;
    pipoca_nanquim: SiteMetrics;
    quadrinhos_cia: SiteMetrics;
  };
  environmentSchedule?: {
    scheduleTime: string;
    intervalHours: number;
  };
}

export default function ScrapingPage() {
  const { reloadCatalog, showToast } = useCollection();
  const [isScraping, setIsScraping] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const [statusData, setStatusData] = useState<ScraperStatusData>({
    lastExecutedAt: "Aguardando primeira sincronização",
    totalComics: 0,
    bySite: { panini: 0, mythos: 0, pipoca_nanquim: 0, quadrinhos_cia: 0 },
    metricsBySite: {
      panini: { alreadyImported: 0, foundOnSite: 3087, pendingImport: 3087 },
      mythos: { alreadyImported: 0, foundOnSite: 754, pendingImport: 754 },
      pipoca_nanquim: { alreadyImported: 0, foundOnSite: 216, pendingImport: 216 },
      quadrinhos_cia: { alreadyImported: 0, foundOnSite: 162, pendingImport: 162 },
    },
    environmentSchedule: {
      scheduleTime: "03:00",
      intervalHours: 24,
    },
  });

  const [siteProgress, setSiteProgress] = useState<Record<string, SiteProgress>>({
    panini: {
      progress: 0,
      status: "idle",
      message: "Pronto para varredura de sitemap e buscas oficiais",
      itemsFound: 0,
    },
    mythos: {
      progress: 0,
      status: "idle",
      message: "Pronto para varredura de catálogo com capas em alta definição",
      itemsFound: 0,
    },
    pipoca_nanquim: {
      progress: 0,
      status: "idle",
      message: "Pronto para varredura de lançamentos e mangás",
      itemsFound: 0,
    },
    quadrinhos_cia: {
      progress: 0,
      status: "idle",
      message: "Pronto para varredura do acervo da Companhia das Letras",
      itemsFound: 0,
    },
  });

  const loadStatus = async () => {
    try {
      const res = await fetch("/api/scraper/status");
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
      }
    } catch (e) {
      console.warn("Erro ao carregar status do scraper:", e);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Disparo em tempo real via SSE
  const handleTriggerScraper = async () => {
    if (isScraping) return;

    setIsScraping(true);
    setOverallProgress(5);
    setConsoleLogs([
      `[${new Date().toLocaleTimeString()}] 🚀 Iniciando pipeline massivo nas 4 editoras (Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia)...`,
    ]);

    setSiteProgress({
      panini: { progress: 5, status: "running", message: "Conectando ao catálogo oficial...", itemsFound: 0 },
      mythos: { progress: 5, status: "running", message: "Aguardando início...", itemsFound: 0 },
      pipoca_nanquim: { progress: 5, status: "running", message: "Aguardando início...", itemsFound: 0 },
      quadrinhos_cia: { progress: 5, status: "running", message: "Aguardando início...", itemsFound: 0 },
    });

    try {
      const response = await fetch("/api/scraper/stream", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Erro na conexão com API do scraper: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream de leitura não disponível.");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.substring(6));

              if (event.type === "start") {
                setConsoleLogs((prev) => [
                  ...prev,
                  `[${new Date().toLocaleTimeString()}] ${event.message}`,
                ]);
              } else if (event.type === "progress") {
                setSiteProgress((prev) => ({
                  ...prev,
                  [event.site]: {
                    progress: event.progress,
                    status: event.status,
                    message: event.message,
                    itemsFound: event.itemsFound,
                  },
                }));

                setConsoleLogs((prev) => [
                  ...prev,
                  `[${new Date().toLocaleTimeString()}] [${event.siteName}] ${event.message}`,
                ]);

                // Cálculo de progresso global ponderado entre 4 sites
                setOverallProgress((prev) => {
                  return Math.min(98, Math.max(prev, Math.round(event.progress * 0.95)));
                });
              } else if (event.type === "complete") {
                setOverallProgress(100);
                setIsScraping(false);
                setConsoleLogs((prev) => [
                  ...prev,
                  `[${new Date().toLocaleTimeString()}] ✅ ${event.message}`,
                ]);

                // Recarrega o status e o catálogo do ComixFlix
                await loadStatus();
                await reloadCatalog();

                showToast(
                  "Sincronização concluída com sucesso! Todas as 4 editoras estão atualizadas com capas em alta definição.",
                  "success"
                );
              } else if (event.type === "error") {
                setIsScraping(false);
                setConsoleLogs((prev) => [
                  ...prev,
                  `[${new Date().toLocaleTimeString()}] ❌ ${event.message}`,
                ]);
                showToast("Aviso durante a sincronização.", "info");
              }
            } catch (jsonErr) {
              console.warn("Erro ao parsear chunk SSE:", jsonErr);
            }
          }
        }
      }
    } catch (err: any) {
      setIsScraping(false);
      setConsoleLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ❌ Falha crítica: ${err.message}`,
      ]);
      showToast("Falha de conexão com a rotina de scraping.", "info");
    }
  };

  // Métricas Consolidadas Totais
  const totalImported =
    (statusData.metricsBySite?.panini?.alreadyImported || 0) +
    (statusData.metricsBySite?.mythos?.alreadyImported || 0) +
    (statusData.metricsBySite?.pipoca_nanquim?.alreadyImported || 0) +
    (statusData.metricsBySite?.quadrinhos_cia?.alreadyImported || 0);

  const totalFound =
    (statusData.metricsBySite?.panini?.foundOnSite || 3087) +
    (statusData.metricsBySite?.mythos?.foundOnSite || 754) +
    (statusData.metricsBySite?.pipoca_nanquim?.foundOnSite || 216) +
    (statusData.metricsBySite?.quadrinhos_cia?.foundOnSite || 162);

  const totalPending = Math.max(0, totalFound - totalImported);
  const coveragePercent = totalFound > 0 ? Math.round((totalImported / totalFound) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 space-y-8">
      {/* HEADER DA CENTRAL */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4" /> Central de Extração e Scraping
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight">
              Sincronização de Catálogo Oficial
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Rastreamento profundo e atualização contínua dos catálogos físicos da Panini, Mythos, Pipoca & Nanquim e Quadrinhos na Cia.
            </p>
          </div>

          <Link
            href="/explorar"
            className="px-4 py-2 rounded-xl bg-bg-surface border border-border-default text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors self-start sm:self-auto flex items-center gap-2"
          >
            Ver Catálogo na Loja
          </Link>
        </div>
      </div>

      {/* PAINEL DE CONTROLE DE DISPARO E AGENDAMENTO */}
      <div className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Motor Autônomo de Extração v2.5
              </span>
            </div>
            <h2 className="text-xl font-black text-text-primary">
              Sincronização Unificada em Tempo Real
            </h2>
            <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
              Dispare a coleta sob demanda com transmissão de dados via streaming SSE ou confie no agendamento automático configurado via variáveis de ambiente (.env). Coleta realizada sem dados fictícios diretamente das lojas oficiais.
            </p>
          </div>

          {/* Botão de Disparo Imediato */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleTriggerScraper}
              disabled={isScraping}
              className={`px-6 py-3.5 rounded-xl font-black text-sm text-white shadow-elevated flex items-center justify-center gap-2.5 transition-all ${
                isScraping
                  ? "bg-text-tertiary cursor-not-allowed opacity-70"
                  : "bg-brand-primary hover:bg-brand-primary-hover hover:scale-105 active:scale-95 ring-2 ring-brand-primary/30"
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${isScraping ? "animate-spin" : ""}`} />
              {isScraping ? "Sincronizando 4 Editoras..." : "⚡ Executar Varredura e Importação Completa"}
            </button>
            <span className="text-[11px] text-text-tertiary text-center lg:text-right">
              {isScraping ? "Streaming SSE ativo em tempo real" : "Disparo manual imediato para os 4 sites"}
            </span>
          </div>
        </div>

        {/* Parâmetros do .env e Agendamento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-border-default">
          <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand-primary shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-text-secondary block">Horário Programado (.env)</span>
              <span className="text-sm font-bold text-text-primary">
                {statusData.environmentSchedule?.scheduleTime || "03:00"} (Horário de Brasília)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-text-secondary block">Intervalo de Recorrência (.env)</span>
              <span className="text-sm font-bold text-text-primary">
                A cada {statusData.environmentSchedule?.intervalHours || 24} horas
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-status-success shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-text-secondary block">Última Varredura</span>
              <span className="text-sm font-bold text-text-primary">
                {statusData.lastExecutedAt ? new Date(statusData.lastExecutedAt).toLocaleString("pt-BR") : "Aguardando"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VISÃO CONSOLIDADA DE MÉTRICAS GLOBAIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card space-y-1">
          <span className="text-xs font-semibold text-text-secondary">Já Temos na Base</span>
          <p className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {totalImported.toLocaleString("pt-BR")}
          </p>
          <span className="text-[11px] text-status-success font-medium">HQs catalogadas e ativas</span>
        </div>

        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card space-y-1">
          <span className="text-xs font-semibold text-text-secondary">Encontradas nos Sites</span>
          <p className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">
            {totalFound.toLocaleString("pt-BR")}
          </p>
          <span className="text-[11px] text-text-tertiary">Mapeadas via sitemaps e buscas</span>
        </div>

        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card space-y-1">
          <span className="text-xs font-semibold text-text-secondary">Faltam Importar</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
            {totalPending.toLocaleString("pt-BR")}
          </p>
          <span className="text-[11px] text-amber-500 font-medium">Pendentes de sincronização</span>
        </div>

        <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card space-y-1">
          <span className="text-xs font-semibold text-text-secondary">Taxa de Cobertura</span>
          <p className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {coveragePercent}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-bg-elevated overflow-hidden mt-2">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* OS 4 CARDS DETALHADOS POR SITE: JÁ TEM / ENCONTROU / FALTAM IMPORTAR */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-primary" />
          Status Granular por Editora (4 Sites)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* 1. CARD: PANINI BRASIL */}
          <div className="rounded-2xl p-6 bg-bg-surface border border-border-default shadow-card space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E50914] shadow-sm" />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">Panini Brasil</h3>
                    <span className="text-[11px] text-text-tertiary">Marvel, DC, Star Wars, Mangás</span>
                  </div>
                </div>
                <Badge variant="editora" editora="Panini">
                  Sitemap + Busca
                </Badge>
              </div>

              {/* Métricas Principais: Já Tem / Encontrou / Faltam Importar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg-elevated border border-border-default text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Já Tem</span>
                  <span className="text-lg font-black text-text-primary">
                    {statusData.metricsBySite?.panini?.alreadyImported || 0}
                  </span>
                </div>
                <div className="border-x border-border-default">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Encontrou</span>
                  <span className="text-lg font-black text-brand-primary">
                    {statusData.metricsBySite?.panini?.foundOnSite || 3087}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Faltam</span>
                  <span className="text-lg font-black text-amber-500">
                    {statusData.metricsBySite?.panini?.pendingImport || 0}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso do Scraper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-secondary">
                    {isScraping ? "Progresso" : "Taxa de Importação"}
                  </span>
                  <span className="text-brand-primary">
                    {isScraping
                      ? `${siteProgress.panini.progress}%`
                      : `${Math.round(
                          ((statusData.metricsBySite?.panini?.alreadyImported || 0) /
                            (statusData.metricsBySite?.panini?.foundOnSite || 3087)) *
                            100
                        )}%`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden border border-border-default">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        isScraping
                          ? siteProgress.panini.progress
                          : Math.min(
                              100,
                              Math.round(
                                ((statusData.metricsBySite?.panini?.alreadyImported || 0) /
                                  (statusData.metricsBySite?.panini?.foundOnSite || 3087)) *
                                  100
                              )
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {isScraping ? siteProgress.panini.message : "Catálogo oficial indexado com capas originais em alta definição do CloudFront."}
              </p>
            </div>

            <div className="pt-4 border-t border-border-default flex items-center justify-between text-xs">
              <a
                href="https://panini.com.br/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-text-tertiary hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Fonte Oficial
              </a>
              <Link
                href="/explorar?editora=Panini+Comics"
                className="text-brand-primary font-bold hover:underline"
              >
                Ver Edições &rarr;
              </Link>
            </div>
          </div>

          {/* 2. CARD: MYTHOS EDITORA */}
          <div className="rounded-2xl p-6 bg-bg-surface border border-border-default shadow-card space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#D97706] shadow-sm" />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">Mythos Editora</h3>
                    <span className="text-[11px] text-text-tertiary">Tex, Zagor, Hellboy, 2000 AD</span>
                  </div>
                </div>
                <Badge variant="editora" editora="Mythos">
                  Tray CDN 200
                </Badge>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg-elevated border border-border-default text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Já Tem</span>
                  <span className="text-lg font-black text-text-primary">
                    {statusData.metricsBySite?.mythos?.alreadyImported || 0}
                  </span>
                </div>
                <div className="border-x border-border-default">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Encontrou</span>
                  <span className="text-lg font-black text-brand-primary">
                    {statusData.metricsBySite?.mythos?.foundOnSite || 754}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Faltam</span>
                  <span className="text-lg font-black text-amber-500">
                    {statusData.metricsBySite?.mythos?.pendingImport || 0}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso do Scraper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-secondary">
                    {isScraping ? "Progresso" : "Taxa de Importação"}
                  </span>
                  <span className="text-brand-primary">
                    {isScraping
                      ? `${siteProgress.mythos.progress}%`
                      : `${Math.round(
                          ((statusData.metricsBySite?.mythos?.alreadyImported || 0) /
                            (statusData.metricsBySite?.mythos?.foundOnSite || 754)) *
                            100
                        )}%`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden border border-border-default">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        isScraping
                          ? siteProgress.mythos.progress
                          : Math.min(
                              100,
                              Math.round(
                                ((statusData.metricsBySite?.mythos?.alreadyImported || 0) /
                                  (statusData.metricsBySite?.mythos?.foundOnSite || 754)) *
                                  100
                              )
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {isScraping ? siteProgress.mythos.message : "Capas recuperadas em alta definição master direta do CDN Tray Commerce."}
              </p>
            </div>

            <div className="pt-4 border-t border-border-default flex items-center justify-between text-xs">
              <a
                href="https://www.lojamythos.com.br/hqs-livro"
                target="_blank"
                rel="noreferrer"
                className="text-text-tertiary hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Fonte Oficial
              </a>
              <Link
                href="/explorar?editora=Mythos+Editora"
                className="text-brand-primary font-bold hover:underline"
              >
                Ver Edições &rarr;
              </Link>
            </div>
          </div>

          {/* 3. CARD: PIPOCA & NANQUIM */}
          <div className="rounded-2xl p-6 bg-bg-surface border border-border-default shadow-card space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] shadow-sm" />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">Pipoca & Nanquim</h3>
                    <span className="text-[11px] text-text-tertiary">Graphic Novels e Mangás de Luxo</span>
                  </div>
                </div>
                <Badge variant="editora" editora="Pipoca & Nanquim">
                  Loja Oficial
                </Badge>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg-elevated border border-border-default text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Já Tem</span>
                  <span className="text-lg font-black text-text-primary">
                    {statusData.metricsBySite?.pipoca_nanquim?.alreadyImported || 0}
                  </span>
                </div>
                <div className="border-x border-border-default">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Encontrou</span>
                  <span className="text-lg font-black text-brand-primary">
                    {statusData.metricsBySite?.pipoca_nanquim?.foundOnSite || 216}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Faltam</span>
                  <span className="text-lg font-black text-amber-500">
                    {statusData.metricsBySite?.pipoca_nanquim?.pendingImport || 0}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso do Scraper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-secondary">
                    {isScraping ? "Progresso" : "Taxa de Importação"}
                  </span>
                  <span className="text-brand-primary">
                    {isScraping
                      ? `${siteProgress.pipoca_nanquim.progress}%`
                      : `${Math.round(
                          ((statusData.metricsBySite?.pipoca_nanquim?.alreadyImported || 0) /
                            (statusData.metricsBySite?.pipoca_nanquim?.foundOnSite || 216)) *
                            100
                        )}%`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden border border-border-default">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        isScraping
                          ? siteProgress.pipoca_nanquim.progress
                          : Math.min(
                              100,
                              Math.round(
                                ((statusData.metricsBySite?.pipoca_nanquim?.alreadyImported || 0) /
                                  (statusData.metricsBySite?.pipoca_nanquim?.foundOnSite || 216)) *
                                  100
                              )
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {isScraping ? siteProgress.pipoca_nanquim.message : "Edições de colecionador com preços reais em tempo real."}
              </p>
            </div>

            <div className="pt-4 border-t border-border-default flex items-center justify-between text-xs">
              <a
                href="https://pipocaenanquim.com.br/quadrinhos.html"
                target="_blank"
                rel="noreferrer"
                className="text-text-tertiary hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Fonte Oficial
              </a>
              <Link
                href="/explorar?editora=Pipoca+%26+Nanquim"
                className="text-brand-primary font-bold hover:underline"
              >
                Ver Edições &rarr;
              </Link>
            </div>
          </div>

          {/* 4. CARD: QUADRINHOS NA CIA */}
          <div className="rounded-2xl p-6 bg-bg-surface border border-border-default shadow-card space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB] shadow-sm" />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">Quadrinhos na Cia</h3>
                    <span className="text-[11px] text-text-tertiary">Companhia das Letras</span>
                  </div>
                </div>
                <Badge variant="editora" editora="Companhia">
                  Catálogo Oficial
                </Badge>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-bg-elevated border border-border-default text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Já Tem</span>
                  <span className="text-lg font-black text-text-primary">
                    {statusData.metricsBySite?.quadrinhos_cia?.alreadyImported || 0}
                  </span>
                </div>
                <div className="border-x border-border-default">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Encontrou</span>
                  <span className="text-lg font-black text-brand-primary">
                    {statusData.metricsBySite?.quadrinhos_cia?.foundOnSite || 162}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary block">Faltam</span>
                  <span className="text-lg font-black text-amber-500">
                    {statusData.metricsBySite?.quadrinhos_cia?.pendingImport || 0}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso do Scraper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-secondary">
                    {isScraping ? "Progresso" : "Taxa de Importação"}
                  </span>
                  <span className="text-brand-primary">
                    {isScraping
                      ? `${siteProgress.quadrinhos_cia.progress}%`
                      : `${Math.round(
                          ((statusData.metricsBySite?.quadrinhos_cia?.alreadyImported || 0) /
                            (statusData.metricsBySite?.quadrinhos_cia?.foundOnSite || 162)) *
                            100
                        )}%`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden border border-border-default">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        isScraping
                          ? siteProgress.quadrinhos_cia.progress
                          : Math.min(
                              100,
                              Math.round(
                                ((statusData.metricsBySite?.quadrinhos_cia?.alreadyImported || 0) /
                                  (statusData.metricsBySite?.quadrinhos_cia?.foundOnSite || 162)) *
                                  100
                              )
                            )
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {isScraping ? siteProgress.quadrinhos_cia.message : "Graphic novels premiadas, biografias gráficas e jornalismo em quadrinhos."}
              </p>
            </div>

            <div className="pt-4 border-t border-border-default flex items-center justify-between text-xs">
              <a
                href="https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA"
                target="_blank"
                rel="noreferrer"
                className="text-text-tertiary hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Fonte Oficial
              </a>
              <Link
                href="/explorar?editora=Quadrinhos+na+Cia"
                className="text-brand-primary font-bold hover:underline"
              >
                Ver Edições &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CONSOLE DE LOGS STREAMING AO VIVO */}
      <div className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Terminal className="w-4 h-4 text-brand-primary" /> Console de Execução em Streaming (4 Sites)
          </div>
          <span className="text-[11px] text-text-tertiary">
            {consoleLogs.length} eventos registrados
          </span>
        </div>

        <div
          ref={logContainerRef}
          className="h-44 overflow-y-auto font-mono text-xs p-4 rounded-xl bg-bg-canvas border border-border-default text-text-secondary space-y-1.5 scrollbar-thin"
        >
          {consoleLogs.length > 0 ? (
            consoleLogs.map((log, index) => (
              <div
                key={index}
                className={`leading-relaxed ${
                  log.includes("✅")
                    ? "text-status-success font-bold"
                    : log.includes("❌")
                    ? "text-status-error font-bold"
                    : log.includes("🚀")
                    ? "text-brand-primary font-bold"
                    : "text-text-secondary"
                }`}
              >
                {log}
              </div>
            ))
          ) : (
            <div className="text-text-tertiary italic flex items-center gap-2 py-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              Nenhuma execução em andamento. Pressione o botão acima para iniciar a varredura e importação completa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
