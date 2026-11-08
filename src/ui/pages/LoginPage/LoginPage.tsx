"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/ui/components/Button/Button";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");

    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      });

      if (error) {
        setMessage("Could not sign in. Check your email and password and try again.");
      } else {
        setSignedIn(true);
      }
    } catch {
      setMessage("Unable to connect. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-24 pt-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Account access</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Welcome back.</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">Sign in with your email and password.</p>

        {signedIn ? (
          <div role="status" className="mt-10 border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">You’re signed in.</p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Return to home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 px-3 text-base outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-300 dark:focus:ring-zinc-300" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 px-3 text-base outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-300 dark:focus:ring-zinc-300" />
            </div>
            {message && <p role="alert" className="text-sm leading-6 text-red-700 dark:text-red-400">{message}</p>}
            <Button type="submit" disabled={loading} className="h-12 w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
