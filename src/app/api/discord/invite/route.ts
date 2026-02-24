import { NextResponse } from "next/server";

const FLASK_API_URL = process.env.harmonica_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${FLASK_API_URL}/api/discord/invite`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Failed to fetch Discord invite" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Discord invite proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord invite" },
      { status: 500 }
    );
  }
}
