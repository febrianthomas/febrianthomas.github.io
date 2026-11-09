"use client";

import { Trash2 } from "lucide-react";
import text from "@/content/text.json";
import { deletePost, PostImageDeleteError } from "@/lib/post-delete";
import { kindTable, kindText } from "@/lib/post-kind";
import type { PostKind } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";
import { ConfirmDialog } from "@/ui/components/ConfirmDialog/ConfirmDialog";

export function DeletePostButton({ post, onDeleted, compact = false, kind = "post" }: {
  post: { id: string; title: string; image_path: string | null; inline_image_paths: string[] };
  onDeleted: () => void;
  compact?: boolean;
  kind?: PostKind;
}) {
  const t = kindText(kind);
  return (
    <ConfirmDialog
      title={t.deleteTitle}
      description={t.deleteDescription}
      cancelLabel={text.login.cancel}
      confirmLabel={t.deletePost}
      pendingLabel={t.deleting}
      errorMessage={(error) => error instanceof PostImageDeleteError ? t.deleteImageError : t.deleteError}
      onConfirm={async () => { await deletePost(getSupabase(), post, kindTable(kind)); onDeleted(); }}
      trigger={<button type="button" aria-label={`${t.deletePost}: ${post.title}`} title={t.deletePost} className={`flex size-11 items-center justify-center rounded-xl text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-red-300 dark:hover:bg-red-950 ${compact ? "bg-white shadow-sm dark:bg-zinc-900" : ""}`}><Trash2 size={18} aria-hidden="true" /></button>}
    />
  );
}
