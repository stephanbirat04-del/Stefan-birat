"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }) {
  const { firebaseUser, profile, loading, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) router.push("/login");
  }, [loading, firebaseUser, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-dim)] text-sm">Loading…</div>;
  }

  if (!firebaseUser) return null; // redirecting

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <p className="text-sm text-[var(--color-danger)] max-w-sm text-center">{authError}</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-dim)] text-sm">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
