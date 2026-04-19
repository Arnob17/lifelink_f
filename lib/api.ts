import type { Listing, UserFeedPost, Product, ProductBrowseResult, CategoryCount } from "./types";
import { getPublicApiBaseUrl } from "./api-base";

const base = () => getPublicApiBaseUrl();

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

export async function apiGetFeedPosts(params?: {
  take?: number;
  skip?: number;
}): Promise<UserFeedPost[]> {
  const q = new URLSearchParams();
  if (params?.take != null) q.set("take", String(params.take));
  if (params?.skip != null) q.set("skip", String(params.skip));
  const suffix = q.toString() ? `?${q}` : "";
  return apiGet<UserFeedPost[]>(`/posts${suffix}`);
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

// ─── Essential Things (E-Commerce) ─────────────────────────────

export async function apiGetProducts(
  search: Record<string, string | number | undefined>,
): Promise<ProductBrowseResult> {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(search)) {
    if (v === undefined || v === "") continue;
    q.set(k, String(v));
  }
  return apiGet<ProductBrowseResult>(`/products?${q.toString()}`);
}

export async function apiGetProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}`, { next: { revalidate: 60 } });
}

export async function apiGetProductCategories(): Promise<CategoryCount[]> {
  return apiGet<CategoryCount[]>("/products/categories");
}
