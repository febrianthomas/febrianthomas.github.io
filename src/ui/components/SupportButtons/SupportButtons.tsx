"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { getSupabase } from "@/lib/supabase";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { useSignedIn } from "@/ui/components/SignedInOnly/SignedInOnly";

const buttons = ["streamlabs", "saweria", "kofi", "trakteer"] as const;
type ButtonId = (typeof buttons)[number];
type Status = Partial<Record<ButtonId, boolean>>;

export function SupportButtons() {
  const signedIn = useSignedIn();
  const [status, setStatus] = useState<Status | null>(null);
  const [pending, setPending] = useState<ButtonId | null>(null);
  const [error, setError] = useState(false);
  const t = text.about.donations;

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await getSupabase().from("support_buttons").select("id,enabled");
        if (error) throw error;
        if (active) setStatus(Object.fromEntries(data.map((row) => [row.id, row.enabled])));
      } catch {
        if (active) setError(true);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  async function toggle(id: ButtonId, enabled: boolean) {
    setPending(id);
    setError(false);
    try {
      const { data, error } = await getSupabase().from("support_buttons").update({ enabled }).eq("id", id).select("id,enabled").single();
      if (error || !data) throw error ?? new Error("Support button not updated");
      setStatus((current) => ({ ...current, [id]: data.enabled }));
    } catch {
      setError(true);
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="mx-auto mt-24 max-w-3xl text-center sm:mt-32">
      <h2 className="font-bagel-fat-one text-4xl sm:text-5xl">{t.title}</h2>
      <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-300">{t.description}</p>
      {error && <p role="alert" className="mt-5 text-sm text-red-700 dark:text-red-300">{t.settingsError}</p>}
      {status && <div className="mt-8 flex flex-wrap justify-center gap-4">
        {buttons.map((id) => {
          const donation = t[id];
          const enabled = status[id] === true;
          if (!signedIn && !enabled) return null;
          return <div key={id} className="flex flex-col items-center gap-3">
            {(enabled || signedIn) && donation.url && <MotionLink href={donation.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.04 }} className={`surface-shadow inline-flex min-h-40 w-40 max-w-full flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-100 px-6 py-6 text-lg text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-zinc-800 dark:text-zinc-100 ${enabled ? "" : "opacity-60"}`}>
              {donation.image && <Image src={donation.image} alt="" width={80} height={80} className="size-20 object-contain" />}{donation.name}
            </MotionLink>}
            {signedIn && <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input type="checkbox" role="switch" checked={enabled} disabled={pending !== null || status[id] === undefined} onChange={(event) => void toggle(id, event.target.checked)} className="peer sr-only" />
              <span aria-hidden="true" className="relative h-6 w-11 rounded-full bg-zinc-300 transition-colors peer-checked:bg-zinc-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:opacity-50 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5 dark:bg-zinc-700 dark:peer-checked:bg-zinc-300 dark:peer-checked:after:bg-zinc-900" />
              {donation.name}: {enabled ? t.enabled : t.disabled}
            </label>}
          </div>;
        })}
      </div>}
    </section>
  );
}
