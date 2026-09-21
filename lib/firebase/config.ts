import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const clean = (val?: string) => (val ? val.replace(/^["']|["']$/g, "").trim() : "");

const envAny = process.env as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY),
  authDomain: clean(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN ||
    envAny.FIREBASE_AUTHDOMAIN
  ),
  projectId: clean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    envAny.FIREBASE_projectId
  ),
  storageBucket: clean(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    envAny.FIREBASE_storageBucket
  ),
  messagingSenderId: clean(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    envAny.FIREBASE_messagingSenderId
  ),
  appId: clean(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    process.env.FIREBASE_APP_ID ||
    envAny.FIREBASE_appId
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
    if (typeof window !== "undefined") {
      auth = getAuth(app);
    }
  } catch (err) {
    console.warn("[ComixFlix] Firebase initialization bypassed, falling back to Local Mode:", err);
  }
}

export { app, db, auth };
