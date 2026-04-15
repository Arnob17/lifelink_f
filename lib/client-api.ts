"use client";

import { getPublicApiBaseUrl } from "@/lib/api-base";
import { LIFELINK_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";

/**
 * Browser: same-origin `/ll-backend/...` (see `next.config.ts` rewrites) so JWT
 * is not sent cross-origin. Server / tests: absolute `NEXT_PUBLIC_API_URL` base.
 * Set `NEXT_PUBLIC_API_DIRECT=1` to force direct API URL in the browser.
 */
function resolveRequestUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_API_DIRECT !== "1"
  ) {
    return `${window.location.origin}/ll-backend${p}`;
  }
  return `${getPublicApiBaseUrl()}${p}`;
}

function resolveBearerToken(explicit?: string | null): string | null {
  const t = explicit?.trim();
  if (t) return t;
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LIFELINK_TOKEN_STORAGE_KEY)?.trim() ?? null;
}

export async function clientFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const bearer = resolveBearerToken(token);
  const hasBody = rest.body != null && rest.body !== "";
  const mergedHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  };
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      if (value != null && value !== "") mergedHeaders[key] = value;
    });
  } else if (headers && typeof headers === "object") {
    for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
      if (v != null && v !== "") mergedHeaders[k] = String(v);
    }
  }
  if (bearer) mergedHeaders.Authorization = `Bearer ${bearer}`;

  const res = await fetch(resolveRequestUrl(path), {
    ...rest,
    headers: mergedHeaders,
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.message)
          ? body.message.join(", ")
          : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body as T;
}
