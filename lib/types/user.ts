/**
 * Tipagens do Usuário e Perfil do ComixFlix
 */

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  favoritePublisher: string;
  notifyReleases: boolean;
  notifyDiscounts: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CloudSyncStatus = "offline" | "syncing" | "synced";
