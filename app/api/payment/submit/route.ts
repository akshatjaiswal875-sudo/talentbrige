import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Transaction } from "@/dbConnection/Schema/transaction";
import { Course } from "@/dbConnection/Schema/course";
import { getCurrentUser } from "@/lib/auth";
import { sendAdminNotification } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, utr, amount } = await req.json();

    if (!courseId || !utr || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if a pending transaction already exists for this course/user to prevent duplicates
    const existingTransaction = await Transaction.findOne({
      userId: user._id,
      courseId: courseId,
      status: "pending"
    });

    if (existingTransaction) {
      return NextResponse.json({ error: "A payment request is already pending for this course." }, { status: 409 });
    }

    // Fetch course details for the email
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create Transaction
    const transaction = await Transaction.create({
      userId: user._id,
      courseId: courseId,
      amount: amount,
      paymentId: utr, // Storing UTR as paymentId
      status: "pending",
    });

    // Send Email Notification to Admin
    // We don't await this to keep the response fast, or we can await if we want to ensure email sending
    // For reliability, let's await it but catch errors so it doesn't fail the request
    try {
      await sendAdminNotification(user.email, user.name, course.title, utr, amount);
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Continue execution, as the transaction is saved
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment submitted successfully",
      transactionId: transaction._id,
      status: transaction.status 
    });

  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
