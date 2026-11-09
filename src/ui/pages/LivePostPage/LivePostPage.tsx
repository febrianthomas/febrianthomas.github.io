"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { getPost, type PublishedPost } from "@/lib/posts";

export function LivePostPage() {
  const [post, setPost] = useState<PublishedPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {
      setStatus("missing");
      return;
    }
    let active = true;
    getPost(id).then((data) => {
      if (!active) return;
      setPost(data);
      setStatus(data ? "ready" : "missing");
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, []);

  return (
    <main className="flex-1 px-6 sm:px-10">
      <article className="mx-auto max-w-3xl py-16 sm:py-24">
        <Link href="/post/" className="inline-flex min-h-11 items-center text-sm font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-300 dark:hover:text-white">← {text.post.backToPosts}</Link>
        {status !== "ready" && <p role="status" className="mt-10 text-zinc-600 dark:text-zinc-300">{status === "loading" ? text.post.loading : status === "missing" ? text.post.notFound : text.post.loadError}</p>}
        {post && (
          <>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{text.navigation.post}</p>
            <h1 className="mt-4 font-bagel-fat-one text-5xl leading-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">{post.description}</p>
            <div className="mt-10 whitespace-pre-wrap wrap-break-words text-lg leading-8 text-zinc-700 dark:text-zinc-200">{post.body}</div>
          </>
        )}
      </article>
    </main>
  );
}
