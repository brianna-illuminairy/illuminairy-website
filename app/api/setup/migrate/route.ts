import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * One-time CRM migration (local or after deploy).
 * POST { "secret": "<ADMIN_SECRET>", "databasePassword": "<supabase db password>" }
 */
export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET?.trim();
  if (!adminSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET not configured on server." },
      { status: 503 }
    );
  }

  let body: { secret?: string; databasePassword?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (body.secret?.trim() !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const password = body.databasePassword?.trim();
  if (!password) {
    return NextResponse.json(
      { error: "databasePassword required." },
      { status: 400 }
    );
  }

  const projectRef = "agujbietvwcudihfgkef";
  const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  try {
    const pg = await import("pg");
    const sql = readFileSync(
      resolve(process.cwd(), "supabase/migrations/20260518120000_crm_schema.sql"),
      "utf8"
    );
    const client = new pg.default.Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    try {
      await client.query(sql);
    } catch (err) {
      const msg = String((err as Error).message ?? err);
      if (!msg.includes("already exists")) {
        throw err;
      }
    } finally {
      await client.end();
    }
  } catch (err) {
    console.error("Migration failed:", err);
    return NextResponse.json(
      { error: "Migration failed. Check password and pooler host in Supabase settings." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "CRM tables created." });
}
