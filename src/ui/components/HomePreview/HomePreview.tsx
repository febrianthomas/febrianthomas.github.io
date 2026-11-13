"use client";

import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { kindPath, kindText } from "@/lib/post-kind";
import { listPostPreviews, postImageUrl, type PostKind } from "@/lib/posts";
import { PostCard } from "@/ui/components/PostCard/PostCard";

type Preview = Awaited<ReturnType<typeof listPostPreviews>>[number];

export function HomePreview({ kind }: { kind: PostKind }) {
  const [items, setItems] = useState<Preview[] | null>(null);
  const [error, setError] = useState(false);
  const { text } = useLanguage();
  const t = kindText(kind, text);
  const path = kindPath(kind);

  useEffect(() => {
    let active = true;
    listPostPreviews(kind)
      .then((data) => { if (active) setItems(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [kind]);

  return (
    <section className="mx-auto w-full max-w-6xl py-20 sm:py-28">
      <Link href={path} className="group inline-flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4">
        <h2 className="font-bagel-fat-one text-5xl sm:text-6xl">{t.title}</h2>
        <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
      </Link>
      <p className="mt-5 max-w-lg text-lg leading-7 text-zinc-600 dark:text-zinc-300">{t.description}</p>
      {error ? <p role="status" className="mt-8 text-zinc-600 dark:text-zinc-300">{t.loadError}</p> : items === null ? <p role="status" className="mt-8 text-zinc-600 dark:text-zinc-300">{text.post.loading}</p> : items.length === 0 ? <p className="mt-8 text-zinc-600 dark:text-zinc-300">{t.emptyDescription}</p> : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PostCard key={item.id}>
              <Link href={`${path}view/?id=${encodeURIComponent(item.id)}`} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4">
                <div className="flex aspect-4/3 items-center justify-center overflow-hidden bg-orange-100 text-orange-700 dark:bg-zinc-800 dark:text-orange-300">
                  {item.image_path ? <Image src={postImageUrl(item.image_path)} alt="" width={600} height={450} className="size-full object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" /> : <FileText size={48} aria-hidden="true" />}
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
                </div>
              </Link>
            </PostCard>
          ))}
        </div>
      )}
    </section>
  );
}
