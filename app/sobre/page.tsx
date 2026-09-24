"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Code2, Sparkles, ShieldCheck, Database, Rocket, Heart, BookOpen, Layers, Cpu, Award } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-bg-canvas text-text-primary flex flex-col">
      {/* Header Fixo de Navegação */}
      <header className="sticky top-0 z-40 bg-bg-canvas/90 backdrop-blur-md border-b border-border-default">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary bg-bg-surface hover:bg-bg-elevated px-3 py-1.5 rounded-xl border border-border-default transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <span className="font-black text-sm tracking-wider hidden sm:inline">
                COMIX<span className="text-brand-primary">FLIX</span>
              </span>
            </Link>
            <span className="text-text-tertiary">×</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-elevated border border-border-default">
              <img
                src="/branding/logo-milkfed.png"
                alt="Milkfed Devs&&Reqs Lords"
                className="w-4 h-4 object-contain"
              />
              <span className="text-xs font-semibold text-text-secondary">
                Milkfed Devs&&Reqs Lords
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-12 sm:gap-16 w-full">
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center gap-5 relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Badges Duplas Oficiais */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manifesto & Engenharia de Software</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-elevated border border-border-default text-text-secondary text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-accent-neon" />
              <span>Google Antigravity v2.5.5 • Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            A Nona Arte encontra a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#ff4d58] to-amber-400">
              Engenharia de Elite
            </span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
            O <strong>ComixFlix</strong> nasceu para ser a experiência definitiva de streaming e catalogação de quadrinhos físicos no Brasil. Por trás dessa obra-prima digital está a visão técnica da <strong>Milkfed Devs&&Reqs Lords</strong>.
          </p>

          {/* Dual Card Showcase: ComixFlix & Milkfed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4 text-left">
            {/* Card ComixFlix */}
            <div className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-4 relative overflow-hidden group hover:border-brand-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-black border border-brand-primary/40 flex items-center justify-center p-2 shadow-inner">
                <img
                  src="/branding/logo.jpg"
                  alt="ComixFlix Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">O Produto</span>
                <h3 className="text-lg font-bold text-text-primary">ComixFlix HQ</h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  Mais de 10.400 edições físicas rastreadas, scrapers automatizados das editoras Panini, Mythos e Pipoca & Nanquim, controle de patrimônio financeiro da coleção e listas de desejos inteligentes.
                </p>
              </div>
            </div>

            {/* Card Milkfed */}
            <div className="p-6 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col gap-4 relative overflow-hidden group hover:border-brand-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-center p-2 shadow-inner">
                <img
                  src="/branding/logo-milkfed.png"
                  alt="Milkfed Devs&&Reqs Lords"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-neon">A Desenvolvedora</span>
                <h3 className="text-lg font-bold text-text-primary">Milkfed Devs&&Reqs Lords</h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  Estúdio de arquitetura de software e inteligência computacional especializado em requisitos rigorosos, desenvolvimento orientado a diretivas (SOPs) e produtos com estética visual premium.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pilares da Milkfed Devs&&Reqs Lords */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Pilares de Excelência
            </span>
            <h2 className="text-2xl font-bold text-text-primary">
              Como construímos o ComixFlix
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">Requisitos Blindados</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Nenhum código é escrito sem especificação técnica clara. Adotamos o framework de 3 camadas com SOPs detalhados, garantindo previsibilidade e rastreabilidade total.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-neon/10 text-accent-neon flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">Execução Determinística</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Suítes de verificação estática, typecheck rigoroso em TypeScript e compilação de produção com testes de estresse em cada ciclo de entrega.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-info/10 text-status-info flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">Aura Cinematográfica</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Rejeitamos o visual genérico. Do vídeo de intro ao som Tudum e modo dark imersivo, o colecionador vive uma experiência à altura das melhores histórias dos quadrinhos.
              </p>
            </div>
          </div>
        </section>

        {/* Stack Tecnológica */}
        <section className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-default flex flex-col gap-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-primary" />
                <span>Stack Tecnológica & Orquestração</span>
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Construído sob o ecossistema Google Antigravity e componentes modernos de alta escala.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-status-success/10 text-status-success text-xs font-bold border border-status-success/20">
                100% Type Safe
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default/70 flex flex-col gap-1">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Frontend Framework</span>
              <span className="font-bold text-text-primary">Next.js 14 App Router</span>
              <span className="text-[11px] text-text-secondary">React Server & Client</span>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default/70 flex flex-col gap-1">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Estilização & Design</span>
              <span className="font-bold text-text-primary">Tailwind CSS Modern</span>
              <span className="text-[11px] text-text-secondary">Tokens HSL & Glassmorphism</span>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default/70 flex flex-col gap-1">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Nuvem & Autenticação</span>
              <span className="font-bold text-text-primary">Firebase Firestore & Auth</span>
              <span className="text-[11px] text-text-secondary">Sessão Segura & Regras</span>
            </div>

            <div className="p-3.5 rounded-xl bg-bg-elevated border border-border-default/70 flex flex-col gap-1">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Inteligência & Agente</span>
              <span className="font-bold text-text-primary">Antigravity IDE v2.5.5</span>
              <span className="text-[11px] text-text-secondary">Gemini 3.8 Flash Engine</span>
            </div>
          </div>
        </section>

        {/* CTA e Contato */}
        <section className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-bg-surface via-bg-surface to-bg-elevated/40 border border-border-default flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-center p-2 shadow-sm">
            <img
              src="/branding/logo-milkfed.png"
              alt="Milkfed Devs&&Reqs Lords"
              className="w-full h-full object-contain"
            />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
            Dúvidas, Parcerias ou Sugestões de Catalogação?
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg leading-relaxed">
            Fale diretamente com os mestres da engenharia da Milkfed Devs&&Reqs Lords ou acesse a nossa central de catálogo para sugerir novas edições raras.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-button active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar o Universo ComixFlix</span>
            </Link>
            <a
              href="mailto:suporte@comixflix.com.br"
              className="px-5 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-default text-text-primary text-xs font-semibold transition-all active:scale-95"
            >
              Falar com os Desenvolvedores
            </a>
          </div>
        </section>
      </main>

      {/* Footer Simples */}
      <footer className="w-full border-t border-border-default py-6 text-center text-xs text-text-tertiary">
        <p>© {new Date().getFullYear()} ComixFlix HQ • Desenvolvido com honra por Milkfed Devs&&Reqs Lords.</p>
      </footer>
    </div>
  );
}
