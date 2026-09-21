/**
 * Firebase Client SDK — browser-side only (used for the login form to sign
 * the user in and obtain an ID token, which is then sent as a Bearer token
 * on every API request).
 *
 * Requires the NEXT_PUBLIC_FIREBASE_* values from your Firebase web app
 * config — see .env.example. These are safe to expose to the browser (that
 * is how Firebase web apps are meant to be configured); they are not secret
 * credentials on their own.
 *
 * Initialized lazily (on first use, not at module import time) so the app
 * can still be built/prerendered without real Firebase config present.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

let _auth;

export function getFirebaseAuth() {
  if (_auth) return _auth;
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  _auth = getAuth(app);
  return _auth;
}
