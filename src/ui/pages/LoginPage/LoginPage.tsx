"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

const inputClass =
  "h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-zinc-300";

export default function LoginPage() {
  const { text } = useLanguage();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [missingConfig, setMissingConfig] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
        if (session) {
          router.replace("/");
        } else {
          setCheckingSession(false);
        }
      });
      return () => subscription.unsubscribe();
    } catch {
      setMissingConfig(true);
      setCheckingSession(false);
      return;
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || missingConfig) return;
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
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12 sm:py-16">
        <div className="surface-shadow rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{text.login.eyebrow}</p>
          {checkingSession ? (
            <>
              <h1 id="page-title" className="font-bagel-fat-one text-3xl tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
                {text.login.checkingTitle}
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300" role="status">
                {text.login.checkingStatus}
              </p>
            </>
          ) : (
            <>
              <h1 id="page-title" className="font-bagel-fat-one text-3xl leading-[1.1] tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
                {text.login.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-300">
                {text.login.description}
              </p>
              {missingConfig && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                >
                  {text.login.missingConfig} <code>.env.local</code>.
                </p>
              )}
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-zinc-900 dark:text-zinc-100">
                    {text.login.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={text.login.emailPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm text-zinc-900 dark:text-zinc-100">
                    {text.login.password}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder={text.login.passwordPlaceholder}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? text.login.hidePassword : text.login.showPassword}
                      aria-pressed={showPassword}
                      aria-controls="password"
                      className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                {message && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {message}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={loading || missingConfig}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:outline-zinc-100"
                >
                  {loading ? text.login.signingIn : text.navigation.signIn}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
