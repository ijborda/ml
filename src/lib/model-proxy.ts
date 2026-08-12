import { RateLimiterMemory } from "rate-limiter-flexible";

import type { ModelDefinition } from "@/projects";

const mlApiUrl = process.env.ML_API_URL ?? "http://localhost:8000";
const windowSeconds = Number(process.env.API_LIMIT_WINDOW_SECONDS ?? "60");
const maxRequests = Number(process.env.API_LIMIT_MAX_REQUESTS ?? "10");

export const rateLimiter = new RateLimiterMemory({
  points: maxRequests,
  duration: windowSeconds,
  blockDuration: 60,
});

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export async function enforceRateLimit(ip: string) {
  try {
    await rateLimiter.consume(ip);
    return null;
  } catch {
    return {
      error: "Too many requests.",
      retryAfterSeconds: Math.max(windowSeconds, 1),
    };
  }
}

export async function proxyModelRequest(model: ModelDefinition, body: BodyInit, headers: HeadersInit = {}) {
  const response = await fetch(`${mlApiUrl}${model.apiPath}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...headers,
    },
    body,
  });

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
