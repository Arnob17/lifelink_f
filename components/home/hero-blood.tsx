"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeoBloodQuickForm } from "@/components/home/geo-blood-quick-form";

export function HeroBlood() {
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-[var(--bangla-green)]/30 bg-gradient-to-br from-[var(--newsprint)] via-white to-emerald-50/60 px-6 py-10 shadow-md dark:border-emerald-800/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-emerald-950/30 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-[var(--bangla-red)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[var(--bangla-green)]/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--bangla-green)]/25 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--bangla-green-strong)] shadow-sm dark:bg-zinc-900/90"
          >
            <Droplets className="h-3.5 w-3.5 text-[var(--bangla-red)]" />
            বাংলাদেশি মনের জন্য তৈরি
          </motion.p>
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-4xl font-black leading-tight tracking-tight text-zinc-950 dark:text-white sm:text-5xl"
          >
            মানুষের সেবা,
            <span className="text-[var(--bangla-green-strong)]"> এক ঠাঁইয়ে।</span>
          </motion.h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            রক্ত, ক্লিনিক, ফার্মেসি, চাকরি, শিক্ষক আর দেশি-বিদেশি সংবাদ — সব একসাথে, পত্রিকার প্রথম পাতার মতো
            গুছিয়ে। সংবাদ শিরোনামগুলো বাইরের সংস্থার; ক্লিক করলে তাদের লিংকে চলে যাবেন।
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-[var(--bangla-red)] hover:bg-[var(--bangla-red)]/90"
              asChild
            >
              <Link href="/blood">এখনই রক্ত খুঁজুন</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-[var(--bangla-green)]/40" asChild>
              <Link href="/map">লাইভ মানচিত্র</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                t: "নিরাপদ তালিকা",
                d: "যাচাই করা ব্যবসায়ী অ্যাকাউন্ট",
              },
              {
                icon: MapPin,
                t: "আপনার লোকেশন",
                d: "মানচিত্র ও অনুসন্ধান আপনার এলাকায়",
              },
              {
                icon: Droplets,
                t: "রক্তের জাল",
                d: "দাতা ও ব্যাংক একসাথে",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 text-sm shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60"
              >
                <item.icon className="h-5 w-5 text-[var(--bangla-green)]" />
                <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">{item.t}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <GeoBloodQuickForm />
        </motion.div>
      </div>
    </section>
  );
}
