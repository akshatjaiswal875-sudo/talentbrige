import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

type TokenInfo = {
  email?: string;
  name?: string;
  sub?: string; // google user id
  aud?: string;
  picture?: string;
  exp?: string;
};

export async function POST(request: Request) {
  await connectDb();
  try {
    const body = await request.json();
    const { credential } = body;
    if (!credential) return NextResponse.json({ success: false, message: "Missing credential" }, { status: 400 });

    // Verify token with Google's tokeninfo endpoint
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!googleRes.ok) {
      const txt = await googleRes.text();
      return NextResponse.json({ success: false, message: `Invalid Google token: ${txt}` }, { status: 400 });
    }

    const info: TokenInfo = await googleRes.json();
    const email = info.email;
    const name = info.name || "";
    const googleId = info.sub || "";

    if (!email) return NextResponse.json({ success: false, message: "Google token missing email" }, { status: 400 });

    // Optional: validate audience
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (GOOGLE_CLIENT_ID && info.aud && info.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json({ success: false, message: "Token audience mismatch" }, { status: 400 });
    }

    const picture = info.picture || undefined;
    // If Google provides a picture URL, try to fetch and convert it to a base64 data URL
    async function fetchImageAsDataUrl(url: string): Promise<string | undefined> {
      try {
        const res = await fetch(url);
        if (!res.ok) return undefined;
        const contentType = res.headers.get("content-type") || "image/jpeg";
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:${contentType};base64,${base64}`;
      } catch {
        return undefined;
      }
    }

    let user = await User.findOne({ email });
    if (!user) {
      // try to fetch and store base64 image if available
      const imageData = picture ? await fetchImageAsDataUrl(picture) : undefined;
      user = await User.create({ email, name, googleId, image: imageData || picture });
    } else if (picture) {
      // Try to update to base64 representation when possible
      const imageData = await fetchImageAsDataUrl(picture);
      if (imageData && user.image !== imageData) {
        user.image = imageData;
        await user.save();
      } else if (!imageData && user.image !== picture) {
        // fallback to storing the URL if conversion failed
        user.image = picture;
        await user.save();
      }
    }

    const secret = process.env.SECRET_JWT || "dev-secret";
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
