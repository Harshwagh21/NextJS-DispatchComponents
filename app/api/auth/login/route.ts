import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }
    
    const { email, password } = body;
    
    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }
    
    if (!password || typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 });
    }
    
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }
    
    const token = jwt.sign(
      { userId: user._id.toString(), authority: user.authority },
      secret,
      { expiresIn: "1d" }
    );
    
    return NextResponse.json({
      token,
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
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}


