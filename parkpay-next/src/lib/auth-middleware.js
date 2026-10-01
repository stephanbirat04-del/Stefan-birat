/**
 * Auth middleware — verify Firebase ID tokens from client requests.
 *
 * Extracts the ID token from the Authorization header (Bearer token),
 * verifies it with Firebase Admin, and returns the decoded UID or an error response.
 */
import { adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function verifyIdToken(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    return { valid: true, uid: decodedToken.uid, token: decodedToken };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, error: error.message };
  }
}

export function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized — invalid or missing token" },
    { status: 401 }
  );
}

