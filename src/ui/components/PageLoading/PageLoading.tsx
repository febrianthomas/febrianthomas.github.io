"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import text from "@/content/text.json";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";

export function PageLoading() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return mounted ? createPortal(
    <LoadingIndicator label={text.post.loading} className="pointer-events-none fixed inset-0 z-10 justify-center text-zinc-600 dark:text-zinc-300" />,
    document.body,
  ) : null;
}
