#!/usr/bin/env node
/**
 * Create the mentor application Typeform via Create API.
 *
 * Requires TYPEFORM_API_TOKEN (Personal token → Forms → Read/Write).
 *
 *   node scripts/create-mentor-typeform.mjs
 *   node scripts/create-mentor-typeform.mjs --dry-run
 *
 * On success, prints public URL. Set in Vercel:
 *   NEXT_PUBLIC_MENTOR_TYPEFORM_URL=https://form.typeform.com/to/XXXX
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildMentorApplicationForm } from "./typeform/build-mentor-application.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const payload = buildMentorApplicationForm();

  if (dryRun) {
    const out = resolve(root, "scripts/typeform/mentor-application.payload.json");
    writeFileSync(out, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify({ dryRun: true, out, fieldCount: payload.fields.length }, null, 2));
    return;
  }

  const token = process.env.TYPEFORM_API_TOKEN;
  if (!token) {
    console.error(
      "Missing TYPEFORM_API_TOKEN. Create a personal token at https://admin.typeform.com/account#/section/tokens"
    );
    console.error("Dry-run payload: node scripts/create-mentor-typeform.mjs --dry-run");
    process.exit(1);
  }

  const res = await fetch("https://api.typeform.com/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Typeform API error:", res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }

  const publicUrl = body?._links?.display || `https://form.typeform.com/to/${body.id}`;
  const meta = {
    created_at: new Date().toISOString(),
    id: body.id,
    title: body.title,
    publicUrl,
    env: "NEXT_PUBLIC_MENTOR_TYPEFORM_URL=" + publicUrl
  };

  writeFileSync(
    resolve(root, "scripts/typeform/mentor-application.created.json"),
    JSON.stringify(meta, null, 2)
  );

  console.log(JSON.stringify(meta, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
