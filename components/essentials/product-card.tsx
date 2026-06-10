import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import type { Product, PRODUCT_CATEGORY_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const shortCategoryLabel: Record<string, string> = {
  GROCERY: "মুদি",
  ELECTRONICS: "ইলেকট্রনিক্স",
  CLOTHING: "পোশাক",
  MEDICINE: "ঔষধ",
  STATIONERY: "স্টেশনারি",
  HOME_KITCHEN: "ঘর ও রান্না",
  BEAUTY_HEALTH: "সৌন্দর্য",
  SPORTS: "ক্রীড়া",
  BOOKS: "বই",
  OTHER: "অন্যান্য",
};

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const shopName =
    product.seller?.businessProfile?.organizationName ??
    product.seller?.name ??
    "Unknown";
  const inStock = product.stock > 0;

  return (
    <Link
      href={`/essentials/${product.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--secondary)]/30 hover:shadow-md",
        className,
      )}
    >
      <div className="relative flex h-44 items-center justify-center bg-muted/40">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground/40" />
        )}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 text-[10px]"
        >
          {shortCategoryLabel[product.category] ?? product.category}
        </Badge>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-destructive/90 px-3 py-1 text-xs font-semibold text-white">
              স্টক নেই
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground group-hover:text-[var(--secondary-strong)]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="text-lg font-bold text-[var(--secondary-strong)] dark:text-[var(--secondary)]">
              ৳{product.price.toLocaleString("bn-BD")}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              / {product.unit}
            </span>
          </div>
          <ShoppingCart className="h-4 w-4 text-muted-foreground transition group-hover:text-[var(--secondary)]" />
        </div>
        <p className="mt-2 truncate text-[10px] text-muted-foreground">
          {shopName}
        </p>
      </div>
    </Link>
  );
}
