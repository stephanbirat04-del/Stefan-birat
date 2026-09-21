"use client";

import { useEffect, useState } from "react";
import { Search, Download, CheckCircle2, Printer } from "lucide-react";
import api from "@/lib/apiClient";
import { printReceipt } from "@/lib/receipt";

export default function HistoryPage() {
  const [vehicles, setVehicles] = useState([]);
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (plate) params.plate = plate;
      if (status) params.status = status;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      setVehicles(await api.get("/vehicles", params));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- fetch on mount only
  useEffect(() => { load(); }, []);

  async function handleExport() {
    const params = {};
    if (plate) params.plate = plate;
    if (status) params.status = status;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    const blob = await api.getBlob("/vehicles/export/csv", params);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parkpay_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async function markPaid(id) {
    await api.post(`/vehicles/${id}/mark-paid`);
    load();
  }

  async function reprint(id) {
    const receipt = await api.get(`/vehicles/${id}/receipt`);
    printReceipt(receipt);
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white mb-1">History</h1>
      <p className="text-sm text-[var(--color-text-dim)] mb-8">Search and export parking records.</p>

      <div className="flex items-end gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Plate</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Search plate…"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] pl-8 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)]">
            <option value="">All</option>
            <option value="parked">Parked</option>
            <option value="exited">Exited</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)]" />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] mb-1.5">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-signal)]" />
        </div>
        <button onClick={load} className="bg-[var(--color-signal)] text-black font-medium px-4 py-2.5 text-sm hover:brightness-95 transition-all">
          Filter
        </button>
        <button onClick={handleExport} className="flex items-center gap-2 border border-[var(--color-border)] text-white px-4 py-2.5 text-sm hover:border-[var(--color-signal)] transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
              <th className="px-4 py-3 font-normal">Plate</th>
              <th className="px-4 py-3 font-normal">Type</th>
              <th className="px-4 py-3 font-normal">Entry</th>
              <th className="px-4 py-3 font-normal">Exit</th>
              <th className="px-4 py-3 font-normal">Duration</th>
              <th className="px-4 py-3 font-normal">Fee</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Payment</th>
              <th className="px-4 py-3 font-normal">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-[var(--color-text-dim)]">Loading…</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-[var(--color-text-dim)]">No records found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]">
                  <td className="px-4 py-3 plate text-white">{v.plate_number}</td>
                  <td className="px-4 py-3 text-[var(--color-text-dim)] capitalize">{v.vehicle_type}</td>
                  <td className="px-4 py-3 text-[var(--color-text-dim)] font-[family-name:var(--font-mono)] text-xs">{v.entry_time.slice(0, 16).replace("T", " ")}</td>
                  <td className="px-4 py-3 text-[var(--color-text-dim)] font-[family-name:var(--font-mono)] text-xs">{v.exit_time ? v.exit_time.slice(0, 16).replace("T", " ") : "—"}</td>
                  <td className="px-4 py-3 text-[var(--color-text-dim)]">{v.duration_min != null ? `${v.duration_min}m` : "—"}</td>
                  <td className="px-4 py-3 text-white font-[family-name:var(--font-mono)]">{v.fee != null ? `₹${v.fee}` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 border ${v.status === "parked" ? "border-[var(--color-cyan)] text-[var(--color-cyan)]" : "border-[var(--color-border)] text-[var(--color-text-dim)]"}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {v.payment_status === "paid" ? (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                        <CheckCircle2 size={13} /> Paid
                      </span>
                    ) : v.status === "exited" ? (
                      <button onClick={() => markPaid(v.id)} className="text-xs text-[var(--color-signal)] hover:underline">
                        Mark paid
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-text-dim)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {v.status === "exited" ? (
                      <button onClick={() => reprint(v.id)} className="flex items-center gap-1 text-xs text-[var(--color-text-dim)] hover:text-white transition-colors">
                        <Printer size={12} /> Print
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-text-dim)]">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
