"use client";

import { useEffect, useState } from "react";
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
  lat: initialLat,
  lng: initialLng,
  markers: initialMarkers,
  radiusKm = 80,
}: {
  lat: number;
  lng: number;
  markers: MapMarker[];
  radiusKm?: number;
}) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers);
  const [note, setNote] = useState("ডেমো কেন্দ্র: ঢাকা। অবস্থান অনুমতি দিলে আপনার এলাকায় সরব।");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/map-markers?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}&radiusKm=${radiusKm}`,
        );
        const data = (await res.json()) as MapMarker[];
        if (!cancelled) setMarkers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMarkers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, radiusKm]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setNote("আপনার বর্তমান অবস্থানের চারপাশে মার্কার দেখানো হচ্ছে।");
      },
      () => {
        setNote("অবস্থান পাওয়া যায়নি, তাই ঢাকা কেন্দ্রিক মানচিত্র দেখাচ্ছি।");
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{note}</p>
      <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
        <MapView lat={lat} lng={lng} zoom={12} markers={markers} height={560} />
      </div>
    </div>
  );
}
