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
  density = "default",
}: {
  listing: Listing;
  className?: string;
  density?: "default" | "compact";
}) {
  const meta = listing.metadata as Record<string, unknown> | null | undefined;
  const blood =
    typeof meta?.bloodGroup === "string" ? meta.bloodGroup : undefined;

  const compact = density === "compact";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--bangla-green)]/25 hover:shadow-md",
        compact ? "p-4" : "p-5",
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
            className={cn(compact && "text-[10px]")}
          >
            {typeLabel[listing.type]}
          </Badge>
          {blood && (
            <span className="ml-2 text-xs font-semibold text-[var(--primary-strong)]">
              {blood}
            </span>
          )}
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
      </div>
      <h3
        className={cn(
          "mt-3 line-clamp-2 font-semibold tracking-tight text-card-foreground",
          compact ? "text-sm leading-snug" : "text-lg",
        )}
      >
        {listing.title}
      </h3>
      <p
        className={cn(
          "mt-2 line-clamp-3 leading-relaxed text-muted-foreground",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {listing.description}
      </p>
      <div className={cn("mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", compact && "mt-3")}>
        {listing.address && <span className="line-clamp-1">{listing.address}</span>}
        {listing.distanceKm != null && (
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
            {listing.distanceKm} km
          </span>
        )}
      </div>
    </Link>
  );
}
