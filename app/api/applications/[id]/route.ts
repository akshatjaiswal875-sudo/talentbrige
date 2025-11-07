import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Application } from "@/dbConnection/Schema/application";
import { User } from "@/dbConnection/Schema/user";
// ensure Internship model is registered for populate
import "@/dbConnection/Schema/internship";
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

export async function GET(request: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }>; }) {
  await connectDb();
  const resolvedParams = (await params) as { id?: string };
  const idParam = resolvedParams?.id;
  if (!idParam) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const app = await Application.findById(idParam).populate("internship").populate("applicant").lean();
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application: app });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }>; }) {
  await connectDb();
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (user as { role?: string } | null)?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const resolvedParams = (await params) as { id?: string };
  const idParam = resolvedParams?.id;
  if (!idParam) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { status } = body;
  if (!status || !["pending", "accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updated = await Application.findByIdAndUpdate(idParam, { status }, { new: true }).lean();
    return NextResponse.json({ application: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Failed to update" }, { status: 500 });
  }
}
