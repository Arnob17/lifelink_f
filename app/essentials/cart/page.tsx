"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type { Cart, Order } from "@/lib/types";

export default function CartPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  async function fetchCart() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await clientFetch<Cart>("/cart", { token });
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) void fetchCart();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateQty(itemId: string, quantity: number) {
    if (!token) return;
    try {
      if (quantity <= 0) {
        await clientFetch(`/cart/${itemId}`, { method: "DELETE", token });
      } else {
        await clientFetch(`/cart/${itemId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ quantity }),
        });
      }
      await fetchCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function removeItem(itemId: string) {
    if (!token) return;
    try {
      await clientFetch(`/cart/${itemId}`, { method: "DELETE", token });
      await fetchCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    }
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCheckingOut(true);
    setError("");
    try {
      const order = await clientFetch<Order>("/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          shippingAddress: address,
          contactPhone: phone,
          note: note || undefined,
        }),
      });
      router.push(`/essentials/orders`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "অর্ডার দেওয়া যায়নি");
    } finally {
      setCheckingOut(false);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">কার্ট দেখতে সাইন ইন করুন</p>
        <Button className="mt-4" asChild>
          <Link href="/auth/login">সাইন ইন</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/essentials">
            <ArrowLeft className="mr-1 h-4 w-4" />
            কেনাকাটা চালিয়ে যান
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">আপনার কার্ট</h1>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">কার্ট খালি</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/essentials">কেনাকাটা শুরু করুন</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/40">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/essentials/${item.productId}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    ৳{item.product.price.toLocaleString("bn-BD")} /{" "}
                    {item.product.unit}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.product.seller?.businessProfile?.organizationName ??
                      item.product.seller?.name}
                  </p>
                </div>

                <div className="flex items-center gap-0 rounded-lg border border-border">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="flex h-8 w-8 items-center justify-center border-x border-border text-xs font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <p className="w-20 text-right text-sm font-semibold">
                  ৳
                  {(item.product.price * item.quantity).toLocaleString("bn-BD")}
                </p>

                <button
                  type="button"
                  className="text-muted-foreground transition hover:text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total & Checkout */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                মোট
              </span>
              <span className="text-2xl font-bold text-[var(--secondary-strong)] dark:text-[var(--secondary)]">
                ৳{total.toLocaleString("bn-BD")}
              </span>
            </div>

            {!showCheckout ? (
              <Button
                className="mt-4 w-full"
                onClick={() => setShowCheckout(true)}
              >
                অর্ডার করুন
              </Button>
            ) : (
              <form onSubmit={placeOrder} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    ডেলিভারি ঠিকানা *
                  </label>
                  <textarea
                    className="mt-1 min-h-[80px] w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    যোগাযোগ নম্বর *
                  </label>
                  <Input
                    className="mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    নোট (ঐচ্ছিক)
                  </label>
                  <Input
                    className="mt-1"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="বিশেষ নির্দেশনা..."
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3">
                  <Button type="submit" disabled={checkingOut} className="flex-1">
                    {checkingOut ? "প্রক্রিয়াকরণ..." : "অর্ডার নিশ্চিত করুন"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                  >
                    বাতিল
                  </Button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
