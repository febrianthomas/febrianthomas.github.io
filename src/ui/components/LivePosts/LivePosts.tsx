"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { listPosts, postImageUrl, type PostSummary } from "@/lib/posts";
import { PostCard } from "@/ui/components/PostCard/PostCard";
import { DeletePostButton } from "@/ui/components/DeletePostButton/DeletePostButton";
import { useSignedIn } from "@/ui/components/SignedInOnly/SignedInOnly";
import { PageLoading } from "@/ui/components/PageLoading/PageLoading";
import { NewPostDialog } from "@/ui/components/NewPostDialog/NewPostDialog";
import { formatPostDate, matchesPost, sortPosts } from "@/lib/post-list";

export function LivePosts() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const signedIn = useSignedIn();

  useEffect(() => {
    let active = true;
    listPosts().then((data) => { if (active) setPosts(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  if (error) return <p role="status" className="text-sm text-zinc-600 dark:text-zinc-300 sm:col-span-2 lg:col-span-3">{text.post.loadError}</p>;
  if (posts === null) return <PageLoading />;
  if (posts.length === 0) return (
    <div className="surface-shadow flex min-h-72 flex-col items-center justify-center rounded-3xl bg-zinc-100 px-6 py-12 text-center dark:bg-zinc-900 sm:col-span-2 lg:col-span-3">
      <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300"><FileText size={30} /></span>
      <h2 className="mt-6 font-bagel-fat-one text-3xl">{text.post.emptyTitle}</h2>
      <p className="mt-3 max-w-sm leading-7 text-zinc-600 dark:text-zinc-300">{text.post.emptyDescription}</p>
    </div>
  );

  const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const selectedTag = tags.includes(tag) ? tag : "";
  const visible = posts.filter((post) => matchesPost(post, query, selectedTag));

  return <>
    <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
      <label className="min-w-48 flex-1"><span className="sr-only">{text.post.search}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.post.searchPlaceholder} className="min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-zinc-300" /></label>
      {tags.length > 0 && <label><span className="sr-only">{text.post.filterTags}</span><select value={selectedTag} onChange={(event) => setTag(event.target.value)} className="min-h-11 max-w-48 rounded-xl border border-zinc-300 bg-white px-3 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"><option value="">{text.post.allTags}</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
    </div>
    {visible.length === 0 && <p role="status" className="text-zinc-600 dark:text-zinc-300 sm:col-span-2 lg:col-span-3">{text.post.noSearchResults}</p>}
    {visible.map((post) => (
    <PostCard key={post.id}>
      {signedIn && <div className="absolute right-3 top-3 z-10 flex gap-2"><NewPostDialog postId={post.id} postTitle={post.title} compact onSaved={(updated) => setPosts((current) => current ? sortPosts(current.map((item) => item.id === updated.id ? updated : item)) : null)} /><DeletePostButton post={post} compact onDeleted={() => setPosts((current) => current?.filter((item) => item.id !== post.id) ?? null)} /></div>}
      <Link href={`/post/view/?id=${encodeURIComponent(post.id)}`} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4px">
        <div className="flex aspect-4/3 items-center justify-center overflow-hidden bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300">
          {post.image_path ? <Image src={postImageUrl(post.image_path)} alt="" width={600} height={450} className="h-full w-full object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" /> : <FileText size={48} aria-hidden="true" />}
        </div>
        <div className="p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{text.post.itemLabel}</p>
          {post.featured && <p className="mt-2 text-sm font-semibold text-orange-700 dark:text-orange-300">{text.post.featured}</p>}
          <h2 className="mt-3 font-bagel-fat-one text-2xl">{post.title}</h2>
          <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">{post.description}</p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400"><time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time></p>
          {post.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{post.tags.map((item) => <span key={item} className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-800 dark:bg-zinc-800 dark:text-orange-200">{item}</span>)}</div>}
        </div>
      </Link>
    </PostCard>
  ))}
  </>;
}
