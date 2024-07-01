import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const standardRateLimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(20, "60 s"), // Allow 20 requests per minute
	analytics: true,
	prefix: "@upstash/ratelimit/standard",
});

export const reportRateLimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, "5 m"), // Allow 5 requests per 5 minutes
	analytics: true,
	prefix: "@upstash/ratelimit/report",
});

export const readRateLimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(50, "60 s"), // Allow 50 requests per minute
	analytics: true,
	prefix: "@upstash/ratelimit/read",
});
