import { auth } from "@/lib/auth";
import { AUDIO_OPTIONS, GIRL_PHOTOS, PERSONALITIES } from "@/lib/constants";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const FLASK_API_URL = process.env.harmonica_API_URL || "http://localhost:5000";

const toBackendPersonality = (personality: string): string => {
  switch (personality) {
    case "dominant":
    case "yandere":
      return "dominant";
    case "goth":
    case "kuudere":
      return "tsundere";
    default:
      return "loving";
  }
};

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

    const existingUserQuery = `
      SELECT
        "communicationChannel",
        "auth_code",
        "verified"
      FROM "user"
      WHERE "id" = $1
      LIMIT 1
    `;
    const existingUserResult = await pool.query(existingUserQuery, [session.user.id]);

    if (existingUserResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingUser = existingUserResult.rows[0] as {
      communicationChannel: string | null;
      auth_code: string | null;
      verified: boolean | null;
    };
    const isChannelChanged = existingUser.communicationChannel !== communicationChannel;

    let authCode: string | null = null;
    let verified: boolean | null = null;
    let discordVerificationUrl: string | null = null;
    let discordVerificationToken: string | null = null;
    let discordInstructions: string | null = null;

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
    if (!communicationChannel || !["imessage", "web", "telegram", "discord"].includes(communicationChannel)) {
      return NextResponse.json(
        { error: "Invalid communication channel" },
        { status: 400 }
      );
    }

    const needsDiscordRelink =
      communicationChannel === "discord" &&
      (isChannelChanged || !existingUser.auth_code || existingUser.verified === false);

    if (needsDiscordRelink) {
      const discordPayload = {
        name: session.user.name || "User",
        email: session.user.email,
        selectedPersonalityId: selectedPersonality,
        selectedPersonality: toBackendPersonality(selectedPersonality),
        selectedPhoto,
        selectedAudio,
        communicationChannel: "discord",
      };

      const discordResponse = await fetch(`${FLASK_API_URL}/api/user/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload),
      });

      const discordData = await discordResponse.json().catch(() => ({}));

      if (!discordResponse.ok) {
        return NextResponse.json(
          {
            error:
              discordData?.error ||
              discordData?.message ||
              "Failed to initialize Discord onboarding",
          },
          { status: discordResponse.status }
        );
      }

      discordVerificationUrl =
        typeof discordData?.verification_url === "string"
          ? discordData.verification_url
          : null;
      discordVerificationToken =
        typeof discordData?.verification_token === "string"
          ? discordData.verification_token
          : null;
      discordInstructions =
        typeof discordData?.instructions === "string" ? discordData.instructions : null;

      authCode = discordVerificationToken;
      verified = false;
    }

    // Validate phone if channel requires it
    if (communicationChannel === "imessage" && !normalizedPhone) {
      return NextResponse.json(
        { error: "Phone number is required for this channel" },
        { status: 400 }
      );
    }

    if (communicationChannel === "telegram") {
      if (isChannelChanged) {
        authCode = Math.floor(100000 + Math.random() * 900000).toString();
        verified = false;
      } else {
        authCode =
          existingUser.auth_code || Math.floor(100000 + Math.random() * 900000).toString();
        verified = existingUser.verified ?? false;
      }
    } else if (communicationChannel === "discord") {
      if (!authCode) {
        authCode = existingUser.auth_code;
      }

      if (verified === null) {
        verified = existingUser.verified ?? false;
      }
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
      ["web", "telegram", "discord"].includes(communicationChannel)
        ? null
        : normalizedPhone,
      selectedPersonality,
      selectedPhoto,
      selectedAudio,
      session.user.id,
      authCode,
      verified,
    ]);

    return NextResponse.json({
      success: true,
      authCode,
      verification_url: discordVerificationUrl,
      verification_token: discordVerificationToken,
      instructions: discordInstructions,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
