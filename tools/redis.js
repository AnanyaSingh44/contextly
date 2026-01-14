import "dotenv/config";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* Fetch last N messages */
export async function getChatHistory(sessionId) {
  const data = await redis.lrange(`chat:${sessionId}`, 0, -1);

  return data
    .map((item) => {
      try {
        // if it's a stringified JSON, parse it
        if (typeof item === "string") return JSON.parse(item);

        // if Upstash already returned an object
        return item;
      } catch {
        // corrupted value like "[object Object]"
        return null;
      }
    })
    .filter(Boolean); // remove nulls
}

/* Save one turn */
export async function saveChatTurn(sessionId, role, content) {
  await redis.rpush(
    `chat:${sessionId}`,
    JSON.stringify({ role, content })
  );

  // keep only last 10 messages
  await redis.ltrim(`chat:${sessionId}`, -10, -1);
}
