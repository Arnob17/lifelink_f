import Link from "next/link";
import { Newspaper, Sparkles } from "lucide-react";
import type { Listing } from "@/lib/types";
import type { ExternalNewsItem } from "@/lib/external-news";
import { ListingCard } from "@/components/listing-card";
import { ExternalNewsCard } from "@/components/home/external-news-card";
import { LocationMapPreview } from "@/components/home/location-map-preview";
import { FutureAiPanel } from "@/components/home/future-ai-panel";
import { MastheadDate } from "@/components/home/masthead-date";
import { Button } from "@/components/ui/button";

function MiniListingStrip({
  title,
  href,
  items,
  kicker,
}: {
  title: string;
  href: string;
  items: Listing[];
  kicker: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-[var(--newsprint)]/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--bangla-green-strong)]">
            {kicker}
          </p>
          <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8 shrink-0 px-2 text-xs" asChild>
          <Link href={href}>সব দেখুন</Link>
        </Button>
      </div>
      <ul className="mt-3 space-y-2 border-t border-dashed border-zinc-300/80 pt-3 dark:border-zinc-700">
        {items.length === 0 && (
          <li className="text-xs text-zinc-500">এই মুহূর্তে তালিকা খালি — API চালু করে আবার চেষ্টা করুন।</li>
        )}
        {items.map((it) => (
          <li key={it.id}>
            <Link
              href={`/listings/${it.id}`}
              className="group flex items-start justify-between gap-2 text-sm font-medium text-zinc-800 hover:text-[var(--bangla-red)] dark:text-zinc-200"
            >
              <span className="line-clamp-2">{it.title}</span>
              <span className="shrink-0 text-[10px] uppercase text-zinc-400 group-hover:text-[var(--bangla-red)]">
                {it.type.replaceAll("_", " ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MapMarkerLite = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  type: string;
};

export function NewspaperFrontPage({
  externalNews,
  news,
  jobs,
  clinics,
  pharmacies,
  teachers,
  donors,
  banks,
  initialMapMarkers,
}: {
  externalNews: ExternalNewsItem[];
  news: Listing[];
  jobs: Listing[];
  clinics: Listing[];
  pharmacies: Listing[];
  teachers: Listing[];
  donors: Listing[];
  banks: Listing[];
  initialMapMarkers: MapMarkerLite[];
}) {
  const lead = externalNews[0];
  const rail = externalNews.slice(1, 4);
  const lower = externalNews.slice(4, 8);

  return (
    <div className="space-y-10 lg:space-y-12">
      <header className="border-b-4 border-[var(--bangla-green)] pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--bangla-red)] text-white shadow-sm">
              <Newspaper className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-[var(--bangla-green-strong)] md:text-3xl">
                লাইফলিংক — আজকের পাতা
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                সংবাদ, রক্ত, চাকরি, স্বাস্থ্য ও শিক্ষা — একসাথে, পত্রিকার প্রথম পাতার মতো সাজানো।
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <MastheadDate className="font-mono" />
            <p className="mt-1 flex items-center justify-end gap-1 text-[10px] uppercase tracking-wide">
              <Sparkles className="h-3 w-3 text-amber-500" />
              বাংলাদেশ ও আশেপাশের সেবা
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">প্রধান সংবাদ</h2>
            <span className="hidden text-xs text-zinc-500 sm:inline">
              বাইরের সংবাদমাধ্যম — ক্লিক করলে তাদের সাইটে যাবেন
            </span>
          </div>
          {lead ? (
            <ExternalNewsCard item={lead} featured />
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
              সংবাদ ফিড আসছে না — নেটওয়ার্ক বা ফিড সীমা হতে পারে। কিছুক্ষণ পরে রিফ্রেশ করুন।
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {rail.map((it) => (
              <ExternalNewsCard key={it.id} item={it} />
            ))}
          </div>
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <MiniListingStrip
            kicker="জরুরি"
            title="কাছের রক্তদাতা"
            href="/blood"
            items={donors.slice(0, 4)}
          />
          <MiniListingStrip
            kicker="স্বাস্থ্য"
            title="রক্তব্যাংক ও ব্যাংক তালিকা"
            href="/blood"
            items={banks.slice(0, 3)}
          />
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">লাইভ মানচিত্র</h3>
              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                <Link href="/map">পূর্ণ মানচিত্র</Link>
              </Button>
            </div>
            <div className="mt-3">
              <LocationMapPreview initialMarkers={initialMapMarkers} />
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">চাকরির বাজার</h3>
          <div className="grid gap-3">
            {jobs.slice(0, 2).map((j) => (
              <ListingCard key={j.id} listing={j} />
            ))}
            {jobs.length === 0 && <p className="text-xs text-zinc-500">কোনো চাকরির তালিকা নেই।</p>}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">ক্লিনিক ও ফার্মেসি</h3>
          <div className="grid gap-3">
            {clinics.slice(0, 1).map((c) => (
              <ListingCard key={c.id} listing={c} />
            ))}
            {pharmacies.slice(0, 1).map((p) => (
              <ListingCard key={p.id} listing={p} />
            ))}
            {clinics.length === 0 && pharmacies.length === 0 && (
              <p className="text-xs text-zinc-500">ক্লিনিক/ফার্মেসি তালিকা খালি।</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/clinics">সব ক্লিনিক</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/pharmacies">সব ফার্মেসি</Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">লাইফলিংক নিউজ ডেস্ক</h3>
          <p className="text-xs text-zinc-500">প্ল্যাটফর্মে প্রকাশিত সংবাদ ও নোটিশ।</p>
          <div className="grid gap-3">
            {news.slice(0, 2).map((n) => (
              <ListingCard key={n.id} listing={n} />
            ))}
            {news.length === 0 && <p className="text-xs text-zinc-500">কোনো অভ্যন্তরীণ সংবাদ নেই।</p>}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/news">আরও সংবাদ</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">আরও শিরোনাম</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {lower.map((it) => (
              <ExternalNewsCard key={it.id} item={it} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">শিক্ষক ও প্রশিক্ষণ</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {teachers.slice(0, 4).map((t) => (
              <ListingCard key={t.id} listing={t} />
            ))}
            {teachers.length === 0 && <p className="text-xs text-zinc-500">শিক্ষক তালিকা খালি।</p>}
          </div>
        </div>
      </section>

      <FutureAiPanel />
    </div>
  );
}
