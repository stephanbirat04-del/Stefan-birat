import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { paymentId, transactionId, status } = await req.json();

    // Validate input
    if (!paymentId || !transactionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, transactionId, status" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["completed", "failed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: completed, failed, or cancelled" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Update payment status
    const result = await db.collection("payments").updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status,
          transactionId,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        paymentId,
        status,
        transactionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
