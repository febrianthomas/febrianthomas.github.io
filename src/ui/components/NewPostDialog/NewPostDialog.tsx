"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, Plus, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { INPUT_FIELD_CLASS } from "@/constants/ui";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { kindText } from "@/lib/post-kind";
import type { PostKind, PublishedPost } from "@/lib/posts";
import { Button } from "@/ui/components/Button/Button";
import { CoverImageDropzone } from "@/ui/components/CoverImageDropzone/CoverImageDropzone";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";
import { PostEditor } from "@/ui/components/PostEditor/PostEditor";

const fieldClass = `mt-2 px-4 py-3 text-base ${INPUT_FIELD_CLASS}`;

export function NewPostDialog({
  postId,
  postTitle,
  onSaved,
  compact = false,
  kind = "post",
}: {
  postId?: string;
  postTitle?: string;
  onSaved?: (post: PublishedPost) => void;
  compact?: boolean;
  kind?: PostKind;
} = {}) {
  const { text } = useLanguage();
  const t = kindText(kind, text);
  const reducedMotion = useReducedMotion();
  const {
    open,
    pending,
    error,
    image,
    original,
    loadingPost,
    removeImage,
    savedWarning,
    preview,
    imageError,
    setImageError,
    setContent,
    addContentImage,
    selectImage,
    handleOpenChange,
    handleBodyChange,
    handleRemoveImage,
    handleSubmit,
  } = usePostDialog({ kind, postId, onSaved, t });

  const hasCoverImage = Boolean(image || (original?.image_path && !removeImage));

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {postId ? (
          <button
            type="button"
            aria-label={`${t.editPost}: ${postTitle ?? ""}`}
            title={t.editPost}
            className={`flex size-11 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-200 dark:hover:bg-zinc-800 ${
              compact ? "bg-white shadow-sm dark:bg-zinc-900" : ""
            }`}
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
        ) : (
          <Button className="min-h-11 gap-2 rounded-xl!">
            <Plus size={18} aria-hidden="true" />
            {t.addPost}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-zinc-950/50" />
        <div className="pointer-events-none fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
          <Dialog.Content
            asChild
            onEscapeKeyDown={(event) => {
              if (pending) event.preventDefault();
            }}
            onPointerDownOutside={(event) => {
              if (pending) event.preventDefault();
            }}
          >
            <motion.div
              data-lenis-prevent
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="surface-shadow pointer-events-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-zinc-950 focus:outline-hidden sm:p-8 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="text-4xl font-bold">{postId ? t.editTitle : t.createTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={pending}
                    aria-label={t.close}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 text-lg leading-7 text-zinc-600 dark:text-zinc-300">
                {postId ? t.editDescription : t.createDescription}
              </Dialog.Description>
              {postId && !original ? (
                <p role="status" className="mt-7">
                  {loadingPost ? t.loading : error}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div>
                    <label htmlFor="post-title" className="block text-sm">
                      {t.titleLabel}
                    </label>
                    <input id="post-title" name="title" defaultValue={original?.title} required maxLength={120} className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="post-description" className="block text-sm">
                      {t.descriptionLabel}
                    </label>
                    <textarea id="post-description" name="description" defaultValue={original?.description} required maxLength={240} rows={3} className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="post-tags" className="block text-sm">
                      {t.tagsLabel}
                    </label>
                    <input id="post-tags" name="tags" defaultValue={original?.tags.join(", ")} aria-describedby="post-tags-help" className={fieldClass} />
                    <p id="post-tags-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {t.tagsHelp}
                    </p>
                  </div>
                  <label className="flex min-h-11 items-center gap-3 text-sm">
                    <input type="checkbox" name="featured" defaultChecked={original?.featured} className="size-5 accent-orange-600" />
                    {t.featuredLabel}
                  </label>
                  <div>
                    <p id="post-body-label" className="block text-sm">
                      {t.bodyLabel}
                    </p>
                    <PostEditor
                      initialPost={original}
                      onReady={setContent}
                      onChange={handleBodyChange}
                      onImage={addContentImage}
                      disabled={pending || savedWarning}
                    />
                    <p id="post-link-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {t.linkHelp}
                    </p>
                  </div>
                  <CoverImageDropzone
                    pending={pending}
                    image={image}
                    preview={preview}
                    existingImagePath={original?.image_path}
                    removeImage={removeImage}
                    imageError={imageError}
                    onSelect={selectImage}
                    onError={setImageError}
                    onRemove={handleRemoveImage}
                    labels={t}
                  />
                  {hasCoverImage && (
                    <div>
                      <label htmlFor="post-image-alt" className="block text-sm">
                        {t.imageAltLabel}
                      </label>
                      <input
                        id="post-image-alt"
                        name="imageAlt"
                        defaultValue={original?.image_alt ?? ""}
                        maxLength={300}
                        aria-describedby="post-image-alt-help"
                        className={fieldClass}
                      />
                      <p id="post-image-alt-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {t.imageAltHelp}
                      </p>
                    </div>
                  )}
                  {hasCoverImage && (
                    <div>
                      <label htmlFor="post-image-caption" className="block text-sm">
                        {t.captionLabel}
                      </label>
                      <input
                        id="post-image-caption"
                        name="imageCaption"
                        defaultValue={original?.image_caption ?? ""}
                        maxLength={300}
                        className={fieldClass}
                      />
                    </div>
                  )}
                  {error && (
                    <p role="alert" className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  <Button type="submit" disabled={pending || savedWarning} className="min-h-11 rounded-xl!">
                    {pending ? <LoadingIndicator label={postId ? t.saving : t.publishing} /> : postId ? t.saveChanges : t.publish}
                  </Button>
                </form>
              )}
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
