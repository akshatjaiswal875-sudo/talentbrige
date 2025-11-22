import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { CourseProgress } from "@/dbConnection/Schema/courseProgress";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies?.get?.("token")?.value || null;
  if (!token) return null;
  try {
    const secret = process.env.SECRET_JWT || "dev-secret";
    const decoded = jwt.verify(token, secret) as unknown;
    if (typeof decoded !== "object" || decoded === null) return null;
    const maybeId = (decoded as Record<string, unknown>)["id"];
    if (!maybeId || typeof maybeId !== "string") return null;
    await connectDb();
    const user = await User.findById(maybeId).lean();
    return user || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: courseId } = await params;
  const typedUser = user as { _id: string };

  try {
    let progress = await CourseProgress.findOne({ user: typedUser._id, course: courseId });
    if (!progress) {
        return NextResponse.json({ completedLectures: [] });
    }
    return NextResponse.json({ 
        completedLectures: progress.completedLectures,
        lastPlayedLectureId: progress.lastPlayedLectureId
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: courseId } = await params;
  const typedUser = user as { _id: string };
  const body = await req.json();
  const { lectureId, completed } = body;

  if (!lectureId) return NextResponse.json({ error: "lectureId required" }, { status: 400 });

  try {
    let progress = await CourseProgress.findOne({ user: typedUser._id, course: courseId });
    
    if (!progress) {
        progress = new CourseProgress({
            user: typedUser._id,
            course: courseId,
            completedLectures: []
        });
    }

    if (completed) {
        if (!progress.completedLectures.includes(lectureId)) {
            progress.completedLectures.push(lectureId);
        }
    } else {
        progress.completedLectures = progress.completedLectures.filter((id: string) => id !== lectureId);
    }
    
    progress.lastPlayedLectureId = lectureId;
    progress.updatedAt = new Date();
    await progress.save();

    return NextResponse.json({ success: true, completedLectures: progress.completedLectures });
  } catch (err) {
    console.error("Error updating progress:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
