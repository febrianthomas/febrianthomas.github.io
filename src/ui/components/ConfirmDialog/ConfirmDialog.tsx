"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel: string;
  errorMessage: string | ((error: unknown) => string);
  onConfirm: () => Promise<void>;
};

export function ConfirmDialog({ trigger, title, description, cancelLabel, confirmLabel, pendingLabel, errorMessage, onConfirm }: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const reducedMotion = useReducedMotion();

  async function confirm() {
    setPending(true);
    setError("");
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      setError(typeof errorMessage === "function" ? errorMessage(error) : errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => { if (!pending) { setOpen(nextOpen); setError(""); } }}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-60 bg-zinc-950/50" />
        <div className="pointer-events-none fixed inset-0 z-70 flex items-center justify-center p-6">
          <AlertDialog.Content asChild>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="surface-shadow pointer-events-auto w-full max-w-sm rounded-3xl bg-white p-7 text-zinc-950 focus:outline-none dark:bg-zinc-900 dark:text-zinc-50"
            >
              <AlertDialog.Title className="font-bagel-fat-one text-3xl">{title}</AlertDialog.Title>
              <AlertDialog.Description className="mt-3 leading-6 text-zinc-600 dark:text-zinc-300">{description}</AlertDialog.Description>
              {error && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">{error}</p>}
              <div className="mt-7 flex flex-wrap justify-end gap-3">
                <AlertDialog.Cancel disabled={pending} className="min-h-11 rounded-full px-5 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800">{cancelLabel}</AlertDialog.Cancel>
                <button type="button" onClick={confirm} disabled={pending} className="min-h-11 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">{pending ? <LoadingIndicator label={pendingLabel} /> : confirmLabel}</button>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
