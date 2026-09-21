"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Comic } from "@/lib/types/comic";
import { ComicCard } from "./ComicCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ContentRowProps {
  title: string;
  comics: Comic[];
  seeAllHref?: string;
}

export const ContentRow: React.FC<ContentRowProps> = ({ title, comics, seeAllHref }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (comics.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 py-4 w-full">
      {/* Header da Linha */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-brand-primary shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-semibold text-text-tertiary">
            ({comics.length})
          </span>
        </div>

        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors group"
          >
            Ver todos
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Container de Rolagem Horizontal */}
      <div className="relative group/row">
        {/* Seta Esquerda (Desktop) */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-bg-canvas/90 backdrop-blur-md text-text-primary border border-border-default shadow-elevated items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110 active:scale-95"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Trilha de Cards - Limitado a 24 itens no carrossel para ultra performance */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {comics.slice(0, 24).map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>

        {/* Seta Direita (Desktop) */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-bg-canvas/90 backdrop-blur-md text-text-primary border border-border-default shadow-elevated items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110 active:scale-95"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
