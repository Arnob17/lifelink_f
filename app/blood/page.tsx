import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { apiBloodSearch } from "@/lib/api";
import { DonorRegistrationPanel } from "@/components/blood/donor-registration-panel";

const DEFAULT_LAT = 23.810331;
const DEFAULT_LNG = 90.412521;

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BloodPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const bloodGroup =
    typeof sp.bloodGroup === "string" && sp.bloodGroup
      ? sp.bloodGroup
      : undefined;
  const lat = typeof sp.lat === "string" ? Number(sp.lat) : DEFAULT_LAT;
  const lng = typeof sp.lng === "string" ? Number(sp.lng) : DEFAULT_LNG;
  const radiusKm =
    typeof sp.radiusKm === "string" ? Number(sp.radiusKm) || 25 : 25;

  let donors: Awaited<ReturnType<typeof apiBloodSearch>>["donors"] = [];
  let banks: Awaited<ReturnType<typeof apiBloodSearch>>["banks"] = [];
  try {
    const results = await apiBloodSearch({
      lat,
      lng,
      bloodGroup,
      radiusKm,
    });
    donors = results.donors;
    banks = results.banks;
  } catch {
    donors = [];
    banks = [];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-[var(--bangla-red)]/25 bg-gradient-to-br from-card to-muted/50 p-8 shadow-sm dark:border-[var(--bangla-red)]/35 dark:from-card dark:to-muted/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700 dark:text-red-300">
          Emergency pathway
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Find blood now
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Radius search across donor registrations and blood bank listings. Use
          the homepage hero or pass query parameters to tune coordinates.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/blood?lat=${lat}&lng=${lng}&radiusKm=15`}>
              Tight 15 km radius
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/map">View on map</Link>
          </Button>
        </div>
      </div>

      <DonorRegistrationPanel />

      <section>
        <h2 className="text-xl font-semibold">Matching donors</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {bloodGroup
            ? `Filtered to ${bloodGroup.toUpperCase()} near your coordinates.`
            : "All donor types within the selected radius."}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {donors.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No donors in range — widen the radius or start the seeded API.
            </p>
          )}
          {donors.map((d) => (
            <ListingCard key={d.id} listing={d} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Blood banks</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {banks.length === 0 && (
            <p className="text-sm text-muted-foreground">No banks in range.</p>
          )}
          {banks.map((b) => (
            <ListingCard key={b.id} listing={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
