import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  console.log(`[UserStatusAPI] GET request received`);
  
  try {
    // Get the current session
    console.log(`[UserStatusAPI] Getting session from Better Auth...`);
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.warn(`[UserStatusAPI] No session found - returning 401`);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`[UserStatusAPI] Session found - userId: ${session.user.id}, email: ${session.user.email}`);

    // Query user from database
    const query = `
      SELECT 
        "onboardingCompleted",
        "selectedPersonality",
        "communicationChannel",
        "selectedPhoto",
        "selectedAudio"
      FROM "user"
      WHERE "id" = $1
    `;

    console.log(`[UserStatusAPI] Querying database for user: ${session.user.id}`);
    const result = await pool.query(query, [session.user.id]);

    if (result.rows.length === 0) {
      console.error(`[UserStatusAPI] User not found in database: ${session.user.id}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    console.log(`[UserStatusAPI] User data retrieved:`, {
      onboardingCompleted: user.onboardingCompleted,
      selectedPersonality: user.selectedPersonality,
      communicationChannel: user.communicationChannel,
      selectedPhoto: user.selectedPhoto,
      selectedAudio: user.selectedAudio,
    });

    const response = {
      onboardingCompleted: user.onboardingCompleted || false,
      selectedPersonality: user.selectedPersonality,
      communicationChannel: user.communicationChannel,
      selectedPhoto: user.selectedPhoto,
      selectedAudio: user.selectedAudio,
    };

    console.log(`[UserStatusAPI] Returning status:`, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(`[UserStatusAPI] Error fetching user status:`, error);
    return NextResponse.json(
      { error: "Failed to fetch user status" },
      { status: 500 }
    );
  }
}
