import { HeroBlood } from "@/components/home/hero-blood";
import { SectionHeading } from "@/components/home/section-heading";
import { FutureAiPanel } from "@/components/home/future-ai-panel";
import { ListingCard } from "@/components/listing-card";
import { MapPreview } from "@/components/map/map-preview";
import { apiGetListings, apiGetMarkers } from "@/lib/api";
import type { Listing } from "@/lib/types";

const DEMO_LAT = 37.7749;
const DEMO_LNG = -122.4194;

async function safeListings(
  params: Record<string, string | number | undefined>,
): Promise<Listing[]> {
  try {
    return await apiGetListings(params);
  } catch {
    return [];
  }
}

async function safeMarkers() {
  try {
    return await apiGetMarkers({
      lat: DEMO_LAT,
      lng: DEMO_LNG,
      radiusKm: 35,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [news, jobs, clinics, pharmacies, teachers, markers] =
    await Promise.all([
      safeListings({ type: "NEWS", lat: DEMO_LAT, lng: DEMO_LNG, radiusKm: 80, take: 4 }),
      safeListings({ type: "JOB", lat: DEMO_LAT, lng: DEMO_LNG, radiusKm: 80, take: 4 }),
      safeListings({
        type: "CLINIC",
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        radiusKm: 80,
        take: 4,
      }),
      safeListings({
        type: "PHARMACY",
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        radiusKm: 80,
        take: 4,
      }),
      safeListings({
        type: "TEACHER",
        lat: DEMO_LAT,
        lng: DEMO_LNG,
        radiusKm: 80,
        take: 4,
      }),
      safeMarkers(),
    ]);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 lg:py-14">
      <HeroBlood />

      <section>
        <SectionHeading
          kicker="Front page"
          title="Top news"
          subtitle="Headline-style briefs from trusted civic publishers on LifeLink."
          href="/news"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {news.length === 0 && (
            <p className="text-sm text-zinc-500">
              Start the API and seed the database to see live headlines here.
            </p>
          )}
          {news.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          kicker="Geo layer"
          title="Nearby services"
          subtitle="OpenStreetMap with Leaflet — markers colored by service type."
          href="/map"
          actionLabel="Open full map"
        />
        <MapPreview lat={DEMO_LAT} lng={DEMO_LNG} markers={markers} />
      </section>

      <section>
        <SectionHeading
          kicker="Work"
          title="Jobs worth a look"
          subtitle="Healthcare, logistics, and community roles posted by business accounts."
          href="/jobs"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            kicker="Care"
            title="Clinics"
            subtitle="Primary and urgent care listings with contact paths for patients."
            href="/clinics"
          />
          <div className="grid gap-4">
            {clinics.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeading
            kicker="Care"
            title="Pharmacies"
            subtitle="Prescriptions, vaccines, and delivery-aware neighborhood pharmacies."
            href="/pharmacies"
          />
          <div className="grid gap-4">
            {pharmacies.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          kicker="Learning"
          title="Teachers"
          subtitle="Subject experts and cohort instructors represented as structured listings."
          href="/teachers"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {teachers.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <FutureAiPanel />
    </div>
  );
}
