import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

export async function GET() {
  await connectDb();

  try {
    // Return the latest 3 internships (newest first)
    const internships = await Internship.find().sort({ createdAt: -1 }).limit(3).lean();
    return NextResponse.json({ count: internships.length, data: internships });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
