"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { getAuthErrorMessage } from "@/lib/firebase/auth";
import { getAssetPath } from "@/lib/utils/asset";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    loginGoogle,
    loginEmail,
    registerEmail,
    resetPwd,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sincroniza a aba quando aberta externamente
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalTab);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isAuthModalOpen, authModalTab]);

  // Fecha com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginGoogle();
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (activeTab === "forgot") {
      if (!email.trim()) {
        setError("Informe seu endereço de e-mail.");
        return;
      }
      setLoading(true);
      try {
        await resetPwd(email);
        setSuccessMessage("Link de recuperação enviado com sucesso para seu e-mail!");
      } catch (err: any) {
        setError(getAuthErrorMessage(err?.code || ""));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (activeTab === "register") {
      if (!name.trim()) {
        setError("Informe seu nome para o perfil.");
        return;
      }
      if (password.length < 6) {
        setError("A senha deve conter no mínimo 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setError("As senhas informadas não coincidem.");
        return;
      }
      setLoading(true);
      try {
        await registerEmail(email, password, name);
      } catch (err: any) {
        setError(getAuthErrorMessage(err?.code || ""));
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login normal
    if (!email.trim() || !password.trim()) {
      setError("Preencha seu e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await loginEmail(email, password);
    } catch (err: any) {
      setError(getAuthErrorMessage(err?.code || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-bg-surface/95 border border-border-default/80 rounded-2xl shadow-elevated overflow-hidden z-10 backdrop-blur-xl animate-scale-up">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header do Modal */}
        <div className="relative flex items-center justify-between p-5 border-b border-border-default/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-brand-primary/40 bg-black shrink-0 shadow-md">
              <img
                src={getAssetPath("/branding/logo.jpg")}
                alt="ComixFlix Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center tracking-wider leading-none">
                <span className="font-black text-[#E50914] text-sm">COMIX</span>
                <span className="font-black text-white text-sm ml-0.5">FLIX</span>
              </div>
              <span className="text-[11px] text-text-muted mt-0.5">
                {activeTab === "register"
                  ? "Crie sua conta e estante digital"
                  : activeTab === "forgot"
                  ? "Recuperação de acesso"
                  : "Acesse sua coleção na nuvem"}
              </span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas Acessar / Cadastrar */}
        {activeTab !== "forgot" && (
          <div className="flex border-b border-border-default/60 bg-bg-canvas/50 p-1">
            <button
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-bg-elevated text-brand-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Acessar conta
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-bg-elevated text-brand-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Cadastrar conta
            </button>
          </div>
        )}

        {/* Corpo do Modal */}
        <div className="p-6 flex flex-col gap-4">
          {/* Mensagens de Sucesso ou Erro */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-status-success/10 border border-status-success/30 text-status-success text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Botão Oficial do Google */}
          {activeTab !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {activeTab === "register"
                    ? "Cadastrar com Conta Google"
                    : "Entrar com Conta Google"}
                </span>
              </button>

              {/* Divisor */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border-default/80" />
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  ou com e-mail
                </span>
                <div className="flex-1 h-px bg-border-default/80" />
              </div>
            </>
          )}

          {/* Formulário Tradicional */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {activeTab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Nome completo
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Peter Parker"
                    className="w-full pl-9 pr-3 py-2 bg-bg-canvas border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Endereço de e-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-3 py-2 bg-bg-canvas border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {activeTab !== "forgot" && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-secondary">
                    Senha
                  </label>
                  {activeTab === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("forgot");
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-brand-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-10 py-2 bg-bg-canvas border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Confirmar senha
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="w-full pl-9 pr-3 py-2 bg-bg-canvas border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-button hover:shadow-button-hover disabled:opacity-50 active:scale-[0.98]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {activeTab === "register"
                  ? "Criar Minha Conta"
                  : activeTab === "forgot"
                  ? "Enviar Link de Recuperação"
                  : "Acessar Conta"}
              </span>
            </button>

            {activeTab === "forgot" && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-text-secondary hover:text-text-primary text-center mt-2 transition-colors"
              >
                Voltar para o login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
