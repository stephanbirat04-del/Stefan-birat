/**
 * Server-side request authentication for API routes.
 *
 * Flow: client signs in with Firebase Auth -> sends the Firebase ID token
 * as "Authorization: Bearer <token>" -> this helper verifies the token with
 * Firebase Admin, then loads the matching document from the MongoDB
 * "staff_profiles" collection (keyed by the Firebase UID) to get the app
 * role (admin/staff). Firebase only proves *identity*; authorization
 * (what the account is allowed to do in ParkPay) lives entirely in Mongo.
 */
import { adminAuth } from "./firebaseAdmin";
import { getDb } from "./mongodb";

export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Verifies the request's bearer token and returns the caller's staff
 * profile document ({ firebase_uid, email, role, name, created_at }).
 * Throws AuthError(401) if the token is missing/invalid, or AuthError(403)
 * if the token is valid but there is no matching staff profile (i.e. the
 * Firebase account exists but hasn't been provisioned as ParkPay staff).
 */
export async function requireUser(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new AuthError("Missing bearer token", 401);

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(token);
  } catch {
    throw new AuthError("Invalid or expired token", 401);
  }

  const db = await getDb();
  const profile = await db.collection("staff_profiles").findOne({ firebase_uid: decoded.uid });
  if (!profile) {
    throw new AuthError("No staff profile provisioned for this account", 403);
  }
  return profile;
}

/** Throws AuthError(403) unless the caller's role is 'admin'. */
export function requireAdmin(profile) {
  if (profile.role !== "admin") {
    throw new AuthError("Admin role required", 403);
  }
}
