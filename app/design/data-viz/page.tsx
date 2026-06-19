import { notFound } from "next/navigation";
import Link from "next/link";
import { DataVizGallery } from "./gallery";
import "./data-viz.css";

export const metadata = {
  title: "Data viz gallery · Visx · Illuminairy",
  robots: { index: false, follow: false },
};

/** Preview only — blocked on Vercel production deploys (not local dev). */
function isVercelProductionDeploy() {
  return process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
}

export default function DataVizDesignPage() {
  if (isVercelProductionDeploy()) {
    notFound();
  }

  return (
    <>
      <nav className="dv-gallery__nav">
        <Link href="/">← Site</Link>
        <span style={{ fontSize: 13, color: "var(--aurora-muted)" }}>
          /design/data-viz · local & preview
        </span>
      </nav>
      <DataVizGallery />
    </>
  );
}
