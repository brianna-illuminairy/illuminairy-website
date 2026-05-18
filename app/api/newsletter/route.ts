import { NextResponse } from "next/server";

/**
 * Newsletter signups run client-side via Klaviyo's client subscriptions API.
 * This route remains for backwards compatibility and returns a clear message.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Use the footer subscribe form on the site. If it fails, email support@illuminairy.com."
    },
    { status: 410 }
  );
}
