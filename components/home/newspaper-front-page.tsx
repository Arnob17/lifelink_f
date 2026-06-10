import Link from "next/link";
import { Flame, MessagesSquare } from "lucide-react";
import type { Listing, UserFeedPost } from "@/lib/types";
import type { ExternalNewsItem } from "@/lib/external-news";
import { ListingCard } from "@/components/listing-card";
import { ExternalNewsCard } from "@/components/home/external-news-card";
import { LocationMapPreview } from "@/components/home/location-map-preview";
import { MastheadDate } from "@/components/home/masthead-date";
import { Button } from "@/components/ui/button";
import { FeedStoriesBar } from "@/components/home/feed-stories-bar";
import { FeedWidgetStrip } from "@/components/home/feed-widget-strip";
import { HomeFeedRail } from "@/components/home/home-feed-rail";
import { FeedReveal } from "@/components/home/feed-reveal";
import { UserCommunityFeed } from "@/components/home/user-community-feed";

type MapMarkerLite = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  type: string;
};

function FeedSectionTitle({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/40 text-[var(--bangla-red)] shadow-sm">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">{title}</h2>
          {subtitle && <p className="mt-0.5 max-w-2xl text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function NewspaperFrontPage({
  externalNews,
  userPosts,
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
  userPosts: UserFeedPost[];
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
    <div className="space-y-8 lg:space-y-10">
      <div id="home-feed-top" className="scroll-mt-24 space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-4 shadow-xl shadow-black/[0.06] backdrop-blur-md dark:bg-card/35 dark:shadow-black/40 sm:p-5">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-card font-tiro-bangla text-lg font-bold text-[var(--accent-ink)] shadow-inner">
                লি
              </span>
              <div className="min-w-0">
                <p className="font-tiro-bangla text-xl font-semibold text-[var(--accent-ink)] md:text-2xl">
                  আপনার লাইফলিংক ফিড
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  সংবাদ, রক্ত, চাকরি, স্বাস্থ্য ও শিক্ষা। একই টাইমলাইনে, আপডেট হতে থাকা কার্ড।
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs text-muted-foreground">
              <MastheadDate className="font-mono text-[11px] text-foreground/80" />
            </div>
          </div>
        </div>

        <FeedStoriesBar />
      </div>

      <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] xl:items-start xl:gap-8 2xl:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,18rem)]">
        <HomeFeedRail />

        <div className="min-w-0">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-[0.65rem] top-4 hidden w-px bg-gradient-to-b from-transparent via-border/70 to-transparent md:block"
            />
            <div className="space-y-10 md:pl-9">
              <FeedReveal>
                <section id="home-feed-community" className="scroll-mt-24 space-y-4">
                  <FeedSectionTitle
                    title="কমিউনিটি পোস্ট"
                    subtitle="ফেসবুক বা রেডিটের মতো। সাইন ইন করে লিখুন, সবাই পড়তে পারবে।"
                    icon={MessagesSquare}
                  />
                  <UserCommunityFeed initialPosts={userPosts} />
                </section>
              </FeedReveal>

              <FeedReveal>
                <section id="home-feed-lead" className="scroll-mt-24 space-y-5">
                  <FeedSectionTitle
                    title="প্রধান সংবাদ"
                    subtitle="বাইরের সংবাদমাধ্যম, ক্লিক করলে তাদের সাইটে যাবেন"
                  />
                  {lead ? (
                    <ExternalNewsCard item={lead} featured />
                  ) : (
                    <p className="rounded-3xl border border-dashed border-border/80 bg-muted/30 p-6 text-sm text-muted-foreground backdrop-blur-sm">
                      সংবাদ ফিড আসছে না। নেটওয়ার্ক বা ফিড সীমা হতে পারে। কিছুক্ষণ পরে রিফ্রেশ করুন।
                    </p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {rail.map((it) => (
                      <ExternalNewsCard key={it.id} item={it} />
                    ))}
                  </div>
                </section>
              </FeedReveal>

              <FeedReveal>
                <section
                  id="home-feed-hub"
                  className="scroll-mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3"
                >
                  <div className="min-w-0 space-y-4 rounded-3xl border border-border/60 bg-card/45 p-4 shadow-md shadow-black/[0.04] backdrop-blur-md dark:bg-card/25">
                    <FeedSectionTitle title="চাকরির বাজার" icon={Flame} />
                    <div className="grid gap-3">
                      {jobs.slice(0, 2).map((j) => (
                        <ListingCard key={j.id} listing={j} density="compact" />
                      ))}
                      {jobs.length === 0 && <p className="text-xs text-muted-foreground">কোনো চাকরির তালিকা নেই।</p>}
                    </div>
                  </div>
                  <div className="min-w-0 space-y-4 rounded-3xl border border-border/60 bg-card/45 p-4 shadow-md shadow-black/[0.04] backdrop-blur-md dark:bg-card/25">
                    <FeedSectionTitle title="ক্লিনিক ও ফার্মেসি" />
                    <div className="grid gap-3">
                      {clinics.slice(0, 1).map((c) => (
                        <ListingCard key={c.id} listing={c} density="compact" />
                      ))}
                      {pharmacies.slice(0, 1).map((p) => (
                        <ListingCard key={p.id} listing={p} density="compact" />
                      ))}
                      {clinics.length === 0 && pharmacies.length === 0 && (
                        <p className="text-xs text-muted-foreground">ক্লিনিক/ফার্মেসি তালিকা খালি।</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" className="rounded-full" asChild>
                        <Link href="/clinics">সব ক্লিনিক</Link>
                      </Button>
                      <Button variant="secondary" size="sm" className="rounded-full" asChild>
                        <Link href="/pharmacies">সব ফার্মেসি</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="min-w-0 space-y-4 rounded-3xl border border-border/60 bg-card/45 p-4 shadow-md shadow-black/[0.04] backdrop-blur-md dark:bg-card/25">
                    <FeedSectionTitle title="লাইফলিংক নিউজ ডেস্ক" subtitle="প্ল্যাটফর্মে প্রকাশিত সংবাদ ও নোটিশ।" />
                    <div className="grid gap-3">
                      {news.slice(0, 2).map((n) => (
                        <ListingCard key={n.id} listing={n} density="compact" />
                      ))}
                      {news.length === 0 && <p className="text-xs text-muted-foreground">কোনো অভ্যন্তরীণ সংবাদ নেই।</p>}
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <Link href="/news">আরও সংবাদ</Link>
                    </Button>
                  </div>
                </section>
              </FeedReveal>

              <FeedReveal>
                <section
                  id="home-feed-more"
                  className="scroll-mt-24 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
                >
                  <div className="min-w-0 space-y-4">
                    <FeedSectionTitle title="আরও শিরোনাম" />
                    <div className="grid grid-cols-1 gap-4 min-[36rem]:grid-cols-2">
                      {lower.map((it) => (
                        <ExternalNewsCard key={it.id} item={it} />
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0 space-y-4">
                    <FeedSectionTitle title="শিক্ষক ও প্রশিক্ষণ" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {teachers.slice(0, 4).map((t) => (
                        <ListingCard key={t.id} listing={t} density="compact" />
                      ))}
                      {teachers.length === 0 && <p className="text-xs text-muted-foreground">শিক্ষক তালিকা খালি।</p>}
                    </div>
                  </div>
                </section>
              </FeedReveal>

            </div>
          </div>
        </div>

        <aside
          id="home-feed-sidebar"
          className="scroll-mt-24 min-w-0 space-y-5 xl:sticky xl:top-24"
        >
          <FeedWidgetStrip kicker="জরুরি" title="কাছের রক্তদাতা" href="/blood" items={donors.slice(0, 4)} accent="red" />
          <FeedWidgetStrip
            kicker="স্বাস্থ্য"
            title="রক্তব্যাংক ও ব্যাংক তালিকা"
            href="/blood"
            items={banks.slice(0, 3)}
            accent="green"
          />
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-lg shadow-black/[0.04] backdrop-blur-md dark:shadow-black/30">
            <div className="h-1 w-full bg-gradient-to-r from-[var(--bangla-green)]/25 via-[var(--accent-gold)]/30 to-[var(--bangla-red)]/25" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-foreground">লাইভ মানচিত্র</h3>
                <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" asChild>
                  <Link href="/map">পূর্ণ মানচিত্র</Link>
                </Button>
              </div>
              <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-border/60">
                <LocationMapPreview initialMarkers={initialMapMarkers} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
