"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Droplets,
  GraduationCap,
  HeartPulse,
  Map,
  Newspaper,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

const shortcuts = [
  { href: "/news", label: "সংবাদ", hint: "News", icon: Newspaper },
  { href: "/map", label: "মানচিত্র", hint: "Map", icon: Map },
  { href: "/jobs", label: "চাকরি", hint: "Jobs", icon: Briefcase },
  { href: "/clinics", label: "ক্লিনিক", hint: "Clinics", icon: HeartPulse },
  { href: "/pharmacies", label: "ফার্মেসি", hint: "Rx", icon: Pill },
  { href: "/teachers", label: "শিক্ষক", hint: "Teach", icon: GraduationCap },
  { href: "/blood", label: "রক্ত", hint: "Blood", icon: Droplets },
] as const;

export function FeedStoriesBar() {
  const pathname = usePathname();

  return (
    <div className="relative -mx-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <div
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="navigation"
        aria-label="দ্রুত নেভিগেশন"
      >
        {shortcuts.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-w-[4.5rem] snap-start flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-2.5 text-center transition will-change-transform",
                "bg-card/80 shadow-sm backdrop-blur-sm",
                "hover:-translate-y-0.5 hover:border-[var(--bangla-green)]/35 hover:shadow-md",
                "motion-safe:transition-transform motion-safe:duration-300",
                active &&
                  "border-[var(--bangla-red)]/40 bg-[color-mix(in_oklab,var(--card)_88%,var(--bangla-red))] shadow-md ring-1 ring-[var(--bangla-red)]/25",
                !active && "border-border/70",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full p-[2.5px] transition group-hover:scale-105",
                  active
                    ? "bg-gradient-to-tr from-[var(--bangla-red)]/75 via-[var(--accent-gold)]/55 to-[var(--bangla-green)]/55 shadow-md"
                    : "bg-gradient-to-br from-border/80 to-border/40",
                )}
              >
                <span className="flex h-full w-full items-center justify-center rounded-full bg-card text-[var(--bangla-green-strong)] shadow-inner dark:text-[var(--bangla-green)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
              </span>
              <span className="max-w-[4.5rem] truncate text-[11px] font-bold leading-tight text-foreground">
                {item.label}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                {item.hint}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
