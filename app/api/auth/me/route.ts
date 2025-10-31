import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getAuthUser, getAuthToken } from "@/lib/auth";
import User from "@/models/User";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(auth.userId).select('username email authority location fleet');
    
    if (!user) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    return NextResponse.json({
      loggedIn: true,
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
    console.error("Error fetching user:", err);
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}

