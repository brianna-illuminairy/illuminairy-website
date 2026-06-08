import { NextResponse } from "next/server";
import { isDanielleAuthenticated } from "@/lib/danielle-auth";
import {
  DANIELLE_FILE_MAP,
  readDanielleFile,
  type DanielleFileSlug
} from "@/lib/danielle-content";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!(slug in DANIELLE_FILE_MAP)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { buffer, contentType, filename } = readDanielleFile(slug as DanielleFileSlug);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
