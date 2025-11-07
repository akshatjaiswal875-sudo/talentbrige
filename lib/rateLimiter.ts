
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashFetch(command: string[], method: string = "POST") {
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
        throw new Error("Upstash Redis REST credentials are not set.");
    }
    const res = await fetch(UPSTASH_REDIS_REST_URL, {
        method,
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });
    if (!res.ok) throw new Error(`Upstash error: ${res.status}`);
    return res.json();
}

/**
 * Rate limiting using a sliding window based on Upstash Redis sorted sets (Edge compatible).
 * @param key Unique key to identify the client (e.g., IP address)
 * @param limit Max number of requests allowed within the time window
 * @param windowSec Time window in seconds
 * @returns `true` if allowed, `false` if rate limit exceeded
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
    const nowMs = Date.now();
    const windowStartMs = nowMs - windowSec * 1000;
    const k = `rl:${key}`;
    try {
        // Remove old entries
        await upstashFetch(["ZREMRANGEBYSCORE", k, "0", windowStartMs.toString()]);
        // Count current requests
        const zcardRes = await upstashFetch(["ZCARD", k]);
        const requestCount = Number(zcardRes.result ?? 0);
        if (requestCount >= limit) return false;
        // Add new request
        const member = `${nowMs}-${Math.random().toString(36).slice(2, 8)}`;
        await upstashFetch(["ZADD", k, nowMs.toString(), member]);
        // Set expiry
        await upstashFetch(["EXPIRE", k, windowSec.toString()]);
        return true;
    } catch (error) {
        console.error("Rate limiting error:", error);
        return true; // Fail open
    }
}

/**
 * Global rate limiting for S3 APIs to prevent abuse across all users.
 * Uses a single Redis key to track all requests globally.
 * @param apiName Name of the API (e.g., 's3', 's3url')
 * @param limit Max number of requests allowed globally within the time window
 * @param windowSec Time window in seconds
 * @returns `true` if allowed, `false` if global rate limit exceeded
 */
export async function globalRateLimit(apiName: string, limit: number, windowSec: number): Promise<boolean> {
    const nowMs = Date.now();
    const windowStartMs = nowMs - windowSec * 1000;
    const k = `rl:global:${apiName}`;
    try {
        // Remove old entries
        await upstashFetch(["ZREMRANGEBYSCORE", k, "0", windowStartMs.toString()]);
        // Count current requests
        const zcardRes = await upstashFetch(["ZCARD", k]);
        const requestCount = Number(zcardRes.result ?? 0);
        if (requestCount >= limit) {
            console.warn(`Global rate limit exceeded for ${apiName}. Current: ${requestCount}, Limit: ${limit}`);
            return false;
        }
        // Add new request
        const member = `${nowMs}-${Math.random().toString(36).slice(2, 8)}`;
        await upstashFetch(["ZADD", k, nowMs.toString(), member]);
        // Set expiry
        await upstashFetch(["EXPIRE", k, windowSec.toString()]);
        return true;
    } catch (error) {
        console.error("Global rate limiting error:", error);
        return true; // Fail open
    }
}