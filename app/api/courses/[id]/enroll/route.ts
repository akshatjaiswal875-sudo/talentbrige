import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';
import { Transaction } from '@/dbConnection/Schema/transaction';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const course = await Course.findById(id);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if already enrolled
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }
    
    if (user.enrolledCourses.includes(id)) {
      return NextResponse.json({ message: 'Already enrolled' });
    }

    // Simulate payment verification or just record it
    // In a real app, we would verify the paymentId with the gateway here
    const body = await req.json().catch(() => ({}));
    const paymentId = body.paymentId || `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create Transaction Record
    await Transaction.create({
      userId: user._id,
      courseId: course._id,
      amount: course.price,
      paymentId: paymentId,
      status: 'success'
    });

    // Add to enrolled courses
    user.enrolledCourses.push(id);
    await user.save();

    return NextResponse.json({ message: 'Enrolled successfully', paymentId });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
