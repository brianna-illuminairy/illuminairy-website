import { NextResponse } from "next/server";
import { isSkyeAuthenticated } from "@/lib/skye-auth";
import { readSkyeFile, SKYE_FILE_MAP, type SkyeFileSlug } from "@/lib/skye-content";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authed = await isSkyeAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!(slug in SKYE_FILE_MAP)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const { buffer, contentType, filename } = readSkyeFile(slug as SkyeFileSlug);

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
