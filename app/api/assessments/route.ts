import { connectDb } from "@/dbConnection/connect";
import { Assessment } from "@/dbConnection/Schema/assessment";
import { User } from "@/dbConnection/Schema/user";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

connectDb();

function getTokenFromRequest(req: NextRequest) {
  try {
    const token = req.cookies?.get?.("token")?.value || null;
    return token;
  } catch (e) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const secret = process.env.SECRET_JWT || "dev-secret";
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, secret) as { id?: string; role?: string };
    if (!decoded || typeof decoded !== "object" || !decoded.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { studentId: maybeStudentId, testType = "aptitude", answers, score, total } = body;
    if (typeof score !== "number" || typeof total !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If admin and studentId provided, allow posting for that student; otherwise use authenticated user
    let targetStudentId = decoded.id;
    if (decoded.role === "admin" && maybeStudentId) {
      targetStudentId = maybeStudentId;
    }

    const student = await User.findById(targetStudentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const assess = new Assessment({
      student: student._id,
      testType,
      answers: answers || [],
      score,
      total,
    });

    await assess.save();

    // Update user's best score for the test type if this attempt is better
    const key = testType === "gn" ? "gn" : "aptitude";
    const currentBest = (student as any).bestScores?.[key] ?? 0;
    if (score > currentBest) {
      (student as any).bestScores = { ...(student as any).bestScores, [key]: score };
      await student.save();
    }

    return NextResponse.json({ success: true, assessment: assess });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const secret = process.env.SECRET_JWT || "dev-secret";
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = jwt.verify(token, secret) as { id?: string; role?: string };
    if (!decoded || typeof decoded !== "object" || !decoded.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const minScore = searchParams.get("minScore");
    const testType = searchParams.get("testType");

    const filter: any = {};
    if (minScore) {
      filter.score = { $gte: Number(minScore) };
    }
    if (testType) {
      filter.testType = testType;
    }

    // If not admin, limit to the authenticated user's assessments
    if (decoded.role !== "admin") {
      filter.student = decoded.id;
    }

    const results = await Assessment.find(filter).populate("student", "name email").sort({ score: -1 }).lean();

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
