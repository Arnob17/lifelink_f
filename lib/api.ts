import type { Listing } from "./types";

const base = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGetListings(
  search: Record<string, string | number | undefined>,
): Promise<Listing[]> {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(search)) {
    if (v === undefined || v === "") continue;
    q.set(k, String(v));
  }
  return apiGet<Listing[]>(`/listings?${q.toString()}`);
}

export async function apiGetListing(id: string): Promise<Listing> {
  return apiGet<Listing>(`/listings/${id}`, { next: { revalidate: 60 } });
}

export async function apiGetMarkers(params: {
  lat: number;
  lng: number;
  radiusKm?: number;
}) {
  const q = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    radiusKm: String(params.radiusKm ?? 35),
  });
  return apiGet<
    Array<{
      id: string;
      type: Listing["type"];
      title: string;
      lat: number;
      lng: number;
      color: string;
      distanceKm: number | null;
    }>
  >(`/map/markers?${q.toString()}`);
}

export async function apiBloodSearch(params: {
  lat: number;
  lng: number;
  bloodGroup?: string;
  radiusKm?: number;
}) {
  const q = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    radiusKm: String(params.radiusKm ?? 25),
  });
  if (params.bloodGroup) q.set("bloodGroup", params.bloodGroup);
  return apiGet<{ donors: Listing[]; banks: Listing[] }>(
    `/blood/search?${q.toString()}`,
  );
}
