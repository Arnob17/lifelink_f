"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-context";

const nav = [
  { href: "/news", label: "সংবাদ", hint: "News" },
  { href: "/map", label: "মানচিত্র", hint: "Map" },
  { href: "/jobs", label: "চাকরি", hint: "Jobs" },
  { href: "/clinics", label: "ক্লিনিক", hint: "Clinics" },
  { href: "/pharmacies", label: "ফার্মেসি", hint: "Pharmacies" },
  { href: "/teachers", label: "শিক্ষক", hint: "Teachers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bangla-green)] text-white shadow-sm ring-2 ring-[var(--bangla-red)]/30">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg text-[var(--bangla-green-strong)] dark:text-emerald-300">
              লাইফলিংক
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">LifeLink</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white",
                pathname === item.href && "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white",
              )}
            >
              <span className="block leading-tight">{item.label}</span>
              <span className="block text-[10px] font-normal uppercase tracking-wide text-zinc-400">
                {item.hint}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" size="sm" className="border-[var(--bangla-red)]/40 text-[var(--bangla-red)]" asChild>
            <Link href="/blood">রক্ত খুঁজুন</Link>
          </Button>
          {user ? (
            <>
              {user.role === "BUSINESS" && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/listings">Dashboard</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Create account</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 md:hidden dark:border-zinc-800"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                <span>{item.label}</span>
                <span className="ml-2 text-[10px] uppercase text-zinc-400">{item.hint}</span>
              </Link>
            ))}
            <Link
              href="/blood"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--bangla-red)]"
            >
              রক্ত খুঁজুন
            </Link>
            {user ? (
              <>
                {user.role === "BUSINESS" && (
                  <Link
                    href="/dashboard/listings"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
