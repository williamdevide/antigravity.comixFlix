"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Heart,
  BookOpen,
  Share2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCollection } from "@/lib/context/collection-context";

interface SeriesIssue {
  volume: number;
  title: string;
  subtitle: string;
  year: string;
  coverUrl: string;
  status: "tenho" | "lido" | "falta";
  price: number;
}

const BATMAN_SNYDER_ISSUES: SeriesIssue[] = [
  {
    volume: 1,
    title: "Batman: Corte das Corujas",
    subtitle: "Edição Definitiva Vol. 01 (Novos 52)",
    year: "2012",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AACES001.jpg",
    status: "lido",
    price: 89.9,
  },
  {
    volume: 2,
    title: "Batman: Cidade das Corujas",
    subtitle: "Edição Definitiva Vol. 02 (Novos 52)",
    year: "2013",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AACES002_1.jpg",
    status: "lido",
    price: 89.9,
  },
  {
    volume: 3,
    title: "Batman: Morte da Família",
    subtitle: "Edição Definitiva Vol. 03 (Novos 52)",
    year: "2013",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AADDO001.jpg",
    status: "falta", // Lacuna detectada!
    price: 94.9,
  },
  {
    volume: 4,
    title: "Batman: Ano Zero — Cidade Secreta",
    subtitle: "Edição Definitiva Vol. 04 (Novos 52)",
    year: "2014",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AADIE001.jpg",
    status: "tenho",
    price: 89.9,
  },
  {
    volume: 5,
    title: "Batman: Ano Zero — Cidade Sombria",
    subtitle: "Edição Definitiva Vol. 05 (Novos 52)",
    year: "2014",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AADIE002.jpg",
    status: "tenho",
    price: 89.9,
  },
  {
    volume: 6,
    title: "Batman: Cemitério",
    subtitle: "Edição Definitiva Vol. 06 (Novos 52)",
    year: "2015",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AADDO002.jpg",
    status: "tenho",
    price: 89.9,
  },
  {
    volume: 7,
    title: "Batman: Fim de Jogo",
    subtitle: "Edição Definitiva Vol. 07 (Novos 52)",
    year: "2015",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AADTH001.jpg",
    status: "falta", // Lacuna detectada!
    price: 99.9,
  },
  {
    volume: 8,
    title: "Batman: Peso Pesado",
    subtitle: "Edição Definitiva Vol. 08 (Novos 52)",
    year: "2016",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AAGEN001.jpg",
    status: "tenho",
    price: 89.9,
  },
  {
    volume: 9,
    title: "Batman: Bloom",
    subtitle: "Edição Definitiva Vol. 09 (Novos 52)",
    year: "2016",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AAHDB002.png",
    status: "tenho",
    price: 89.9,
  },
  {
    volume: 10,
    title: "Batman: Epílogo",
    subtitle: "Edição Definitiva Vol. 10 (Novos 52)",
    year: "2016",
    coverUrl: "https://panini.com.br/media/catalog/product/A/A/AAGWA001.jpg",
    status: "tenho",
    price: 94.9,
  },
];

