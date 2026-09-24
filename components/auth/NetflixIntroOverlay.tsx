"use client";

import React, { useEffect, useRef, useState } from "react";
import { playNetflixComicIntroSound } from "@/lib/utils/audio";

interface NetflixIntroOverlayProps {
  onComplete: () => void;
}

export function NetflixIntroOverlay({ onComplete }: NetflixIntroOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<"initial" | "burst" | "zoom" | "fade">("initial");

  useEffect(() => {
    // 1. Toca o sintetizador sonoro Web Audio nativo sincronizado com o efeito de tela
    playNetflixComicIntroSound();

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.playbackRate = 1.35; // Aceleração cinematográfica dinâmica
      videoEl.play().catch(() => {});
    }

    // 2. Cronograma das etapas da transição cinematográfica (~3.2 segundos no total)
    const t1 = setTimeout(() => setStage("burst"), 500);
    const t2 = setTimeout(() => setStage("zoom"), 1800);
    const t3 = setTimeout(() => setStage("fade"), 3100);
    const t4 = setTimeout(() => onComplete(), 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c] overflow-hidden select-none transition-opacity duration-500 ${
        stage === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Vídeo Oficial de Transição Cinematográfica com explosão de néon */}
      <video
        ref={videoRef}
        src="/branding/transition-netflix.mp4"
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 ${
          stage === "zoom" ? "scale-105" : "scale-100"
        }`}
        onEnded={() => {
          setStage("fade");
          setTimeout(onComplete, 350);
        }}
      />

      {/* Camada de suporte com feixes de luz vermelha anamórfica de clímax (burst) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-500 ${
          stage === "burst" || stage === "zoom" ? "opacity-100 scale-110" : "opacity-0 scale-95"
        }`}
      >
        <div className="w-[180vw] h-2 bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent shadow-[0_0_40px_#FF1E27] opacity-80" />
        <div className="absolute w-2 h-[160vh] bg-gradient-to-b from-transparent via-[#FF1E27] to-transparent shadow-[0_0_40px_#FF1E27] opacity-80" />
      </div>

      {/* Vinheta escura nas bordas */}
      <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_40%,#000000_100%)] pointer-events-none z-30" />
    </div>
  );
}
