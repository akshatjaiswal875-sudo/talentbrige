import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Application } from "@/dbConnection/Schema/application";
import { Internship } from "@/dbConnection/Schema/internship";
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

export async function GET(request: NextRequest) {
  await connectDb();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const role = (user as { role?: string } | null)?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Check query params for ordering
  const url = new URL(request.url);
  const order = url.searchParams.get("order") || null; // 'asc' | 'desc'
  const reverse = url.searchParams.get("reverse") === "true";

  // Fetch raw applications and then attach internship/applicant info
  // Support sorting by createdAt desc when requested (reverse=true or order=desc)
  const shouldReverse = reverse || order === "desc";
  let appsRaw: Array<Record<string, unknown>>;
  if (shouldReverse) {
    // use array-style sort to satisfy mongoose typings without casts
    appsRaw = await Application.find().sort([["createdAt", -1]]).lean();
  } else {
    appsRaw = await Application.find().lean();
  }

    // Collect internship and applicant ids
    const internshipIds = Array.from(
      new Set(appsRaw.map((a: Record<string, unknown>) => (a?.internship ? String(a.internship) : null)).filter(Boolean))
    );
    const applicantIds = Array.from(
      new Set(appsRaw.map((a: Record<string, unknown>) => (a?.applicant ? String(a.applicant) : null)).filter(Boolean))
    );

    const [internships, users] = await Promise.all([
      internshipIds.length ? Internship.find({ _id: { $in: internshipIds } }).lean() : [],
      applicantIds.length ? User.find({ _id: { $in: applicantIds } }).lean() : [],
    ]);

    const internshipsMap = new Map(internships.map((i: Record<string, unknown>) => [String(i._id), i]));
    const usersMap = new Map(users.map((u: Record<string, unknown>) => [String(u._id), u]));

    const apps = appsRaw.map((a: Record<string, unknown>) => {
      const internshipId = a?.internship ? String(a.internship) : null;
      const applicantId = a?.applicant ? String(a.applicant) : null;
      const internship = internshipId ? internshipsMap.get(internshipId) as Record<string, unknown> | undefined : undefined;
      return {
        ...a,
        internship: internship ?? (internshipId ? { _id: internshipId, title: "(deleted internship)", company: "" } : null),
        applicant: applicantId ? (usersMap.get(applicantId) as Record<string, unknown> | undefined) ?? null : null,
      };
    });

    return NextResponse.json({ applications: apps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to fetch" }, { status: 500 });
  }
}
