import { getDb } from "@/lib/mongodb";
import { requireUser, requireAdmin, AuthError } from "@/lib/auth";
import { serializeSettings, jsonError } from "@/lib/serialize";

export async function GET(request) {
  try {
    await requireUser(request);
    const db = await getDb();
    const s = await db.collection("settings").findOne({ _id: "config" });
    return Response.json(serializeSettings(s));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}

export async function PUT(request) {
  try {
    const profile = await requireUser(request);
    requireAdmin(profile);

    const body = await request.json();
    const updates = {};
    for (const key of ["lot_name", "hourly_rate", "minimum_charge", "grace_minutes"]) {
      if (body[key] !== undefined && body[key] !== null) updates[key] = body[key];
    }

    const db = await getDb();
    await db.collection("settings").updateOne({ _id: "config" }, { $set: updates });
    const s = await db.collection("settings").findOne({ _id: "config" });
    return Response.json(serializeSettings(s));
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
