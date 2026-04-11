"use client";

import { useEffect, useState } from "react";
import { MapPreview } from "@/components/map/map-preview";

const DHAKA_LAT = 23.810331;
const DHAKA_LNG = 90.412521;

type Marker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  type: string;
};

export function LocationMapPreview({ initialMarkers = [] }: { initialMarkers?: Marker[] }) {
  const [lat, setLat] = useState(DHAKA_LAT);
  const [lng, setLng] = useState(DHAKA_LNG);
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [caption, setCaption] = useState("মানচিত্র: ঢাকা কেন্দ্রিক (অবস্থান অনুমতি দিলে আপনার এলাকায় সরে যাবে)।");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/map-markers?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}&radiusKm=40`,
        );
        const data = (await res.json()) as Marker[];
        if (!cancelled) setMarkers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMarkers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude;
        const ln = pos.coords.longitude;
        setLat(la);
        setLng(ln);
        setCaption("মানচিত্র: আপনার বর্তমান অবস্থানের চারপাশে সেবাসমূহ।");
      },
      () => {
        setCaption("মানচিত্র: অবস্থান পাওয়া যায়নি — ঢাকা কেন্দ্রিক ডেমো।");
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{caption}</p>
      <MapPreview lat={lat} lng={lng} markers={markers} />
    </div>
  );
}
