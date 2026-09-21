"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Shield,
  Bell,
  Mail,
  BookOpen,
  Heart,
  Layers,
  Sparkles,
  Share2,
  Eye,
  EyeOff,
  TrendingUp,
  Award,
  Trash2,
  Database,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useCollection } from "@/lib/context/collection-context";
import { Badge } from "@/components/ui/Badge";
import { ShareProfileModal } from "@/components/profile/ShareProfileModal";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  favoritePublisher: string;
  avatarUrl: string;
  notifyReleases: boolean;
  notifyDiscounts: boolean;
}

const DEFAULT_AVATARS = [
  {
    id: "av1",
    label: "Colecionador",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJf3MRo88VJIRLJmCEyvZVt0wi6G4Tl9JDY1v0RnL7yXk2SFKq3MT05-k2jFwSFodG3jvSxm_nwNjowYt9GeVQG8U9Rp8FkJ4nkNh7hvs1dsn9JynUROKdmHqpJVPQBDs-YxCm5D4Syux62vyvbgWjz3hEoF9Hquik__GY1w8bASDtqjOJ_GNqSyfghIr_xxEalNgI_4jC4SJUDVZwj479jydKcieNFRRhQVYeLhr0l1l--D788g4Pg",
  },
  {
    id: "av2",
    label: "Cavaleiro das Trevas",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "av3",
    label: "Leitor Clássico",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "av4",
    label: "Explorador Cósmico",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
  },
];

const PROFILE_STORAGE_KEY = "comixflix_user_profile_v1";

