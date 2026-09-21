import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { calcFee } from "@/lib/fee";
import { serializeVehicle, jsonError } from "@/lib/serialize";

export async function POST(request, { params }) {
  try {
    await requireUser(request);
    const { id } = await params;

    let _id;
    try { _id = new ObjectId(id); } catch { return jsonError("Vehicle not found", 404); }

    const db = await getDb();
    const vehicles = db.collection("vehicles");

    const vehicle = await vehicles.findOne({ _id });
    if (!vehicle) return jsonError("Vehicle not found", 404);
    if (vehicle.status !== "parked") return jsonError("Vehicle has already exited", 400);

    const settings = await db.collection("settings").findOne({ _id: "config" });
    const exitTime = new Date();
    const { durationMin, fee } = calcFee(
      vehicle.entry_time, exitTime,
      settings.hourly_rate, settings.minimum_charge, settings.grace_minutes
    );

    await vehicles.updateOne(
      { _id },
      { $set: { exit_time: exitTime, duration_min: durationMin, fee, status: "exited" } }
    );
    const updated = await vehicles.findOne({ _id });
    return Response.json(serializeVehicle(updated));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
