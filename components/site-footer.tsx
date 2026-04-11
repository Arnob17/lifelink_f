import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 py-10 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p suppressHydrationWarning className="font-semibold text-zinc-900 dark:text-zinc-100">
            লাইফলিংক <span className="text-xs font-sans font-normal text-zinc-500">LifeLink</span>
          </p>
          <p className="mt-1 max-w-md">
            রক্ত, স্বাস্থ্য, চাকরি, শিক্ষা ও সংবাদ — বাংলাদেশি পরিবারের জন্য এক ঠাঁইয়ে।
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/map" className="hover:text-zinc-900 dark:hover:text-white">
            মানচিত্র
          </Link>
          <Link href="/blood" className="hover:text-zinc-900 dark:hover:text-white">
            রক্ত
          </Link>
          <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-white">
            চাকরি
          </Link>
          <Link href="/news" className="hover:text-zinc-900 dark:hover:text-white">
            সংবাদ
          </Link>
        </div>
      </div>
    </footer>
  );
}
