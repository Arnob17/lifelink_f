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
      <p className="text-sm leading-relaxed text-muted-foreground">
        {listing.description}
      </p>
      {listing.address && (
        <p className="text-sm text-muted-foreground">{listing.address}</p>
      )}
      <div className="rounded-2xl border border-border bg-muted/60 p-4 text-sm">
        <p className="font-semibold text-foreground">Contact</p>
        <div className="mt-2 space-y-1 text-muted-foreground">
          {listing.contactEmail && <p>Email: {listing.contactEmail}</p>}
          {listing.contactPhone && <p>Phone: {listing.contactPhone}</p>}
          {!listing.contactEmail && !listing.contactPhone && (
            <p className="text-muted-foreground">
              Contact details on file — message through your LifeLink workspace
              (wire-up in a later iteration).
            </p>
          )}
        </div>
      </div>
      {meta && Object.keys(meta).length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground">
            Details
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl border border-border bg-[#0c0a08] p-4 text-xs text-[#f3e9d9]">
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
