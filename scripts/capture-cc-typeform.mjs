#!/usr/bin/env node
/**
 * Walk Curious Cardinals get-started funnel and capture each step.
 * Usage: node scripts/capture-cc-typeform.mjs
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "docs/research/cc-typeform-capture");

const TYPEFORM_PAGES = [
  {
    id: "contact-info",
    url: "https://www.curiouscardinals.com/get-started/contact-info",
    typeformLive: "01K8K8SQJ19ZW5HCXAD7WHDAYT"
  },
  {
    id: "parent-info",
    url: "https://www.curiouscardinals.com/get-started/parent-info",
    typeformLive: "01K8BW43NZXA5C24GC08WJBB9G"
  }
];

const WEBFLOW_STEPS = [
  "basic-info",
  "student-insights",
  "add-another-student",
  "book-a-consultation-call",
  "book-a-consultation-call-passion-project",
  "confirmation",
  "async-confirmation",
  "asynchronous-match-request"
];

function getTypeformFrame(page) {
  return page.frames().find((f) => f.url().includes("form.typeform.com"));
}

async function captureTypeform(page, form) {
  await page.goto(form.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(5000);

  const frame = getTypeformFrame(page);
  if (!frame) {
    return { error: "no typeform iframe", frameUrls: page.frames().map((f) => f.url()) };
  }

  const formSlug = frame.url().match(/to\/([^?]+)/)?.[1] || "";
  const steps = [];
  const seen = new Set();

  for (let n = 1; n <= 50; n++) {
    await page.waitForTimeout(800);
    const bodyText = await frame.locator("body").innerText();
    const hash = bodyText.slice(0, 200);
    if (seen.has(hash) && n > 2) break;
    seen.add(hash);

    const inputs = await frame.evaluate(() =>
      [...document.querySelectorAll("input, textarea, select, [role=radio], [role=checkbox]")]
        .filter((el) => el.offsetParent !== null || el.type === "hidden")
        .map((el) => ({
          tag: el.tagName,
          type: el.type || el.getAttribute("role") || "",
          name: el.name || "",
          placeholder: el.placeholder || "",
          aria: el.getAttribute("aria-label") || "",
          value: el.value || ""
        }))
    );

    steps.push({ step: n, bodyText, inputs, frameUrl: frame.url() });

    const skip = ':not([name="g-recaptcha-response"])';
    const emails = frame.locator(`input[type="email"]${skip}`);
    const texts = frame.locator(`input[type="text"]${skip}`);
    const tels = frame.locator(`input[type="tel"]${skip}`);
    const textareas = frame.locator(`textarea${skip}`);

    if ((await emails.count()) > 0) {
      for (const el of await emails.all()) {
        if (!(await el.inputValue())) await el.fill(`parent+cc${n}@example.com`);
      }
    }
    if ((await tels.count()) > 0) {
      for (const el of await tels.all()) {
        if (!(await el.inputValue())) await el.fill("4045550100");
      }
    }
    if ((await texts.count()) > 0) {
      const fields = await texts.all();
      for (let i = 0; i < fields.length; i++) {
        if (!(await fields[i].inputValue())) {
          await fields[i].fill(i === 0 ? "Test" : i === 1 ? "Parent" : "Student");
        }
      }
    }
    if ((await textareas.count()) > 0) {
      const ta = textareas.first();
      if (!(await ta.inputValue())) await ta.fill("Test response for archive capture.");
    }

    const radio = frame.locator('[role="radio"]').first();
    const checkbox = frame.locator('[role="checkbox"]').first();
    if ((await radio.count()) > 0) {
      const checked = await frame.locator('[role="radio"][aria-checked="true"]').count();
      if (checked === 0) await radio.click();
    } else if ((await checkbox.count()) > 0) {
      const checked = await checkbox.getAttribute("aria-checked");
      if (checked !== "true") await checkbox.click();
    }

    const ok = frame.getByRole("button", { name: /^OK$/i });
    const submit = frame.getByRole("button", { name: /submit|finish|book|schedule/i });
    const btn = (await ok.count()) > 0 ? ok : submit;
    if ((await btn.count()) === 0) break;

    const prev = bodyText;
    await btn.first().click();
    await page.waitForTimeout(2000);

    const next = await frame.locator("body").innerText();
    if (next === prev) {
      const choice = frame.locator('[data-qa="choice"]').first();
      if ((await choice.count()) > 0) {
        await choice.click();
        await page.waitForTimeout(1500);
        continue;
      }
      break;
    }

    if (!page.url().includes("get-started") && !frame.url().includes("typeform")) {
      steps.push({ step: n + 1, redirect: page.url() });
      break;
    }
  }

  return { formSlug, frameUrl: frame.url(), steps };
}

async function captureWebflowStep(page, slug) {
  const url = `https://www.curiouscardinals.com/get-started/${slug}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  return page.evaluate((u) => {
    const labels = [...document.querySelectorAll("label, .w-label, h1, h2, h3")]
      .map((el) => el.innerText?.trim())
      .filter((t) => t && t.length > 2 && t.length < 400);
    const fields = [...document.querySelectorAll("input, textarea, select")]
      .map((el) => ({
        name: el.name,
        type: el.type,
        placeholder: el.placeholder,
        id: el.id
      }));
    const buttons = [...document.querySelectorAll("a.w-button, button, input[type=submit]")]
      .map((el) => ({ text: el.innerText?.trim() || el.value, href: el.href || "" }));
    const iframes = [...document.querySelectorAll("iframe")].map((f) => f.src);
    return {
      slug: u.split("/").pop(),
      url: u,
      title: document.title,
      labels: [...new Set(labels)],
      fields,
      buttons,
      iframes
    };
  }, url);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const report = { captured_at: new Date().toISOString(), typeforms: [], webflow_steps: [] };

  for (const form of TYPEFORM_PAGES) {
    console.error(`Typeform: ${form.id}…`);
    report.typeforms.push({ ...form, ...(await captureTypeform(page, form)) });
  }

  for (const slug of WEBFLOW_STEPS) {
    console.error(`Webflow: ${slug}…`);
    report.webflow_steps.push(await captureWebflowStep(page, slug));
  }

  await browser.close();
  writeFileSync(resolve(outDir, "capture-raw.json"), JSON.stringify(report, null, 2));
  console.error(`Wrote ${outDir}/capture-raw.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
