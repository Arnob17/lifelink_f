"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroBlood() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-white to-red-50 px-6 py-10 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-red-950/30 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--primary-strong)] shadow-sm ring-1 ring-red-100 dark:bg-zinc-900/80 dark:ring-red-900/40"
          >
            <Droplets className="h-3.5 w-3.5" />
            Emergency-ready network
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl"
          >
            Critical services,
            <span className="text-[var(--primary)]"> one calm place.</span>
          </motion.h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            LifeLink unifies blood, clinics, pharmacies, jobs, teachers, and
            trusted news — designed like a modern front page, built like
            infrastructure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/blood">Find Blood Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/map">Open live map</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Verified businesses", d: "Unified business accounts" },
              { icon: MapPin, t: "Distance-aware search", d: "Radius + map markers" },
              { icon: Droplets, t: "Donor registry", d: "Users can opt in to help" },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 text-sm shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60"
              >
                <item.icon className="h-5 w-5 text-[var(--secondary-strong)]" />
                <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.t}
                </p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80"
        >
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Quick blood lookup
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Defaults to San Francisco demo coordinates — adjust on the blood page.
          </p>
          <form
            className="mt-4 space-y-3"
            action="/blood"
            method="get"
          >
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Blood group
              </label>
              <Input name="bloodGroup" placeholder="e.g. O+" className="mt-1" />
            </div>
            <input type="hidden" name="lat" value="37.7749" />
            <input type="hidden" name="lng" value="-122.4194" />
            <Button type="submit" className="w-full">
              Search nearby
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
