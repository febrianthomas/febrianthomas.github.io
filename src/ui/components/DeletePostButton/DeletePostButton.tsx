"use client";

import { Trash2 } from "lucide-react";
import text from "@/content/text.json";
import { deletePost, PostImageDeleteError } from "@/lib/post-delete";
import { getSupabase } from "@/lib/supabase";
import { ConfirmDialog } from "@/ui/components/ConfirmDialog/ConfirmDialog";

export function DeletePostButton({ post, onDeleted, compact = false }: {
  post: { id: string; title: string; image_path: string | null; inline_image_paths: string[] };
  onDeleted: () => void;
  compact?: boolean;
}) {
  return (
    <ConfirmDialog
      title={text.post.deleteTitle}
      description={text.post.deleteDescription}
      cancelLabel={text.login.cancel}
      confirmLabel={text.post.deletePost}
      pendingLabel={text.post.deleting}
      errorMessage={(error) => error instanceof PostImageDeleteError ? text.post.deleteImageError : text.post.deleteError}
      onConfirm={async () => { await deletePost(getSupabase(), post); onDeleted(); }}
      trigger={<button type="button" aria-label={`${text.post.deletePost}: ${post.title}`} title={text.post.deletePost} className={`flex h-11 w-11 items-center justify-center rounded-xl text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-red-300 dark:hover:bg-red-950 ${compact ? "bg-white shadow-sm dark:bg-zinc-900" : ""}`}><Trash2 size={18} aria-hidden="true" /></button>}
    />
  );
}
