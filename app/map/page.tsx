import { MapPageClient } from "@/components/map/map-page-client";
import { apiGetMarkers } from "@/lib/api";

const DEMO_LAT = 37.7749;
const DEMO_LNG = -122.4194;

export default async function MapPage() {
  let markers: Awaited<ReturnType<typeof apiGetMarkers>> = [];
  let markersLoadFailed = false;
  try {
    markers = await apiGetMarkers({
      lat: DEMO_LAT,
      lng: DEMO_LNG,
      radiusKm: 80,
    });
  } catch {
    markers = [];
    markersLoadFailed = true;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      {markersLoadFailed && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">Could not load map markers</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-100/90">
            Start the API and apply the database schema + seed from{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/50">
              lifelink_b
            </code>
            :{" "}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/50">
              npm run db:setup
            </code>{" "}
            then restart the API.
          </p>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Live layer
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">City map</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Markers are tinted by category: red for blood, blue for clinics, green
          for pharmacies. Click a marker to open a compact detail card with a
          deep link.
        </p>
      </div>
      <MapPageClient lat={DEMO_LAT} lng={DEMO_LNG} markers={markers} />
    </div>
  );
}
