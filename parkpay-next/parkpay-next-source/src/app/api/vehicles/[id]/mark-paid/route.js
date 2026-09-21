import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
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

    await vehicles.updateOne({ _id }, { $set: { payment_status: "paid" } });
    const updated = await vehicles.findOne({ _id });
    return Response.json(serializeVehicle(updated));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
