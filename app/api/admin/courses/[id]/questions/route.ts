import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Course } from '@/dbConnection/Schema/course';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { question, options, correctAnswer } = body;

    if (!question || !options || options.length < 2 || correctAnswer === undefined) {
      return NextResponse.json({ error: 'Invalid question data' }, { status: 400 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.questions) {
        course.questions = [];
    }

    course.questions.push({ question, options, correctAnswer });
    await course.save();

    return NextResponse.json({ message: 'Question added successfully', questions: course.questions });
  } catch (err: any) {
    console.error('Error adding question:', err);
    return NextResponse.json({ error: 'Failed to add question: ' + (err.message || String(err)) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const { id } = await params;
        const body = await req.json();
        const { questionId, question, options, correctAnswer } = body;

        if (!questionId || !question || !options || options.length < 2 || correctAnswer === undefined) {
            return NextResponse.json({ error: 'Invalid question data' }, { status: 400 });
        }

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.questions) {
            const qIndex = course.questions.findIndex((q: any) => q._id.toString() === questionId);
            if (qIndex !== -1) {
                course.questions[qIndex] = { ...course.questions[qIndex], question, options, correctAnswer };
                await course.save();
            } else {
                return NextResponse.json({ error: 'Question not found' }, { status: 404 });
            }
        }

        return NextResponse.json({ message: 'Question updated successfully', questions: course.questions });
    } catch (err: any) {
        console.error('Error updating question:', err);
        return NextResponse.json({ error: 'Failed to update question: ' + (err.message || String(err)) }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const { id } = await params;
        const url = new URL(req.url);
        const questionId = url.searchParams.get('questionId');

        if (!questionId) {
            return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
        }

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.questions) {
            course.questions = course.questions.filter((q: any) => q._id.toString() !== questionId);
            await course.save();
        }

        return NextResponse.json({ message: 'Question deleted successfully', questions: course.questions || [] });
    } catch (err: any) {
        console.error('Error deleting question:', err);
        return NextResponse.json({ error: 'Failed to delete question: ' + (err.message || String(err)) }, { status: 500 });
    }
}
