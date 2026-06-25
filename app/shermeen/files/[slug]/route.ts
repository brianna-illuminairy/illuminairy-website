import { NextResponse } from "next/server";
import { isShermeenAuthenticated } from "@/lib/shermeen-auth";
import { readShermeenFile, SHERMEEN_FILE_MAP, type ShermeenFileSlug } from "@/lib/shermeen-content";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authed = await isShermeenAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!(slug in SHERMEEN_FILE_MAP)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const { buffer, contentType, filename } = readShermeenFile(slug as ShermeenFileSlug);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "File unavailable." }, { status: 500 });
  }
}
