"use client";

import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

import type { PostKind } from "@/lib/posts";
import { kindText } from "@/lib/post-kind";
import { SignedInOnly } from "@/ui/components/SignedInOnly/SignedInOnly";
import { LivePosts } from "@/ui/components/LivePosts/LivePosts";
import { NewPostDialog } from "@/ui/components/NewPostDialog/NewPostDialog";

export function PostSectionPage({ kind = "post" }: { kind?: PostKind }) {
  const { text } = useLanguage();
  const t = kindText(kind, text);
  return (
    <main className="flex-1 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{t.eyebrow}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
          <h1 className="font-bagel-fat-one text-6xl leading-none sm:text-8xl">{t.title}</h1>
          <SignedInOnly>
            <NewPostDialog kind={kind} />
          </SignedInOnly>
        </div>
        <p className="mt-6 max-w-lg text-lg leading-7 text-zinc-600 dark:text-zinc-300">{t.description}</p>
        <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          <LivePosts kind={kind} />
        </div>
      </div>
    </main>
  );
}
