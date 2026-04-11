import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  href,
  actionLabel = "View all",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  href: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {kicker}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary-strong)] hover:underline dark:text-[var(--secondary)]"
      >
        {actionLabel}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
