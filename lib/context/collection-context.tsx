"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Comic, UserComic, CollectionStats } from "../types/comic";
import { CloudSyncStatus } from "../types/user";
import { INITIAL_COMICS } from "../data/comics-seed";
import {
  saveUserCollectionToFirestore,
  getUserCollectionFromFirestore,
  getComicsFromFirestore,
} from "../firebase/firestore";
import { isFirebaseConfigured } from "../firebase/config";
import { useAuth } from "./auth-context";

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
  syncStatus: CloudSyncStatus;
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
  forceCloudSync: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "comixflix_user_comics_guest";
const BASE_STORAGE_KEY = "comixflix_user_comics_";

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [comics, setComics] = useState<Comic[]>(INITIAL_COMICS);
  const [userComics, setUserComics] = useState<Record<string, UserComic>>({});
  const [activeModalComic, setActiveModalComic] = useState<Comic | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>(
    isFirebaseConfigured ? "synced" : "offline"
  );

  // Determina a chave de armazenamento de acordo com o usuário logado
  const currentStorageKey = useMemo(() => {
    return user ? `${BASE_STORAGE_KEY}${user.uid}` : GUEST_STORAGE_KEY;
  }, [user]);

  // Carrega catálogo atualizado
  const reloadCatalog = async () => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const candidateUrls = [
        `${basePath}/data/scraped-catalog.json`,
        "/antigravity.comixFlix/data/scraped-catalog.json",
        "/data/scraped-catalog.json",
      ];

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 50) {
              setComics(data);
              return;
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn("[ComixFlix] Catálogo estático inacessível, tentando Firestore:", e);
    }

    try {
      if (isFirebaseConfigured) {
        const remoteComics = await getComicsFromFirestore();
        if (remoteComics && remoteComics.length > 50) {
          setComics(remoteComics);
          return;
        }
      }
    } catch (e) {
      console.warn("[ComixFlix] Falha ao consultar Firestore no cliente:", e);
    }

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

  // Inicializa o catálogo
  useEffect(() => {
    reloadCatalog();
  }, []);

  // Monitora alterações de rede (online/offline)
  useEffect(() => {
    const handleOnline = () => {
      if (user) {
        setSyncStatus("synced");
      }
    };
    const handleOffline = () => {
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user]);

  // Sincronização inteligente de 2 vias quando o usuário loga ou desloga
  useEffect(() => {
    let isCancelled = false;

    const syncUserSession = async () => {
      setIsLoaded(false);

      if (!user) {
        // Usuário deslogado: carrega dados locais de visitante
        try {
          const guestData = localStorage.getItem(GUEST_STORAGE_KEY);
          setUserComics(guestData ? JSON.parse(guestData) : {});
        } catch {
          setUserComics({});
        }
        setSyncStatus(navigator.onLine ? "synced" : "offline");
        setIsLoaded(true);
        return;
      }

      // Usuário logado: Sincronização inteligente de 2 vias
      setSyncStatus("syncing");

      try {
        // 1. Resgata marcações locais feitas em modo visitante
        let localGuestComics: Record<string, UserComic> = {};
        try {
          const guestStr = localStorage.getItem(GUEST_STORAGE_KEY);
          if (guestStr) {
            localGuestComics = JSON.parse(guestStr);
          }
          // Compatibilidade com v2 anterior
          const oldV2 = localStorage.getItem("comixflix_user_comics_v2");
          if (oldV2 && Object.keys(localGuestComics).length === 0) {
            localGuestComics = JSON.parse(oldV2);
            localStorage.removeItem("comixflix_user_comics_v2");
          }
        } catch {}

        // 2. Busca a coleção na nuvem (Firestore) do usuário logado
        const remoteComics = (await getUserCollectionFromFirestore(user.uid)) || {};

        // 3. Mesclagem em 2 vias: Remoto prevalece, complementado pelas marcações locais
        const hasLocalGuest = Object.keys(localGuestComics).length > 0;
        const consolidated: Record<string, UserComic> = {
          ...remoteComics,
          ...localGuestComics,
        };

        if (!isCancelled) {
          setUserComics(consolidated);
          localStorage.setItem(currentStorageKey, JSON.stringify(consolidated));

          // Se havia dados locais de visitante, sincroniza para a nuvem
          if (hasLocalGuest && isFirebaseConfigured) {
            await saveUserCollectionToFirestore(user.uid, consolidated);
            localStorage.removeItem(GUEST_STORAGE_KEY);
            showToast("Suas marcações foram sincronizadas na sua conta na nuvem!", "success");
          }

          setSyncStatus("synced");
        }
      } catch (err) {
        console.warn("[ComixFlix] Erro na sincronização com Firebase:", err);
        setSyncStatus("offline");
      } finally {
        if (!isCancelled) {
          setIsLoaded(true);
        }
      }
    };

    syncUserSession();

    return () => {
      isCancelled = true;
    };
  }, [user, currentStorageKey]);

  // Salva no localStorage e sincroniza com o Firestore a cada alteração
  const persistChanges = async (updatedComics: Record<string, UserComic>) => {
    try {
      localStorage.setItem(currentStorageKey, JSON.stringify(updatedComics));

      if (user && isFirebaseConfigured) {
        if (!navigator.onLine) {
          setSyncStatus("offline");
          return;
        }

        setSyncStatus("syncing");
        const ok = await saveUserCollectionToFirestore(user.uid, updatedComics);
        if (ok) {
          setSyncStatus("synced");
        } else {
          setSyncStatus("offline");
        }
      }
    } catch (e) {
      console.error("Erro ao persistir coleção:", e);
      setSyncStatus("offline");
    }
  };

  // Força uma sincronização manual
  const forceCloudSync = async () => {
    if (!user || !isFirebaseConfigured) {
      showToast("Conecte-se com sua conta para sincronizar com a nuvem.", "info");
      return;
    }
    setSyncStatus("syncing");
    try {
      const ok = await saveUserCollectionToFirestore(user.uid, userComics);
      if (ok) {
        setSyncStatus("synced");
        showToast("Coleção sincronizada com a nuvem com sucesso!", "success");
      } else {
        setSyncStatus("offline");
        showToast("Falha na sincronização. Verifique sua conexão.", "info");
      }
    } catch {
      setSyncStatus("offline");
    }
  };

  // Limpa a coleção do usuário atual
  const clearCollection = async () => {
    setUserComics({});
    try {
      localStorage.setItem(currentStorageKey, JSON.stringify({}));
      if (user && isFirebaseConfigured) {
        setSyncStatus("syncing");
        await saveUserCollectionToFirestore(user.uid, {});
        setSyncStatus("synced");
      }
    } catch (e) {}
    showToast("Sua coleção foi reiniciada e está limpa.", "info");
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
        toastMsg = `"${comicTitle}" marcado como Lido!`;
        toastType = "read";
      }
    }

    const updated = { ...userComics };
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

    setUserComics(updated);
    persistChanges(updated);

    showToast(toastMsg, toastType, () => {
      setUserComics(previousState);
      persistChanges(previousState);
      showToast("Ação desfeita com sucesso.", "info");
    });
  };

  const setRating = (comicId: string, nota: number) => {
    const current = userComics[comicId];
    if (!current) return;

    const updated = {
      ...userComics,
      [comicId]: {
        ...current,
        nota_pessoal: nota,
        status: "li" as const,
        updated_at: new Date().toISOString(),
      },
    };

    setUserComics(updated);
    persistChanges(updated);
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
        syncStatus,
        getComicStatus,
        toggleStatus,
        setRating,
        openComicDetail,
        closeComicDetail,
        showToast,
        removeToast,
        clearCollection,
        reloadCatalog,
        forceCloudSync,
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
