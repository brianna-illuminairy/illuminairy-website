import { NextResponse } from "next/server";
import { importAdSpendCsvRows } from "@/lib/admin/ads-queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function parseCsvLine(line: string) {
  return line.split(",").map((cell) => cell.trim());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { csv?: string };
  try {
    body = (await request.json()) as { csv?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = body.csv?.trim();
  if (!text) {
    return NextResponse.json({ error: "CSV required." }, { status: 400 });
  }

  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = [];

  for (const line of lines) {
    if (line.toLowerCase().startsWith("date,")) continue;
    const [spendDate, utmCampaign, utmContent, spendDollars, impressions, clicks] =
      parseCsvLine(line);
    if (!spendDate || !spendDollars) continue;
    const spendCents = Math.round(parseFloat(spendDollars) * 100);
    if (Number.isNaN(spendCents)) continue;
    rows.push({
      spendDate,
      utmCampaign: utmCampaign ?? "",
      utmContent: utmContent ?? "",
      spendCents,
      impressions: impressions ? parseInt(impressions, 10) : null,
      clicks: clicks ? parseInt(clicks, 10) : null
    });
  }

  const result = await importAdSpendCsvRows(rows);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, count: result.count });
}
