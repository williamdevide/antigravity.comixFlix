"use client";

import React, { useState } from "react";
import { Cloud, CloudOff, RefreshCw, Check } from "lucide-react";
import { CloudSyncStatus } from "@/lib/types/user";

interface CloudSyncIndicatorProps {
  status: CloudSyncStatus;
  className?: string;
  showLabel?: boolean;
}

export function CloudSyncIndicator({
  status,
  className = "",
  showLabel = false,
}: CloudSyncIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  let iconElement: React.ReactNode;
  let statusText: string;
  let statusColor: string;
  let containerGlow: string;

  switch (status) {
    case "offline":
      iconElement = <CloudOff className="w-4 h-4 text-zinc-500" />;
      statusText = "Modo Offline (dados gravados localmente)";
      statusColor = "text-zinc-500";
      containerGlow = "border-zinc-700/50 bg-zinc-900/50";
      break;

    case "syncing":
      iconElement = (
        <div className="relative flex items-center justify-center">
          <Cloud className="w-4 h-4 text-lime-400 animate-pulse drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]" />
          <RefreshCw className="w-2.5 h-2.5 text-lime-300 animate-spin absolute" />
        </div>
      );
      statusText = "Sincronizando coleção com o Firebase...";
      statusColor = "text-lime-400 animate-pulse";
      containerGlow = "border-lime-500/40 bg-lime-950/20 shadow-[0_0_12px_rgba(163,230,53,0.25)]";
      break;

    case "synced":
    default:
      iconElement = (
        <div className="relative flex items-center justify-center">
          <Cloud className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <Check className="w-2.5 h-2.5 text-bg-canvas stroke-[3] absolute translate-y-0.5" />
        </div>
      );
      statusText = "Coleção 100% sincronizada no Firebase";
      statusColor = "text-emerald-400";
      containerGlow = "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.25)]";
      break;
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
      role="status"
      aria-label={statusText}
    >
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all duration-300 cursor-pointer ${containerGlow}`}
      >
        {iconElement}
        {showLabel && (
          <span className={`text-[11px] font-semibold tracking-wide ${statusColor}`}>
            {status === "offline"
              ? "Offline"
              : status === "syncing"
              ? "Sincronizando..."
              : "Sincronizado"}
          </span>
        )}
      </div>

      {/* Tooltip moderno com microanimação */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-default shadow-elevated text-xs font-medium text-text-primary whitespace-nowrap animate-fade-in pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "offline"
                  ? "bg-zinc-500"
                  : status === "syncing"
                  ? "bg-lime-400 animate-ping"
                  : "bg-emerald-400 shadow-[0_0_6px_#34d399]"
              }`}
            />
            {statusText}
          </div>
        </div>
      )}
    </div>
  );
}
