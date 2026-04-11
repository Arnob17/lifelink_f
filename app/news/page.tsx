import { ListingCard } from "@/components/listing-card";
import { apiGetListings } from "@/lib/api";
import type { Listing } from "@/lib/types";

const LAT = 37.7749;
const LNG = -122.4194;

export default async function NewsPage() {
  let items: Listing[] = [];
  try {
    items = await apiGetListings({
      type: "NEWS",
      lat: LAT,
      lng: LNG,
      radiusKm: 200,
      take: 24,
    });
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Civic desk
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">News desk</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Headline-style stories published as NEWS listings — same engine as
          every other service on LifeLink.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}
