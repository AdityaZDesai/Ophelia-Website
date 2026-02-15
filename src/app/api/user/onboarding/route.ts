import { auth } from "@/lib/auth";
import { AUDIO_OPTIONS, GIRL_PHOTOS, PERSONALITIES } from "@/lib/constants";
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
    const {
      communicationChannel,
      phone,
      selectedPersonality,
      selectedPhoto,
      selectedAudio,
    } = body;
    const normalizedPhone = typeof phone === "string" ? phone.replace(/\s+/g, "") : phone;
    const authCode =
      communicationChannel === "whatsapp" || communicationChannel === "telegram"
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : null;
    const verified = communicationChannel === "whatsapp" || communicationChannel === "telegram" ? false : null;

    const validPhotoIds = GIRL_PHOTOS.map((photo) => photo.id);
    const validPersonalityIds = PERSONALITIES.map((personality) => personality.id);
    const validAudioIds = AUDIO_OPTIONS.map((audio) => audio.id);

    if (!selectedPhoto || !validPhotoIds.includes(selectedPhoto)) {
      return NextResponse.json(
        { error: "Invalid photo selection" },
        { status: 400 }
      );
    }

    if (!selectedPersonality || !validPersonalityIds.includes(selectedPersonality)) {
      return NextResponse.json(
        { error: "Invalid personality selection" },
        { status: 400 }
      );
    }

    if (!selectedAudio || !validAudioIds.includes(selectedAudio)) {
      return NextResponse.json(
        { error: "Invalid audio selection" },
        { status: 400 }
      );
    }

    // Validate communication channel
    if (!communicationChannel || !["imessage", "web", "whatsapp", "telegram"].includes(communicationChannel)) {
      return NextResponse.json(
        { error: "Invalid communication channel" },
        { status: 400 }
      );
    }

    // Validate phone if channel requires it
    if ((communicationChannel === "imessage" || communicationChannel === "whatsapp") && !normalizedPhone) {
      return NextResponse.json(
        { error: "Phone number is required for this channel" },
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
        "selectedPhoto" = $4,
        "selectedAudio" = $5,
        "onboardingCompleted" = true,
        "auth_code" = $7,
        "verified" = $8
      WHERE "id" = $6
    `;

    await pool.query(updateQuery, [
      communicationChannel,
      communicationChannel === "web" || communicationChannel === "telegram" ? null : normalizedPhone,
      selectedPersonality,
      selectedPhoto,
      selectedAudio,
      session.user.id,
      authCode,
      verified,
    ]);

    return NextResponse.json({ success: true, authCode });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
