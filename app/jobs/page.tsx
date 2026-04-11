import { ListingCard } from "@/components/listing-card";
import { apiGetListings } from "@/lib/api";
import type { Listing } from "@/lib/types";

const LAT = 37.7749;
const LNG = -122.4194;

export default async function JobsPage() {
  let items: Listing[] = [];
  try {
    items = await apiGetListings({
      type: "JOB",
      lat: LAT,
      lng: LNG,
      radiusKm: 120,
      take: 24,
    });
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Work
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Jobs</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Structured listings with salary ranges and requirements stored in
          flexible metadata.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}
