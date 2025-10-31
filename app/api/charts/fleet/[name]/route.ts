import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import Fleet from "@/models/Fleet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeFleetName(name: string): string {
  return name.trim().replace(/[<>]/g, '');
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await connectToDatabase();
    const { name } = await params;
    
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ message: "Fleet name is required" }, { status: 400 });
    }
    
    const sanitizedName = sanitizeFleetName(name);
    const fleet = await Fleet.findOne({ name: sanitizedName });
    
    if (!fleet) {
      return NextResponse.json({ message: "Fleet not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      charts: fleet.charts,
      location: fleet.location,
      name: fleet.name,
      fleetId: fleet._id,
    });
  } catch (err: unknown) {
    console.error("Error fetching fleet:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch fleet" },
      { status: 500 }
    );
  }
}


