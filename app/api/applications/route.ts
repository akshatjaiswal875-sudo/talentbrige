import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Application } from "@/dbConnection/Schema/application";
// ensure Internship model is registered for populate
import "@/dbConnection/Schema/internship";
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

export async function POST(request: NextRequest) {
  await connectDb();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { internshipId, resumeLink, message, name, email } = body;
  if (!internshipId) return NextResponse.json({ error: "internshipId is required" }, { status: 400 });

  try {
    const typedUser = user as { _id?: string; name?: string; email?: string };
    const application = await Application.create({
      internship: internshipId,
      applicant: typedUser._id,
      name: name || typedUser.name || "",
      email: email || typedUser.email || "",
      resumeLink: resumeLink || "",
      message: message || "",
    });
    return NextResponse.json({ success: true, application });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to create" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await connectDb();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Admins can fetch all applications, users only their own
    // const role = (user as { role?: string } | null)?.role;
    // if (role === "admin") {
    //   const apps = await Application.find().populate("internship").populate("applicant").lean();
    //   return NextResponse.json({ applications: apps });
    // }

  const typedUser = user as { _id?: string };
  const apps = await Application.find({ applicant: typedUser._id }).populate("internship").lean();
    return NextResponse.json({ applications: apps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to fetch" }, { status: 500 });
  }
}
