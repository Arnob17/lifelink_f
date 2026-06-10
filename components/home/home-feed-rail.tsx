"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlignLeft,
  Flame,
  LayoutGrid,
  MapPin,
  MessagesSquare,
  Newspaper,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { id: "page-top", label: "শীর্ষ", hint: "Top", icon: Waves },
  { id: "home-feed-top", label: "ফিড", hint: "Feed", icon: LayoutGrid },
  { id: "home-feed-community", label: "পোস্ট", hint: "Posts", icon: MessagesSquare },
  { id: "home-feed-lead", label: "সংবাদ", hint: "News", icon: Newspaper },
  { id: "home-feed-hub", label: "হাব", hint: "Hub", icon: Flame },
  { id: "home-feed-more", label: "আরও", hint: "More", icon: AlignLeft },
  { id: "home-feed-sidebar", label: "রেল", hint: "Rail", icon: MapPin },
] as const;

export function HomeFeedRail({ className }: { className?: string }) {
  const [active, setActive] = useState<string>(links[0].id);

  const refresh = useCallback(() => {
    const ordered = links
      .map((l) => ({ l, el: document.getElementById(l.id) }))
      .filter((x): x is { l: (typeof links)[number]; el: HTMLElement } => Boolean(x.el));

    if (ordered.length === 0) return;

    const mid = window.innerHeight * 0.28;
    let best = ordered[0].l.id;
    let bestDist = Number.POSITIVE_INFINITY;

    for (const { l, el } of ordered) {
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.top - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = l.id;
      }
    }

    setActive(best);
  }, []);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => refresh());
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [refresh]);

  return (
    <nav
      aria-label="ফিডে দ্রুত যাওয়া"
      className={cn(
        "sticky top-[4.75rem] z-20 hidden h-[calc(100dvh-5.5rem)] max-h-[40rem] flex-col gap-1 self-start overflow-y-auto pr-1 2xl:flex",
        className,
      )}
    >
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        টাইমলাইন
      </p>
      {links.map((item) => {
        const Icon = item.icon;
        const isOn = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border px-2.5 py-2 text-left transition will-change-transform",
              "border-transparent bg-transparent hover:border-border/70 hover:bg-card/70 hover:shadow-sm",
              "motion-safe:duration-200 motion-safe:hover:-translate-y-0.5",
              isOn &&
                "border-border/80 bg-card shadow-md ring-1 ring-[var(--bangla-green)]/20 dark:ring-[var(--bangla-green)]/35",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br text-[var(--bangla-green-strong)] shadow-inner transition group-hover:scale-[1.03] dark:text-[var(--bangla-green)]",
                isOn
                  ? "border-[var(--bangla-red)]/35 from-[var(--bangla-red)]/18 to-transparent"
                  : "border-border/60 from-muted/80 to-transparent",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-tight text-foreground">{item.label}</span>
              <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {item.hint}
              </span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
