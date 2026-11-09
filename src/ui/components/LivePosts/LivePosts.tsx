"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { listPosts, postImageUrl, type PostSummary } from "@/lib/posts";
import { PostCard } from "@/ui/components/PostCard/PostCard";

export function LivePosts() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    listPosts().then((data) => { if (active) setPosts(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  if (error) return <p role="status" className="text-sm text-zinc-600 dark:text-zinc-300 sm:col-span-2 lg:col-span-3">{text.post.loadError}</p>;
  if (posts === null) return <p role="status" className="text-sm text-zinc-600 dark:text-zinc-300 sm:col-span-2 lg:col-span-3">{text.post.loading}</p>;
  if (posts.length === 0) return (
    <div className="surface-shadow flex min-h-72 flex-col items-center justify-center rounded-3xl bg-zinc-100 px-6 py-12 text-center dark:bg-zinc-900 sm:col-span-2 lg:col-span-3">
      <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300"><FileText size={30} /></span>
      <h2 className="mt-6 font-bagel-fat-one text-3xl">{text.post.emptyTitle}</h2>
      <p className="mt-3 max-w-sm leading-7 text-zinc-600 dark:text-zinc-300">{text.post.emptyDescription}</p>
    </div>
  );

  return posts.map((post) => (
    <PostCard key={post.id}>
      <Link href={`/post/view/?id=${encodeURIComponent(post.id)}`} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4px">
        <div className="flex aspect-4/3 items-center justify-center overflow-hidden bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300">
          {post.image_path ? <Image src={postImageUrl(post.image_path)} alt="" width={600} height={450} className="h-full w-full object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" /> : <FileText size={48} aria-hidden="true" />}
        </div>
        <div className="p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{text.navigation.post}</p>
          <h2 className="mt-3 font-bagel-fat-one text-2xl">{post.title}</h2>
          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">{post.description}</p>
        </div>
      </Link>
    </PostCard>
  ));
}
