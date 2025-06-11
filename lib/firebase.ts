// lib/firebase.tsx

import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
