import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await connectDb();
  try {
    const body = await request.json();
    const { email, name, googleId } = body;
    if (!email || !name) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    }

    const secret = process.env.SECRET_JWT || "dev-secret";
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });

  const res = NextResponse.json({ success: true });
  // set httpOnly cookie
  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
