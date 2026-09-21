/**
 * Firebase Admin SDK — server-side only (used inside API routes to verify
 * the ID token a client sent with each request).
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * from a Firebase service account — see .env.example.
 */
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initAdmin() {
  if (getApps().length) return getApps()[0];

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials — set FIREBASE_PROJECT_ID, " +
      "FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local (see .env.example)"
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function adminAuth() {
  initAdmin();
  return getAuth();
}
