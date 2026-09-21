import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { buildFilter } from "@/lib/vehicleFilter";
import { serializeVehicle, jsonError } from "@/lib/serialize";

export async function GET(request) {
  try {
    await requireUser(request);
    const { searchParams } = new URL(request.url);
    const filter = buildFilter(searchParams);

    const db = await getDb();
    const rows = await db.collection("vehicles").find(filter).sort({ entry_time: -1 }).toArray();
    return Response.json(rows.map(serializeVehicle));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
