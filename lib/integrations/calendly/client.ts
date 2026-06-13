/**
 * Typed Calendly API client. Uses CALENDLY_API_TOKEN (Personal Access Token,
 * Calendly account: brianna@illuminairy.com).
 *
 * Endpoints used by CRM v4:
 *   - GET  /users/me                                         (auth probe)
 *   - GET  /webhook_subscriptions                            (list)
 *   - POST /webhook_subscriptions                            (create)
 *   - DELETE /webhook_subscriptions/:id                      (remove)
 *   - GET  /scheduled_events                                 (history)
 *   - GET  /scheduled_events/:uuid/invitees                  (per-event)
 *   - POST /invitee_no_shows                                 (mark no-show)
 *   - DELETE /invitee_no_shows/:uuid                         (undo no-show)
 */

const BASE = "https://api.calendly.com";

export type CalendlyResource<T> = { resource: T };
export type CalendlyCollection<T> = {
  collection: T[];
  pagination?: { count: number; next_page?: string | null };
};

export type CalendlyUser = {
  uri: string;
  email: string;
  name: string;
  current_organization: string;
  timezone?: string;
  scheduling_url?: string;
};

export type CalendlyWebhookSubscription = {
  uri: string;
  callback_url: string;
  events: string[];
  state: "active" | "disabled";
  organization?: string;
  user?: string;
  scope: "organization" | "user";
  signing_key?: string;
  created_at: string;
  updated_at: string;
};

export type CalendlyScheduledEvent = {
  uri: string;
  name: string;
  status: "active" | "canceled";
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type?: string;
    location?: string;
    join_url?: string;
    data?: Record<string, unknown>;
  };
  invitees_counter?: { active: number; limit: number; total: number };
  meeting_notes_html?: string;
  /**
   * The underlying Google/Outlook calendar event Calendly created. For Google
   * bookings the real meet.google.com URL lives on this Calendar event, not on
   * Calendly's redirector `location.join_url`. Use `external_id` to look it up
   * via the Calendar API.
   */
  calendar_event?: { external_id?: string; kind?: string };
  created_at: string;
  updated_at: string;
};

export type CalendlyInvitee = {
  uri: string;
  email: string;
  name: string;
  status: "active" | "canceled";
  timezone?: string;
  rescheduled?: boolean;
  cancellation?: {
    canceled_by: string;
    reason?: string;
    canceler_type?: string;
  };
  no_show?: { uri: string } | null;
  tracking?: Record<string, string | null>;
};

export type CalendlyNoShow = {
  uri: string;
  invitee: string;
  created_at: string;
};

export class CalendlyApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`calendly_api_${status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
    this.status = status;
    this.body = body;
  }
}

export class CalendlyClient {
  private token: string;
  constructor(token?: string) {
    const t = token ?? process.env.CALENDLY_API_TOKEN;
    if (!t) throw new Error("CALENDLY_API_TOKEN is not set");
    this.token = t;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      }
    });
    const text = await res.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    if (!res.ok) {
      throw new CalendlyApiError(res.status, body);
    }
    return body as T;
  }

  async me(): Promise<CalendlyUser> {
    const r = await this.request<CalendlyResource<CalendlyUser>>("/users/me");
    return r.resource;
  }

  async listWebhooks(organizationUri: string): Promise<CalendlyWebhookSubscription[]> {
    const params = new URLSearchParams({ organization: organizationUri, scope: "organization" });
    const r = await this.request<CalendlyCollection<CalendlyWebhookSubscription>>(
      `/webhook_subscriptions?${params.toString()}`
    );
    return r.collection;
  }

  async createWebhook(args: {
    organizationUri: string;
    callbackUrl: string;
    events: string[];
    signingKey: string;
  }): Promise<CalendlyWebhookSubscription> {
    const r = await this.request<CalendlyResource<CalendlyWebhookSubscription>>(
      "/webhook_subscriptions",
      {
        method: "POST",
        body: JSON.stringify({
          url: args.callbackUrl,
          events: args.events,
          organization: args.organizationUri,
          scope: "organization",
          signing_key: args.signingKey
        })
      }
    );
    return r.resource;
  }

  async deleteWebhook(uri: string): Promise<void> {
    const id = uri.split("/").pop();
    if (!id) throw new Error(`bad webhook uri: ${uri}`);
    await this.request(`/webhook_subscriptions/${id}`, { method: "DELETE" });
  }

  async listScheduledEvents(args: {
    organizationUri: string;
    minStartTime?: string;
    maxStartTime?: string;
    status?: "active" | "canceled";
    count?: number;
  }): Promise<CalendlyScheduledEvent[]> {
    const params = new URLSearchParams({ organization: args.organizationUri });
    if (args.minStartTime) params.set("min_start_time", args.minStartTime);
    if (args.maxStartTime) params.set("max_start_time", args.maxStartTime);
    if (args.status) params.set("status", args.status);
    if (args.count) params.set("count", String(args.count));
    const r = await this.request<CalendlyCollection<CalendlyScheduledEvent>>(
      `/scheduled_events?${params.toString()}`
    );
    return r.collection;
  }

  async getScheduledEvent(uri: string): Promise<CalendlyScheduledEvent> {
    const id = uri.split("/").pop();
    if (!id) throw new Error(`bad event uri: ${uri}`);
    const r = await this.request<CalendlyResource<CalendlyScheduledEvent>>(`/scheduled_events/${id}`);
    return r.resource;
  }

  async listInvitees(eventUri: string): Promise<CalendlyInvitee[]> {
    const id = eventUri.split("/").pop();
    if (!id) throw new Error(`bad event uri: ${eventUri}`);
    const r = await this.request<CalendlyCollection<CalendlyInvitee>>(
      `/scheduled_events/${id}/invitees`
    );
    return r.collection;
  }

  async markNoShow(inviteeUri: string): Promise<CalendlyNoShow> {
    const r = await this.request<CalendlyResource<CalendlyNoShow>>("/invitee_no_shows", {
      method: "POST",
      body: JSON.stringify({ invitee: inviteeUri })
    });
    return r.resource;
  }

  async undoNoShow(noShowUri: string): Promise<void> {
    const id = noShowUri.split("/").pop();
    if (!id) throw new Error(`bad no_show uri: ${noShowUri}`);
    await this.request(`/invitee_no_shows/${id}`, { method: "DELETE" });
  }
}

export function getCalendlyClient(): CalendlyClient {
  return new CalendlyClient();
}
