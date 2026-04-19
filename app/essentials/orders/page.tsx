"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "অপেক্ষায় · Pending",
  CONFIRMED: "নিশ্চিত · Confirmed",
  PROCESSING: "প্রক্রিয়াধীন · Processing",
  SHIPPED: "পাঠানো হয়েছে · Shipped",
  DELIVERED: "ডেলিভারড · Delivered",
  CANCELLED: "বাতিল · Cancelled",
};

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function fetchOrders() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await clientFetch<Order[]>("/orders", { token });
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) void fetchOrders();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function cancelOrder(orderId: string) {
    if (!token) return;
    setCancelling(orderId);
    try {
      await clientFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      await fetchOrders();
    } catch {
      // ignore
    } finally {
      setCancelling(null);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">
          অর্ডার দেখতে সাইন ইন করুন
        </p>
        <Button className="mt-4" asChild>
          <Link href="/auth/login">সাইন ইন</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/essentials">
            <ArrowLeft className="mr-1 h-4 w-4" />
            এসেনশিয়াল থিংস
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">আমার অর্ডারসমূহ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          আপনার সকল অর্ডারের ইতিহাস
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">কোনো অর্ডার নেই</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/essentials">কেনাকাটা শুরু করুন</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expanded === order.id;
            const canCancel =
              order.status === "PENDING" || order.status === "CONFIRMED";
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card shadow-sm"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left"
                  onClick={() =>
                    setExpanded(isExpanded ? null : order.id)
                  }
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_VARIANT[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} পণ্য · মোট{" "}
                      <span className="font-semibold text-foreground">
                        ৳{order.totalAmount.toLocaleString("bn-BD")}
                      </span>
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-5 pt-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted/40">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground/40" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ৳
                              {item.unitPrice.toLocaleString("bn-BD")}
                            </p>
                          </div>
                          <p className="text-sm font-semibold">
                            ৳
                            {(item.quantity * item.unitPrice).toLocaleString(
                              "bn-BD",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">
                          ঠিকানা:
                        </span>{" "}
                        {order.shippingAddress}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          ফোন:
                        </span>{" "}
                        {order.contactPhone}
                      </p>
                      {order.note && (
                        <p>
                          <span className="font-medium text-foreground">
                            নোট:
                          </span>{" "}
                          {order.note}
                        </p>
                      )}
                    </div>

                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-red-300 text-red-600"
                        disabled={cancelling === order.id}
                        onClick={() => cancelOrder(order.id)}
                      >
                        {cancelling === order.id
                          ? "বাতিল হচ্ছে..."
                          : "অর্ডার বাতিল করুন"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
