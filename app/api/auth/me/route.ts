import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  await connectDb();
  try {
    const token = request.cookies?.get?.("token")?.value || null;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const secret = process.env.SECRET_JWT || "dev-secret";
  const decoded = jwt.verify(token, secret);
  if (!decoded || typeof decoded !== "object" || !('id' in decoded)) return NextResponse.json({ authenticated: false }, { status: 401 });

  const id = (decoded as { id?: string }).id;
  if (!id) return NextResponse.json({ authenticated: false }, { status: 401 });

  type UserDoc = { _id: string; name: string; email: string; role: string; image?: string };
  const userDoc = (await User.findById(id).lean()) as unknown as UserDoc | null;
  if (!userDoc) return NextResponse.json({ authenticated: false }, { status: 401 });

  const { _id, name, email, role, image } = userDoc;
  return NextResponse.json({ authenticated: true, user: { id: _id, name, email, role, image } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ authenticated: false, message }, { status: 500 });
  }
}
