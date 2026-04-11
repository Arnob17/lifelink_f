"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapView = dynamic(
  () => import("@/components/map/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full rounded-2xl" />,
  },
);

export function MapPreview({
  lat,
  lng,
  markers,
}: {
  lat: number;
  lng: number;
  markers: Array<{
    id: string;
    lat: number;
    lng: number;
    color: string;
    title: string;
    type: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
      <MapView lat={lat} lng={lng} zoom={12} markers={markers} height={320} />
    </div>
  );
}
