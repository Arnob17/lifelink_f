import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-extrabold text-foreground">
            লাইফলিংক{" "}
            <span className="text-xs font-semibold text-muted-foreground">LifeLink</span>
          </p>
          <p className="mt-1 max-w-md leading-relaxed">
            রক্ত, স্বাস্থ্য, চাকরি, শিক্ষা ও সংবাদ — বাংলা ভাষায় চলা জীবনের জন্য এক ঠাঁইয়ে। ব্যবসার তালিকা ও বিজ্ঞাপনও একই ছায়ায়।
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-foreground/90">
          <Link href="/map" className="hover:text-[var(--bangla-red)]">
            মানচিত্র
          </Link>
          <Link href="/blood" className="hover:text-[var(--bangla-red)]">
            রক্ত
          </Link>
          <Link href="/jobs" className="hover:text-[var(--bangla-red)]">
            চাকরি
          </Link>
          <Link href="/news" className="hover:text-[var(--bangla-red)]">
            সংবাদ
          </Link>
          <Link href="/auth/register" className="text-[var(--bangla-green-strong)] hover:underline dark:text-[var(--bangla-green)]">
            ব্যবসায় নিবন্ধন
          </Link>
        </div>
      </div>
    </footer>
  );
}
