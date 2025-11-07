import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

type PartialIntern = { title?: string; company?: string; description?: string; [k: string]: unknown };

export async function GET() {
  await connectDb();

  try {
    const internships = await Internship.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ count: internships.length, data: internships });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDb();

  try {
    const body = (await request.json()) as PartialIntern | PartialIntern[];
    const items = Array.isArray(body) ? body : [body];

    // Basic validation
    const invalid = items.find((it) => !it.title || !it.company || !it.description);
    if (invalid) {
      return NextResponse.json({ error: "Missing required fields: title, company, description" }, { status: 400 });
    }

    // Prevent duplicate titles being inserted repeatedly
    const titles = items.map((i) => String(i.title));
    await Internship.deleteMany({ title: { $in: titles } });

    const created = await Internship.insertMany(items);
    return NextResponse.json({ inserted: created.length, data: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
