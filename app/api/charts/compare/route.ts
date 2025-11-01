import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { sanitizeInput, getJsonBody } from "@/lib/api-utils";
import Fleet from "@/models/Fleet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await getJsonBody(req);
    
    if (!body) return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    
    const { fleet, categories } = body;
    
    if (!fleet?.trim()) {
      return NextResponse.json({ message: "Fleet name is required" }, { status: 400 });
    }
    
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ message: "Categories array is required and cannot be empty" }, { status: 400 });
    }
    
    if (!categories.every(cat => typeof cat === "string" && cat.trim())) {
      return NextResponse.json({ message: "All categories must be non-empty strings" }, { status: 400 });
    }
    
    const sanitizedName = sanitizeInput(fleet);
    const fleetDoc = await Fleet.findOne({ name: sanitizedName }).select('charts').lean();
    
    if (!fleetDoc) {
      return NextResponse.json({ message: "Fleet not found" }, { status: 404 });
    }
    
    const sanitizedCategories = categories.map((cat: string) => sanitizeInput(cat));
    const chartMap = new Map(
      (fleetDoc.charts as Array<{ category: string; data: number[]; summary?: string }>).map(c => [c.category, c])
    );
    
    const result = sanitizedCategories
      .map((category: string) => {
        const chart = chartMap.get(category);
        return chart ? { category: chart.category, data: chart.data, summary: chart.summary } : null;
      })
      .filter((v): v is { category: string; data: number[]; summary: string | undefined } => v !== null);
    
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to compare charts" },
      { status: 500 }
    );
  }
}
