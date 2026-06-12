/**
 * AES-256-GCM encrypt/decrypt for OAuth refresh tokens and other long-lived
 * secrets stored in `integration_tokens`.
 *
 * Key source: process.env.INTEGRATION_TOKEN_ENC_KEY (base64-encoded 32 bytes).
 *
 * Output format: `v1:<iv_b64>:<authTag_b64>:<ciphertext_b64>`.
 *   - `v1`: version prefix so we can rotate algorithms later without ambiguity.
 *   - iv (12 bytes) is unique per encryption; never reused.
 *   - authTag (16 bytes) covers the ciphertext for tamper detection.
 */

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALG = "aes-256-gcm";
const VERSION = "v1";

let cachedKey: Buffer | null = null;

function loadKey(): Buffer {
  if (cachedKey) return cachedKey;
  const raw = process.env.INTEGRATION_TOKEN_ENC_KEY;
  if (!raw) {
    throw new Error(
      "INTEGRATION_TOKEN_ENC_KEY is not set. Generate one with `openssl rand -base64 32` and add to env."
    );
  }
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32) {
    throw new Error(
      `INTEGRATION_TOKEN_ENC_KEY must decode to 32 bytes, got ${buf.length}.`
    );
  }
  cachedKey = buf;
  return cachedKey;
}

export function encryptToken(plaintext: string): string {
  if (!plaintext) {
    throw new Error("encryptToken: plaintext is empty");
  }
  const key = loadKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(":");
}

export function decryptToken(packed: string): string {
  if (!packed) {
    throw new Error("decryptToken: packed value is empty");
  }
  const parts = packed.split(":");
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new Error(`decryptToken: bad packed format (expected ${VERSION}:iv:tag:ct)`);
  }
  const key = loadKey();
  const iv = Buffer.from(parts[1], "base64");
  const tag = Buffer.from(parts[2], "base64");
  const ct = Buffer.from(parts[3], "base64");
  const decipher = createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString("utf8");
}

export function isEncryptedToken(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith(`${VERSION}:`);
}
