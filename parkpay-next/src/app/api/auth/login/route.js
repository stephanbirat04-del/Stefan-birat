import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user from MongoDB
    const { db } = await connectToDatabase();
    const userProfile = await db.collection("users").findOne({ firebase_uid: user.uid });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get ID token
    const idToken = await user.getIdToken();

    return NextResponse.json(
      { 
        message: "Login successful", 
        uid: user.uid,
        email: user.email,
        name: userProfile.name,
        idToken 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
