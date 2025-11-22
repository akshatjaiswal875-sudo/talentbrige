import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

// Add a new lecture to a course
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
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

// Update an existing lecture within a course
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { lectureId, title, videoUrl, duration, notesUrl, isPreview } = body || {};

    if (!lectureId) {
      return NextResponse.json({ error: 'lectureId is required' }, { status: 400 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lecturesArr: any[] = (course.lectures as any[]) || [];
    const idx = lecturesArr.findIndex((lec) => String(lec._id) === String(lectureId));
    if (idx === -1) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
    }

    const lecture: any = lecturesArr[idx];
    if (typeof title === 'string') lecture.title = title;
    if (typeof videoUrl === 'string') lecture.videoUrl = videoUrl;
    if (typeof duration === 'string') lecture.duration = duration;
    if (typeof notesUrl === 'string') lecture.notesUrl = notesUrl;
    if (typeof isPreview === 'boolean') lecture.isPreview = isPreview;

    await course.save();

    return NextResponse.json({ message: 'Lecture updated successfully', course });
  } catch (err) {
    console.error('Error updating lecture:', err);
    return NextResponse.json({ error: 'Failed to update lecture' }, { status: 500 });
  }
}
