import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const FLASK_API_URL = process.env.harmonica_API_URL || "http://localhost:5000";

async function getAuthToken(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    // Try to get token from session object first
    if (session.session?.token) {
      return session.session.token;
    }

    // Fallback: extract from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("better-auth.session_token");
    return sessionCookie?.value || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${FLASK_API_URL}/api/chat0/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Failed to send message" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

