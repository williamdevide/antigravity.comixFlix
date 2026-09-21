"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Comic, UserComic, CollectionStats } from "../types/comic";
import { INITIAL_COMICS } from "../data/comics-seed";

interface ToastMessage {
  id: string;
  title: string;
  type: "wishlist" | "collection" | "read" | "info" | "success";
  undo?: () => void;
}

interface CollectionContextType {
  comics: Comic[];
  userComics: Record<string, UserComic>;
  activeModalComic: Comic | null;
  toasts: ToastMessage[];
  stats: CollectionStats;
  getComicStatus: (comicId: string) => {
    isQuero: boolean;
    isTenho: boolean;
    isLido: boolean;
    nota: number | null;
  };
  toggleStatus: (comicId: string, status: "quero" | "tenho" | "li") => void;
  setRating: (comicId: string, nota: number) => void;
  openComicDetail: (comic: Comic) => void;
  closeComicDetail: () => void;
  showToast: (title: string, type?: ToastMessage["type"], undo?: () => void) => void;
  removeToast: (id: string) => void;
  clearCollection: () => void;
  reloadCatalog: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

// Versão 2: Coleção pessoal estritamente limpa (sem dados mock)
const STORAGE_KEY = "comixflix_user_comics_v2";
const OLD_STORAGE_KEY = "comixflix_user_comics_v1";

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [comics, setComics] = useState<Comic[]>(INITIAL_COMICS);
  const [userComics, setUserComics] = useState<Record<string, UserComic>>({});
  const [activeModalComic, setActiveModalComic] = useState<Comic | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega catálogo atualizado do backend ou cache se disponível
  const reloadCatalog = async () => {
    try {
      const res = await fetch("/api/comics");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setComics(data);
        }
      }
    } catch (e) {
      console.warn("Utilizando catálogo padrão em memória:", e);
    }
  };

  // Carrega estado persistido do localStorage na montagem
  useEffect(() => {
    try {
      // Limpa dados de teste mock da versão antiga se existirem
      if (typeof window !== "undefined") {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserComics(JSON.parse(stored));
      } else {
        // Inicializa com coleção 100% VAZIA por padrão (0 na estante, 0 na wishlist)
        setUserComics({});
      }
    } catch (e) {
      console.warn("Erro ao carregar dados do LocalStorage:", e);
      setUserComics({});
    } finally {
      setIsLoaded(true);
    }

    // Carrega catálogo
    reloadCatalog();
  }, []);

  // Salva no localStorage em toda alteração
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userComics));
      } catch (e) {
        console.error("Erro ao persistir no LocalStorage:", e);
      }
    }
  }, [userComics, isLoaded]);

  // Função para zerar a coleção pessoal
  const clearCollection = () => {
    setUserComics({});
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    } catch (e) {}
    showToast("Sua coleção pessoal foi reiniciada e está 100% limpa.", "info");
  };

  const showToast = (title: string, type: ToastMessage["type"] = "info", undo?: () => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, type, undo }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getComicStatus = (comicId: string) => {
    const entry = userComics[comicId];
    if (!entry) {
      return { isQuero: false, isTenho: false, isLido: false, nota: null };
    }
    return {
      isQuero: entry.status === "quero",
      isTenho: entry.status === "tenho" || entry.status === "li",
      isLido: entry.status === "li",
      nota: entry.nota_pessoal,
    };
  };

  const toggleStatus = (comicId: string, status: "quero" | "tenho" | "li") => {
    const comic = comics.find((c) => c.id === comicId);
    const comicTitle = comic ? comic.titulo.split("—")[0].trim() : "Edição";
    const current = userComics[comicId];
    const previousState = { ...userComics };

    let newStatus: "quero" | "tenho" | "li" | null = status;
    let toastMsg = "";
    let toastType: ToastMessage["type"] = "info";

    if (current && current.status === status) {
      newStatus = null;
      toastMsg = `"${comicTitle}" removido de ${status === "quero" ? "Desejos" : status === "tenho" ? "Coleção" : "Lidos"}.`;
      toastType = "info";
    } else {
      if (status === "quero") {
        toastMsg = `"${comicTitle}" adicionado à sua Wishlist!`;
        toastType = "wishlist";
      } else if (status === "tenho") {
        toastMsg = `"${comicTitle}" adicionado à sua Estante!`;
        toastType = "collection";
      } else if (status === "li") {
        toastMsg = `"${comicTitle}" marcado como Lido! Parabéns pela leitura.`;
        toastType = "read";
      }
    }

    setUserComics((prev) => {
      const updated = { ...prev };
      if (!newStatus) {
        delete updated[comicId];
      } else {
        updated[comicId] = {
          id: current ? current.id : `uc_${Date.now()}`,
          comic_id: comicId,
          status: newStatus,
          nota_pessoal: current?.nota_pessoal ?? null,
          data_adicao: current?.data_adicao ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preco_pago: current?.preco_pago ?? (comic?.preco_promocional ?? comic?.preco_normal ?? null),
        };
      }
      return updated;
    });

    // Toast com ação de Desfazer (Undo)
    showToast(toastMsg, toastType, () => {
      setUserComics(previousState);
      showToast("Ação desfeita com sucesso.", "info");
    });
  };

  const setRating = (comicId: string, nota: number) => {
    setUserComics((prev) => {
      const current = prev[comicId];
      if (!current) return prev;
      return {
        ...prev,
        [comicId]: {
          ...current,
          nota_pessoal: nota,
          status: "li",
          updated_at: new Date().toISOString(),
        },
      };
    });
    showToast(`Avaliação de ${nota} estrelas registrada!`, "success");
  };

  const openComicDetail = (comic: Comic) => {
    setActiveModalComic(comic);
  };

  const closeComicDetail = () => {
    setActiveModalComic(null);
  };

  // Estatísticas agregadas reativas
  const stats = useMemo<CollectionStats>(() => {
    let totalTenho = 0;
    let totalQuero = 0;
    let totalLidos = 0;
    let valorEstimadoTotal = 0;
    const distribuicaoEditoras: Record<string, number> = {};

    Object.values(userComics).forEach((item) => {
      const comic = comics.find((c) => c.id === item.comic_id);
      if (!comic) return;

      if (item.status === "quero") {
        totalQuero++;
      } else {
        totalTenho++;
        if (item.status === "li") {
          totalLidos++;
        }
        valorEstimadoTotal += item.preco_pago ?? comic.preco_promocional ?? comic.preco_normal;

        const editora = comic.editora.split(" ")[0] || "Outras";
        distribuicaoEditoras[editora] = (distribuicaoEditoras[editora] || 0) + 1;
      }
    });

    const percentualLidos = totalTenho > 0 ? Math.round((totalLidos / totalTenho) * 100) : 0;

    return {
      totalTenho,
      totalQuero,
      totalLidos,
      percentualLidos,
      valorEstimadoTotal,
      distribuicaoEditoras,
    };
  }, [userComics, comics]);

  return (
    <CollectionContext.Provider
      value={{
        comics,
        userComics,
        activeModalComic,
        toasts,
        stats,
        getComicStatus,
        toggleStatus,
        setRating,
        openComicDetail,
        closeComicDetail,
        showToast,
        removeToast,
        clearCollection,
        reloadCatalog,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection deve ser utilizado dentro de um CollectionProvider");
  }
  return context;
}
