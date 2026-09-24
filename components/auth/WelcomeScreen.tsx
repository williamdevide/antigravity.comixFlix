"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";
import { getAuthErrorMessage } from "@/lib/firebase/auth";
import { playNetflixComicIntroSound } from "@/lib/utils/audio";

export type ScreenState = "splash-initial" | "splash-transition" | "login" | "register" | "forgot";

interface WelcomeScreenProps {
  onComplete?: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { loginGoogle, loginEmail, registerEmail, resetPwd, enterGuestMode } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>("splash-initial");
  const [authSuccessType, setAuthSuccessType] = useState<"guest" | "user" | null>(null);

  // Estado do vídeo da intro cinematográfica sobre o splash.jpg
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoFading, setVideoFading] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  // Form states - Login
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Cadastro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeNewsletter, setAgreeNewsletter] = useState(true);

  // Form states - Recuperação
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "sms">("email");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Transição do Segundo Splash (3s Countdown e barra de progresso)
  const [countdown, setCountdown] = useState(3);
  const [progressWidth, setProgressWidth] = useState(0);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Autoplay com áudio ou muted fallback para o vídeo do Primeiro Splash
  useEffect(() => {
    if (currentScreen === "splash-initial" && isVideoPlaying) {
      const videoEl = introVideoRef.current;
      if (videoEl) {
        videoEl.play().catch(() => {
          // Se o navegador bloquear autoplay com som, roda em muted
          videoEl.muted = true;
          videoEl.play().catch(() => {
            // Se ainda assim falhar, conclui a intro para não prender o usuário
            handleVideoEnd();
          });
        });
      }
    }
  }, [currentScreen, isVideoPlaying]);

  const handleVideoEnd = () => {
    setVideoFading(true);
    setTimeout(() => {
      setIsVideoPlaying(false);
      setVideoFading(false);
    }, 600);
  };

  // Finalização do Splash de Transição (Segundo Splash)
  const finishTransition = () => {
    if (authSuccessType === "guest") {
      enterGuestMode();
    }
    if (onComplete) {
      onComplete();
    } else if (authSuccessType === "guest") {
      enterGuestMode();
    }
  };

  // Efeito ao entrar no Splash de Transição (Segundo Splash - 3 segundos)
  useEffect(() => {
    if (currentScreen === "splash-transition") {
      playNetflixComicIntroSound();
      setCountdown(3);
      setProgressWidth(0);

      const animTimer = setTimeout(() => {
        setProgressWidth(100);
      }, 50);

      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const finishTimer = setTimeout(() => {
        finishTransition();
      }, 3400);

      return () => {
        clearTimeout(animTimer);
        clearInterval(countdownTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [currentScreen, authSuccessType]);

  // Ações de Autenticação
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      showToast("Conectando via Google...");
      await loginGoogle();
      setAuthSuccessType("user");
      setCurrentScreen("splash-transition");
    } catch (err: any) {
      showToast(getAuthErrorMessage(err?.code || ""));
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      showToast("Preencha todos os campos para entrar.");
      return;
    }
    setLoading(true);
    try {
      await loginEmail(loginIdentifier, loginPassword);
      showToast("Acesso autorizado! Carregando seu acervo...");
      setAuthSuccessType("user");
      setCurrentScreen("splash-transition");
    } catch (err: any) {
      showToast(getAuthErrorMessage(err?.code || ""));
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast("Informe seu Nome de Colecionador.");
      return;
    }
    if (!regEmail.trim()) {
      showToast("Informe seu e-mail.");
      return;
    }
    if (regPassword.length < 6) {
      showToast("A senha precisa ter no mínimo 6 dígitos.");
      return;
    }
    if (!agreeTerms) {
      showToast("Você deve concordar com os Termos de Uso e Política de Privacidade.");
      return;
    }

    setLoading(true);
    try {
      await registerEmail(regEmail, regPassword, regName);
      showToast("Conta criada com sucesso! Bem-vindo ao ComixFlix.");
      setAuthSuccessType("user");
      setCurrentScreen("splash-transition");
    } catch (err: any) {
      showToast(getAuthErrorMessage(err?.code || ""));
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryInput.trim()) {
      showToast("Informe seu e-mail cadastrado.");
      return;
    }
    setLoading(true);
    try {
      await resetPwd(recoveryInput);
      setRecoverySuccess(true);
      showToast("Link de recuperação despachado com sucesso!");
    } catch (err: any) {
      showToast(getAuthErrorMessage(err?.code || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = () => {
    showToast("Aguardando confirmação biométrica (Face ID / Digital)...");
    setTimeout(() => {
      showToast("Biometria confirmada! Iniciando sessão...");
      enterGuestMode();
    }, 1200);
  };

  const togglePreference = (chip: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  // Cálculo da força da senha (0 a 4)
  const passwordStrength = Math.min(
    4,
    (regPassword.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(regPassword) ? 1 : 0) +
      (/[0-9]/.test(regPassword) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(regPassword) ? 1 : 0)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#131313] text-[#e5e2e1] antialiased select-none font-sans flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TELA: SPLASH INICIAL (Fundo splash.jpg + Vídeo cinematic_intro.mp4 na frente) */}
      {/* ========================================================================= */}
      {currentScreen === "splash-initial" && (
        <main className="flex-1 flex flex-col relative w-full bg-[#141414] min-h-screen overflow-hidden">
          {/* CAMADA BASE: Imagem Oficial splash.jpg em Tela Cheia */}
          <div className="absolute inset-0 z-0">
            <img
              src="/branding/splash.jpg"
              alt="ComixFlix Splash Background"
              className="w-full h-full object-cover object-center transform scale-100"
            />
            {/* Dynamic Neon Ambient Glow Orbs */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#e50914]/25 rounded-full blur-[110px] animate-pulse"></div>
            {/* Halftone Comics Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px]"></div>
            {/* Vignette Escura Cinematográfica */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/75 via-black/25 via-45% to-black/95"></div>
          </div>

          {/* CAMADA FRONTAL: Vídeo cinematic_intro.mp4 à frente do splash.jpg */}
          {isVideoPlaying && (
            <div
              className={`absolute inset-0 z-30 flex items-center justify-center bg-transparent transition-opacity duration-700 overflow-hidden ${
                videoFading ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <video
                ref={introVideoRef}
                src="/branding/cinematic_intro.mp4"
                poster="/branding/splash.jpg"
                autoPlay
                playsInline
                muted
                onEnded={handleVideoEnd}
                className="w-full max-w-full max-h-screen object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.85)]"
              />

              {/* Botão Pular Vídeo */}
              <button
                type="button"
                onClick={handleVideoEnd}
                className="absolute top-6 right-6 z-40 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <span>Pular intro</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* CAMADA DE INTERAÇÃO: Revelada assim que o vídeo acaba com os botões e visual limpo */}
          <div
            className={`relative z-10 flex flex-col items-center justify-between px-4 pt-8 pb-8 min-h-screen max-w-sm mx-auto w-full transition-opacity duration-700 ${
              isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100 animate-fade-in"
            }`}
          >
            {/* Top System Brand Accent */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/15"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-widest text-white/90 font-bold">
                ComixFlix HQ • Premiere Experience
              </span>
            </div>

            {/* Espaçador flexível central permitindo visibilidade total do splash.jpg de fundo */}
            <div className="w-full flex-1 min-h-[160px] pointer-events-none" />

            {/* Bottom: Typography, Action Buttons, and Links */}
            <div className="w-full flex flex-col items-center gap-3.5 max-w-sm mt-auto">
              {/* Botoes de Acao Lado a Lado */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  id="btnEnterUniverse"
                  onClick={() => setCurrentScreen("login")}
                  className="w-full min-h-[48px] py-3 px-3 rounded-lg bg-white hover:bg-white/95 active:scale-[0.98] text-black text-sm font-bold flex items-center justify-center gap-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                >
                  <span>Acessar</span>
                  <span className="material-symbols-outlined text-lg font-bold">login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen("register")}
                  className="w-full min-h-[48px] py-3 px-3 rounded-lg bg-black/60 hover:bg-black/80 active:scale-[0.98] border border-white/35 text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md backdrop-blur-sm transition-all cursor-pointer"
                >
                  <span>Criar Conta</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    Grátis
                  </span>
                </button>
              </div>

              {/* Links Auxiliares */}
              <div className="flex items-center justify-between w-full px-1 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("forgot")}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthSuccessType("guest");
                    setCurrentScreen("splash-transition");
                  }}
                  className="text-white hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explorar como visitante</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>

              {/* Indicador de Audio Imersivo */}
              <div className="flex items-center gap-1.5 text-white/70 pt-1">
                <span className="material-symbols-outlined text-sm text-white">volume_up</span>
                <span className="text-[11px] opacity-90">Áudio imersivo estilo Tudum ativado</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 2. TELA: SEGUNDO SPLASH (Transição 3s - Fiel 100% ao Stitch screens/1bffc4e6c8a14bb5ae6adf5d7d36cdaf) */}
      {/* ========================================================================= */}
      {currentScreen === "splash-transition" && (
        <main className="flex-1 flex flex-col relative w-full h-full bg-[#131313] min-h-screen">
          <div className="flex flex-col w-full relative overflow-hidden select-none min-h-screen justify-between">
            {/* Imagem de Fundo em Tela Cheia */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src="/branding/splash.jpg"
                alt="ComixFlix HQ Neon"
                className="w-full h-full object-cover object-center transform scale-105 animate-[pulse_6s_ease-in-out_infinite]"
              />
              {/* Vinheta Cinematográfica e Gradientes */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/70 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(19,19,19,0.85)_100%)]"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(19,19,19,0.85)]"></div>
            </div>

            {/* Topo: Botão Discreto de Pular */}
            <header className="relative z-20 flex justify-end items-center px-4 pt-6 max-w-sm mx-auto w-full">
              <button
                type="button"
                id="btn-skip"
                onClick={() => finishTransition()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#201f1f]/80 backdrop-blur-md text-[#B3B3B3] hover:text-white active:bg-[#2a2a2a] transition-colors text-xs font-semibold uppercase tracking-wider border border-[#404040]/30 cursor-pointer"
              >
                <span>Pular introdução</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </header>

            {/* Centro: Efeito de Luz Pulsante Discreta (Ambient Glow Neon) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
              <div className="w-52 h-52 rounded-full bg-[#e50914]/20 blur-3xl absolute -z-10 animate-pulse"></div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.8)] bg-black relative mb-3">
                <img
                  src="/branding/logo.jpg"
                  alt="ComixFlix Logo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <h1 className="text-3xl font-extrabold tracking-widest uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] flex items-center justify-center">
                <span className="text-[#E50914] font-black">COMIX</span>
                <span className="text-white font-black ml-0.5">FLIX</span>
              </h1>
            </div>

            {/* Base: Status de Carregamento, Countdown e Barra de Progresso */}
            <footer className="relative z-20 flex flex-col items-center px-4 pb-10 space-y-3 bg-gradient-to-t from-[#131313] via-[#131313]/85 to-transparent pt-10 max-w-sm mx-auto w-full">
              {/* Indicador de Status e Countdown */}
              <div className="w-full flex items-center justify-between text-[#B3B3B3] px-1 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e50914]"></span>
                  </span>
                  <span className="font-semibold tracking-wider uppercase text-white">
                    Entrando no ComixFlix...
                  </span>
                </div>
                <span className="text-[#8C8C8C] tabular-nums font-bold">
                  {countdown > 0 ? `${countdown}s` : "Pronto!"}
                </span>
              </div>

              {/* Barra de Progresso Suave (3 Segundos) */}
              <div className="w-full h-1 bg-[#353534]/80 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-[#e50914] transition-all duration-[3200ms] ease-out rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]"
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>

              {/* Micro Detalhe Visual & Autoria Técnica */}
              <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#8C8C8C] uppercase tracking-widest font-semibold">
                  Sua Coleção em Alta Definição
                </span>
                <Link
                  href="/sobre"
                  className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Conheça a Milkfed Devs&&Reqs Lords - Sobre Nós"
                >
                  <span className="text-[9px] text-[#7A7A7A]">Desenvolvido por</span>
                  <img
                    src="/branding/logo-milkfed.png"
                    alt="Milkfed Devs&&Reqs Lords"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="text-[10px] text-[#A0A0A0] font-semibold">
                    Milkfed Devs&&Reqs Lords
                  </span>
                </Link>
              </div>
            </footer>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. TELA: ACESSAR CONTA / ENTRAR (Fiel 100% ao Stitch com logo.jpg) */}
      {/* ========================================================================= */}
      {currentScreen === "login" && (
        <div className="min-h-screen bg-[#131313] flex flex-col">
          {/* Header Superior Fixo com logo.jpg */}
          <header className="fixed top-0 w-full z-50 pt-safe bg-[#131313]/85 backdrop-blur-xl border-b border-[#201f1f]">
            <div className="h-16 max-w-sm mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Voltar"
                  onClick={() => setCurrentScreen("splash-initial")}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[#B3B3B3] hover:text-white hover:bg-[#201f1f] active:scale-95 transition-all -ml-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e50914]/40 bg-black shrink-0 shadow-sm">
                  <img src="/branding/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-lg tracking-wider text-[#e50914]">
                  COMIX<span className="text-white">FLIX</span>
                </span>
                <span className="text-xs font-semibold text-white ml-1">Acessar Conta</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#ffb4aa] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#690003] text-[18px]">person</span>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col pt-18 pb-10 px-4 max-w-sm mx-auto w-full">
            {/* Dynamic Cinematic Ambient Glow */}
            <div className="relative w-full overflow-hidden pt-2">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-44 bg-[#e50914]/15 blur-[64px] rounded-full pointer-events-none"></div>

              {/* Comic Strip Backdrop Mosaic Highlight */}
              <div className="relative w-full rounded-xl overflow-hidden bg-[#1c1b1b] border border-[#2a2a2a] p-4 shadow-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#e50914] text-white font-bold text-[10px]">
                      HQ
                    </span>
                    <span className="text-[11px] text-[#B3B3B3] tracking-wider uppercase font-semibold">
                      Universo ComixFlix
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#FFB400] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[13px]">auto_stories</span>
                    <span>+45.000 EDIÇÕES</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  Bem-vindo de <span className="text-[#e50914]">volta</span>
                </h2>
                <p className="text-xs text-[#B3B3B3] leading-relaxed mt-0.5">
                  Acesse sua biblioteca, acompanhe suas séries favoritas e mergulhe em sagas memoráveis.
                </p>

                {/* Mini Live Comic Previews Row */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="relative rounded-md overflow-hidden aspect-[2/3] bg-[#201f1f] shadow-md">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCECcE91QN9ftJ7WQ_VUVoBpRvW-4oG0lQVSR7uzrZO3n4hc8xn2Mp8UPYT9sGa7gwNb8DKWAA4h5VsQOw0m9vWl4XJDwwTLynpH5x6k-5Vy5fdY13AS9bT01RimLAJaEKHFFDG09eCyWQpYwLGR_9iCYUSPx0ss6GWqsEb88FD5Ma_FeW2fabzDKCcz5tsKep42sHnfsngCuBcwDA7EfKSLgUb3lLFJyF7rL7S2v8rikxWriF9WW6G0w"
                      alt="Noir Comic"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white px-1 rounded bg-black/80">
                      Lendo
                    </span>
                  </div>

                  <div className="relative rounded-md overflow-hidden aspect-[2/3] bg-[#201f1f] shadow-md">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6CTAiCxClYwqyOspZJMPrprzmorAJdAtPAWBDTRIqxu4nnVUvCsOwnG9IaDy-x2gqhrLpQPosuJ9DPL8u_NSucFfZzS1u4FrMfX2cCYwUXNLkBx4RbidZP5vLdiKpT5OUe6xrd9WeTPmUP0XZCl7NmNZe7MrdKnLMlkwLsvsrWyRV3gkxg9MPtwVvYASt2qA6oa7NW80kh5gw3Z9GuqiAPhcbEn3JGGapHA_p-P-yw3xDNNlUlaV2Rw"
                      alt="Sci-Fi Comic"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold text-[#4DA3FF] px-1 rounded bg-black/80">
                      Coleção
                    </span>
                  </div>

                  <div className="relative rounded-md overflow-hidden aspect-[2/3] bg-[#201f1f] shadow-md">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCrwISrtZDRWJ_2bUVQV37YdJCrOJF8qV_DEWL2rXyFQeBzpT0omhcdv5bRkvklPJdiEst1kfwVUBHflE260VGXu-bJeshyfv5qwazdxj3Dd1E2INh49-DAe-hRgM8gGFJOctbB1TMt58OjUFOu4L-dBp6ePlrlnZuhRUdrOlGNEm2PlxLNK25AfAqkBbQZwYXmkOeZhkuIEo3ppb3DBqZEPsq4_ZcEnG--Fv-meJK_CuMxdxQ0QkoWg"
                      alt="Gothic Comic"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold text-[#FFB400] px-1 rounded bg-black/80">
                      Raro
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Form Card */}
              <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl p-4 shadow-xl">
                <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
                  {/* Input: E-mail or Username */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#B3B3B3] flex items-center justify-between">
                      <span>E-mail ou Usuário</span>
                      <span className="text-[10px] text-[#8C8C8C]">Obrigatório</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                        alternate_email
                      </span>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        required
                        className="w-full h-11 bg-[#201f1f] pl-10 pr-3 rounded-lg text-sm text-white placeholder:text-[#8C8C8C] focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                      />
                    </div>
                  </div>

                  {/* Input: Password */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#B3B3B3]">Senha</label>
                      <button
                        type="button"
                        onClick={() => setCurrentScreen("forgot")}
                        className="text-[11px] font-semibold text-[#ffb4aa] hover:text-white transition-colors cursor-pointer"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                        lock
                      </span>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full h-11 bg-[#201f1f] pl-10 pr-10 rounded-lg text-sm text-white placeholder:text-[#8C8C8C] focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label="Alternar visibilidade da senha"
                        className="absolute right-1 w-9 h-9 flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showLoginPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded bg-[#201f1f] border border-[#404040] flex items-center justify-center peer-checked:bg-[#e50914] peer-checked:border-[#e50914] transition-all">
                      <span className="material-symbols-outlined text-[13px] text-white font-bold">
                        check
                      </span>
                    </div>
                    <span className="text-xs text-[#B3B3B3] peer-checked:text-white transition-colors">
                      Lembrar de mim neste dispositivo
                    </span>
                  </label>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-[#e50914] hover:bg-[#F40612] active:bg-[#B20710] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[18px]">
                          progress_activity
                        </span>
                        <span>Acessando cofre...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Entrar no ComixFlix</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    )}
                  </button>
                </form>

                {/* Biometric Rapid Access Option */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="w-full h-11 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#2a2a2a]"
                  >
                    <span className="material-symbols-outlined text-[#a2c9ff] text-[20px]">
                      fingerprint
                    </span>
                    <span>Entrar com Biometria / Face ID</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-[1px] bg-[#2a2a2a]"></div>
                  </div>
                  <span className="relative px-3 bg-[#1c1b1b] text-[10px] text-[#8C8C8C] uppercase tracking-wider font-semibold">
                    ou continue com
                  </span>
                </div>

                {/* Social Logins Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="h-11 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] flex items-center justify-center gap-2 px-3 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-xs font-bold text-white">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast("Conectando via Apple...")}
                    className="h-11 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] flex items-center justify-center gap-2 px-3 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.67-.82 1.13-1.97 1-3.12-1 .04-2.17.67-2.85 1.47-.6.7-1.13 1.83-.99 2.95 1.12.09 2.18-.5 2.84-1.3z" />
                    </svg>
                    <span className="text-xs font-bold text-white">Apple</span>
                  </button>
                </div>
              </div>

              {/* Sign-Up Direct Link Box */}
              <div className="mt-3 p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col items-center justify-center text-center gap-1">
                <p className="text-xs text-[#B3B3B3]">Ainda não faz parte do clube?</p>
                <button
                  type="button"
                  onClick={() => setCurrentScreen("register")}
                  className="text-xs font-bold text-[#ffb4aa] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Criar conta grátis</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>
              </div>

              {/* Guest Access Button */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("splash-transition")}
                  className="w-full h-10 rounded-lg hover:bg-[#1c1b1b] text-[#B3B3B3] hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#FFB400]">explore</span>
                  <span>Continuar navegando como visitante</span>
                </button>
              </div>

              {/* Security & Developer Note */}
              <div className="mt-4 flex flex-col items-center justify-center gap-2 text-[#8C8C8C] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-[#46D369]">
                    verified_user
                  </span>
                  <span>Ambiente Seguro • Seus dados e coleção criptografados</span>
                </div>
                <Link
                  href="/sobre"
                  className="flex items-center gap-1.5 opacity-65 hover:opacity-95 transition-opacity cursor-pointer"
                  title="Conheça a Milkfed Devs&&Reqs Lords - Sobre Nós"
                >
                  <span className="text-[10px] text-[#707070]">Desenvolvido por</span>
                  <img
                    src="/branding/logo-milkfed.png"
                    alt="Milkfed Devs&&Reqs Lords"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="text-[10px] text-[#909090] font-semibold">
                    Milkfed Devs&&Reqs Lords
                  </span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TELA: CRIAR CONTA (Fiel 100% ao Stitch com logo.jpg) */}
      {/* ========================================================================= */}
      {currentScreen === "register" && (
        <div className="min-h-screen bg-[#131313] flex flex-col">
          {/* Header Superior Fixo com logo.jpg */}
          <header className="fixed top-0 w-full z-50 pt-safe bg-[#131313]/85 backdrop-blur-xl border-b border-[#201f1f]">
            <div className="h-16 max-w-sm mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Voltar"
                  onClick={() => setCurrentScreen("splash-initial")}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[#B3B3B3] hover:text-white hover:bg-[#201f1f] active:scale-95 transition-all -ml-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e50914]/40 bg-black shrink-0 shadow-sm">
                  <img src="/branding/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-lg tracking-wider text-[#e50914]">
                  COMIX<span className="text-white">FLIX</span>
                </span>
                <span className="text-xs font-semibold text-white ml-1">Criar Conta</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#ffb4aa] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#690003] text-[18px]">person</span>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col pt-18 pb-10 px-4 max-w-sm mx-auto w-full">
            {/* Ambient Glow */}
            <div className="relative w-full overflow-hidden">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#e50914]/15 blur-3xl pointer-events-none rounded-full"></div>

              {/* Header Section */}
              <div className="flex flex-col pt-2 pb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a2a2a] self-start mb-2 border border-[#404040]/30">
                  <span className="material-symbols-outlined text-[#FFB400] text-[15px]">verified</span>
                  <span className="text-[10px] text-[#FFB400] font-bold tracking-wider uppercase">
                    100% Gratuito para Colecionadores
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Crie sua conta no ComixFlix
                </h2>
                <p className="text-xs text-[#B3B3B3] mt-1 leading-relaxed">
                  Comece a catalogar sua estante, criar wishlists e acompanhar lançamentos em segundos.
                </p>
              </div>

              {/* Social Authentication Options */}
              <div className="flex flex-col gap-2 my-2">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 px-4 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.7 5.8 7 10.4 7z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-xs font-bold text-white">Cadastrar com Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast("Cadastrando com Apple...")}
                  className="w-full h-11 px-4 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96.99-3.11-.97.05-2.19.66-2.88 1.48-.6.71-1.13 1.87-.99 2.98 1.09.09 2.22-.53 2.88-1.35z" />
                  </svg>
                  <span className="text-xs font-bold text-white">Cadastrar com Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-3 gap-3">
                <div className="flex-1 h-px bg-[#2a2a2a]"></div>
                <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider font-semibold">
                  ou cadastre com seu e-mail
                </span>
                <div className="flex-1 h-px bg-[#2a2a2a]"></div>
              </div>

              {/* Registration Form */}
              <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit}>
                {/* Nome de Colecionador */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#B3B3B3] flex items-center justify-between">
                    <span>Nome de Colecionador ou Apelido</span>
                    <span className="text-[10px] text-[#8C8C8C]">Público no perfil</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                      badge
                    </span>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Peter Parker"
                      required
                      className="w-full h-11 bg-[#201f1f] pl-10 pr-3 rounded-lg text-sm text-white placeholder:text-[#8C8C8C] focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#B3B3B3]">E-mail</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                      mail
                    </span>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="voce@email.com"
                      required
                      className="w-full h-11 bg-[#201f1f] pl-10 pr-10 rounded-lg text-sm text-white placeholder:text-[#8C8C8C] focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                    />
                    {regEmail.includes("@") && regEmail.includes(".") && (
                      <span className="material-symbols-outlined absolute right-3 text-[#46D369] text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                </div>

                {/* Senha */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#B3B3B3]">Criar Senha</label>
                    <span className="text-[10px] text-[#8C8C8C]">Mínimo 6 dígitos</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                      lock
                    </span>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="No mínimo 6 caracteres"
                      required
                      className="w-full h-11 bg-[#201f1f] pl-10 pr-10 rounded-lg text-sm text-white placeholder:text-[#8C8C8C] focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label="Alternar exibição da senha"
                      className="absolute right-1 w-9 h-9 flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showRegPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= 1 ? "bg-[#e50914]" : "bg-[#2a2a2a]"
                      }`}
                    ></div>
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= 2 ? "bg-[#FFB400]" : "bg-[#2a2a2a]"
                      }`}
                    ></div>
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= 3 ? "bg-[#4DA3FF]" : "bg-[#2a2a2a]"
                      }`}
                    ></div>
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= 4 ? "bg-[#46D369]" : "bg-[#2a2a2a]"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Preferências de Leitura */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-[#B3B3B3]">
                    O que você mais coleciona? <span className="text-[#8C8C8C] font-normal">(Opcional)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "marvel", label: "Marvel", icon: "local_fire_department", color: "text-[#e50914]" },
                      { id: "dc", label: "DC Comics", icon: "shield", color: "text-[#4DA3FF]" },
                      { id: "manga", label: "Mangás", icon: "menu_book", color: "text-[#FFB400]" },
                      { id: "indie", label: "Nacionais & Indie", icon: "palette", color: "text-[#46D369]" },
                    ].map((chip) => {
                      const isSelected = selectedPreferences.includes(chip.id);
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => togglePreference(chip.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#2a2a2a] text-white border-[#e50914]"
                              : "bg-[#201f1f] text-[#B3B3B3] border-transparent hover:bg-[#2a2a2a]"
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[15px] ${chip.color}`}>
                            {chip.icon}
                          </span>
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkboxes de Termos e Newsletter */}
                <div className="flex flex-col gap-2 pt-1 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only peer"
                      required
                    />
                    <div className="w-4 h-4 rounded bg-[#201f1f] border border-[#404040] flex items-center justify-center peer-checked:bg-[#e50914] peer-checked:border-[#e50914] transition-all mt-0.5 shrink-0">
                      <span className="material-symbols-outlined text-[13px] text-white font-bold">
                        check
                      </span>
                    </div>
                    <span className="text-[#B3B3B3] leading-snug">
                      Li e concordo com os{" "}
                      <Link href="/termos" className="text-white underline font-semibold hover:text-[#e50914]">
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-white underline font-semibold hover:text-[#e50914]">
                        Política de Privacidade
                      </Link>{" "}
                      do ComixFlix.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeNewsletter}
                      onChange={(e) => setAgreeNewsletter(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded bg-[#201f1f] border border-[#404040] flex items-center justify-center peer-checked:bg-[#4DA3FF] peer-checked:border-[#4DA3FF] transition-all mt-0.5 shrink-0">
                      <span className="material-symbols-outlined text-[13px] text-white font-bold">
                        check
                      </span>
                    </div>
                    <span className="text-[#B3B3B3] leading-snug">
                      Desejo receber avisos de promoções, reduções de preço e novos lançamentos no meu e-mail.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 rounded-lg bg-[#e50914] hover:bg-[#F40612] active:bg-[#B20710] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      <span>Criando sua conta...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Criar Minha Conta Grátis</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  )}
                </button>
              </form>

              {/* Rodapé Alternar para Login & Autoria */}
              <div className="flex flex-col items-center gap-2 mt-4 text-center">
                <p className="text-xs text-[#B3B3B3]">Já possui uma conta de colecionador?</p>
                <button
                  type="button"
                  onClick={() => setCurrentScreen("login")}
                  className="text-xs font-bold text-[#ffb4aa] hover:text-white transition-colors cursor-pointer"
                >
                  Fazer login na sua estante
                </button>
                <Link
                  href="/sobre"
                  className="flex items-center gap-1.5 pt-2 opacity-65 hover:opacity-95 transition-opacity cursor-pointer"
                  title="Conheça a Milkfed Devs&&Reqs Lords - Sobre Nós"
                >
                  <span className="text-[10px] text-[#707070]">Desenvolvido por</span>
                  <img
                    src="/branding/logo-milkfed.png"
                    alt="Milkfed Devs&&Reqs Lords"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="text-[10px] text-[#909090] font-semibold">
                    Milkfed Devs&&Reqs Lords
                  </span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TELA: ESQUECEU SUA SENHA (Fiel 100% ao Stitch com logo.jpg) */}
      {/* ========================================================================= */}
      {currentScreen === "forgot" && (
        <div className="min-h-screen bg-[#131313] flex flex-col">
          {/* Header Superior Fixo com logo.jpg */}
          <header className="fixed top-0 w-full z-50 pt-safe bg-[#131313]/85 backdrop-blur-xl border-b border-[#201f1f]">
            <div className="h-16 max-w-sm mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Voltar"
                  onClick={() => setCurrentScreen("login")}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[#B3B3B3] hover:text-white hover:bg-[#201f1f] active:scale-95 transition-all -ml-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e50914]/40 bg-black shrink-0 shadow-sm">
                  <img src="/branding/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-lg tracking-wider text-[#e50914]">
                  COMIX<span className="text-white">FLIX</span>
                </span>
                <span className="text-xs font-semibold text-white ml-1">Recuperação</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#ffb4aa] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#690003] text-[18px]">lock_reset</span>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col pt-18 pb-10 px-4 max-w-sm mx-auto w-full">
            <div className="w-full flex flex-col gap-4">
              {/* Card de Topo com Ícone e Badge */}
              <div className="relative overflow-hidden bg-[#201f1f] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3.5 shadow-xl">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#e50914]/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 rounded-lg bg-[#353534] flex items-center justify-center relative shadow-inner">
                  <span className="material-symbols-outlined text-[#e50914] text-[26px]">
                    lock_reset
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 z-10">
                  <span className="inline-flex items-center gap-1.5 w-max px-2 py-0.5 rounded-full bg-[#e50914]/15 text-[#ffb4aa] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e50914] animate-pulse"></span>
                    PROTOCOLO SEGURO CFHQ
                  </span>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Recuperar Acesso à Estante
                  </h2>
                </div>
              </div>

              <p className="text-xs text-[#B3B3B3] leading-relaxed">
                Informe seu e-mail cadastrado ou usuário para restabelecer as chaves do seu cofre e receber o link de redefinição imediato.
              </p>

              {/* Card com Seletor de Método e Input */}
              <div className="flex flex-col gap-3 bg-[#1c1b1b] border border-[#2a2a2a] p-4 rounded-xl shadow-lg">
                <label className="text-[10px] font-bold text-[#8C8C8C] uppercase tracking-wider">
                  Método de Envio
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod("email");
                      setRecoveryInput("");
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                      recoveryMethod === "email"
                        ? "bg-[#353534] border-[#e50914]"
                        : "bg-[#201f1f] border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mb-1.5 ${
                        recoveryMethod === "email" ? "bg-[#e50914]" : "bg-transparent"
                      }`}
                    ></div>
                    <span className="material-symbols-outlined text-[#e50914] text-[18px] mb-0.5">
                      mail
                    </span>
                    <span className="text-xs font-semibold text-white">Link por E-mail</span>
                    <span className="text-[10px] text-[#8C8C8C]">Envio instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod("sms");
                      setRecoveryInput("+55 (11) 98877-6655");
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                      recoveryMethod === "sms"
                        ? "bg-[#353534] border-[#4DA3FF]"
                        : "bg-[#201f1f] border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mb-1.5 ${
                        recoveryMethod === "sms" ? "bg-[#4DA3FF]" : "bg-transparent"
                      }`}
                    ></div>
                    <span className="material-symbols-outlined text-[#4DA3FF] text-[18px] mb-0.5">
                      chat_bubble
                    </span>
                    <span className="text-xs font-semibold text-white">SMS / WhatsApp</span>
                    <span className="text-[10px] text-[#8C8C8C]">Código de 6 dígitos</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs font-semibold text-[#B3B3B3]">
                    {recoveryMethod === "email"
                      ? "E-mail ou Nome de Usuário"
                      : "Telefone Celular com DDD"}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#8C8C8C] text-[20px] pointer-events-none">
                      {recoveryMethod === "email" ? "alternate_email" : "phone_android"}
                    </span>
                    <input
                      type={recoveryMethod === "email" ? "email" : "text"}
                      value={recoveryInput}
                      onChange={(e) => setRecoveryInput(e.target.value)}
                      placeholder={
                        recoveryMethod === "email"
                          ? "colecionador@comixflix.app"
                          : "+55 (11) 99999-9999"
                      }
                      required
                      className="w-full h-11 pl-10 pr-9 bg-[#201f1f] text-white placeholder:text-[#8C8C8C] rounded-lg text-sm focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-[#e50914] transition-all"
                    />
                    {recoveryInput.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setRecoveryInput("")}
                        aria-label="Limpar campo"
                        className="w-7 h-7 absolute right-2 flex items-center justify-center text-[#8C8C8C] hover:text-white cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                {recoverySuccess && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#e50914]/10 border border-[#e50914]/30">
                    <span className="material-symbols-outlined text-[#e50914] text-[18px] shrink-0 mt-0.5">
                      mark_email_read
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">E-mail de verificação despachado!</span>
                      <span className="text-[11px] text-[#B3B3B3]">
                        Confira sua caixa postal ou pasta de spam nos próximos 2 minutos.
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRecoverySubmit}
                  className="w-full h-11 bg-[#e50914] hover:bg-[#F40612] active:bg-[#B20710] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      <span>Enviando solicitação...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>
                        {recoveryMethod === "email"
                          ? "Enviar Link de Redefinição"
                          : "Enviar Código por SMS"}
                      </span>
                    </span>
                  )}
                </button>
              </div>

              {/* Card Suporte Humano */}
              <div className="bg-[#201f1f] border border-[#2a2a2a] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#4DA3FF] text-[18px]">
                      contact_support
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Esqueceu as credenciais?</span>
                    <span className="text-[10px] text-[#8C8C8C]">
                      Recupere sua estante com auxílio humano.
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:suporte@comixflix.com.br"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#353534] text-white hover:bg-[#404040] text-[11px] font-bold active:scale-95 transition-all"
                >
                  Suporte
                </a>
              </div>

              {/* Voltar para Login */}
              <div className="flex flex-col items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("login")}
                  className="inline-flex items-center gap-1.5 text-[#B3B3B3] hover:text-white text-xs font-semibold transition-colors py-2 px-3 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Lembrou sua senha? Voltar para o Acesso</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Toast Notifier Flutuante Global do Stitch */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none animate-fade-in">
          <div className="bg-[#2B2B2B] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 max-w-sm w-full border border-[#404040]">
            <span className="material-symbols-outlined text-[#e50914] text-[20px]">
              info
            </span>
            <span className="text-xs leading-tight flex-1">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