export default function PerfilPage() {
  const { stats, clearCollection, showToast } = useCollection();
  const [activeTab, setActiveTab] = useState<"estatisticas" | "conta">("estatisticas");
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Perfil do Usuário
  const [profile, setProfile] = useState<UserProfile>({
    name: "William Colecionador",
    username: "william_hqs",
    email: "william@comixflix.com.br",
    bio: "Colecionador ávido de quadrinhos físicos, focado em edições definitivas da Panini, lançamentos do Pipoca & Nanquim e clássicos Bonelli da Mythos.",
    favoritePublisher: "Pipoca & Nanquim",
    avatarUrl: DEFAULT_AVATARS[0].url,
    notifyReleases: true,
    notifyDiscounts: true,
  });

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      showToast("Dados do perfil atualizados com sucesso!", "success");
    } catch (e) {
      showToast("Erro ao salvar dados localmente.", "info");
    }
  };

  const handleClearCollectionPrompt = () => {
    if (
      window.confirm(
        "Atenção: deseja realmente zerar todos os quadrinhos da sua estante e lista de desejos? Esta ação deixará sua coleção 100% vazia."
      )
    ) {
      clearCollection();
    }
  };

  // Valor do patrimônio estimado
  const displayNetWorth = hideNetWorth
    ? "R$ ••••••"
    : `R$ ${(stats.valorEstimadoTotal || 14820).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header do Perfil com Visual Stitch */}
      <div className="relative rounded-3xl overflow-hidden border border-border-default bg-bg-surface shadow-card">
        {/* Banner de Fundo Cinemático */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-brand-primary/40 via-[#18181b] to-purple-900/30 relative">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              NÍVEL 5 • CURADOR MESTRE
            </span>
          </div>
        </div>

        {/* Informações Principais & Avatar com Anel Gradiente Stitch */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-20 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Anel Gradiente Stitch */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-brand-primary via-amber-500 to-purple-600 shadow-elevated">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover border-2 border-bg-surface bg-bg-elevated"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-bg-surface flex items-center justify-center text-[10px] text-white font-bold" title="Colecionador Verificado">
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-bold text-text-tertiary">@{profile.username}</span>
              </div>
              <p className="text-xs text-text-secondary max-w-md leading-relaxed">{profile.bio}</p>

              {/* Tags de Foco do Colecionador */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-xs px-3 py-1 rounded-full bg-bg-elevated text-text-secondary border border-border-default font-medium">
                  {profile.favoritePublisher}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-status-info/10 text-status-info border border-status-info/20 font-semibold">
                  {stats.totalTenho} na Estante
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-status-wishlist/10 text-status-wishlist border border-status-wishlist/20 font-semibold">
                  {stats.totalQuero} na Wishlist
                </span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas: Compartilhar Perfil & Ver Coleção */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-brand-primary hover:bg-brand-primary-hover text-white shadow-elevated transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar Perfil
            </button>

            <Link
              href="/colecao"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-bg-elevated hover:bg-border-default text-text-primary border border-border-default transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              Ver Minha Coleção
            </Link>
          </div>
        </div>

        {/* Abas do Perfil */}
        <div className="flex border-t border-border-default px-6 bg-bg-canvas/40">
          <button
            type="button"
            onClick={() => setActiveTab("estatisticas")}
            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "estatisticas"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Award className="w-4 h-4" />
            Estatísticas & Conquistas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("conta")}
            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "conta"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Settings className="w-4 h-4" />
            Minha Conta & Preferências
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: ESTATÍSTICAS, PATRIMÔNIO & CONQUISTAS (STITCH DESIGN) */}
      {activeTab === "estatisticas" && (
        <div className="space-y-6">
          {/* Card de Patrimônio com Toggle de Olho (Stitch Screen 98a7fcf90b0b4b9e99cbd74986c1fdf7) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-3xl bg-bg-surface border border-border-default shadow-card space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Patrimônio Estimado da Coleção
                  </span>
                </div>

                {/* Botão de Toggle Olho Stitch */}
                <button
                  type="button"
                  onClick={() => setHideNetWorth(!hideNetWorth)}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors border border-border-default"
                  title={hideNetWorth ? "Exibir valor estimado" : "Ocultar valor estimado"}
                  aria-label="Alternar visibilidade do patrimônio"
                >
                  {hideNetWorth ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-brand-primary" />}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight font-mono">
                  {displayNetWorth}
                </span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  ▲ +15% de valorização este mês
                </span>
              </div>

              {/* Barra Segmentada de Distribuição */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                  <span>Distribuição por Selo / Universo</span>
                  <span>{stats.totalTenho} edições catalogadas</span>
                </div>
                <div className="w-full h-3 rounded-full bg-bg-elevated overflow-hidden flex">
                  <div style={{ width: "42%" }} className="h-full bg-red-600" title="Panini Marvel (42%)" />
                  <div style={{ width: "26%" }} className="h-full bg-blue-600" title="Panini DC (26%)" />
                  <div style={{ width: "18%" }} className="h-full bg-amber-500" title="Pipoca & Nanquim (18%)" />
                  <div style={{ width: "14%" }} className="h-full bg-emerald-600" title="Mythos Bonelli (14%)" />
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] text-text-tertiary pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Marvel (42%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> DC Comics (26%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pipoca & Nanquim (18%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Mythos Bonelli (14%)</span>
                </div>
              </div>
            </div>

            {/* Ritmo de Leitura & Metas */}
            <div className="p-6 rounded-3xl bg-bg-surface border border-border-default shadow-card space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                  Ritmo de Leitura
                </span>
                <p className="text-3xl font-black text-text-primary">
                  {stats.totalLidos} <span className="text-base font-normal text-text-tertiary">lidos</span>
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Média de <strong>6 edições/mês</strong>. Você completou <strong>{stats.percentualLidos || 0}%</strong> da sua estante atual.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">Meta de 2026</span>
                <span className="text-xs font-black text-brand-primary">35 / 50 HQs</span>
              </div>
            </div>
          </div>

          {/* Conquistas e Badges do Colecionador (Stitch Screen 98a7fcf90b0b4b9e99cbd74986c1fdf7) */}
          <div className="p-6 rounded-3xl bg-bg-surface border border-border-default shadow-card space-y-4">
            <h2 className="text-base font-black text-text-primary tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Insígnias & Conquistas de Colecionador
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-bg-elevated border border-border-default text-center space-y-2 group hover:border-brand-primary/40 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-xl font-black shadow-sm">
                  𝗫
                </div>
                <h3 className="text-xs font-black text-text-primary">Mestre Mutante</h3>
                <p className="text-[10px] text-text-tertiary">Mais de 50 edições de X-Men colecionadas</p>
              </div>

              <div className="p-4 rounded-2xl bg-bg-elevated border border-border-default text-center space-y-2 group hover:border-brand-primary/40 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center text-xl font-black shadow-sm">
                  🦇
                </div>
                <h3 className="text-xs font-black text-text-primary">Morcego de Gotham</h3>
                <p className="text-[10px] text-text-tertiary">Run completa do Batman Novos 52</p>
              </div>

              <div className="p-4 rounded-2xl bg-bg-elevated border border-border-default text-center space-y-2 group hover:border-brand-primary/40 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-600/10 text-amber-500 flex items-center justify-center text-xl font-black shadow-sm">
                  🤠
                </div>
                <h3 className="text-xs font-black text-text-primary">Colecionador Bonelli</h3>
                <p className="text-[10px] text-text-tertiary">Coleção com Tex e clássicos da Mythos</p>
              </div>

              <div className="p-4 rounded-2xl bg-bg-elevated border border-border-default text-center space-y-2 group hover:border-brand-primary/40 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-600/10 text-purple-500 flex items-center justify-center text-xl font-black shadow-sm">
                  📖
                </div>
                <h3 className="text-xs font-black text-text-primary">Guardião da Nona Arte</h3>
                <p className="text-[10px] text-text-tertiary">Edições integrais Pipoca & Nanquim</p>
              </div>
            </div>
          </div>

          {/* Atalho Especial para a Central de Scraping */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-primary/10 via-bg-surface to-bg-surface border border-brand-primary/20 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-primary" />
                Deseja sincronizar novos quadrinhos das editoras?
              </h3>
              <p className="text-xs text-text-secondary">
                A Central de Scraping agora possui sua página dedicada com métricas detalhadas de importação por site.
              </p>
            </div>

            <Link
              href="/scraping"
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-card transition-all flex items-center gap-2 shrink-0"
            >
              Acessar Central de Scraping →
            </Link>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: DADOS PESSOAIS & PREFERÊNCIAS */}
      {activeTab === "conta" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Perfil */}
          <form onSubmit={handleSaveProfile} className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl p-6 bg-bg-surface border border-border-default space-y-6 shadow-card">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <User className="w-5 h-5 text-brand-primary" />
                Dados Pessoais do Colecionador
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Nome Completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Nome de Usuário (@)</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-text-tertiary" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Biografia / Apresentação</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary resize-none"
                  placeholder="Fale sobre seus autores prediletos, selos colecionados..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Editora Favorita</label>
                <select
                  value={profile.favoritePublisher}
                  onChange={(e) => setProfile({ ...profile, favoritePublisher: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="Panini">Panini Brasil (Marvel, DC, Planet Manga)</option>
                  <option value="Pipoca & Nanquim">Pipoca & Nanquim (Graphic Novels & Mangás)</option>
                  <option value="Mythos">Mythos Editora (Tex, Bonelli, Juiz Dredd, Hellboy)</option>
                  <option value="Todas">Todas as Editoras</option>
                </select>
              </div>

              {/* Seletor de Avatares */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-text-secondary">Escolher Avatar Temático</label>
                <div className="flex flex-wrap gap-3">
                  {DEFAULT_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatarUrl: av.url })}
                      className={`relative rounded-full p-0.5 border-2 transition-transform hover:scale-105 ${
                        profile.avatarUrl === av.url ? "border-brand-primary" : "border-transparent"
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-12 h-12 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-default flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-card transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </form>

          {/* Coluna Lateral: Notificações & Reset de Coleção */}
          <div className="space-y-6">
            <div className="rounded-3xl p-6 bg-bg-surface border border-border-default space-y-4 shadow-card">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-primary" />
                Alertas e Notificações
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between gap-3 text-xs font-semibold text-text-primary cursor-pointer">
                  <span>Novos lançamentos da editora favorita</span>
                  <input
                    type="checkbox"
                    checked={profile.notifyReleases}
                    onChange={(e) => setProfile({ ...profile, notifyReleases: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 text-xs font-semibold text-text-primary cursor-pointer">
                  <span>Quedas de preço e promoções</span>
                  <input
                    type="checkbox"
                    checked={profile.notifyDiscounts}
                    onChange={(e) => setProfile({ ...profile, notifyDiscounts: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                  />
                </label>
              </div>
            </div>

            {/* Zona de Gerenciamento da Coleção Pessoal */}
            <div className="rounded-3xl p-6 bg-bg-surface border border-border-default space-y-4 shadow-card">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Shield className="w-4 h-4 text-status-warning" />
                Gerenciar Coleção Pessoal
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Você pode reiniciar sua estante e lista de desejos a qualquer momento para começar um controle do zero.
              </p>

              <button
                type="button"
                onClick={handleClearCollectionPrompt}
                className="w-full py-2.5 px-4 rounded-xl border border-status-error/30 bg-status-error/10 hover:bg-status-error/20 text-status-error text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar / Resetar Minha Coleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento Social */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        stats={stats}
      />
    </div>
  );
}
