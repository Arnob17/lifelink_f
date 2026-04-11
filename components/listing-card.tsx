import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const typeLabel: Record<Listing["type"], string> = {
  BLOOD_DONOR: "Donor",
  BLOOD_BANK: "Blood bank",
  PHARMACY: "Pharmacy",
  CLINIC: "Clinic",
  JOB: "Job",
  TEACHER: "Teacher",
  NEWS: "News",
};

export function ListingCard({
  listing,
  className,
}: {
  listing: Listing;
  className?: string;
}) {
  const meta = listing.metadata as Record<string, unknown> | null | undefined;
  const blood =
    typeof meta?.bloodGroup === "string" ? meta.bloodGroup : undefined;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge
            variant={
              listing.type.includes("BLOOD")
                ? "destructive"
                : listing.type === "JOB"
                  ? "secondary"
                  : "outline"
            }
          >
            {typeLabel[listing.type]}
          </Badge>
          {blood && (
            <span className="ml-2 text-xs font-semibold text-[var(--primary-strong)]">
              {blood}
            </span>
          )}
        </div>
        <ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:text-zinc-900 dark:group-hover:text-white" />
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {listing.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {listing.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        {listing.address && <span className="line-clamp-1">{listing.address}</span>}
        {listing.distanceKm != null && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {listing.distanceKm} km
          </span>
        )}
      </div>
    </Link>
  );
}
