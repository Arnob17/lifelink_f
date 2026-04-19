"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type { Product } from "@/lib/types";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";

type PageProps = { params: Promise<{ id: string }> };

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    clientFetch<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function addToCart() {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setAdding(true);
    setError("");
    setAddedMsg("");
    try {
      await clientFetch("/cart", {
        method: "POST",
        token,
        body: JSON.stringify({ productId: id, quantity: qty }),
      });
      setAddedMsg("কার্টে যোগ হয়েছে!");
      setTimeout(() => setAddedMsg(""), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "যোগ করা যায়নি");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">পণ্যটি পাওয়া যায়নি</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/essentials">ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  const shopName =
    product.seller?.businessProfile?.organizationName ??
    product.seller?.name ??
    "Unknown";
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/essentials">
          <ArrowLeft className="mr-1 h-4 w-4" />
          এসেনশিয়াল থিংস
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full max-h-96 w-full object-cover"
            />
          ) : (
            <Package className="h-24 w-24 text-muted-foreground/25" />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit">
            {PRODUCT_CATEGORY_LABELS[product.category]}
          </Badge>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            <span>{shopName}</span>
            {product.seller?.businessProfile?.verified && (
              <Badge variant="outline" className="text-[10px]">
                ✓ Verified
              </Badge>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-[var(--secondary-strong)] dark:text-[var(--secondary)]">
              ৳{product.price.toLocaleString("bn-BD")}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              / {product.unit}
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {inStock
              ? `${product.stock} টি স্টকে আছে`
              : "বর্তমানে স্টকে নেই"}
          </p>

          {/* Quantity + Add to cart */}
          {inStock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-0 rounded-xl border border-border">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-l-xl text-muted-foreground transition hover:bg-muted"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-r-xl text-muted-foreground transition hover:bg-muted"
                  onClick={() =>
                    setQty((q) => Math.min(product.stock, q + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={addToCart} disabled={adding} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                {adding ? "যোগ হচ্ছে..." : "কার্টে যোগ করুন"}
              </Button>
            </div>
          )}

          {addedMsg && (
            <p className="mt-3 text-sm font-medium text-green-600">
              {addedMsg}
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          {!user && (
            <p className="mt-4 text-xs text-muted-foreground">
              কিনতে{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[var(--secondary)] underline"
              >
                সাইন ইন
              </Link>{" "}
              করুন
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
