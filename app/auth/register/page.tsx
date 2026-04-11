"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-context";
import { clientFetch } from "@/lib/client-api";
import type { AuthUser, UserRole } from "@/lib/types";

export default function RegisterPage() {
  const { setSession } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await clientFetch<{
        accessToken: string;
        user: AuthUser;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          role,
        }),
      });
      setSession(res.accessToken, res.user);
      router.push(role === "BUSINESS" ? "/dashboard/listings" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a normal user account to search and register as a donor, or a
          business account to publish listings.
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-medium text-muted-foreground">Full name</label>
          <Input
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <Input
            className="mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone (optional)</label>
          <Input
            className="mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <Input
            className="mt-1"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Account type</label>
          <select
            className="mt-1 flex h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-card-foreground shadow-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="USER">Normal user</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have access?{" "}
        <Link href="/auth/login" className="font-semibold text-[var(--secondary-strong)] dark:text-[var(--secondary)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
