"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, PenLine, Trash2 } from "lucide-react";
import type { UserFeedPost } from "@/lib/types";
import { LIFELINK_TOKEN_STORAGE_KEY } from "@/lib/auth-constants";
import { clientFetch } from "@/lib/client-api";
import { useAuth } from "@/components/providers/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function formatPostDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PostCard({
  post,
  canDelete,
  onDeleted,
}: {
  post: UserFeedPost;
  canDelete: boolean;
  onDeleted: (id: string) => void;
}) {
  const { token } = useAuth();
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    if (!token || !canDelete) return;
    if (!window.confirm("এই পোস্ট মুছে ফেলবেন?")) return;
    setRemoving(true);
    try {
      await clientFetch<{ deleted: boolean }>(`/posts/${post.id}`, {
        method: "DELETE",
        token,
      });
      onDeleted(post.id);
    } catch {
      // keep card; user can retry
    } finally {
      setRemoving(false);
    }
  };

  return (
    <article
      className={cn(
        "rounded-3xl border border-border/70 bg-card/90 p-4 shadow-md shadow-black/[0.04] backdrop-blur-md dark:shadow-black/25 sm:p-5",
        "transition hover:border-[var(--bangla-green)]/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-gradient-to-br from-muted to-card text-sm font-black text-[var(--bangla-green-strong)] dark:text-[var(--bangla-green)]">
            {post.author.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatPostDate(post.createdAt)}</p>
          </div>
        </div>
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
            disabled={removing}
            onClick={() => void remove()}
            aria-label="পোস্ট মুছুন"
          >
            {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {post.title && (
        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-foreground sm:text-lg">{post.title}</h3>
      )}
      <div
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed text-card-foreground",
          post.title ? "mt-2" : "mt-3",
        )}
      >
        {post.content}
      </div>
    </article>
  );
}

export function UserCommunityFeed({ initialPosts }: { initialPosts: UserFeedPost[] }) {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<UserFeedPost[]>(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const submit = useCallback(async () => {
    const accessToken =
      token?.trim() ||
      (typeof window !== "undefined"
        ? (localStorage.getItem(LIFELINK_TOKEN_STORAGE_KEY)?.trim() ?? "")
        : "");
    if (!accessToken) {
      setError("সাইন ইন করুন — টোকেন পাওয়া যায়নি।");
      return;
    }
    const body = content.trim();
    if (body.length === 0) {
      setError("কিছু লিখুন — খালি পোস্ট পাঠানো যাবে না।");
      return;
    }
    setError(null);
    setSending(true);
    try {
      const created = await clientFetch<UserFeedPost>("/posts", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: body,
        }),
      });
      setPosts((prev) => [created, ...prev]);
      setTitle("");
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "পোস্ট পাঠানো যায়নি।");
    } finally {
      setSending(false);
    }
  }, [token, title, content]);

  const onDeleted = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const signedIn = Boolean(token && user);

  const empty = useMemo(() => posts.length === 0, [posts.length]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-card/90 to-muted/25 p-4 shadow-lg shadow-black/[0.04] backdrop-blur-md dark:shadow-black/20 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <PenLine className="h-4 w-4 text-[var(--bangla-red)]" />
            নতুন পোস্ট
          </p>
          {!signedIn && (
            <span className="text-xs font-medium text-muted-foreground">
              পোস্ট করতে{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[var(--bangla-red)] underline-offset-2 hover:underline"
              >
                সাইন ইন
              </Link>{" "}
              করুন।
            </span>
          )}
        </div>
        {signedIn && (
          <div className="mt-4 space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="শিরোনাম (ঐচ্ছিক) — রেডিট-স্টাইল"
              maxLength={200}
              disabled={sending}
              className="rounded-2xl"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনার মন্তব্য, খবর বা টিপস লিখুন…"
              maxLength={20000}
              disabled={sending}
              rows={5}
              className={cn(
                "w-full resize-y rounded-2xl border border-border bg-card px-3 py-2.5 text-sm text-card-foreground shadow-sm",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">{content.length.toLocaleString("bn-BD")} / ২০,০০০</span>
              <Button
                type="button"
                className="rounded-full bg-[var(--bangla-red)] hover:bg-[var(--bangla-red)]/90"
                disabled={sending || !content.trim()}
                onClick={() => void submit()}
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    পাঠানো হচ্ছে…
                  </>
                ) : (
                  "পোস্ট করুন"
                )}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>

      {empty ? (
        <p className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          এখনও কোনো কমিউনিটি পোস্ট নেই। প্রথম পোস্ট আপনার!
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard
                post={p}
                canDelete={Boolean(user && user.id === p.author.id)}
                onDeleted={onDeleted}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
