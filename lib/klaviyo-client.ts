const KLAVIYO_REVISION = "2024-10-15";

export type KlaviyoSubscribeOptions = {
  email: string;
  customSource: string;
  /** Optional profile properties (magnet slug, intake stage, etc.) */
  properties?: Record<string, string>;
};

export async function subscribeToKlaviyo({
  email,
  customSource,
  properties = {}
}: KlaviyoSubscribeOptions) {
  const companyId = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY;
  if (!companyId) {
    throw new Error("Newsletter is not configured yet.");
  }

  const listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
  const profileAttributes: Record<string, string> = { email, ...properties };

  const payload: Record<string, unknown> = {
    data: {
      type: "subscription",
      attributes: {
        custom_source: customSource,
        profile: {
          data: {
            type: "profile",
            attributes: profileAttributes
          }
        }
      },
      ...(listId
        ? {
            relationships: {
              list: {
                data: { type: "list", id: listId }
              }
            }
          }
        : {})
    }
  };

  const response = await fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(companyId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        revision: KLAVIYO_REVISION
      },
      body: JSON.stringify(payload)
    }
  );

  if (response.status !== 202) {
    throw new Error("Could not subscribe. Please try again later.");
  }
}
