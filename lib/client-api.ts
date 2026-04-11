"use client";

const base = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function clientFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const hasBody = rest.body != null && rest.body !== "";
  const res = await fetch(`${base()}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
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
