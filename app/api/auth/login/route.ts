import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import { validateEmail, getJsonBody } from "@/lib/api-utils";
import { setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await getJsonBody(req);
    
    if (!body) return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    
    const { email, password } = body;
    const normalizedEmail = email?.trim().toLowerCase();
    
    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }
    
    if (!password || typeof password !== "string") {
      return NextResponse.json({ message: "Password is required" }, { status: 400 });
    }
    
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }
    
    const token = jwt.sign({ userId: user._id.toString(), authority: user.authority }, secret, { expiresIn: "1d" });
    await setAuthCookie(token);
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        authority: user.authority,
        location: user.location,
        fleet: user.fleet,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Login failed" },
      { status: 500 }
    );
  }
}


