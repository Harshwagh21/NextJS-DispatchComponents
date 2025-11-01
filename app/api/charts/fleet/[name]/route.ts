import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { sanitizeInput } from "@/lib/api-utils";
import Fleet from "@/models/Fleet";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await connectToDatabase();
    const { name } = await params;
    
    if (!name?.trim()) {
      return NextResponse.json({ message: "Fleet name is required" }, { status: 400 });
    }
    
    const sanitizedName = sanitizeInput(name);
    const fleet = await Fleet.findOne({ name: sanitizedName })
      .select('charts location name _id')
      .lean();
    
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
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch fleet" },
      { status: 500 }
    );
  }
}


