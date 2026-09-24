"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  Monitor,
  QrCode,
  ShieldCheck,
  BookOpen,
  Send,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    username: string;
    avatarUrl: string;
    favoritePublisher: string;
  };
  stats: {
    totalTenho: number;
    totalLidos: number;
    valorEstimadoTotal: number;
  };
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  stats,
}) => {
  const [format, setFormat] = useState<"stories" | "banner">("stories");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/perfil` : "https://comixflix.com.br/perfil";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Confira minha coleção oficial de quadrinhos no @ComixFlix! Já tenho ${stats.totalTenho} edições catalogadas 📚🔥`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bg-surface border border-border-default rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-text-primary tracking-tight">
                Compartilhar Minha Coleção
              </h2>
              <p className="text-xs text-text-secondary">
                Gere cards otimizados para Instagram Stories ou redes sociais.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formatos: Stories vs Banner */}
        <div className="px-6 pt-4 pb-2 flex gap-2 border-b border-border-default bg-bg-canvas/30">
          <button
            type="button"
            onClick={() => setFormat("stories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              format === "stories"
                ? "bg-brand-primary text-white shadow-card"
                : "bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Instagram Stories (9:16)
          </button>
          <button
            type="button"
            onClick={() => setFormat("banner")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              format === "banner"
                ? "bg-brand-primary text-white shadow-card"
                : "bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Banner Twitter / Discord (16:9)
          </button>
        </div>

        {/* Visual Preview Container */}
        <div className="p-6 overflow-y-auto flex items-center justify-center bg-bg-canvas/60">
          {format === "stories" ? (
            /* STORY 9:16 CARD PREVIEW */
            <div className="w-72 sm:w-80 aspect-[9/16] rounded-3xl bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#000000] border-2 border-border-default p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white group select-none">
              {/* Glow decorativo */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top: Logo & Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <Logo size="sm" />
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-brand-primary/30 border border-brand-primary/40 text-red-300">
                  NÍVEL 5 • CURADOR
                </span>
              </div>

              {/* Center: Avatar & Info */}
              <div className="relative z-10 text-center space-y-3 my-auto py-4">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary via-amber-500 to-purple-600 animate-pulse blur-[2px]" />
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="relative w-full h-full rounded-full object-cover border-2 border-black p-0.5"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">{profile.name}</h3>
                  <p className="text-xs text-zinc-400 font-medium">@{profile.username}</p>
                </div>

                {/* Badges de Destaque */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-zinc-200 border border-white/10">
                    Mestre Mutante
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-zinc-200 border border-white/10">
                    Morcego de Gotham
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Na Estante</span>
                    <span className="text-2xl font-black text-brand-primary block">{stats.totalTenho}</span>
                    <span className="text-[9px] text-zinc-400">Edições Físicas</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Lidos</span>
                    <span className="text-2xl font-black text-emerald-400 block">{stats.totalLidos}</span>
                    <span className="text-[9px] text-zinc-400">Completados</span>
                  </div>
                </div>
              </div>

              {/* Bottom: QR Code & Link */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] text-zinc-400 block">Acesse meu catálogo:</span>
                  <span className="text-xs font-bold text-white">comixflix.com.br/@{profile.username}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white text-black">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            </div>
          ) : (
            /* BANNER 16:9 CARD PREVIEW */
            <div className="w-full max-w-lg aspect-[16/9] rounded-3xl bg-gradient-to-r from-[#18181b] via-[#09090b] to-[#000000] border-2 border-border-default p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white select-none">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-brand-primary/30 border border-brand-primary/40 text-red-300">
                  NÍVEL 5 • COLECIONADOR
                </span>
              </div>

              <div className="flex items-center gap-5 my-auto">
                <div className="relative w-20 h-20 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary via-amber-500 to-purple-600 animate-pulse blur-[2px]" />
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="relative w-full h-full rounded-full object-cover border-2 border-black p-0.5"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight text-white">{profile.name}</h3>
                  <p className="text-xs text-zinc-400 font-medium">@{profile.username}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary">
                      {stats.totalTenho} Quadrinhos
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {stats.totalLidos} Lidos
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>ComixFlix • O streaming da sua coleção física</span>
                <span className="font-bold text-white">comixflix.com.br</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-border-default bg-bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border-default bg-bg-elevated hover:bg-border-default text-text-primary text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
              {copied ? "Link Copiado!" : "Copiar Link"}
            </button>

            <button
              type="button"
              onClick={handleShareTwitter}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-black shadow-card transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
