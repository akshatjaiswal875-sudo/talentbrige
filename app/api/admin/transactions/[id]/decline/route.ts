import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { getCurrentUser } from "@/lib/auth";
import { sendPaymentDeclinedEmail } from "@/lib/mail";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const reasonRaw = typeof body?.reason === "string" ? body.reason.trim() : "";

    const { id } = await params;
    const transaction = await Transaction.findById(id)
      .populate('userId')
      .populate('courseId');

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: "Can only decline pending transactions" }, { status: 400 });
    }

    // Update Transaction Status
    transaction.status = 'failed';
    transaction.declineReason = reasonRaw || undefined;
    await transaction.save();

    const userDoc = transaction.userId as any;
    const courseDoc = transaction.courseId as any;

    if (userDoc?.email && courseDoc?.title) {
      try {
        await sendPaymentDeclinedEmail(
          userDoc.email,
          userDoc.name || "",
          courseDoc.title,
          transaction.amount,
          transaction.paymentId,
          reasonRaw
        );
      } catch (emailError) {
        console.error("Failed to send decline email", emailError);
      }
    }

    return NextResponse.json({ success: true, status: 'failed', reason: reasonRaw || null });
  } catch (error) {
    console.error("Error declining transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
