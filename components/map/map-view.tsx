"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import Link from "next/link";

/** Leaflet often renders a gray box until the container size is known (layout + dynamic import). */
function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const run = () => map.invalidateSize();
    run();
    const t1 = window.setTimeout(run, 100);
    const t2 = window.setTimeout(run, 400);
    window.addEventListener("resize", run);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", run);
    };
  }, [map]);
  return null;
}

const fillForColor = (c: string) => {
  switch (c) {
    case "red":
      return { fill: "#ef4444", stroke: "#b91c1c" };
    case "blue":
      return { fill: "#3b82f6", stroke: "#1d4ed8" };
    case "green":
      return { fill: "#22c55e", stroke: "#15803d" };
    case "violet":
      return { fill: "#8b5cf6", stroke: "#5b21b6" };
    default:
      return { fill: "#f59e0b", stroke: "#b45309" };
  }
};

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  type: string;
};

export function MapView({
  lat,
  lng,
  zoom = 12,
  markers,
  height = 480,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  markers: MapMarker[];
  height?: number;
}) {
  const center = useMemo<[number, number]>(() => [lat, lng], [lat, lng]);

  return (
    <div
      style={{ height, minHeight: height }}
      className="relative z-0 w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:min-h-[inherit] [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-[inherit]"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: height }}
        scrollWheelZoom
        className="rounded-[inherit]"
      >
        <MapInvalidateSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {markers.map((m) => {
          const colors = fillForColor(m.color);
          return (
            <CircleMarker
              key={m.id}
              center={[m.lat, m.lng]}
              radius={9}
              pathOptions={{
                color: colors.stroke,
                fillColor: colors.fill,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {m.type.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {m.title}
                  </p>
                  <Link
                    href={`/listings/${m.id}`}
                    className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
