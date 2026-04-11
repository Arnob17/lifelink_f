"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapMarker } from "@/components/map/map-view";

const MapView = dynamic(
  () => import("@/components/map/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[560px] w-full rounded-2xl" />,
  },
);

export function MapPageClient({
  lat,
  lng,
  markers,
}: {
  lat: number;
  lng: number;
  markers: MapMarker[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-sm dark:border-zinc-800">
      <MapView lat={lat} lng={lng} zoom={12} markers={markers} height={560} />
    </div>
  );
}
