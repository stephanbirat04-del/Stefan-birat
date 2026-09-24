import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Build filter
    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    // Get payment history
    const payments = await db
      .collection("payments")
      .find(filter)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection("payments").countDocuments(filter);

    return NextResponse.json(
      {
        message: "Payment history retrieved",
        total,
        count: payments.length,
        payments: payments.map((p) => ({
          paymentId: p._id,
          orderId: p.orderId,
          amount: p.amount,
          licensePlate: p.licensePlate,
          status: p.status,
          transactionId: p.transactionId || null,
          created_at: p.created_at,
          updated_at: p.updated_at,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment history error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
