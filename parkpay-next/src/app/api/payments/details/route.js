import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId query parameter is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get payment details
    const payment = await db.collection("payments").findOne({ orderId });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Payment details retrieved",
        payment: {
          paymentId: payment._id,
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          licensePlate: payment.licensePlate,
          vehicleId: payment.vehicleId,
          duration: payment.duration,
          status: payment.status,
          transactionId: payment.transactionId || null,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment details error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
