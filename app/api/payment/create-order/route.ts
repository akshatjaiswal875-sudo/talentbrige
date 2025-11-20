import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';
import { getCurrentUser } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Create Razorpay Order
    // Amount must be in smallest currency unit (paise for INR)
    // Remove non-numeric chars from price string (e.g. "₹499" -> 499)
    const priceAmount = parseInt(course.price.replace(/[^0-9]/g, ''));
    
    if (isNaN(priceAmount)) {
        return NextResponse.json({ error: 'Invalid course price' }, { status: 400 });
    }

    const options = {
      amount: priceAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}_${user._id}`,
      notes: {
        courseId: courseId,
        userId: user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID 
    });

  } catch (err) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
