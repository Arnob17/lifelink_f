"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import type { ThemePreference } from "@/lib/theme-storage";
import { cn } from "@/lib/utils";

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "আলো", icon: Sun },
  { value: "dark", label: "অন্ধকার", icon: Moon },
  { value: "system", label: "সিস্টেম", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted/60 p-0.5 shadow-inner",
        className,
      )}
      role="group"
      aria-label="রঙ মোড"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          title={label}
          aria-pressed={theme === value}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition",
            theme === value &&
              "bg-card text-foreground shadow-sm ring-1 ring-border/80",
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
