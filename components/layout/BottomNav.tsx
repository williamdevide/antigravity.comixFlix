"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Library, Database, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/explorar",
      label: "Explorar",
      icon: Compass,
      isActive: pathname === "/explorar",
    },
    {
      href: "/colecao",
      label: "Coleção",
      icon: Library,
      isActive: pathname === "/colecao",
    },
    {
      href: "/scraping",
      label: "Scraper",
      icon: Database,
      isActive: pathname === "/scraping",
    },
    {
      href: "/perfil",
      label: "Perfil",
      icon: User,
      isActive: pathname === "/perfil",
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-canvas/95 backdrop-blur-xl border-t border-border-default pb-safe"
      aria-label="Navegação móvel"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                item.isActive
                  ? "text-brand-primary font-bold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"}`} />
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
