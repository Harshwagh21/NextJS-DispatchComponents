import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import Fleet from "@/models/Fleet";
import User from "@/models/User";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const revalidate = 300;

type LeanFleet = { name: string; location?: unknown; charts?: unknown };
type LeanUser = { authority?: string; location?: string; fleet?: string };

export async function GET() {
  try {
    await connectToDatabase();
    
    const { getAuthUser } = await import("@/lib/auth");
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }
    
    if (!auth.userId || !mongoose.Types.ObjectId.isValid(auth.userId)) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 403 });
    }
    
    const user = await User.findById(auth.userId).select('authority location fleet').lean<LeanUser>();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let fleets: LeanFleet[] = [];
    if (user.authority === 'HQM') {
      fleets = await Fleet.find({}).select('name location charts').lean<LeanFleet[]>();
    } else if (user.authority === 'FM') {
      const query = user.location
        ? { name: { $regex: user.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
        : user.fleet
        ? { name: user.fleet }
        : null;
      if (query) {
        fleets = await Fleet.find(query).select('name location charts').lean<LeanFleet[]>();
      }
    }
    
    return NextResponse.json(fleets);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch fleets" },
      { status: 500 }
    );
  }
}


