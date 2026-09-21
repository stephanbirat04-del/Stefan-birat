import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { serializeVehicle, jsonError } from "@/lib/serialize";

export async function GET(request) {
  try {
    await requireUser(request);
    const db = await getDb();
    const rows = await db.collection("vehicles")
      .find({ status: "parked" })
      .sort({ entry_time: -1 })
      .toArray();
    return Response.json(rows.map(serializeVehicle));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
