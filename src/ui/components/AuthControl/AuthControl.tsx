"use client";

import { LogOut, UserRound } from "lucide-react";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { getSupabase } from "@/lib/supabase";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { ConfirmDialog } from "@/ui/components/ConfirmDialog/ConfirmDialog";
import { useSignedIn } from "@/ui/components/SignedInOnly/SignedInOnly";

const controlClass = "inline-flex size-11 items-center justify-center text-zinc-500 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-400 dark:hover:text-zinc-50";

export function AuthControl() {
  const { text } = useLanguage();
  const signedIn = useSignedIn();

  async function signOut() {
    const { error } = await getSupabase().auth.signOut({ scope: "local" });
    if (error) throw error;
  }

  if (signedIn) {
    return (
      <ConfirmDialog
        title={text.login.confirmSignOut}
        description={text.login.signOutDescription}
        cancelLabel={text.login.cancel}
        confirmLabel={text.navigation.signOut}
        pendingLabel={text.login.signingOut}
        errorMessage={text.login.signOutError}
        onConfirm={signOut}
        trigger={<button type="button" aria-label={text.navigation.signOut} className={controlClass}><LogOut aria-hidden="true" size={18} strokeWidth={1.75} /></button>}
      />
    );
  }

  return (
    <MotionLink href="/login/" aria-label={text.navigation.signIn} className={controlClass}>
      <UserRound aria-hidden="true" size={18} strokeWidth={1.75} />
    </MotionLink>
  );
}
