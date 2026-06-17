// One-off probe: list Google Drive docs modified in the last 4 hours so we can
// see exactly what Workspace named the Gemini Notes / Transcript docs for the
// most recent calls. Run with:
//   node --env-file=.env.local scripts/drive-probe.mjs
import { createClient } from "@supabase/supabase-js";
import { createDecipheriv } from "node:crypto";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const encKey = process.env.INTEGRATION_TOKEN_ENC_KEY;
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
if (!url || !key || !encKey || !clientId || !clientSecret) {
  console.error("missing env (SUPABASE_*, INTEGRATION_TOKEN_ENC_KEY, GOOGLE_OAUTH_*)");
  process.exit(1);
}

function decrypt(payload) {
  const [v, ivB64, tagB64, ctB64] = payload.split(":");
  if (v !== "v1") throw new Error("unknown enc version");
  const k = Buffer.from(encKey, "base64");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ct = Buffer.from(ctB64, "base64");
  const d = createDecipheriv("aes-256-gcm", k, iv);
  d.setAuthTag(tag);
  const out = Buffer.concat([d.update(ct), d.final()]);
  return out.toString("utf8");
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await supabase
  .from("integration_tokens")
  .select("refresh_token_enc, access_token_enc, access_token_expires_at")
  .eq("provider", "google")
  .eq("owner_email", "brianna@illuminairy.com")
  .maybeSingle();
if (error || !data) throw new Error("no token row");

let accessToken;
const expiresMs = data.access_token_expires_at ? Date.parse(data.access_token_expires_at) : 0;
if (expiresMs - 60_000 > Date.now() && data.access_token_enc) {
  accessToken = decrypt(data.access_token_enc);
  console.log("(reusing cached access token)");
} else {
  const refresh = decrypt(data.refresh_token_enc);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refresh,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token"
    })
  });
  const json = await res.json();
  if (!res.ok) throw new Error("refresh failed: " + JSON.stringify(json));
  accessToken = json.access_token;
  console.log("(refreshed access token)");
}

const since = new Date(Date.now() - 4 * 3600_000).toISOString();
const q = encodeURIComponent(
  `mimeType = 'application/vnd.google-apps.document' and modifiedTime > '${since}' and trashed = false`
);
const r = await fetch(
  `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=50&fields=files(id,name,modifiedTime,webViewLink,owners)`,
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
const body = await r.json();
console.log("\nDocs modified in the last 4h:");
for (const f of body.files ?? []) {
  console.log(` - ${f.modifiedTime}  |  ${f.name}\n     ${f.webViewLink}`);
}
console.log(`\n(${(body.files ?? []).length} total)`);
