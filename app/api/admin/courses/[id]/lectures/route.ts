import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const { id } = params;
    const body = await req.json();

    if (!body.title || !body.videoUrl) {
      return NextResponse.json({ error: 'Title and Video URL are required' }, { status: 400 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    course.lectures.push(body);
    await course.save();

    return NextResponse.json({ message: 'Lecture added successfully', course });
  } catch (err) {
    console.error('Error adding lecture:', err);
    return NextResponse.json({ error: 'Failed to add lecture' }, { status: 500 });
  }
}
