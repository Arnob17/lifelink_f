"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/essentials/product-card";
import { clientFetch } from "@/lib/client-api";
import type {
  Product,
  ProductBrowseResult,
  ProductCategory,
  PRODUCT_CATEGORY_LABELS as Labels,
} from "@/lib/types";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: ProductCategory[] = [
  "GROCERY",
  "ELECTRONICS",
  "CLOTHING",
  "MEDICINE",
  "STATIONERY",
  "HOME_KITCHEN",
  "BEAUTY_HEALTH",
  "SPORTS",
  "BOOKS",
  "OTHER",
];

const SORT_OPTIONS = [
  { value: "newest", label: "নতুন · Newest" },
  { value: "price_asc", label: "মূল্য ↑ · Price Low" },
  { value: "price_desc", label: "মূল্য ↓ · Price High" },
  { value: "oldest", label: "পুরাতন · Oldest" },
] as const;

export default function EssentialsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [sort, setSort] = useState<string>("newest");
  const [page, setPage] = useState(0);
  const pageSize = 24;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        take: pageSize,
        skip: page * pageSize,
        sort,
      };
      if (category) params.category = category;
      if (search.trim()) params.search = search.trim();

      const q = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        q.set(k, String(v));
      }
      const data = await clientFetch<ProductBrowseResult>(
        `/products?${q.toString()}`,
      );
      setProducts(data.items);
      setTotal(data.total);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  function handleCategoryToggle(cat: ProductCategory) {
    setCategory((prev) => (prev === cat ? "" : cat));
    setPage(0);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    void fetchProducts();
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[var(--secondary)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              E-Commerce
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            এসেনশিয়াল থিংস
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার প্রিয় দোকান থেকে সব রকমের পণ্য কিনুন — Discover products from
            local shops
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-60 pl-9"
              placeholder="পণ্য খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">
            খুঁজুন
          </Button>
        </form>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setPage(0);
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
            category === ""
              ? "border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm"
              : "border-border bg-card text-muted-foreground hover:bg-muted/80",
          )}
        >
          সব · All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryToggle(cat)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              category === cat
                ? "border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted/80",
            )}
          >
            {PRODUCT_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Sort & count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total > 0
            ? `${total} পণ্য পাওয়া গেছে`
            : loading
              ? "লোড হচ্ছে..."
              : "কোনো পণ্য পাওয়া যায়নি"}
        </p>
        <select
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-card-foreground"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            কোনো পণ্য পাওয়া যায়নি। ফিল্টার পরিবর্তন করে দেখুন।
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            আগের পাতা
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            পরের পাতা
          </Button>
        </div>
      )}
    </div>
  );
}
