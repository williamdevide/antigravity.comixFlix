import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "discount" | "wishlist" | "collection" | "read" | "promo" | "default" | "pre_venda" | "esgotado" | "editora" | "status";
  editora?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", editora, className }) => {
  const baseStyles = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide transition-colors";

  const variantStyles = {
    discount: "bg-red-500/20 text-red-400 border border-red-500/30",
    wishlist: "bg-brand-primary/20 text-brand-primary border border-brand-primary/40",
    collection: "bg-status-collection/20 text-status-collection border border-status-collection/40",
    read: "bg-status-success/20 text-status-success border border-status-success/40",
    promo: "bg-promo text-bg-canvas font-extrabold uppercase",
    pre_venda: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    esgotado: "bg-neutral-700/50 text-neutral-400 border border-neutral-600",
    default: "bg-bg-surface text-text-secondary border border-border-default",
    status: "bg-brand-primary/20 text-brand-primary border border-brand-primary/30",
    editora: clsx(
      "border",
      editora === "Panini" && "bg-red-500/10 text-red-400 border-red-500/30",
      editora === "Mythos" && "bg-amber-500/10 text-amber-400 border-amber-500/30",
      editora === "Pipoca & Nanquim" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      (editora === "Quadrinhos na Cia" || editora === "Companhia") && "bg-blue-500/10 text-blue-400 border-blue-500/30",
      !editora && "bg-bg-surface text-text-secondary border-border-default"
    ),
  };

  return (
    <span className={clsx(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
};
