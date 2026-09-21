import { db, isFirebaseConfigured } from "./config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  updateDoc,
} from "firebase/firestore";
import { Comic, UserComic } from "../types/comic";

/**
 * Converte uma URL de imagem remota para Data URI em Base64 (data:image/webp;base64,...)
 * Funciona tanto no ambiente Node.js (servidor/scraper) quanto no navegador.
 */
export async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  if (!imageUrl || !imageUrl.startsWith("http")) return null;
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/webp";

    if (typeof Buffer !== "undefined") {
      const buffer = Buffer.from(arrayBuffer);
      return `data:${contentType};base64,${buffer.toString("base64")}`;
    } else {
      // Browser environment
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:${contentType};base64,${btoa(binary)}`;
    }
  } catch (error) {
    console.warn(`[ComixFlix/Firestore] Falha ao converter imagem para base64 (${imageUrl}):`, error);
    return null;
  }
}

/**
 * Grava ou atualiza uma edição de quadrinho diretamente no Cloud Firestore.
 * Se autoBase64 for true e o quadrinho ainda não tiver imagem_base64, baixa a imagem e converte antes de gravar.
 */
export async function saveComicToFirestore(comic: Comic, autoBase64 = true): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    let base64 = comic.imagem_base64;
    if (!base64 && autoBase64 && comic.url_capa) {
      base64 = (await fetchImageAsBase64(comic.url_capa)) || undefined;
    }

    const comicRef = doc(db, "comics", comic.id);
    const payload: Partial<Comic> & { sincronizado_em: string } = {
      ...comic,
      imagem_base64: base64 || null,
      sincronizado_em: new Date().toISOString(),
    };

    await setDoc(comicRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.error(`[ComixFlix/Firestore] Erro ao gravar quadrinho ${comic.id}:`, error);
    return false;
  }
}

/**
 * Atualiza cirurgicamente apenas o campo imagem_base64 de um quadrinho no Cloud Firestore.
 */
export async function updateComicBase64InFirestore(comicId: string, base64: string): Promise<boolean> {
  if (!db || !isFirebaseConfigured || !comicId || !base64) return false;
  try {
    const comicRef = doc(db, "comics", comicId);
    await updateDoc(comicRef, {
      imagem_base64: base64,
      atualizado_em: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error(`[ComixFlix/Firestore] Erro ao atualizar Base64 do quadrinho ${comicId}:`, error);
    return false;
  }
}

/**
 * Garante que o quadrinho possua a imagem Base64 no banco. Se não tiver, converte e atualiza assincronamente.
 */
export async function ensureComicBase64(comic: Comic): Promise<string | null> {
  if (comic.imagem_base64) return comic.imagem_base64;
  if (!comic.url_capa) return null;

  try {
    const base64 = await fetchImageAsBase64(comic.url_capa);
    if (base64) {
      comic.imagem_base64 = base64;
      // Atualiza no Firestore em background sem travar a renderização
      updateComicBase64InFirestore(comic.id, base64).catch(() => {});
      return base64;
    }
  } catch {
    // Silently continue with url fallback
  }
  return null;
}

/**
 * Salva ou sincroniza o estado da coleção pessoal do usuário no Cloud Firestore.
 * Coleção: user_collections -> documento: {userId}
 */
export async function saveUserCollectionToFirestore(
  userId: string,
  userComics: Record<string, UserComic>
): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;
  try {
    const userRef = doc(db, "user_collections", userId);
    await setDoc(
      userRef,
      {
        userComics,
        updatedAt: new Date().toISOString(),
        totalTitles: Object.keys(userComics).length,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("[ComixFlix/Firestore] Erro ao sincronizar coleção do usuário:", error);
    return false;
  }
}

/**
 * Recupera o estado da coleção pessoal do usuário gravada no Cloud Firestore.
 */
export async function getUserCollectionFromFirestore(
  userId: string
): Promise<Record<string, UserComic> | null> {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const userRef = doc(db, "user_collections", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.userComics as Record<string, UserComic>) || {};
    }
    return null;
  } catch (error) {
    console.error("[ComixFlix/Firestore] Erro ao buscar coleção do usuário:", error);
    return null;
  }
}

/**
 * Consulta edições de quadrinhos diretamente da coleção `comics` no Cloud Firestore.
 */
export async function getComicsFromFirestore(options?: {
  editora?: string;
  limitCount?: number;
}): Promise<Comic[]> {
  if (!db || !isFirebaseConfigured) return [];
  try {
    const comicsRef = collection(db, "comics");
    let q = query(comicsRef);

    if (options?.editora && options.editora !== "todas") {
      q = query(comicsRef, where("editora", "==", options.editora));
    }
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snap = await getDocs(q);
    const comics: Comic[] = [];
    snap.forEach((docSnap) => {
      comics.push(docSnap.data() as Comic);
    });
    return comics;
  } catch (error) {
    console.error("[ComixFlix/Firestore] Erro ao consultar quadrinhos do Firestore:", error);
    return [];
  }
}
