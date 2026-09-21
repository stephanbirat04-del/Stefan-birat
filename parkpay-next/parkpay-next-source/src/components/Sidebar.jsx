"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, CarFront, History, Settings as SettingsIcon, LogOut, Radio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/active", label: "Active Lot", icon: CarFront },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="w-60 shrink-0 border-r border-[var(--color-border)] flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-[var(--color-border)]">
        <div className="w-2 h-2 rounded-full bg-[var(--color-signal)]" />
        <span className="font-[family-name:var(--font-display)] font-semibold tracking-tight text-lg text-white">
          ParkPay
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[var(--color-surface-2)] text-[var(--color-signal)] border-l-2 border-[var(--color-signal)] -ml-[2px] pl-[14px]"
                  : "text-[var(--color-text-dim)] hover:text-white hover:bg-[var(--color-surface)]"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-3">
        <div className="flex items-center gap-2 px-3 text-xs text-[var(--color-text-dim)]">
          <Radio size={13} className="text-[var(--color-success)]" />
          Live
        </div>
        <div className="px-3">
          <p className="text-sm text-white truncate">{profile?.name || profile?.email}</p>
          <p className="text-xs text-[var(--color-text-dim)] uppercase tracking-wide">{profile?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
