import { HeroBlood } from "@/components/home/hero-blood";
import { NewspaperFrontPage } from "@/components/home/newspaper-front-page";
import { apiGetListings, apiBloodSearch, apiGetMarkers, apiGetFeedPosts } from "@/lib/api";
import { fetchExternalNews } from "@/lib/external-news";
import type { Listing } from "@/lib/types";

const BD_LAT = 23.810331;
const BD_LNG = 90.412521;

async function safeListings(
  params: Record<string, string | number | undefined>,
): Promise<Listing[]> {
  try {
    return await apiGetListings(params);
  } catch {
    return [];
  }
}

async function safeMarkers(lat: number, lng: number) {
  try {
    return await apiGetMarkers({ lat, lng, radiusKm: 40 });
  } catch {
    return [];
  }
}

async function safeFeedPosts() {
  try {
    return await apiGetFeedPosts({ take: 40 });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [
    externalNews,
    userPosts,
    news,
    jobs,
    clinics,
    pharmacies,
    teachers,
    blood,
    initialMapMarkers,
  ] = await Promise.all([
    fetchExternalNews(14).catch(() => []),
    safeFeedPosts(),
    safeListings({ type: "NEWS", lat: BD_LAT, lng: BD_LNG, radiusKm: 200, take: 6 }),
    safeListings({ type: "JOB", lat: BD_LAT, lng: BD_LNG, radiusKm: 120, take: 8 }),
    safeListings({
      type: "CLINIC",
      lat: BD_LAT,
      lng: BD_LNG,
      radiusKm: 120,
      take: 6,
    }),
    safeListings({
      type: "PHARMACY",
      lat: BD_LAT,
      lng: BD_LNG,
      radiusKm: 120,
      take: 6,
    }),
    safeListings({
      type: "TEACHER",
      lat: BD_LAT,
      lng: BD_LNG,
      radiusKm: 120,
      take: 8,
    }),
    apiBloodSearch({ lat: BD_LAT, lng: BD_LNG, radiusKm: 45 }).catch(() => ({
      donors: [] as Listing[],
      banks: [] as Listing[],
    })),
    safeMarkers(BD_LAT, BD_LNG),
  ]);

  return (
    <div className="mx-auto w-full max-w-[min(100%,100rem)] space-y-12 px-4 py-10 sm:px-6 lg:space-y-14 lg:py-14">
      <HeroBlood />
      <NewspaperFrontPage
        externalNews={externalNews}
        userPosts={userPosts}
        news={news}
        jobs={jobs}
        clinics={clinics}
        pharmacies={pharmacies}
        teachers={teachers}
        donors={blood.donors}
        banks={blood.banks}
        initialMapMarkers={initialMapMarkers}
      />
    </div>
  );
}
