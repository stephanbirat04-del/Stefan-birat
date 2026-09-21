import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { jsonError } from "@/lib/serialize";

export async function GET(request, { params }) {
  try {
    await requireUser(request);
    const { id } = await params;

    let _id;
    try { _id = new ObjectId(id); } catch { return jsonError("Vehicle not found", 404); }

    const db = await getDb();
    const vehicle = await db.collection("vehicles").findOne({ _id });
    if (!vehicle) return jsonError("Vehicle not found", 404);
    if (vehicle.status !== "exited") return jsonError("Vehicle has not exited yet — nothing to print", 400);

    const settings = await db.collection("settings").findOne({ _id: "config" });
    const hours = Math.floor((vehicle.duration_min || 0) / 60);
    const mins = (vehicle.duration_min || 0) % 60;

    return Response.json({
      receipt_no: id.slice(-8).toUpperCase(),
      lot_name: settings.lot_name,
      plate_number: vehicle.plate_number,
      owner_phone: vehicle.owner_phone,
      vehicle_type: vehicle.vehicle_type,
      entry_time: vehicle.entry_time.toISOString(),
      exit_time: vehicle.exit_time.toISOString(),
      duration_min: vehicle.duration_min,
      duration_display: `${hours}h ${mins}m`,
      hourly_rate: settings.hourly_rate,
      fee: vehicle.fee,
      payment_status: vehicle.payment_status,
      printed_at: new Date().toISOString(),
    });
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
