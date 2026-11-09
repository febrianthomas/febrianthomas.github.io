"use client";

import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import text from "@/content/text.json";
import { getPost, listPosts, postImageUrl, type PublishedPost, type PostSummary } from "@/lib/posts";
import { PostContent } from "@/ui/components/PostContent/PostContent";
import { DeletePostButton } from "@/ui/components/DeletePostButton/DeletePostButton";
import { SignedInOnly } from "@/ui/components/SignedInOnly/SignedInOnly";
import { PageLoading } from "@/ui/components/PageLoading/PageLoading";
import { NewPostDialog } from "@/ui/components/NewPostDialog/NewPostDialog";
import { adjacentPosts, formatPostDate } from "@/lib/post-list";
import { ImageLightbox } from "@/ui/components/ImageLightbox/ImageLightbox";

export function LivePostPage() {
  const router = useRouter();
  const [post, setPost] = useState<PublishedPost | null>(null);
  const [posts, setPosts] = useState<PostSummary[]>([]);
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
    listPosts().then((data) => { if (active) setPosts(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const { previous, next } = adjacentPosts(posts, post?.id);

  return (
    <main className="flex-1 px-6 sm:px-10">
      <article className="mx-auto max-w-3xl py-16 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/post/" className="inline-flex min-h-11 items-center text-sm font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-300 dark:hover:text-white">← {text.post.backToPosts}</Link>
          {post && <SignedInOnly><div className="flex items-center gap-1"><NewPostDialog postId={post.id} postTitle={post.title} onSaved={setPost} /><DeletePostButton post={post} onDeleted={() => router.push("/post/")} /></div></SignedInOnly>}
        </div>
        {status === "loading" ? <PageLoading /> : status !== "ready" && <p role="status" className="mt-10 text-zinc-600 dark:text-zinc-300">{status === "missing" ? text.post.notFound : text.post.loadError}</p>}
        {post && (
          <>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{text.post.itemLabel}</p>
            <h1 className="mt-4 font-bagel-fat-one text-5xl leading-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">{post.description}</p>
            <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">{text.post.published} <time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time>{post.updated_at && <> · {text.post.updated} <time dateTime={post.updated_at}>{formatPostDate(post.updated_at)}</time></>}</p>
            {post.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-zinc-800 dark:text-orange-200">{tag}</span>)}</div>}
            {post.image_path && <figure className="mt-10"><ImageLightbox src={postImageUrl(post.image_path)} alt={post.image_alt ?? ""} className="surface-shadow h-auto w-full rounded-3xl object-contain" />{post.image_caption && <figcaption className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">{post.image_caption}</figcaption>}</figure>}
            {post.body_format === "tiptap" ? (
              <PostContent body={post.body} />
            ) : post.body_format === "markdown" ? (
              <div className="post-rich-content mt-10 text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                <Markdown skipHtml allowedElements={["p", "strong", "em", "ul", "ol", "li", "blockquote", "h2", "br", "a"]} unwrapDisallowed components={{ a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}>{post.body}</Markdown>
              </div>
            ) : (
              <div className="mt-10 whitespace-pre-wrap wrap-break-words text-lg leading-8 text-zinc-700 dark:text-zinc-200">{post.body}</div>
            )}
            {(previous || next) && <nav aria-label={text.post.navigationLabel} className="mt-16 flex justify-between gap-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">{previous ? <a href={`/post/view/?id=${encodeURIComponent(previous.id)}`} aria-label={`${text.post.previousPost}: ${previous.title}`} title={`${text.post.previousPost}: ${previous.title}`} className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-zinc-800"><ArrowLeft size={20} aria-hidden="true" /></a> : <span />}{next && <a href={`/post/view/?id=${encodeURIComponent(next.id)}`} aria-label={`${text.post.nextPost}: ${next.title}`} title={`${text.post.nextPost}: ${next.title}`} className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-zinc-800"><ArrowRight size={20} aria-hidden="true" /></a>}</nav>}
          </>
        )}
      </article>
    </main>
  );
}
