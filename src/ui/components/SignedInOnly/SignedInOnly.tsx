"use client";

import type { ReactNode } from "react";
import { useSignedIn } from "@/hooks/use-signed-in";

export function SignedInOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const signedIn = useSignedIn();
  return signedIn === null ? null : signedIn ? children : fallback;
}
