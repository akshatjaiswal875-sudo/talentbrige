import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

export async function GET() {
  try {
    await connectDb();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
