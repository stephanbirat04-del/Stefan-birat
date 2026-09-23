import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user in MongoDB
    const { db } = await connectToDatabase();
    await db.collection("users").insertOne({
      firebase_uid: user.uid,
      email,
      name,
      created_at: new Date(),
      role: "user",
    });

    return NextResponse.json(
      { message: "User created successfully", uid: user.uid },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
