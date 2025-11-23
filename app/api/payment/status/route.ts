import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDb();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const transaction = await Transaction.findOne({ userId: user._id, courseId })
      .sort({ createdAt: -1 })
      .lean();

    if (!transaction) {
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({
      status: transaction.status,
      paymentId: transaction.paymentId,
      amount: transaction.amount,
      declineReason: transaction.declineReason || null,
      transactionId: transaction._id,
      updatedAt: transaction.updatedAt || transaction.createdAt,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
