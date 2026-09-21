import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { buildFilter } from "@/lib/vehicleFilter";
import { jsonError } from "@/lib/serialize";

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request) {
  try {
    await requireUser(request);
    const { searchParams } = new URL(request.url);
    const filter = buildFilter(searchParams);

    const db = await getDb();
    const rows = await db.collection("vehicles").find(filter).sort({ entry_time: -1 }).toArray();

    const header = ["Plate", "Owner Phone", "Type", "Entry Time", "Exit Time", "Duration (min)", "Fee (Rs)", "Status", "Payment Status"];
    const lines = [header.join(",")];
    for (const v of rows) {
      lines.push([
        v.plate_number, v.owner_phone, v.vehicle_type,
        v.entry_time ? v.entry_time.toISOString() : "",
        v.exit_time ? v.exit_time.toISOString() : "",
        v.duration_min ?? "", v.fee ?? "", v.status, v.payment_status,
      ].map(csvEscape).join(","));
    }

    const filename = `parkpay_export_${new Date().toISOString().slice(0, 10)}.csv`;
    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
