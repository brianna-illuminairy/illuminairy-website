#!/usr/bin/env node
/**
 * Scrape Curious Cardinals blog (public) and rank posts by proxy signals.
 * Usage: node scripts/analyze-curious-cardinals-blog.mjs
 *        node scripts/analyze-curious-cardinals-blog.mjs --json > /tmp/cc-blog.json
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITEMAP = "https://blog.curiouscardinals.com/sitemap.xml";
const jsonOut = process.argv.includes("--json");
const outPath = resolve(root, "archives/cc-blog-scrape-latest.json");

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith("https://blog.curiouscardinals.com/"));
}

function slugFromUrl(url) {
  return url.replace("https://blog.curiouscardinals.com/", "").replace(/\/$/, "");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "IlluminairyResearch/1.0" },
    signal: AbortSignal.timeout(25000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function analyzePost(html, slug) {
  const titleM = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleM ? titleM[1].trim() : slug;

  const tags = [
    ...html.matchAll(/blog-post__tag-link[^>]*>([^<]+)</gi)
  ].map((m) => m[1].trim()).filter(Boolean);

  const ctaLinks = (html.match(/href="https?:\/\/(?:www\.)?curiouscardinals\.com/gi) || [])
    .length;

  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const words = (body.replace(/<[^>]+>/g, " ").match(/\b[a-zA-Z]{3,}\b/g) || [])
    .length;

  return { slug, title, url: `https://blog.curiouscardinals.com/${slug}`, tags, ctaLinks, words };
}

async function main() {
  console.error("Fetching sitemap…");
  const sitemapXml = await fetchText(SITEMAP);
  const urls = extractLocs(sitemapXml);
  console.error(`Found ${urls.length} posts. Scraping…`);

  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = slugFromUrl(url);
    try {
      const html = await fetchText(url);
      results.push(analyzePost(html, slug));
    } catch (err) {
      results.push({ slug, url, error: String(err.message || err) });
    }
    if ((i + 1) % 25 === 0) console.error(`  ${i + 1}/${urls.length}`);
    await new Promise((r) => setTimeout(r, 150));
  }

  const ok = results.filter((r) => !r.error);
  const payload = {
    scraped_at: new Date().toISOString(),
    post_count: ok.length,
    posts: results,
    top_by_words: [...ok].sort((a, b) => b.words - a.words).slice(0, 15),
    top_by_cta: [...ok].sort((a, b) => b.ctaLinks - a.ctaLinks).slice(0, 15)
  };

  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.error(`Wrote ${outPath}`);

  if (jsonOut) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log("\n=== TOP BY WORD COUNT (pillar content) ===\n");
  for (const r of payload.top_by_words) {
    console.log(`${String(r.words).padStart(5)}w | ${r.title}`);
    console.log(`       ${r.url}\n`);
  }

  console.log("=== TOP BY CTA LINKS (conversion-focused) ===\n");
  for (const r of payload.top_by_cta) {
    console.log(`${String(r.ctaLinks).padStart(3)} CTAs | ${r.title}`);
    console.log(`       ${r.url}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
