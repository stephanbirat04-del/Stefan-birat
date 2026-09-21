"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@parkpay.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, firebaseUser, profile, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (firebaseUser && profile) router.push("/dashboard");
  }, [firebaseUser, profile, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(mapFirebaseError(err.code) || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-signal)]" />
          <span className="font-[family-name:var(--font-display)] font-semibold text-2xl text-white tracking-tight">
            ParkPay
          </span>
        </div>

        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h1 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-6">Staff sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] transition-colors"
              />
            </div>

            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            {authError && <p className="text-sm text-[var(--color-danger)]">{authError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-signal)] text-black font-medium py-2.5 text-sm hover:brightness-95 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-xs text-[var(--color-text-dim)] mt-4 text-center">
          Default admin: admin@parkpay.com / Admin@123 (after running the seed script)
        </p>
      </div>
    </div>
  );
}

function mapFirebaseError(code) {
  const map = {
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-not-found": "Invalid email or password.",
    "auth/wrong-password": "Invalid email or password.",
    "auth/too-many-requests": "Too many attempts — try again shortly.",
    "auth/invalid-email": "Enter a valid email address.",
  };
  return map[code];
}
