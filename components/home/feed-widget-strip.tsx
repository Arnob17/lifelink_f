"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedWidgetStrip({
  title,
  href,
  items,
  kicker,
  accent = "green",
  className,
}: {
  title: string;
  href: string;
  items: Listing[];
  kicker: string;
  accent?: "green" | "red";
  className?: string;
}) {
  const accentClass =
    accent === "red"
      ? "from-[var(--bangla-red)]/20 to-transparent text-[var(--bangla-red)]"
      : "from-[var(--bangla-green)]/18 to-transparent text-[var(--bangla-green-strong)] dark:text-[var(--bangla-green)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-lg shadow-black/[0.04] backdrop-blur-md dark:shadow-black/30",
        className,
      )}
    >
      <div className={cn("h-1 w-full bg-gradient-to-r", accentClass)} aria-hidden />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{kicker}</p>
            <h3 className="mt-1 text-base font-bold leading-tight text-foreground">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-8 shrink-0 rounded-full px-3 text-xs font-semibold" asChild>
            <Link href={href}>সব দেখুন</Link>
          </Button>
        </div>
        <ul className="mt-3 space-y-1 border-t border-border/60 pt-3">
          {items.length === 0 && (
            <li className="rounded-2xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
              এই মুহূর্তে তালিকা খালি। API চালু করে আবার চেষ্টা করুন।
            </li>
          )}
          {items.map((it, i) => (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Link
                href={`/listings/${it.id}`}
                className="group flex items-start justify-between gap-2 rounded-2xl px-2 py-2 text-sm font-medium text-foreground/90 transition hover:bg-muted/70 hover:text-[var(--bangla-red)]"
              >
                <span className="line-clamp-2">{it.title}</span>
                <span className="shrink-0 rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition group-hover:bg-[var(--bangla-red)]/15 group-hover:text-[var(--bangla-red)]">
                  {it.type.replaceAll("_", " ")}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
