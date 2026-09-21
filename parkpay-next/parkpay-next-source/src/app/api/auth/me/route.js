import { requireUser, AuthError } from "@/lib/auth";

export async function GET(request) {
  try {
    const profile = await requireUser(request);
    return Response.json({
      firebase_uid: profile.firebase_uid,
      email: profile.email,
      role: profile.role,
      name: profile.name || "",
    });
  } catch (e) {
    if (e instanceof AuthError) return Response.json({ detail: e.message }, { status: e.status });
    throw e;
  }
}
