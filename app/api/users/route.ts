import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";

export async function GET() {
  await connectDb();

  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ count: users.length, data: users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
