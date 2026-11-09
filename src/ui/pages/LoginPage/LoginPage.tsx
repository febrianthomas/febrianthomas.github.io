"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/ui/components/Button/Button";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";
import { getSupabase } from "@/lib/supabase";
import text from "@/content/text.json";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
        setSignedIn(Boolean(session));
        if (event === "INITIAL_SESSION" && session) router.replace("/");
      });
      return () => subscription.unsubscribe();
    } catch {
      return;
    }
  }, [router]);

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
        setMessage(text.login.invalidCredentials);
      } else {
        router.replace("/");
      }
    } catch {
      setMessage(text.login.connectionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-24 pt-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{text.login.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{text.login.title}</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">{text.login.description}</p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{text.login.email}</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 px-3 text-base outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:focus:border-zinc-300 dark:focus:ring-zinc-300" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{text.login.password}</label>
            <div className="relative mt-2">
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 pr-12 text-base outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? text.login.hidePassword : text.login.showPassword} aria-controls="password" className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-400 dark:hover:text-zinc-100">
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>
          {message && <p role="alert" className="text-sm leading-6 text-red-700 dark:text-red-400">{message}</p>}
          <Button type="submit" disabled={loading} className="h-12 w-full">
            {loading ? <LoadingIndicator label={text.login.signingIn} /> : text.navigation.signIn}
          </Button>
        </form>
      </div>
    </main>
  );
}
