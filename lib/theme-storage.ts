export const THEME_STORAGE_KEY = "lifelink-theme";

export type ThemePreference = "light" | "dark" | "system";

/** Default is light so the warm “paper” UI is never replaced by OS dark unless the user asks. */
export function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "light";
}

export function prefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveDark(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return prefersDark();
}
