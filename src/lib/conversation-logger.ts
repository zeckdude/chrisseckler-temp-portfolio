import { getRedis, rk } from "./redis";
import { getVectorIndex } from "./vector";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationLog {
  id: string;
  sessionId: string;
  startedAt: string;    // ISO timestamp
  endedAt: string;      // ISO timestamp  
  messages: ConversationMessage[];
  turnCount: number;    // user turn count
  ip: string;
  tokenCount: number;
  env: "dev" | "prod";
  // Optional enrichments
  bookmarked?: boolean;
  note?: string;
}

/** Minimum number of user turns required before a conversation is logged. */
const MIN_USER_TURNS = 2;

/**
 * Logs a completed conversation to Redis (raw storage) and Upstash Vector (for RAG).
 * Only logs conversations with >= MIN_USER_TURNS user turns.
 * Fire-and-forget — does not throw; errors are swallowed to avoid blocking responses.
 */
export async function logConversation(params: {
  sessionId: string;
  messages: ConversationMessage[];
  ip: string;
  tokenCount: number;
  startedAt: Date;
}): Promise<void> {
  const userTurns = params.messages.filter((m) => m.role === "user").length;
  if (userTurns < MIN_USER_TURNS) return;

  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const id = `${env}:${Date.now()}:${params.sessionId}`;
  const now = new Date().toISOString();

  const log: ConversationLog = {
    id,
    sessionId: params.sessionId,
    startedAt: params.startedAt.toISOString(),
    endedAt: now,
    messages: params.messages,
    turnCount: userTurns,
    ip: params.ip,
    tokenCount: params.tokenCount,
    env,
    bookmarked: false,
  };

  try {
    const redis = getRedis();

    // Store the raw log
    const logKey = rk("conversations", id);
    await redis.set(logKey, JSON.stringify(log));

    // Add to sorted set for time-based retrieval (score = unix timestamp ms)
    await redis.zadd(rk("conversations:index"), {
      score: Date.now(),
      member: id,
    });

    // Increment total conversation counter
    await redis.incr(rk("conversations:total"));

    // Try to store vector embedding for RAG
    await embedAndStoreConversation(id, log);
  } catch {
    // Non-fatal — never block the chat response
  }
}

/**
 * Build a plain-text summary of a conversation for embedding.
 */
function conversationToText(log: ConversationLog): string {
  const lines: string[] = [
    `Conversation on ${log.startedAt}`,
    `Turns: ${log.turnCount}`,
    "",
  ];
  for (const msg of log.messages) {
    const prefix = msg.role === "user" ? "Visitor:" : "Assistant:";
    lines.push(`${prefix} ${msg.content}`);
  }
  return lines.join("\n");
}

async function embedAndStoreConversation(id: string, log: ConversationLog): Promise<void> {
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) return;

  try {
    const text = conversationToText(log);
    const vectorIndex = getVectorIndex();

    // Use Upstash Vector's built-in embedding — pass `data` (text) and let
    // Upstash handle embedding server-side. The index must be created with an
    // embedding model in the Upstash console (e.g. "text-embedding-3-small").
    await (vectorIndex as unknown as {
      upsert: (items: {
        id: string;
        data: string;
        metadata: Record<string, unknown>;
      }[]) => Promise<unknown>;
    }).upsert([{
      id,
      data: text,
      metadata: {
        id,
        sessionId: log.sessionId,
        startedAt: log.startedAt,
        endedAt: log.endedAt,
        turnCount: log.turnCount,
        env: log.env,
        firstMessage: log.messages.find((m) => m.role === "user")?.content?.slice(0, 200) ?? "",
      },
    }]);
  } catch {
    // Embedding is optional — if Vector isn't configured, skip silently
  }
}

/**
 * Fetch all conversation logs from Redis (newest first, paginated).
 */
export async function getConversationLogs(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{ logs: ConversationLog[]; total: number }> {
  const { page = 1, pageSize = 25 } = params;
  const redis = getRedis();

  const total = await redis.zcard(rk("conversations:index"));
  if (total === 0) return { logs: [], total: 0 };

  // Get IDs sorted by score descending (newest first), paginated
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const ids = await redis.zrange(rk("conversations:index"), start, end, { rev: true });

  if (!ids.length) return { logs: [], total };

  // Fetch each log
  const rawLogs = await Promise.all(
    ids.map((id) => redis.get<string>(rk("conversations", id as string))),
  );

  let logs = rawLogs
    .filter((r): r is string => r !== null)
    .map((r) => JSON.parse(r) as ConversationLog);

  // Client-side search filter (simple substring match across all messages)
  if (params.search) {
    const q = params.search.toLowerCase();
    logs = logs.filter((log) =>
      log.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }

  return { logs, total };
}

/**
 * Get a single conversation log by ID.
 */
export async function getConversationById(id: string): Promise<ConversationLog | null> {
  try {
    const redis = getRedis();
    const raw = await redis.get<string>(rk("conversations", id));
    if (!raw) return null;
    return JSON.parse(raw) as ConversationLog;
  } catch {
    return null;
  }
}

/**
 * Toggle bookmark on a conversation.
 */
export async function toggleBookmark(id: string): Promise<boolean> {
  const redis = getRedis();
  const raw = await redis.get<string>(rk("conversations", id));
  if (!raw) return false;
  const log = JSON.parse(raw) as ConversationLog;
  log.bookmarked = !log.bookmarked;
  await redis.set(rk("conversations", id), JSON.stringify(log));
  return log.bookmarked;
}

/**
 * Save a personal note on a conversation.
 */
export async function saveNote(id: string, note: string): Promise<void> {
  const redis = getRedis();
  const raw = await redis.get<string>(rk("conversations", id));
  if (!raw) return;
  const log = JSON.parse(raw) as ConversationLog;
  log.note = note;
  await redis.set(rk("conversations", id), JSON.stringify(log));
}
