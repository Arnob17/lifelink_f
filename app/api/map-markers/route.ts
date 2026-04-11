import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");
  const radiusKm = req.nextUrl.searchParams.get("radiusKm") ?? "35";
  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  const url = `${base}/map/markers?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radiusKm=${encodeURIComponent(radiusKm)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return NextResponse.json([]);
    }
    const data = (await res.json()) as unknown;
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}
