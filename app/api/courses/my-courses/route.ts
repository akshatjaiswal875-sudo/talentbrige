import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDb();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If admin, return all courses? Or just enrolled? Let's stick to enrolled for "My Courses"
    // But wait, admin might want to see everything. For now, let's just show enrolled.
    // Actually, the user schema has enrolledCourses as IDs.
    
    const enrolledIds = user.enrolledCourses || [];
    
    const courses = await Course.find({
      _id: { $in: enrolledIds }
    });

    return NextResponse.json({ courses });
  } catch (err) {
    console.error('Error fetching my courses:', err);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
