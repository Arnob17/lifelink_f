"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type { Listing, ListingType } from "@/lib/types";

const types: ListingType[] = [
  "BLOOD_BANK",
  "PHARMACY",
  "CLINIC",
  "JOB",
  "TEACHER",
  "NEWS",
];

export default function BusinessListingsPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ListingType>("JOB");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("37.7749");
  const [longitude, setLongitude] = useState("-122.4194");

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await clientFetch<Listing[]>("/listings/mine", { token });
      setItems(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === "BUSINESS") void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      await clientFetch("/listings", {
        method: "POST",
        token,
        body: JSON.stringify({
          type,
          title,
          description,
          address: address || undefined,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          published: true,
        }),
      });
      setTitle("");
      setDescription("");
      setAddress("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create");
    }
  }

  if (!user || user.role !== "BUSINESS") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted-foreground">
        <p>This workspace is reserved for business accounts.</p>
        <Button asChild className="mt-4">
          <Link href="/auth/register">Create business account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Business
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your listings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Publish any supported service type from a single dashboard — no
          separate portals.
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <p className="text-sm font-semibold">Create listing</p>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select
            className="mt-1 flex h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-card-foreground"
            value={type}
            onChange={(e) => setType(e.target.value as ListingType)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            className="mt-1 min-h-[100px] w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Address</label>
          <Input className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Latitude</label>
          <Input className="mt-1" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Longitude</label>
          <Input className="mt-1" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <div className="md:col-span-2">
          <Button type="submit" disabled={!token}>
            Publish listing
          </Button>
        </div>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live listings</h2>
          <Button variant="outline" size="sm" type="button" onClick={() => void refresh()} disabled={loading}>
            Refresh
          </Button>
        </div>
        <div className="space-y-3">
          {items.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No listings yet.</p>
          )}
          {items.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {l.type.replaceAll("_", " ")}
                </p>
                <p className="font-medium">{l.title}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/listings/${l.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
