"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type {
  Product,
  ProductCategory,
  Order,
  OrderStatus,
} from "@/lib/types";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";

const CATEGORIES: ProductCategory[] = [
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

const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "অপেক্ষায়",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রক্রিয়াধীন",
  SHIPPED: "পাঠানো",
  DELIVERED: "ডেলিভারড",
  CANCELLED: "বাতিল",
};

export default function BusinessProductsPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Product form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("piece");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<ProductCategory>("OTHER");
  const [stock, setStock] = useState("0");

  async function fetchProducts() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await clientFetch<Product[]>("/products/mine", { token });
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    if (!token) return;
    try {
      const data = await clientFetch<Order[]>("/orders/seller", { token });
      setOrders(data);
    } catch {
      setOrders([]);
    }
  }

  useEffect(() => {
    if (user?.role === "BUSINESS") {
      void fetchProducts();
      void fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  async function onCreateProduct(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      await clientFetch("/products", {
        method: "POST",
        token,
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          unit: unit || "piece",
          imageUrl: imageUrl || undefined,
          category,
          stock: Number(stock) || 0,
        }),
      });
      setName("");
      setDescription("");
      setPrice("");
      setUnit("piece");
      setImageUrl("");
      setCategory("OTHER");
      setStock("0");
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    }
  }

  async function togglePublished(product: Product) {
    if (!token) return;
    try {
      await clientFetch(`/products/${product.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ published: !product.published }),
      });
      await fetchProducts();
    } catch {
      // ignore
    }
  }

  async function deleteProduct(id: string) {
    if (!token) return;
    try {
      await clientFetch(`/products/${id}`, { method: "DELETE", token });
      await fetchProducts();
    } catch {
      // ignore
    }
  }

  async function advanceOrderStatus(orderId: string, currentStatus: OrderStatus) {
    if (!token) return;
    const idx = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return;
    const next = ORDER_STATUS_FLOW[idx + 1];
    try {
      await clientFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status: next }),
      });
      await fetchOrders();
    } catch {
      // ignore
    }
  }

  if (!user || user.role !== "BUSINESS") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted-foreground">
        <p>This workspace is reserved for business accounts.</p>
        <Button asChild className="mt-4">
          <Link href="/auth/register">Create business account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Business
        </p>
        <h1 className="mt-2 text-3xl font-semibold">এসেনশিয়াল থিংস ড্যাশবোর্ড</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনার পণ্য পরিচালনা করুন ও অর্ডার ট্র্যাক করুন
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${tab === "products" ? "border-b-2 border-[var(--secondary)] text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Package className="mr-1.5 inline h-4 w-4" />
          পণ্য ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${tab === "orders" ? "border-b-2 border-[var(--secondary)] text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Truck className="mr-1.5 inline h-4 w-4" />
          অর্ডার ({orders.length})
        </button>
      </div>

      {/* Products tab */}
      {tab === "products" && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowForm((v) => !v)}>
              <Plus className="mr-1 h-4 w-4" />
              {showForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন"}
            </Button>
          </div>

          {showForm && (
            <form
              onSubmit={onCreateProduct}
              className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <p className="text-sm font-semibold">নতুন পণ্য</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  পণ্যের নাম *
                </label>
                <Input
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  ক্যাটেগরি
                </label>
                <select
                  className="mt-1 flex h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-card-foreground"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {PRODUCT_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">
                  বিবরণ *
                </label>
                <textarea
                  className="mt-1 min-h-[80px] w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  মূল্য (৳) *
                </label>
                <Input
                  className="mt-1"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  একক (piece, kg, litre...)
                </label>
                <Input
                  className="mt-1"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  স্টক সংখ্যা
                </label>
                <Input
                  className="mt-1"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  ছবির URL
                </label>
                <Input
                  className="mt-1"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 md:col-span-2">{error}</p>
              )}
              <div className="md:col-span-2">
                <Button type="submit">পণ্য প্রকাশ করুন</Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {products.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                এখনো কোনো পণ্য নেই।
              </p>
            )}
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/40">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{p.name}</p>
                      {!p.published && (
                        <Badge variant="outline" className="text-[10px]">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ৳{p.price} / {p.unit} · স্টক: {p.stock} ·{" "}
                      {PRODUCT_CATEGORY_LABELS[p.category]}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(p)}
                  >
                    {p.published ? "আড়াল" : "প্রকাশ"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600"
                    onClick={() => deleteProduct(p.id)}
                  >
                    মুছুন
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/essentials/${p.id}`}>দেখুন</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              এখনো কোনো অর্ডার আসেনি।
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        order.status === "CANCELLED"
                          ? "destructive"
                          : order.status === "DELIVERED"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {STATUS_LABELS[order.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                  <span className="font-semibold">
                    ৳{order.totalAmount.toLocaleString("bn-BD")}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>
                        ৳{(item.quantity * item.unitPrice).toLocaleString("bn-BD")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  <p>ক্রেতা: {order.buyer?.name} ({order.buyer?.email})</p>
                  <p>ঠিকানা: {order.shippingAddress}</p>
                  <p>ফোন: {order.contactPhone}</p>
                  {order.note && <p>নোট: {order.note}</p>}
                </div>

                {order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() =>
                        advanceOrderStatus(order.id, order.status)
                      }
                    >
                      পরবর্তী ধাপ →{" "}
                      {
                        STATUS_LABELS[
                          ORDER_STATUS_FLOW[
                            ORDER_STATUS_FLOW.indexOf(order.status) + 1
                          ]
                        ]
                      }
                    </Button>
                  )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
