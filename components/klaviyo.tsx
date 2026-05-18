import Script from "next/script";

export function KlaviyoScript() {
  const companyId = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY;
  if (!companyId) {
    return null;
  }

  return (
    <Script
      id="klaviyo-onsite"
      src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${companyId}`}
      strategy="afterInteractive"
    />
  );
}
