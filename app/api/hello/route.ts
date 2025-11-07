import { connectDb } from "@/dbConnection/connect";
import { NextResponse } from "next/server";

export async function GET() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await connectDb();
    return NextResponse.json({ message: "Hello, World!" });
}
