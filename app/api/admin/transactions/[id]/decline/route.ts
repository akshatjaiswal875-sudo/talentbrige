import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: "Can only decline pending transactions" }, { status: 400 });
    }

    // Update Transaction Status
    transaction.status = 'failed';
    await transaction.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error declining transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
