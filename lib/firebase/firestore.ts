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
  writeBatch,
} from "firebase/firestore";
import { Comic, UserComic } from "../types/comic";

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
