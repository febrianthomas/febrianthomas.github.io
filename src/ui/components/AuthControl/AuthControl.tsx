"use client";

import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { getSupabase } from "@/lib/supabase";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { ConfirmDialog } from "@/ui/components/ConfirmDialog/ConfirmDialog";

const controlClass = "inline-flex h-11 w-11 items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-4";

export function AuthControl() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    try {
      const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
        setSignedIn(Boolean(session));
      });
      return () => subscription.unsubscribe();
    } catch {
      return;
    }
  }, []);

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
