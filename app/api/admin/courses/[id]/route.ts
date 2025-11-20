import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
    
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
