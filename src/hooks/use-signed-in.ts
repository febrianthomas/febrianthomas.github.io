"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export function useSignedIn() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const {
        data: { subscription },
      } = getSupabase().auth.onAuthStateChange((_event, session) => {
        setSignedIn(Boolean(session));
      });
      return () => subscription.unsubscribe();
    } catch {
      setSignedIn(false);
      return;
    }
  }, []);

  return signedIn;
}
