"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, MapPin, Radio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import {
  loadDismissedSosIds,
  persistDismissedSosIds,
  SOS_NEARBY_RADIUS_KM,
  SOS_POLL_INTERVAL_MS,
} from "@/lib/sos-constants";
import type { SosNearbyAlert } from "@/lib/types";
import { cn } from "@/lib/utils";

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function SosPresence() {
  const { user, token } = useAuth();
  const [viewerPos, setViewerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoNote, setGeoNote] = useState<string | null>(null);
  const [nearby, setNearby] = useState<SosNearbyAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => loadDismissedSosIds());
  const [sendOpen, setSendOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendOk, setSendOk] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoNote("এই ব্রাউজারে অবস্থান সাপোর্ট নেই, তাই SOS দেখতে পারবেন না।");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setViewerPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoNote(null);
      },
      () => {
        setGeoNote("অবস্থান অনুমতি দিলে আশেপাশের SOS দেখা যাবে।");
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 14_000 },
    );
  }, []);

  const fetchNearby = useCallback(async () => {
    if (!viewerPos) return;
    const q = new URLSearchParams({
      lat: String(viewerPos.lat),
      lng: String(viewerPos.lng),
      radiusKm: String(SOS_NEARBY_RADIUS_KM),
    });
    const rows = await clientFetch<SosNearbyAlert[]>(`/sos/nearby?${q.toString()}`);
    setNearby(Array.isArray(rows) ? rows : []);
  }, [viewerPos]);

  useEffect(() => {
    if (!viewerPos) return;
    let cancelled = false;
    (async () => {
      try {
        await fetchNearby();
      } catch {
        if (!cancelled) setNearby([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [viewerPos, fetchNearby]);

  useEffect(() => {
    if (!viewerPos) return;
    const t = window.setInterval(() => {
      fetchNearby().catch(() => setNearby([]));
    }, SOS_POLL_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [viewerPos, fetchNearby]);

  const visibleAlerts = useMemo(() => {
    return nearby.filter((a) => {
      if (dismissed.has(a.id)) return false;
      if (user && a.authorId === user.id) return false;
      return true;
    });
  }, [nearby, dismissed, user]);

  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistDismissedSosIds(next);
      return next;
    });
  };

  const sendSos = async () => {
    setSendError(null);
    setSendOk(null);
    if (!token) {
      setSendError("পাঠাতে সাইন ইন করুন।");
      return;
    }
    setSending(true);
    try {
      const pos =
        viewerPos ??
        (await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("অবস্থান পাওয়া যায়নি।"));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (p) =>
              resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            () => reject(new Error("অবস্থান অনুমতি দিন।")),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
          );
        }));

      await clientFetch<{ id: string }>("/sos", {
        method: "POST",
        token,
        body: JSON.stringify({
          lat: pos.lat,
          lng: pos.lng,
          ...(message.trim() ? { message: message.trim() } : {}),
        }),
      });
      setSendOk(
        `SOS পাঠানো হয়েছে। আপনার আশেপাশের প্রায় ${SOS_NEARBY_RADIUS_KM} কিমি এলাকার লোকজন দেখতে পারবে।`,
      );
      setMessage("");
      setViewerPos(pos);
      await fetchNearby().catch(() => {});
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "পাঠানো ব্যর্থ।");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {geoNote && (
        <p
          className="sr-only"
          aria-live="polite"
        >
          {geoNote}
        </p>
      )}

      {visibleAlerts.length > 0 && (
        <div
          className="fixed inset-x-0 top-[3.65rem] z-40 border-b border-[var(--bangla-red)]/35 bg-[var(--bangla-red)]/12 px-3 py-2 shadow-md backdrop-blur-md dark:bg-[var(--bangla-red)]/20 sm:px-4"
          role="alert"
        >
          <div className="mx-auto flex max-w-[min(100%,100rem)] flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--bangla-red)] dark:text-red-200">
              <Radio className="h-4 w-4 shrink-0 animate-pulse" aria-hidden />
              <span className="font-tiro-bangla">
                কাছাকাছি SOS ({SOS_NEARBY_RADIUS_KM} কিমি), সহায়তা প্রয়োজন হতে পারে
              </span>
            </div>
            <ul className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto sm:max-h-48">
              {visibleAlerts.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/95 p-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-foreground">
                      <span className="font-tiro-bangla">{a.authorName}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {a.distanceKm.toFixed(1)} কিমি দূরে
                      </span>
                    </p>
                    {a.message ? (
                      <p className="text-muted-foreground">{a.message}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={mapsUrl(a.lat, a.lng)} target="_blank" rel="noreferrer">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        মানচিত্র
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      type="button"
                      onClick={() => dismiss(a.id)}
                      aria-label="বন্ধ করুন"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
        <Button
          type="button"
          size="lg"
          className={cn(
            "h-14 rounded-full px-5 shadow-lg shadow-black/20",
            "bg-[var(--bangla-red)] font-semibold text-white hover:bg-[var(--bangla-red)]/90",
          )}
          onClick={() => {
            setSendOpen(true);
            setSendError(null);
            setSendOk(null);
          }}
          aria-haspopup="dialog"
        >
          <AlertTriangle className="mr-2 h-5 w-5" aria-hidden />
          <span className="font-tiro-bangla">SOS</span>
        </Button>
      </div>

      {sendOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSendOpen(false);
          }}
        >
          <Card className="relative w-full max-w-md border-[var(--bangla-red)]/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-tiro-bangla flex items-center gap-2 text-[var(--bangla-red)]">
                <AlertTriangle className="h-5 w-5" />
                জরুরি SOS
              </CardTitle>
              <CardDescription className="text-pretty">
                শুধু আসল জরুরিতে ব্যবহার করুন। আপনার অবস্থান সংরক্ষিত হবে; সাইট খোলা ও অবস্থান অনুমতি দেওয়া
                দর্শকদের কাছে আশেপাশের প্রায় {SOS_NEARBY_RADIUS_KM} কিমি পর্যন্ত এই SOS দেখা যাবে।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <p className="text-sm text-muted-foreground">
                  পাঠাতে{" "}
                  <Link href="/auth/login" className="font-semibold text-foreground underline">
                    সাইন ইন
                  </Link>{" "}
                  করুন।
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="sos-msg" className="text-sm font-medium">
                      সংক্ষিপ্ত বার্তা (ঐচ্ছিক)
                    </label>
                    <Input
                      id="sos-msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="যেমন: দুর্ঘটনা, রক্ত দরকার, নিরাপদ সাহায্য"
                      maxLength={500}
                    />
                  </div>
                  {sendError && (
                    <p className="text-sm text-[var(--bangla-red)]" role="alert">
                      {sendError}
                    </p>
                  )}
                  {sendOk && (
                    <p className="text-sm text-[var(--bangla-green-strong)]" role="status">
                      {sendOk}
                    </p>
                  )}
                </>
              )}
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSendOpen(false)}>
                  বাতিল
                </Button>
                {user ? (
                  <Button
                    type="button"
                    className="bg-[var(--bangla-red)] text-white hover:bg-[var(--bangla-red)]/90"
                    disabled={sending}
                    onClick={() => void sendSos()}
                  >
                    {sending ? "পাঠাচ্ছি…" : "SOS পাঠান"}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
