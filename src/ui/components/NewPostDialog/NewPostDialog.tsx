"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import text from "@/content/text.json";
import { createPost } from "@/lib/posts";
import { Button } from "@/ui/components/Button/Button";

const fieldClass = "mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function NewPostDialog() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    if (!title || !description || !body) {
      setError(text.post.requiredFields);
      return;
    }
    setPending(true);
    setError("");
    try {
      const id = await createPost({ title, description, body });
      setOpen(false);
      router.push(`/post/view/?id=${encodeURIComponent(id)}`);
    } catch {
      setError(text.post.publishError);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!pending) { setOpen(nextOpen); setError(""); } }}>
      <Dialog.Trigger asChild>
        <Button className="min-h-11 gap-2 rounded-xl"><Plus size={18} aria-hidden="true" />{text.post.addPost}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-zinc-950/50" />
        <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <Dialog.Content asChild onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }}>
            <motion.div
              data-lenis-prevent
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-zinc-900 bg-white p-6 text-zinc-950 shadow-xl focus:outline-none sm:p-8 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="font-bagel-fat-one text-4xl">{text.post.createTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" disabled={pending} aria-label={text.post.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800"><X size={20} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 text-lg leading-7 text-zinc-600 dark:text-zinc-300">{text.post.createDescription}</Dialog.Description>
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div><label htmlFor="post-title" className="block text-sm font-medium">{text.post.titleLabel}</label><input id="post-title" name="title" required maxLength={120} className={fieldClass} /></div>
                <div><label htmlFor="post-description" className="block text-sm font-medium">{text.post.descriptionLabel}</label><textarea id="post-description" name="description" required maxLength={240} rows={3} className={fieldClass} /></div>
                <div><label htmlFor="post-body" className="block text-sm font-medium">{text.post.bodyLabel}</label><textarea id="post-body" name="body" required maxLength={20000} rows={8} className={fieldClass} /></div>
                {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={pending} className="min-h-11">{pending ? text.post.publishing : text.post.publish}</Button>
              </form>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
