import { makeStubHandler } from "../_stub";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = makeStubHandler("lead-score-decay");

export { handler as GET, handler as POST };
