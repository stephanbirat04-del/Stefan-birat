import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, amount, vehicleId, duration, licensePlate } = await req.json();

    // Validate input
    if (!userId || !amount || !licensePlate) {
      return NextResponse.json(
        { error: "Missing required fields: userId, amount, licensePlate" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Create payment record
    const payment = {
      userId,
      amount,
      vehicleId,
      licensePlate,
      duration,
      status: "pending",
      orderId: `ORD-${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await db.collection("payments").insertOne(payment);

    return NextResponse.json(
      {
        message: "Payment initiated",
        orderId: payment.orderId,
        amount: payment.amount,
        paymentId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
