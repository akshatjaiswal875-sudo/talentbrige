import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { User } from "@/dbConnection/Schema/user";
import { Course } from "@/dbConnection/Schema/course";
import { getCurrentUser } from "@/lib/auth";
import { sendAccessGrantedEmail } from "@/lib/mail";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const transaction = await Transaction.findById(id).populate('userId').populate('courseId');

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (!transaction.userId || !transaction.courseId) {
      return NextResponse.json({ error: "Associated User or Course not found" }, { status: 404 });
    }

    if (transaction.status === 'success') {
      return NextResponse.json({ error: "Transaction already approved" }, { status: 400 });
    }

    // Update Transaction Status
    transaction.status = 'success';
    await transaction.save();

    // Enroll User in Course
    // We need to add the courseId to the user's enrolledCourses array
    const userObj = transaction.userId as any;
    const courseObj = transaction.courseId as any;

    if (!userObj._id || !courseObj._id) {
       return NextResponse.json({ error: "Invalid transaction data" }, { status: 500 });
    }

    await User.findByIdAndUpdate(userObj._id, {
      $addToSet: { enrolledCourses: courseObj._id }
    });

    // Send Email
    try {
        await sendAccessGrantedEmail(userObj.email, courseObj.title);
    } catch (e) {
        console.error("Failed to send email", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
