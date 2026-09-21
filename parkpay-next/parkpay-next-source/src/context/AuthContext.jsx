"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // staff_profiles doc: { email, role, name }
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            setProfile(await res.json());
            setAuthError("");
          } else if (res.status === 403) {
            setAuthError("This account has no ParkPay staff profile provisioned yet.");
            setProfile(null);
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email, password) {
    setAuthError("");
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }

  async function logout() {
    await signOut(getFirebaseAuth());
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
