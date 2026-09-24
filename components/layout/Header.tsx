"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../ui/Logo";
import { Search, Sun, Moon, Library, Compass, Sparkles, User, Database, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useCollection } from "@/lib/context/collection-context";
import { CloudSyncIndicator } from "@/components/ui/CloudSyncIndicator";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isGuestMode, logout, exitGuestMode, openAuthModal } = useAuth();
  const { syncStatus } = useCollection();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Carrega tema salvo ou detecta do html
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    } catch (e) {}

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("comixflix_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("comixflix_theme", "light");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/explorar`);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/explorar", label: "Explorar", icon: Compass },
    { href: "/colecao", label: "Minha Coleção", icon: Library },
    { href: "/scraping", label: "Central de Scraping", icon: Database },
    { href: "/perfil", label: "Meu Perfil", icon: User },
  ];

  const userAvatar =
    profile?.avatarUrl ||
    user?.photoURL ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJf3MRo88VJIRLJmCEyvZVt0wi6G4Tl9JDY1v0RnL7yXk2SFKq3MT05-k2jFwSFodG3jvSxm_nwNjowYt9GeVQG8U9Rp8FkJ4nkNh7hvs1dsn9JynUROKdmHqpJVPQBDs-YxCm5D4Syux62vyvbgWjz3hEoF9Hquik__GY1w8bASDtqjOJ_GNqSyfghIr_xxEalNgI_4jC4SJUDVZwj479jydKcieNFRRhQVYeLhr0l1l--D788g4Pg";

  const handleHeaderLogout = async () => {
    if (window.confirm("Deseja realmente sair e voltar à tela inicial?")) {
      if (user) {
        await logout();
      } else {
        exitGuestMode();
      }
      window.location.href = "/";
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-canvas/95 backdrop-blur-md border-b border-border-default shadow-elevated"
          : "bg-gradient-to-b from-bg-canvas/95 via-bg-canvas/70 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <Logo size="md" className="transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "text-brand-primary bg-brand-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Desktop Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar título, editora, herói..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 md:w-56 lg:w-72 h-9 pl-9 pr-4 rounded-full bg-bg-surface border border-border-default text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary focus:w-80 transition-all"
            />
          </form>

          {/* Mobile Search Button */}
          <Link
            href="/explorar"
            className="sm:hidden p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
            aria-label="Buscar quadrinhos"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors border border-transparent hover:border-border-default"
            aria-label={isDarkMode ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {mounted && !isDarkMode ? (
              <Moon className="w-5 h-5 text-indigo-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Indicador de Nuvem (Cloud Sync) Dinâmico */}
          <CloudSyncIndicator status={syncStatus} />

          {/* Profile Avatar / Botão de Acesso / Sair */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/perfil"
                className="relative flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-border-default hover:ring-brand-primary transition-all overflow-hidden bg-bg-surface shrink-0 cursor-pointer"
                title={`Meu Perfil (${profile?.name || user.displayName || user.email})`}
              >
                <img
                  src={userAvatar}
                  alt={profile?.name || "Avatar do Usuário"}
                  className="w-full h-full object-cover"
                />
              </Link>
              <button
                type="button"
                onClick={handleHeaderLogout}
                className="p-2 rounded-full text-text-secondary hover:text-status-danger hover:bg-bg-surface transition-colors cursor-pointer"
                title="Desconectar e voltar à tela inicial"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isGuestMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-button active:scale-95 shrink-0 cursor-pointer"
                title="Acessar sua conta"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                type="button"
                onClick={handleHeaderLogout}
                className="p-2 rounded-full text-text-secondary hover:text-status-danger hover:bg-bg-surface transition-colors cursor-pointer"
                title="Sair do Modo Visitante e voltar à tela inicial"
                aria-label="Sair da visita"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all shadow-button active:scale-95 shrink-0 cursor-pointer"
              title="Acessar sua conta"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
