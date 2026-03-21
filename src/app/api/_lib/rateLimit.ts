type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp || "unknown";
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  options: RateLimitOptions,
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const key = `${scope}:${clientIp}`;

  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return { ok: true };
  }

  if (current.count >= options.maxRequests) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    return { ok: false, retryAfterSeconds };
  }

  current.count += 1;
  buckets.set(key, current);

  return { ok: true };
}