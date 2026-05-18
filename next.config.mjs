/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";
    const region = host.includes("eu") ? "eu" : "us";
    const ingest = `https://${region}.i.posthog.com`;
    const assets = `https://${region}-assets.i.posthog.com`;

    return [
      {
        source: "/ia/static/:path*",
        destination: `${assets}/static/:path*`
      },
      {
        source: "/ia/array/:path*",
        destination: `${assets}/array/:path*`
      },
      {
        source: "/ia/:path*",
        destination: `${ingest}/:path*`
      }
    ];
  }
};

export default nextConfig;
