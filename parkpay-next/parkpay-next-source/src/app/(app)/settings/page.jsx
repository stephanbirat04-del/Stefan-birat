"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/settings").then(setSettings).catch((err) => setError(err.message));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      const updated = await api.put("/settings", {
        lot_name: settings.lot_name,
        hourly_rate: parseFloat(settings.hourly_rate),
        minimum_charge: parseFloat(settings.minimum_charge),
        grace_minutes: parseInt(settings.grace_minutes, 10),
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !settings) return <div className="p-8 text-[var(--color-danger)] text-sm">{error}</div>;
  if (!settings) return <div className="p-8 text-[var(--color-text-dim)] text-sm">Loading…</div>;

  const readOnly = profile?.role !== "admin";

  return (
    <div className="p-8 max-w-lg">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white mb-1">Settings</h1>
      <p className="text-sm text-[var(--color-text-dim)] mb-8">Configure pricing for this lot.</p>

      <form onSubmit={handleSave} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Lot name</label>
          <input
            value={settings.lot_name}
            onChange={(e) => setSettings({ ...settings, lot_name: e.target.value })}
            disabled={readOnly}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Hourly rate (₹)</label>
          <input
            type="number" step="0.01"
            value={settings.hourly_rate}
            onChange={(e) => setSettings({ ...settings, hourly_rate: e.target.value })}
            disabled={readOnly}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Minimum charge (₹)</label>
          <input
            type="number" step="0.01"
            value={settings.minimum_charge}
            onChange={(e) => setSettings({ ...settings, minimum_charge: e.target.value })}
            disabled={readOnly}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Grace period (minutes)</label>
          <input
            type="number"
            value={settings.grace_minutes}
            onChange={(e) => setSettings({ ...settings, grace_minutes: e.target.value })}
            disabled={readOnly}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] disabled:opacity-50"
          />
          <p className="text-xs text-[var(--color-text-dim)] mt-1.5">
            Minutes past the hour before the next full hour is charged.
          </p>
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        {readOnly && <p className="text-xs text-[var(--color-text-dim)]">Only admins can change pricing.</p>}

        {!readOnly && (
          <button
            type="submit"
            className="bg-[var(--color-signal)] text-black font-medium px-5 py-2.5 text-sm hover:brightness-95 transition-all"
          >
            {saved ? "Saved ✓" : "Save settings"}
          </button>
        )}
      </form>
    </div>
  );
}
