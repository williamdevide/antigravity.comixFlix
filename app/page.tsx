"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { useCollection } from "@/lib/context/collection-context";
import { WelcomeScreen } from "@/components/auth/WelcomeScreen";
import { HeroCarousel } from "@/components/comic/HeroCarousel";
import { ContentRow } from "@/components/comic/ContentRow";
import { Logo } from "@/components/ui/Logo";
import { Library, ArrowRight, UserPlus, LogIn, LogOut, Sparkles } from "lucide-react";

export default function HomePage() {
  const { user, isGuestMode, openAuthModal, logout, exitGuestMode } = useAuth();
  const { comics, stats } = useCollection();

  // Controla se a intro/welcome screen (incluindo o segundo splash) está em exibição
  const [introActive, setIntroActive] = React.useState(!user && !isGuestMode);

  // Se o usuário deslogar ou sair do modo visitante, reativa a tela de boas-vindas com o vídeo inicial
  React.useEffect(() => {
    if (!user && !isGuestMode) {
      setIntroActive(true);
    }
  }, [user, isGuestMode]);

  const handleExitGuest = () => {
    exitGuestMode();
    setIntroActive(true);
  };

  // Se o fluxo inicial de intro/boas-vindas estiver ativo ou se não houver sessão nem modo visitante:
  if (introActive || (!user && !isGuestMode)) {
    return <WelcomeScreen onComplete={() => setIntroActive(false)} />;
  }

  // Filtragens para as fileiras temáticas do catálogo
  const featuredComics = comics.filter((c) => c.destaque);
  const weeklyReleases = comics.filter((c) => c.lancamento_semana);
  const paniniComics = comics.filter((c) => c.editora.includes("Panini"));
  const pipocaComics = comics.filter((c) => c.editora.includes("Pipoca"));
  const mythosComics = comics.filter((c) => c.editora.includes("Mythos"));
  const promoComics = comics.filter((c) => c.preco_promocional !== null);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Banner Sutil de Modo Visitante (Apenas se não estiver autenticado) */}
      {!user && isGuestMode && (
        <div className="w-full bg-gradient-to-r from-brand-primary/15 via-bg-surface to-brand-primary/10 border-b border-brand-primary/30 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="text-xs text-text-secondary">
                Você está explorando no <strong className="text-text-primary">Modo Visitante</strong>. Para salvar sua coleção permanentemente no Firebase e sincronizar entre dispositivos:
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3 py-1 rounded-lg bg-bg-canvas hover:bg-bg-elevated border border-border-default text-xs font-bold text-text-primary transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-primary" />
                Acessar
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="px-3 py-1 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Criar Conta
              </button>
              <button
                onClick={handleExitGuest}
                className="px-3 py-1 rounded-lg bg-bg-canvas hover:bg-bg-elevated border border-border-default text-xs font-bold text-text-secondary hover:text-status-danger transition-all flex items-center gap-1.5"
                title="Sair do Modo Visitante e voltar ao início"
              >
                <LogOut className="w-3.5 h-3.5 text-status-danger" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

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
                {user ? "Sua Estante Virtual na Nuvem" : "Sua Estante Local (Visitante)"}
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
