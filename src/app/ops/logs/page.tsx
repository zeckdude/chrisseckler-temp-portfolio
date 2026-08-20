import OpsLogsClient from "@/components/ops/ops-logs-client";
import { getConversationLogs } from "@/lib/conversation-logger";

export default async function OpsLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; id?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.q ?? "";
  const openId = params.id ?? null;

  const { logs, total } = await getConversationLogs({ page, pageSize: 25, search });

  return (
    <OpsLogsClient
      initialLogs={logs}
      total={total}
      initialPage={page}
      initialSearch={search}
      initialOpenId={openId}
    />
  );
}
