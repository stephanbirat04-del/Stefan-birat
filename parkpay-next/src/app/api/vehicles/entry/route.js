import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { normalizePlate } from "@/lib/fee";
import { serializeVehicle, jsonError } from "@/lib/serialize";

export async function POST(request) {
  try {
    const profile = await requireUser(request);
    const body = await request.json();

    if (!body.plate_number || body.plate_number.trim().length < 2) {
      return jsonError("plate_number is required", 422);
    }
    if (!body.owner_phone || body.owner_phone.trim().length < 6) {
      return jsonError("owner_phone is required", 422);
    }

    const plate = normalizePlate(body.plate_number);
    const db = await getDb();
    const vehicles = db.collection("vehicles");

    const existing = await vehicles.findOne({ plate_number: plate, status: "parked" });
    if (existing) {
      return jsonError(`Vehicle ${plate} is already parked (not yet exited)`, 400);
    }

    const doc = {
      plate_number: plate,
      owner_phone: body.owner_phone.trim(),
      vehicle_type: body.vehicle_type || "car",
      entry_time: new Date(),
      exit_time: null,
      duration_min: null,
      fee: null,
      status: "parked",
      payment_status: "unpaid",
      logged_by: profile.email,
      created_at: new Date(),
    };
    const result = await vehicles.insertOne(doc);
    doc._id = result.insertedId;
    return Response.json(serializeVehicle(doc));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
