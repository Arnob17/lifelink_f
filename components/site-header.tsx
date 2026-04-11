"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[3.65rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-[color-mix(in_oklab,var(--accent-ink)_18%,var(--border))] bg-card text-[var(--bangla-green-strong)] shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_35%,transparent)] dark:text-[var(--bangla-green)]">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span suppressHydrationWarning className="flex flex-col leading-tight">
            <span className="font-tiro-bangla text-[1.12rem] font-semibold tracking-tight text-[var(--accent-ink)]">
              লাইফলিংক
            </span>
            <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground">
              সংবাদ · মানচিত্র · মিলন
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                pathname === item.href &&
                "bg-card text-foreground shadow-sm ring-1 ring-border/70",
              )}
            >
              <span className="block leading-tight">{item.label}</span>
              <span className="block text-[9px] font-medium uppercase tracking-wide text-muted-foreground/80">
                {item.hint}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="border-[var(--bangla-red)]/45 text-[var(--bangla-red)]" asChild>
            <Link href="/blood">রক্ত খুঁজুন</Link>
          </Button>
          {user ? (
            <>
              {user.role === "BUSINESS" && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/listings">বিজ্ঞাপন ড্যাশবোর্ড</Link>
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

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-foreground"
              >
                <span>{item.label}</span>
                <span className="ml-2 text-[10px] font-medium uppercase text-muted-foreground">{item.hint}</span>
              </Link>
            ))}
            <Link
              href="/blood"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--bangla-red)]"
            >
              রক্ত খুঁজুন
            </Link>
            {user ? (
              <>
                {user.role === "BUSINESS" && (
                  <Link
                    href="/dashboard/listings"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium"
                  >
                    বিজ্ঞাপন ড্যাশবোর্ড
                  </Link>
                )}
                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-left text-sm"
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
                  className="rounded-md px-3 py-2 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold"
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
