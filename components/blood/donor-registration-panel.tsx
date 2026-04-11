"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";

export function DonorRegistrationPanel() {
  const { token, user } = useAuth();
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("37.7749");
  const [lng, setLng] = useState("-122.4194");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "USER") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground">
          Become a donor on LifeLink
        </p>
        <p className="mt-2">
          Sign in with a normal user account to register your blood group and
          optional location for emergency discovery.
        </p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await clientFetch("/blood/donor", {
        method: "POST",
        token,
        body: JSON.stringify({
          bloodGroup,
          address: address || undefined,
          latitude: lat ? Number(lat) : undefined,
          longitude: lng ? Number(lng) : undefined,
          available: true,
        }),
      });
      setMessage("Donor profile saved. Thank you for opting in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <p className="text-sm font-semibold text-foreground">
          Donor registration
        </p>
        <p className="text-xs text-muted-foreground">
          Creates or updates your BLOOD_DONOR listing. You control availability in
          metadata.
        </p>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Blood group</label>
        <Input
          className="mt-1"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Address</label>
        <Input
          className="mt-1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Optional"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Latitude</label>
        <Input className="mt-1" value={lat} onChange={(e) => setLat(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Longitude</label>
        <Input className="mt-1" value={lng} onChange={(e) => setLng(e.target.value)} />
      </div>
      <div className="md:col-span-2 flex flex-col gap-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <Button type="submit" disabled={loading || !token}>
          {loading ? "Saving…" : "Save donor profile"}
        </Button>
      </div>
    </form>
  );
}
