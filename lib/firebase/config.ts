import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

const clean = (val?: string) => (val ? val.replace(/^["']|["']$/g, "").trim() : "");

// Leitura estática de variáveis públicas com proteção contra 'process is not defined' no browser
const envPublicApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const envPublicAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const envPublicProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const envPublicStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const envPublicMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const envPublicAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Fallbacks seguros para ambiente Node.js / SSR sem quebrar no browser
const getNodeEnv = (key: string): string => {
  if (typeof process !== "undefined" && process?.env) {
    return (process.env as Record<string, string | undefined>)[key] || "";
  }
  return "";
};

const firebaseConfig = {
  apiKey: clean(
    envPublicApiKey ||
    getNodeEnv("FIREBASE_API_KEY") ||
    "AIzaSyDzbfMV8XjOtvSQOMzMlh-wuR4rMSPFmRM"
  ),
  authDomain: clean(
    envPublicAuthDomain ||
    getNodeEnv("FIREBASE_AUTH_DOMAIN") ||
    getNodeEnv("FIREBASE_AUTHDOMAIN") ||
    "antigravitycomixflix.firebaseapp.com"
  ),
  projectId: clean(
    envPublicProjectId ||
    getNodeEnv("FIREBASE_PROJECT_ID") ||
    getNodeEnv("FIREBASE_projectId") ||
    "antigravitycomixflix"
  ),
  storageBucket: clean(
    envPublicStorageBucket ||
    getNodeEnv("FIREBASE_STORAGE_BUCKET") ||
    getNodeEnv("FIREBASE_storageBucket") ||
    "antigravitycomixflix.firebasestorage.app"
  ),
  messagingSenderId: clean(
    envPublicMessagingSenderId ||
    getNodeEnv("FIREBASE_MESSAGING_SENDER_ID") ||
    getNodeEnv("FIREBASE_messagingSenderId") ||
    "1020138109304"
  ),
  appId: clean(
    envPublicAppId ||
    getNodeEnv("FIREBASE_APP_ID") ||
    getNodeEnv("FIREBASE_appId") ||
    "1:1020138109304:web:27a55d7c8a0e0a5deeb08d"
  ),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your_api_key" &&
  firebaseConfig.projectId !== "your_project_id"
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    try {
      auth = getAuth(app);
    } catch {}
  } catch (err) {
    console.warn("[ComixFlix] Firebase initialization bypassed, falling back to Local Mode:", err);
  }
}

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  if (app) {
    try {
      auth = getAuth(app);
      return auth;
    } catch {}
  }
  return null;
}

export { app, db, auth };
