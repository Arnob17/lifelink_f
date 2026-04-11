import { ListingCard } from "@/components/listing-card";
import { ExternalNewsCard } from "@/components/home/external-news-card";
import { apiGetListings } from "@/lib/api";
import { fetchExternalNews } from "@/lib/external-news";
import type { Listing } from "@/lib/types";

const LAT = 23.810331;
const LNG = 90.412521;

export default async function NewsPage() {
  let items: Listing[] = [];
  const external = await fetchExternalNews(24).catch(() => []);
  try {
    items = await apiGetListings({
      type: "NEWS",
      lat: LAT,
      lng: LNG,
      radiusKm: 200,
      take: 24,
    });
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bangla-green)]">
          সংবাদ ডেস্ক
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          সংবাদ — বাইরের শিরোনাম ও লাইফলিংক নিজস্ব
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          উপরের কার্ডগুলো বিভিন্ন সংবাদমাধ্যমের RSS থেকে এসেছে; ক্লিক করলে তাদের ওয়েবসাইটে
          খুলবে। নিচের গ্রিডে লাইফলিংকে প্রকাশিত NEWS টাইপের তালিকা দেখাচ্ছি।
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">শিরোনাম (বহিঃসূত্র)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {external.length === 0 && (
            <p className="text-sm text-zinc-500">ফিড লোড হয়নি — পরে আবার চেষ্টা করুন।</p>
          )}
          {external.map((item, i) => (
            <ExternalNewsCard key={item.id} item={item} featured={i === 0} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">লাইফলিংক নিউজ তালিকা</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.length === 0 && (
            <p className="text-sm text-zinc-500">কোনো অভ্যন্তরীণ সংবাদ তালিকা নেই।</p>
          )}
          {items.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
