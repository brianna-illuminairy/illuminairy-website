import { IntegrationsPanel } from "@/components/admin/integrations-panel";
import { listGoogleTokens } from "@/lib/integrations/google/tokens";
import { getLatestHeartbeats } from "@/lib/integrations/heartbeat";

export const metadata = {
  title: "Integrations",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    connected?: string;
    error?: string;
    detail?: string;
    missing_scopes?: string;
  }>;
};

export default async function AdminIntegrationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [googleTokens, heartbeats] = await Promise.all([
    listGoogleTokens(),
    getLatestHeartbeats()
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Google Workspace and Calendly power the CRM call intelligence layer:
          attendance detection, Gmail sync, transcripts, and post-call summaries.
        </p>
      </header>

      <IntegrationsPanel
        googleTokens={googleTokens}
        heartbeats={heartbeats}
        flash={{
          connected: params.connected,
          error: params.error,
          detail: params.detail,
          missingScopes: params.missing_scopes
        }}
      />
    </div>
  );
}
