import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const { id } = params;
    const course = await Course.findById(id).lean();
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const user = await getCurrentUser();
    const enrolledCourses = user?.enrolledCourses || [];
    const isEnrolled = user && (user.role === 'admin' || enrolledCourses.map((id: any) => id.toString()).includes(id));
    
    // If not enrolled, strip videoUrls and notesUrls from non-preview lectures
    if (!isEnrolled) {
      course.lectures = course.lectures.map((lecture: any) => {
        if (lecture.isPreview) return lecture;
        const { videoUrl, notesUrl, ...rest } = lecture;
        return rest;
      });
    }

    return NextResponse.json({ course, hasAccess: !!isEnrolled });
  } catch (err) {
    console.error('Error fetching course:', err);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
