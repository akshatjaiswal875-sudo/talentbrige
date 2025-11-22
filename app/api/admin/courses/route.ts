import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();
    
    // Basic validation
    if (!body.title || !body.category) {
      return NextResponse.json({ error: 'Title and Category are required' }, { status: 400 });
    }

    // Parse syllabus if it's a string (from textarea)
    let syllabus = body.syllabus;
    if (typeof syllabus === 'string') {
      syllabus = syllabus.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    const course = await Course.create({
      ...body,
      syllabus
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('Error creating course:', err);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectDb();
      // Sort by _id for better performance (uses default index)
      const courses = await Course.find().sort({ _id: -1 });
      return NextResponse.json({ courses });
    } catch (err) {
      console.error('Error fetching courses:', err);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
  }
