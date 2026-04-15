import type { NextConfig } from "next";

/**
 * Same-origin `/ll-backend/*` → Nest `/api/*` so the browser always talks to Next
 * and `Authorization: Bearer …` is not subject to cross-origin quirks.
 * Set `BACKEND_INTERNAL_URL` in production (e.g. `https://api.example.com`).
 */
const nextConfig: NextConfig = {
  async rewrites() {
    const backend = (process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:4000").replace(
      /\/+$/,
      "",
    );
    return [
      {
        source: "/ll-backend/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
