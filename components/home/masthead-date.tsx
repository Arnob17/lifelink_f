"use client";

import { useEffect, useState } from "react";

/**
 * Locale+timezone formatted dates differ between Node SSR and the browser.
 * Render an empty shell first, then set text after mount to avoid hydration mismatch.
 */
export function MastheadDate({ className }: { className?: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setLabel(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date()),
      );
    });
  }, []);

  return (
    <p className={className} suppressHydrationWarning>
      {label || "\u00a0"}
    </p>
  );
}
