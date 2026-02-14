import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
    const { communicationChannel, phone, selectedPersonality, name, email } = body;

    // Validate communication channel
    if (!communicationChannel || !["imessage", "whatsapp", "web", "discord"].includes(communicationChannel)) {
      return NextResponse.json(
        { error: "Invalid communication channel" },
        { status: 400 }
      );
    }

    // For Discord, call the backend API to get OAuth verification link
    if (communicationChannel === "discord") {
      const backendResponse = await fetch(`${BACKEND_API_URL}/api/user/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${session.user.id}:`).toString("base64")}`, // Basic auth with user_id
        },
        body: JSON.stringify({
          name: name || session.user.name || "User",
          email: email || session.user.email || "",
          selectedPersonality: selectedPersonality || "loving",
          communicationChannel: "discord",
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        return NextResponse.json(
          { error: errorData.message || "Failed to generate Discord verification link" },
          { status: backendResponse.status }
        );
      }

      const backendData = await backendResponse.json();
      return NextResponse.json({
        success: true,
        verification_url: backendData.verification_url,
        verification_token: backendData.verification_token,
        user_id: backendData.user_id,
      });
    }

    // For other channels, call backend API
    const normalizedPhone = typeof phone === "string" ? phone.replace(/\s+/g, "") : phone;
    
    // Validate phone if channel requires it
    if ((communicationChannel === "imessage" || communicationChannel === "whatsapp") && !normalizedPhone) {
      return NextResponse.json(
        { error: "Phone number is required for iMessage or WhatsApp" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/user/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${session.user.id}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        name: name || session.user.name || "User",
        email: email || session.user.email || "",
        selectedPersonality: selectedPersonality || "loving",
        communicationChannel,
        phone: (communicationChannel === "imessage" || communicationChannel === "whatsapp") ? normalizedPhone : null,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to complete onboarding" },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    return NextResponse.json({
      success: true,
      ...backendData, // Include authCode, verification_url, etc. from backend
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
