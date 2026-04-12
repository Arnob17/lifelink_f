import type { ExternalNewsItem } from "@/lib/external-news";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExternalNewsCard({
  item,
  featured,
  className,
}: {
  item: ExternalNewsItem;
  featured?: boolean;
  className?: string;
}) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-md shadow-black/[0.04] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[var(--bangla-red)]/25 hover:shadow-lg dark:shadow-black/25",
        featured ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          featured ? "aspect-[16/10] w-full sm:aspect-auto sm:h-auto sm:w-[46%]" : "aspect-[16/10] w-full",
        )}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br from-[var(--bangla-green)]/15 to-[var(--bangla-red)]/15 text-4xl font-black text-[var(--bangla-green)]/40">
            {item.source.slice(0, 1)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {item.source}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-gradient-to-br from-muted to-card text-sm font-black text-[var(--bangla-green-strong)] shadow-inner dark:text-[var(--bangla-green)]">
            {item.source.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{item.source}</p>
            <p className="text-[11px] font-medium text-muted-foreground">বাইরের সংবাদ · লিংক আউট</p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-[var(--bangla-red)]" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-semibold leading-snug tracking-tight text-card-foreground",
              featured ? "text-lg sm:text-xl" : "text-base",
            )}
          >
            {item.title}
          </h3>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          মূল প্রতিবেদন খুলতে ক্লিক করুন — আমরা শুধু সংযোগ দেখাচ্ছি, বিষয়বস্তু সেই সংস্থার।
        </p>
        <div className="mt-4 flex items-center border-t border-border/60 pt-3 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-[var(--bangla-red)] transition group-hover:underline">
            <ExternalLink className="h-3.5 w-3.5" />
            প্রতিবেদন খুলুন
          </span>
        </div>
      </div>
    </a>
  );
}
