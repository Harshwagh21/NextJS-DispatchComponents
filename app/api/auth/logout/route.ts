import { NextResponse } from "next/server";
import { deleteAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await deleteAuthCookie();
  return NextResponse.json({ success: true });
}

