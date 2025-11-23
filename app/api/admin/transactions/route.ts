import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDb();
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
