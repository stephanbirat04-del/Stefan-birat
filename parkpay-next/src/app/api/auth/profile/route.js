import { connectToDatabase } from "@/lib/mongodb";
import { verifyIdToken, unauthorized } from "@/lib/auth-middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Verify token
  const verification = await verifyIdToken(req);
  if (!verification.valid) {
    return unauthorized();
  }

  try {
    const { db } = await connectToDatabase();
    
    // Get user profile from MongoDB
    const userProfile = await db.collection("users").findOne({
      firebase_uid: verification.uid,
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        uid: userProfile.firebase_uid,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        created_at: userProfile.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
