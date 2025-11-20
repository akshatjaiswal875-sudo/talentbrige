import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/dbConnection/Schema/user";
import { connectDb } from "@/dbConnection/connect";

export async function getCurrentUser() {
  await connectDb();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;

  try {
    const secret = process.env.SECRET_JWT || "dev-secret";
    const decoded = jwt.verify(token, secret);
    
    if (!decoded || typeof decoded !== "object" || !('id' in decoded)) return null;

    const id = (decoded as { id?: string }).id;
    if (!id) return null;

    const user = await User.findById(id);
    return user;
  } catch (error) {
    return null;
  }
}
