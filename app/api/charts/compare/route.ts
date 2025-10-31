import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import Fleet from "@/models/Fleet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeFleetName(name: string): string {
  return name.trim().replace(/[<>]/g, '');
}

function sanitizeCategory(category: string): string {
  return category.trim().replace(/[<>]/g, '');
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
    
    const { fleet, categories } = body;
    
    if (!fleet || typeof fleet !== "string" || fleet.trim().length === 0) {
      return NextResponse.json({ message: "Fleet name is required" }, { status: 400 });
    }
    
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ message: "Categories array is required and cannot be empty" }, { status: 400 });
    }
    
    if (!categories.every(cat => typeof cat === "string" && cat.trim().length > 0)) {
      return NextResponse.json({ message: "All categories must be non-empty strings" }, { status: 400 });
    }
    
    const sanitizedName = sanitizeFleetName(fleet);
    const fleetDoc = await Fleet.findOne({ name: sanitizedName });
    
    if (!fleetDoc) {
      return NextResponse.json({ message: "Fleet not found" }, { status: 404 });
    }
    
    const sanitizedCategories = categories.map((cat: string) => sanitizeCategory(cat));
    const result = sanitizedCategories
      .map((category: string) => {
        const chart = (fleetDoc.charts as Array<{ category: string; data: number[]; summary?: string }>).find(
          (c) => c.category === category
        );
        return chart
          ? { category: chart.category, data: chart.data, summary: chart.summary }
          : null;
      })
      .filter((v): v is { category: string; data: number[]; summary: string | undefined } => v !== null);
    
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Error comparing charts:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to compare charts" },
      { status: 500 }
    );
  }
}
