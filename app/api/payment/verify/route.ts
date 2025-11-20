import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDb } from '@/dbConnection/connect';
import { Transaction } from '@/dbConnection/Schema/transaction';
import { User } from '@/dbConnection/Schema/user';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDb();
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        courseId 
    } = await req.json();

    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful

      // 1. Record Transaction
      await Transaction.create({
        userId: user._id,
        courseId: courseId,
        amount: "PAID", // You might want to pass the actual amount
        paymentId: razorpay_payment_id,
        status: 'success'
      });

      // 2. Enroll User
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { enrolledCourses: courseId }
      });

      return NextResponse.json({ 
        message: "Payment verified successfully",
        success: true 
      });
    } else {
      return NextResponse.json({ 
        message: "Invalid signature",
        success: false 
      }, { status: 400 });
    }

  } catch (err) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
