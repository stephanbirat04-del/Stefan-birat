import { auth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function verifyIdToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        valid: false,
        error: "Missing or invalid authorization header",
      };
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(idToken);

    return {
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      valid: false,
      error: "Invalid or expired token",
    };
  }
}

export function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
