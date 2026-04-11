"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clientFetch } from "@/lib/client-api";

type Suggestion = {
  listingId: string;
  title: string;
  distanceKm: number;
  available: boolean;
  score: number;
  reason: string;
};

export function FutureAiPanel() {
  const [urgency, setUrgency] = useState("HIGH");
  const [data, setData] = useState<{
    suggestions: Suggestion[];
    disclaimer: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await clientFetch<{
          suggestions: Suggestion[];
          disclaimer: string;
        }>(
          `/blood/ai-suggest?lat=37.7749&lng=-122.4194&radiusKm=40&urgency=${urgency}`,
        );
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unable to load preview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urgency]);

  return (
    <section className="rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-white p-8 dark:border-zinc-700 dark:from-zinc-950 dark:to-zinc-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Future AI feature
          </Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Nearest and fastest-available donors
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Preview ranking blends distance, donor availability, and clinical
            urgency. This is a transparent heuristic — not a medical device —
            intended to guide coordinators toward better first calls.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((u) => (
            <Button
              key={u}
              size="sm"
              variant={urgency === u ? "default" : "outline"}
              onClick={() => setUrgency(u)}
            >
              {u.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {loading && <p className="text-zinc-500">Loading ranking preview…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {data && (
          <>
            <ol className="space-y-3">
              {data.suggestions.slice(0, 5).map((s, idx) => (
                <li
                  key={s.listingId}
                  className="flex items-start justify-between gap-4 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      #{idx + 1} · {s.distanceKm} km · score {s.score}
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {s.title}
                    </p>
                    <p className="text-xs text-zinc-500">{s.reason}</p>
                  </div>
                  <span
                    className={
                      s.available
                        ? "text-xs font-semibold text-emerald-600"
                        : "text-xs font-semibold text-amber-600"
                    }
                  >
                    {s.available ? "Available" : "Limited"}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">{data.disclaimer}</p>
          </>
        )}
      </div>
    </section>
  );
}
