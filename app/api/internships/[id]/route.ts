import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

export async function DELETE(request: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  await connectDb();
  try {
    const params = (context.params instanceof Promise) ? await context.params : context.params;
    const { id } = params;
    const deleted = await Internship.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
