"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CircleParking, IndianRupee, LogOut as ExitIcon, CalendarDays } from "lucide-react";
import api from "@/lib/apiClient";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">{label}</span>
        <Icon size={16} className={accent ? "text-[var(--color-signal)]" : "text-[var(--color-text-dim)]"} strokeWidth={1.75} />
      </div>
      <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2 text-xs">
      <p className="text-[var(--color-text-dim)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-[family-name:var(--font-mono)]">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setStats(await api.get("/dashboard/stats"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    // Fetch on mount, then poll — intentional; `load` is stable across
    // renders and doesn't depend on component state, so this doesn't
    // cascade re-renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="p-8 text-[var(--color-danger)] text-sm">{error}</div>;
  if (!stats) return <div className="p-8 text-[var(--color-text-dim)] text-sm">Loading dashboard…</div>;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-[var(--color-text-dim)] mb-8">Live view of lot occupancy and revenue.</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={CircleParking} label="Currently parked" value={stats.currently_parked} accent />
        <StatCard icon={IndianRupee} label="Today's revenue" value={`₹${stats.today_revenue}`} />
        <StatCard icon={ExitIcon} label="Today's exits" value={stats.today_exits} />
        <StatCard icon={CalendarDays} label="Month revenue" value={`₹${stats.month_revenue}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-4">7-day revenue (₹)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.revenue_trend_7d}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="var(--color-text-dim)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-dim)" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-signal)" strokeWidth={2} dot={{ fill: "var(--color-signal)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-4">Exits by hour (today)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.exits_by_hour}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="hour" stroke="var(--color-text-dim)" fontSize={11} tickLine={false} axisLine={false} interval={2} />
              <YAxis stroke="var(--color-text-dim)" fontSize={11} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="exits" fill="var(--color-cyan)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
