/** Default radius (km) for who sees an SOS and for the nearby feed. */
export const SOS_NEARBY_RADIUS_KM = 5;

/** How often to refresh nearby SOS while the tab is open (ms). */
export const SOS_POLL_INTERVAL_MS = 28_000;

const DISMISSED_KEY = "lifelink_sos_dismissed_ids";

export function loadDismissedSosIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function persistDismissedSosIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}
