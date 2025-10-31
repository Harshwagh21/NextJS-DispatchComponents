import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import Fleet from "@/models/Fleet";
import User from "@/models/User";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JwtPayload = { userId: string; authority?: string };

type LeanFleet = {
  name: string;
  location?: unknown;
  charts?: unknown;
};

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }
    
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, secret) as JwtPayload;
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 });
    }
    
    if (!payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId)) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 403 });
    }
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let fleets: LeanFleet[] = [];
    if (user.authority === 'HQM') {
      fleets = await Fleet.find({}).select('name location charts').lean<LeanFleet[]>();
    } else if (user.authority === 'FM') {
      if (user.location) {
        const locationRegex = user.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        fleets = await Fleet.find({ name: { $regex: locationRegex, $options: 'i' } }).select('name location charts').lean<LeanFleet[]>();
      } else if (user.fleet) {
        fleets = await Fleet.find({ name: user.fleet }).select('name location charts').lean<LeanFleet[]>();
      }
    }
    
    return NextResponse.json(fleets);
  } catch (err: unknown) {
    console.error("Error fetching fleets:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch fleets" },
      { status: 500 }
    );
  }
}


