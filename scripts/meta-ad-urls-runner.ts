import {
  assertMetaAdDestinationUrl,
  metaLiveAdDestinationUrls,
} from "@/lib/marketing/meta-live-creatives";

const rows = metaLiveAdDestinationUrls();

for (const row of rows) {
  assertMetaAdDestinationUrl(row.url);
}

console.log("Live Meta ad destination URLs (paste into Ads Manager):\n");
for (const row of rows) {
  console.log(
    `${row.id} · offer=${row.offerGoal} · utm_content=${row.utmContent} · hook=${row.heroHook} · path=${row.landingPath}`
  );
  console.log(row.url);
  console.log("");
}

console.log(
  `Validated ${rows.length} URLs — no step= deep links (Strategy Call may use /plan).`
);
