import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 py-10 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            LifeLink
          </p>
          <p className="mt-1 max-w-md">
            One trusted place for blood, care, work, learning, and civic news.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/map" className="hover:text-zinc-900 dark:hover:text-white">
            Map
          </Link>
          <Link href="/blood" className="hover:text-zinc-900 dark:hover:text-white">
            Blood
          </Link>
          <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-white">
            Jobs
          </Link>
          <Link href="/news" className="hover:text-zinc-900 dark:hover:text-white">
            News
          </Link>
        </div>
      </div>
    </footer>
  );
}
