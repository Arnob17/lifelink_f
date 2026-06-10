"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DHAKA_LAT = 23.810331;
const DHAKA_LNG = 90.412521;

export function GeoBloodQuickForm() {
  const [lat, setLat] = useState(String(DHAKA_LAT));
  const [lng, setLng] = useState(String(DHAKA_LNG));
  const [geoNote, setGeoNote] = useState("ঢাকা কেন্দ্রিক ডেমো অবস্থান। অনুমতি দিলে আপনার আসল অবস্থান ব্যবহার হবে।");

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        setGeoNote("আপনার বর্তমান অবস্থান ব্যবহার করে খুঁজছি।");
      },
      () => {
        setGeoNote("অবস্থান পাওয়া যায়নি, তাই ঢাকা কেন্দ্রিক ডেমো অবস্থান ব্যবহার হচ্ছে।");
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 12_000 },
    );
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-[color-mix(in_oklab,var(--background)_90%,var(--foreground))] p-6 shadow-md backdrop-blur-sm">
      <p className="text-sm font-semibold text-foreground">দ্রুত রক্ত খোঁজ</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{geoNote}</p>
      <form className="mt-4 space-y-3" action="/blood" method="get">
        <div>
          <label className="text-xs font-medium text-muted-foreground">রক্তের গ্রুপ</label>
          <Input name="bloodGroup" placeholder="যেমন O+" className="mt-1" />
        </div>
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
        <Button type="submit" className="w-full bg-[var(--bangla-green)] hover:bg-[var(--bangla-green-strong)]">
          কাছাকাছি খুঁজুন
        </Button>
      </form>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        <Link href="/blood" className="font-medium text-[var(--bangla-red)] underline-offset-2 hover:underline">
          বিস্তারিত রক্ত ডেস্ক
        </Link>
      </p>
    </div>
  );
}
