"use client";

import React from "react";
import { useCollection } from "@/lib/context/collection-context";
import { Heart, Library, CheckCircle2, Info, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCollection();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case "wishlist":
              return <Heart className="w-5 h-5 text-brand-primary fill-brand-primary shrink-0" />;
            case "collection":
              return <Library className="w-5 h-5 text-status-collection shrink-0" />;
            case "read":
              return <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-status-info shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg bg-bg-elevated border border-border-default shadow-elevated text-text-primary animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getIcon()}
              <p className="text-sm font-medium leading-tight truncate">{toast.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {toast.undo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.undo?.();
                    removeToast(toast.id);
                  }}
                  className="text-xs font-bold text-brand-primary hover:text-brand-primary-hover underline underline-offset-2 px-1.5 py-0.5 rounded transition-colors"
                >
                  Desfazer
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
