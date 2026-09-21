"use client";

import { useEffect, useState } from "react";
import { Plus, LogOut as ExitIcon, Clock, Printer } from "lucide-react";
import api from "@/lib/apiClient";
import { printReceipt } from "@/lib/receipt";

function timeSince(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const VEHICLE_TYPES = ["car", "bike", "truck", "other"];

export default function ActiveLotPage() {
  const [vehicles, setVehicles] = useState([]);
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("car");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [exitingId, setExitingId] = useState(null);
  const [lastExit, setLastExit] = useState(null);
  const [, forceTick] = useState(0);

  async function load() {
    try {
      setVehicles(await api.get("/vehicles/active"));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount, then poll
    load();
    const poll = setInterval(load, 10000);
    const tick = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => { clearInterval(poll); clearInterval(tick); };
  }, []);

  async function handleEntry(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/vehicles/entry", { plate_number: plate, owner_phone: phone, vehicle_type: type });
      setPlate(""); setPhone(""); setType("car");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExit(id) {
    setExitingId(id);
    try {
      const updated = await api.post(`/vehicles/${id}/exit`);
      const receipt = await api.get(`/vehicles/${id}/receipt`);
      setLastExit(updated);
      printReceipt(receipt);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setExitingId(null);
    }
  }

  async function reprint(id) {
    const receipt = await api.get(`/vehicles/${id}/receipt`);
    printReceipt(receipt);
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white mb-1">Active Lot</h1>
      <p className="text-sm text-[var(--color-text-dim)] mb-8">Log entries and process exits.</p>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sticky top-8">
            <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-4">New entry</h2>
            <form onSubmit={handleEntry} className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">License plate</label>
                <input
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="ML05AB1234"
                  required
                  className="plate w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-3 text-lg text-[var(--color-signal)] focus:outline-none focus:border-[var(--color-signal)] transition-colors placeholder:text-[var(--color-text-dim)] placeholder:opacity-40"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Owner phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  required
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Vehicle type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)] transition-colors"
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-signal)] text-black font-medium py-2.5 text-sm hover:brightness-95 transition-all disabled:opacity-50"
              >
                <Plus size={16} strokeWidth={2} />
                {submitting ? "Logging…" : "Log entry"}
              </button>
            </form>

            {lastExit && (
              <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-2">Last exit</p>
                <p className="plate text-[var(--color-signal)] text-lg">{lastExit.plate_number}</p>
                <p className="text-sm text-white mt-1">₹{lastExit.fee} · {lastExit.duration_min} min</p>
                <button
                  onClick={() => reprint(lastExit.id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 border border-[var(--color-border)] text-white text-sm py-2 hover:border-[var(--color-signal)] transition-colors"
                >
                  <Printer size={14} />
                  Reprint receipt
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
              Currently parked — {vehicles.length}
            </h2>
          </div>

          {vehicles.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-dim)]">
              No vehicles in the lot right now.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {vehicles.map((v) => (
                <div key={v.id} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-signal)] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className="plate text-lg text-white">{v.plate_number}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] border border-[var(--color-border)] px-1.5 py-0.5">
                      {v.vehicle_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-cyan)] mb-4">
                    <Clock size={12} />
                    {timeSince(v.entry_time)}
                  </div>
                  <button
                    onClick={() => handleExit(v.id)}
                    disabled={exitingId === v.id}
                    className="w-full flex items-center justify-center gap-2 border border-[var(--color-border)] text-white text-sm py-2 hover:bg-[var(--color-signal)] hover:text-black hover:border-[var(--color-signal)] transition-colors disabled:opacity-50"
                  >
                    <ExitIcon size={14} />
                    {exitingId === v.id ? "Processing…" : "Process exit"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
