interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_SIZE_MS = 60 * 1000;

function cleanupOldEntries() {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now - entry.windowStart > WINDOW_SIZE_MS * 2) {
      rateLimitStore.delete(key);
    }
  });
}

setInterval(cleanupOldEntries, 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart >= WINDOW_SIZE_MS) {
    rateLimitStore.set(identifier, {
      count: 1,
      windowStart: now,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: 60,
    };
  }

  if (entry.count >= maxRequests) {
    const resetInSeconds = Math.ceil((WINDOW_SIZE_MS - (now - entry.windowStart)) / 1000);

    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  entry.count += 1;

  const resetInSeconds = Math.ceil((WINDOW_SIZE_MS - (now - entry.windowStart)) / 1000);

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSeconds,
  };
}

export function checkUserRateLimit(userId: string): RateLimitResult {
  return checkRateLimit(`user:${userId}`, 20);
}

export function checkIpRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(`ip:${ip}`, 5);
}