export default function SeriesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useCollection();

  const [isFollowing, setIsFollowing] = useState(true);
  const [issues, setIssues] = useState<SeriesIssue[]>(BATMAN_SNYDER_ISSUES);

  const totalIssues = issues.length;
  const ownedCount = issues.filter((i) => i.status === "tenho" || i.status === "lido").length;
  const missingIssues = issues.filter((i) => i.status === "falta");
  const completionPercentage = Math.round((ownedCount / totalIssues) * 100);

  const handleToggleStatus = (volume: number) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.volume === volume) {
          const nextStatus = item.status === "falta" ? "tenho" : item.status === "tenho" ? "lido" : "falta";
          showToast(`Volume #${volume} atualizado para status: ${nextStatus.toUpperCase()}`, "success");
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Botão de Voltar */}
      <div className="flex items-center justify-between">
        <Link
          href="/explorar"
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </Link>
        <span className="text-xs text-text-tertiary font-mono">Série ID: {slug || "batman-snyder"}</span>
      </div>

      {/* Hero da Série inspirado no Stitch (Screen ca00a27cd08347e6a8d58fac36dab63a) */}
      <div className="relative rounded-3xl overflow-hidden border border-border-default bg-bg-surface shadow-card">
        <div className="h-64 sm:h-80 relative bg-gradient-to-t from-bg-surface via-black/70 to-black/90">
          <img
            src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
            alt="Batman Novos 52"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent" />

          {/* Badges superiores */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <Badge variant="editora" editora="Panini">
              DC Comics • Novos 52
            </Badge>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300">
              Fase Completa (2011–2016)
            </span>
          </div>

          {/* Informações Centrais do Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Batman: Fase Snyder & Capullo
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                A run histórica e aclamada que redefiniu o Cavaleiro das Trevas no reboot dos Novos 52. Introduziu a lendária Corte das Corujas e o Coringa definitivo de Snyder.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">
                <span>Roteiro: <strong>Scott Snyder</strong></span>
                <span>•</span>
                <span>Arte: <strong>Greg Capullo</strong></span>
                <span>•</span>
                <span>Volumes: <strong>10 Edições</strong></span>
              </div>
            </div>

            {/* Ação de Seguir Série */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  showToast(isFollowing ? "Deixou de seguir a série" : "Você está seguindo a série!", "info");
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isFollowing
                    ? "bg-brand-primary text-white shadow-elevated"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {isFollowing ? "Seguindo Série" : "Seguir Série"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE COMPLETUDE DA RUN & ALERTA DE LACUNAS (STITCH SPEC) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progresso de Coleção */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-bg-surface border border-border-default shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h2 className="text-sm font-black text-text-primary uppercase tracking-wider">
                Completude da sua Estante
              </h2>
            </div>
            <span className="text-base font-black text-brand-primary font-mono">
              {ownedCount} de {totalIssues} Edições ({completionPercentage}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-bg-elevated overflow-hidden border border-border-default">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Alerta de Lacunas Identificadas */}
          {missingIssues.length > 0 ? (
            <div className="p-4 rounded-2xl bg-status-warning/10 border border-status-warning/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-text-primary block">
                  Identificamos {missingIssues.length} lacunas para completar esta run:
                </span>
                <p className="text-text-secondary leading-relaxed">
                  Faltam em sua coleção:{" "}
                  {missingIssues.map((m) => `Vol. #${m.volume} (${m.title})`).join(" e ")}.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-status-success/10 border border-status-success/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
              <span className="text-xs font-bold text-status-success">
                Parabéns! Você possui todas as 10 edições desta run histórica na sua estante!
              </span>
            </div>
          )}
        </div>

        {/* Card de Aquisição / Completar Série */}
        <div className="p-6 rounded-3xl bg-bg-surface border border-border-default shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Investimento Estimado
            </span>
            <p className="text-2xl font-black text-text-primary">
              R${" "}
              {missingIssues
                .reduce((acc, curr) => acc + curr.price, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Valor estimado para adquirir os {missingIssues.length} volumes faltantes e platinar a série.
            </p>
          </div>

          <button
            type="button"
            onClick={() => showToast("Volumes faltantes adicionados à Wishlist!", "success")}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-black shadow-card transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Adicionar Faltantes à Wishlist
          </button>
        </div>
      </div>

      {/* CHECKLIST DE TODAS AS EDIÇÕES DA RUN COM STATUS INTERATIVO */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-primary" />
          Checklist Cronológico das 10 Edições
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {issues.map((issue) => {
            const isOwned = issue.status === "tenho" || issue.status === "lido";
            const isRead = issue.status === "lido";

            return (
              <div
                key={issue.volume}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  issue.status === "falta"
                    ? "bg-bg-surface/50 border-dashed border-status-warning/40 opacity-80 hover:opacity-100"
                    : "bg-bg-surface border-border-default shadow-card hover:border-brand-primary/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-elevated">
                    <img
                      src={issue.coverUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-black text-white">
                      Vol. {issue.volume}
                    </span>

                    {/* Badge do Status Atual */}
                    <div className="absolute bottom-2 right-2">
                      {isRead ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> Lido
                        </span>
                      ) : isOwned ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/90 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1 shadow-sm">
                          Tenho
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1 shadow-sm">
                          Falta
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-text-primary line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="text-[10px] text-text-tertiary line-clamp-1">{issue.subtitle}</p>
                    <span className="text-xs font-bold text-brand-primary block pt-1">
                      R$ {issue.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                {/* Botão de Toggle do Status do Volume */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(issue.volume)}
                  className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                    issue.status === "falta"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                      : isRead
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20"
                  }`}
                >
                  {issue.status === "falta"
                    ? "+ Marcar como Tenho"
                    : isRead
                    ? "✓ Lido (Clique p/ Reset)"
                    : "Marcar como Lido"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
