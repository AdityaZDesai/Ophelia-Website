import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { communicationChannel, phone, selectedPersonality } = body;

    // Validate communication channel
    if (!communicationChannel || !["imessage", "whatsapp", "web"].includes(communicationChannel)) {
      return NextResponse.json(
        { error: "Invalid communication channel" },
        { status: 400 }
      );
    }

    // Validate phone if channel requires it
    if ((communicationChannel === "imessage" || communicationChannel === "whatsapp") && !phone) {
      return NextResponse.json(
        { error: "Phone number is required for iMessage or WhatsApp" },
        { status: 400 }
      );
    }

    // Update user in database
    const updateQuery = `
      UPDATE "user"
      SET 
        "communicationChannel" = $1,
        "phone" = $2,
        "selectedPersonality" = $3,
        "onboardingCompleted" = true
      WHERE "id" = $4
    `;

    await pool.query(updateQuery, [
      communicationChannel,
      communicationChannel === "web" ? null : phone,
      selectedPersonality || null,
      session.user.id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

