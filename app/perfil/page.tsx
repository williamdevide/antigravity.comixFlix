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
  LogOut,
  LogIn,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useCollection } from "@/lib/context/collection-context";
import { Badge } from "@/components/ui/Badge";
import { CloudSyncIndicator } from "@/components/ui/CloudSyncIndicator";
import { ShareProfileModal } from "@/components/profile/ShareProfileModal";

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

export default function PerfilPage() {
  const { user, profile, updateProfile, logout, isGuestMode, exitGuestMode, openAuthModal } = useAuth();
  const { stats, clearCollection, showToast, syncStatus, forceCloudSync } = useCollection();

  const [activeTab, setActiveTab] = useState<"estatisticas" | "conta">("estatisticas");
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado local para o formulário de edição
  const [formData, setFormData] = useState({
    name: "Colecionador",
    username: "colecionador",
    email: "",
    bio: "Colecionador de quadrinhos físicos.",
    favoritePublisher: "Panini",
    avatarUrl: DEFAULT_AVATARS[0].url,
    notifyReleases: true,
    notifyDiscounts: true,
  });

  // Sincroniza dados com o perfil real do Firebase quando carregar
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.displayName || "Colecionador",
        username: profile.username || "colecionador",
        email: profile.email || user?.email || "",
        bio: profile.bio || "Colecionador de quadrinhos físicos.",
        favoritePublisher: profile.favoritePublisher || "Panini",
        avatarUrl: profile.avatarUrl || user?.photoURL || DEFAULT_AVATARS[0].url,
        notifyReleases: profile.notifyReleases ?? true,
        notifyDiscounts: profile.notifyDiscounts ?? true,
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "Colecionador",
        email: user.email || "",
        avatarUrl: user.photoURL || prev.avatarUrl,
      }));
    }
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (user) {
        await updateProfile(formData);
        showToast("Perfil atualizado no Firebase com sucesso!", "success");
      } else {
        showToast("Perfil local atualizado. Crie uma conta para salvar na nuvem.", "info");
      }
    } catch {
      showToast("Erro ao salvar dados do perfil.", "info");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente desconectar sua conta do ComixFlix?")) {
      await logout();
      window.location.href = "/";
    }
  };

  const handleExitGuest = () => {
    if (window.confirm("Deseja sair do Modo Visitante e voltar ao início?")) {
      exitGuestMode();
      window.location.href = "/";
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
    : `R$ ${(stats.valorEstimadoTotal || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  const currentAvatar =
    formData.avatarUrl ||
    user?.photoURL ||
    DEFAULT_AVATARS[0].url;

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Banner de Aviso caso esteja navegando como visitante */}
      {!user && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-primary/15 via-bg-surface to-brand-primary/10 border border-brand-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary">
                Você está navegando no Modo Visitante
              </h3>
              <p className="text-xs text-text-secondary">
                Crie sua conta ou faça login com o Google para ter sua coleção permanente salva no Firebase.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal("login")}
              className="px-4 py-2 rounded-xl bg-bg-canvas hover:bg-bg-elevated border border-border-default text-xs font-bold text-text-primary transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-primary" />
              Acessar
            </button>
            <button
              onClick={() => openAuthModal("register")}
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-button"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Cadastrar Conta
            </button>
          </div>
        </div>
      )}

      {/* Header do Perfil com Visual Stitch */}
      <div className="relative rounded-3xl overflow-hidden border border-border-default bg-bg-surface shadow-card">
        {/* Banner de Fundo Cinemático */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-brand-primary/40 via-[#18181b] to-purple-900/30 relative">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Indicador de Nuvem no Perfil */}
            <CloudSyncIndicator status={syncStatus} showLabel />
            <button
              type="button"
              onClick={forceCloudSync}
              className="p-1.5 rounded-full bg-bg-surface/80 hover:bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary transition-all"
              title="Forçar sincronização com a nuvem"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Informações Principais & Avatar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-20 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Anel Gradiente com Foto */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-brand-primary via-amber-500 to-purple-600 shadow-elevated">
                <img
                  src={currentAvatar}
                  alt={formData.name}
                  className="w-full h-full rounded-full object-cover border-2 border-bg-surface bg-bg-elevated"
                />
              </div>
              <span
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-bg-surface flex items-center justify-center text-[10px] text-white font-bold"
                title={user ? "Conta Autenticada no Firebase" : "Visitante"}
              >
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  {formData.name}
                </h1>
                <span className="text-xs font-bold text-text-tertiary">
                  @{formData.username}
                </span>
                {user && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                    Nuvem Ativa
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary max-w-md leading-relaxed">
                {formData.bio}
              </p>

              {/* Tags de Foco do Colecionador */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-xs px-3 py-1 rounded-full bg-bg-elevated text-text-secondary border border-border-default font-medium">
                  {formData.favoritePublisher}
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

          {/* Ações Rápidas */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-bg-elevated hover:bg-bg-elevated/80 border border-border-default text-xs font-bold text-text-primary transition-all flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-brand-primary" />
              Compartilhar Perfil
            </button>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/30 text-xs font-bold text-status-danger transition-all flex items-center gap-2 cursor-pointer"
                title="Desconectar da sua conta"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-xs font-bold text-white transition-all flex items-center gap-2 shadow-button cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Fazer Login
                </button>
                {isGuestMode && (
                  <button
                    type="button"
                    onClick={handleExitGuest}
                    className="px-4 py-2 rounded-xl bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/30 text-xs font-bold text-status-danger transition-all flex items-center gap-2 cursor-pointer"
                    title="Encerrar Modo Visitante e voltar ao início"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da Visita
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Abas do Perfil */}
        <div className="flex border-t border-border-default px-6 bg-bg-elevated/30">
          <button
            type="button"
            onClick={() => setActiveTab("estatisticas")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "estatisticas"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Estatísticas da Minha Coleção
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("conta")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "conta"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurações da Conta
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: ESTATÍSTICAS */}
      {activeTab === "estatisticas" && (
        <div className="space-y-6">
          {/* Métricas Principais da Coleção */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-text-tertiary">
                <span className="text-xs font-bold uppercase tracking-wider">Estante Física</span>
                <BookOpen className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text-primary">{stats.totalTenho}</span>
                <span className="text-xs font-medium text-text-secondary">edições</span>
              </div>
              <span className="text-[11px] text-text-muted">Total de volumes em mãos</span>
            </div>

            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-text-tertiary">
                <span className="text-xs font-bold uppercase tracking-wider">Lidas / Concluídas</span>
                <CheckCircle2 className="w-4 h-4 text-status-success" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text-primary">{stats.totalLidos}</span>
                <span className="text-xs font-semibold text-status-success">
                  ({stats.percentualLidos}%)
                </span>
              </div>
              <span className="text-[11px] text-text-muted">Leituras concluídas</span>
            </div>

            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-text-tertiary">
                <span className="text-xs font-bold uppercase tracking-wider">Lista de Desejos</span>
                <Heart className="w-4 h-4 text-status-warning" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-text-primary">{stats.totalQuero}</span>
                <span className="text-xs font-medium text-text-secondary">edições</span>
              </div>
              <span className="text-[11px] text-text-muted">No radar de compras</span>
            </div>

            <div className="p-5 rounded-2xl bg-bg-surface border border-border-default shadow-card flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-text-tertiary">
                <span className="text-xs font-bold uppercase tracking-wider">Patrimônio da Coleção</span>
                <button
                  type="button"
                  onClick={() => setHideNetWorth(!hideNetWorth)}
                  className="hover:text-text-primary"
                  title={hideNetWorth ? "Mostrar valor" : "Ocultar valor"}
                >
                  {hideNetWorth ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-text-primary tracking-tight">
                  {displayNetWorth}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">Baseado nos preços de capa/promoção</span>
            </div>
          </div>

          {/* Distribuição por Editoras */}
          <div className="rounded-3xl p-6 bg-bg-surface border border-border-default shadow-card space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" />
              Distribuição por Editoras
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(stats.distribuicaoEditoras).map(([editora, count]) => {
                const percent = stats.totalTenho > 0 ? Math.round((count / stats.totalTenho) * 100) : 0;
                return (
                  <div
                    key={editora}
                    className="p-4 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-text-primary">{editora}</span>
                      <p className="text-[11px] text-text-muted">{count} edições ({percent}%)</p>
                    </div>
                    <span className="text-base font-black text-brand-primary">{percent}%</span>
                  </div>
                );
              })}
              {Object.keys(stats.distribuicaoEditoras).length === 0 && (
                <div className="sm:col-span-3 text-center py-6 text-xs text-text-muted">
                  Nenhuma edição cadastrada na estante ainda. Adicione quadrinhos para ver as estatísticas!
                </div>
              )}
            </div>
          </div>

          {/* Banner de Scraping e Catálogo */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface border border-border-default flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 justify-center sm:justify-start">
                <Database className="w-4 h-4 text-brand-primary" />
                Catálogo Unificado de +10.400 Edições Oficiais
              </h3>
              <p className="text-xs text-text-secondary">
                Consulte lançamentos e atualizações das editoras Panini, Mythos, Pipoca & Nanquim e Cia das Letras.
              </p>
            </div>

            <Link
              href="/scraping"
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-card transition-all flex items-center gap-2 shrink-0"
            >
              Central de Scraping →
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-primary" />
                  Dados Pessoais do Colecionador
                </h2>
                {user && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Sincronizado no Firestore
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Nome de Usuário (@)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                    value={formData.email}
                    disabled={Boolean(user?.email)}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary disabled:opacity-75 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Biografia / Apresentação</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-bg-elevated border border-border-default text-sm text-text-primary focus:outline-none focus:border-brand-primary resize-none"
                  placeholder="Fale sobre seus autores prediletos, selos colecionados..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Editora Favorita</label>
                <select
                  value={formData.favoritePublisher}
                  onChange={(e) => setFormData({ ...formData, favoritePublisher: e.target.value })}
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
                      onClick={() => setFormData({ ...formData, avatarUrl: av.url })}
                      className={`relative rounded-full p-0.5 border-2 transition-transform hover:scale-105 ${
                        formData.avatarUrl === av.url ? "border-brand-primary" : "border-transparent"
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
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-card transition-all disabled:opacity-50"
                >
                  {isSaving ? "Gravando..." : "Salvar Alterações"}
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
                    checked={formData.notifyReleases}
                    onChange={(e) => setFormData({ ...formData, notifyReleases: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 text-xs font-semibold text-text-primary cursor-pointer">
                  <span>Quedas de preço e promoções</span>
                  <input
                    type="checkbox"
                    checked={formData.notifyDiscounts}
                    onChange={(e) => setFormData({ ...formData, notifyDiscounts: e.target.checked })}
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
                className="w-full py-2.5 px-4 rounded-xl border border-status-danger/30 bg-status-danger/10 hover:bg-status-danger/20 text-status-danger text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Limpar / Resetar Minha Coleção
              </button>
            </div>

            {/* Informações da Plataforma & Autoria Técnica com Link Sobre Nós */}
            <Link
              href="/sobre"
              className="rounded-3xl p-5 bg-bg-surface hover:bg-bg-elevated/80 border border-border-default hover:border-brand-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card transition-all group cursor-pointer"
              title="Conheça a equipe desenvolvedora Milkfed Devs&&Reqs Lords - Sobre Nós"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-default flex items-center justify-center p-1.5 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src="/branding/logo-milkfed.png"
                    alt="Milkfed Devs&&Reqs Lords"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    ComixFlix HQ • Versão Oficial v1.0
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    Engenharia e desenvolvimento por <strong className="text-text-secondary">Milkfed Devs&&Reqs Lords</strong>
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider border border-brand-primary/20 flex items-center gap-1">
                <span>Sobre Nós</span>
                <span>→</span>
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento Social */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={{
          name: formData.name,
          username: formData.username,
          avatarUrl: currentAvatar,
          favoritePublisher: formData.favoritePublisher,
        }}
        stats={stats}
      />
    </div>
  );
}
