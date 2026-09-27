/**
 * Helper wrapper for Next.js API route handlers — adds rate limiting + headers.
 *
 * Usage:
 *   export const POST = withRateLimit(async (req) => {
 *     return NextResponse.json({ ... });
 *   });
 */

import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIdentifier,
  isValidApiKey,
  rateLimitHeaders,
  rateLimitResponse,
} from "./rate-limit";

type Handler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

export function withRateLimit(handler: Handler, options?: { skip?: boolean }): Handler {
  return async (req: NextRequest) => {
    if (options?.skip) return handler(req);

    const id = getClientIdentifier(req);
    const hasKey = isValidApiKey(req);
    const rl = checkRateLimit(id, hasKey);

    if (!rl.allowed) {
      return rateLimitResponse(rl);
    }

    const res = await handler(req);
    // Attach rate-limit headers to successful responses
    const headers = rateLimitHeaders(rl);
    for (const [k, v] of Object.entries(headers)) {
      res.headers.set(k, v);
    }
    return res;
  };
}