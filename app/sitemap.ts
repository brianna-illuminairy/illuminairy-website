import type { MetadataRoute } from "next";
import { MAGNET_FUNNEL_LANDING_PATH } from "@/lib/primary-lead-magnet";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/sat-accelerator",
    "/programs",
    "/mentors",
    "/about",
    "/contact",
    MAGNET_FUNNEL_LANDING_PATH,
    "/get-started",
    "/tools/georgia-list-fit",
    "/blog",
    "/blog/pacing-mistakes-that-cost-points",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/support-policy"
  ];

  return staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === MAGNET_FUNNEL_LANDING_PATH || route.startsWith("/blog")
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === MAGNET_FUNNEL_LANDING_PATH
          ? 0.9
          : 0.8
  }));
}
