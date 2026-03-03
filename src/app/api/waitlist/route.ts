import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let schemaInitPromise: Promise<void> | null = null;

const ensureWaitlistTable = async () => {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS waitlist_entries (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          source TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    })();
  }

  return schemaInitPromise;
};

export async function POST(request: Request) {
  try {
    await ensureWaitlistTable();

    const body = await request.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const rawSource = typeof body?.source === "string" ? body.source : null;
    const email = rawEmail.trim().toLowerCase();
    const source = rawSource ? rawSource.trim().slice(0, 64) : null;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const result = await pool.query(
      `
        INSERT INTO waitlist_entries (email, source)
        VALUES ($1, $2)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `,
      [email, source]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: true, alreadyJoined: true }, { status: 200 });
    }

    return NextResponse.json({ success: true, alreadyJoined: false }, { status: 201 });
  } catch (error) {
    console.error("[WaitlistAPI] Failed to add waitlist entry:", error);
    return NextResponse.json({ error: "Failed to join waitlist." }, { status: 500 });
  }
}
