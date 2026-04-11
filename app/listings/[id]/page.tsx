import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGetListing } from "@/lib/api";

type PageProps = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  let listing: Awaited<ReturnType<typeof apiGetListing>>;
  try {
    listing = await apiGetListing(id);
  } catch {
    notFound();
  }

  const meta = listing.metadata as Record<string, unknown> | null | undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{listing.type.replaceAll("_", " ")}</Badge>
        {typeof meta?.bloodGroup === "string" && (
          <Badge variant="destructive">{meta.bloodGroup}</Badge>
        )}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{listing.title}</h1>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {listing.description}
      </p>
      {listing.address && (
        <p className="text-sm text-zinc-500">{listing.address}</p>
      )}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">Contact</p>
        <div className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-300">
          {listing.contactEmail && <p>Email: {listing.contactEmail}</p>}
          {listing.contactPhone && <p>Phone: {listing.contactPhone}</p>}
          {!listing.contactEmail && !listing.contactPhone && (
            <p className="text-zinc-500">
              Contact details on file — message through your LifeLink workspace
              (wire-up in a later iteration).
            </p>
          )}
        </div>
      </div>
      {meta && Object.keys(meta).length > 0 && (
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Details
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs text-zinc-100">
            {JSON.stringify(meta, null, 2)}
          </pre>
        </div>
      )}
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/map">Back to map</Link>
        </Button>
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
