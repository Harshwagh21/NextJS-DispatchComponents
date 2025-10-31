import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/models/User";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      username: user.username,
      email: user.email,
      authority: user.authority,
      location: user.location,
      fleet: user.fleet,
    });
  } catch (err: unknown) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch user" },
      { status: 500 }
    );
  }
}


