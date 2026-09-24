"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth, getFirebaseAuth, isFirebaseConfigured } from "../firebase/config";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  resetPassword,
  getOrCreateUserProfile,
  saveUserProfileToFirestore,
  createResilientUser,
} from "../firebase/auth";
import { UserProfile } from "../types/user";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuestMode: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  loginGoogle: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPwd: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "comixflix_guest_mode";
const AUTH_STORAGE_KEY = "comixflix_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // Recupera estado de visitante ou sessão resiliente salva localmente
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const guest = sessionStorage.getItem(GUEST_STORAGE_KEY);
        if (guest === "true") {
          setIsGuestMode(true);
        }

        const savedUserJson = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserJson) {
          const parsed = JSON.parse(savedUserJson);
          if (parsed?.uid && parsed?.email) {
            const restoredUser = createResilientUser(parsed);
            setUser(restoredUser);
            setIsGuestMode(false);
            getOrCreateUserProfile(restoredUser)
              .then((prof) => setProfile(prof))
              .catch(() => {});
          }
        }
      }
    } catch {}
  }, []);

  // Escuta alterações de estado de autenticação no Firebase
  useEffect(() => {
    const activeAuth = auth || getFirebaseAuth();
    if (!activeAuth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(activeAuth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuestMode(false);
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(GUEST_STORAGE_KEY);
            localStorage.setItem(
              AUTH_STORAGE_KEY,
              JSON.stringify({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              })
            );
          }
          const prof = await getOrCreateUserProfile(currentUser);
          setProfile(prof);
        } catch (e) {
          console.warn("[ComixFlix/AuthContext] Erro ao carregar perfil:", e);
        }
      } else {
        // Se o Firebase Auth deslogou ou não está ativo, apenas limpa se não houver sessão resiliente
        if (typeof window !== "undefined" && !localStorage.getItem(AUTH_STORAGE_KEY)) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const persistSession = (u: FirebaseUser) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
          })
        );
      }
    } catch {}
  };

  const loginGoogle = async () => {
    const res = await loginWithGoogle();
    setUser(res.user);
    setProfile(res.profile);
    setIsGuestMode(false);
    persistSession(res.user);
    closeAuthModal();
  };

  const loginEmail = async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    setUser(res.user);
    setProfile(res.profile);
    setIsGuestMode(false);
    persistSession(res.user);
    closeAuthModal();
  };

  const registerEmail = async (email: string, pass: string, name: string) => {
    const res = await registerWithEmail(email, pass, name);
    setUser(res.user);
    setProfile(res.profile);
    setIsGuestMode(false);
    persistSession(res.user);
    closeAuthModal();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setIsGuestMode(false);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  };

  const resetPwd = async (email: string) => {
    await resetPassword(email);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const ok = await saveUserProfileToFirestore(user.uid, updates);
    if (ok) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return ok;
  };

  const enterGuestMode = () => {
    setIsGuestMode(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(GUEST_STORAGE_KEY, "true");
      }
    } catch {}
  };

  const exitGuestMode = () => {
    setIsGuestMode(false);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
      }
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuestMode,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        loginGoogle,
        loginEmail,
        registerEmail,
        logout,
        resetPwd,
        updateProfile,
        enterGuestMode,
        exitGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
