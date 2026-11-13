"use client";

import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, Plus, UploadCloud, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { kindPath, kindText } from "@/lib/post-kind";
import { createPost, getPost, postImageUrl, updatePost, PostImageUncertainError, type PostKind, type PublishedPost } from "@/lib/posts";
import { PostUpdateUncertainError } from "@/lib/post-update";
import { optimizePostImage, postImageExtension } from "@/lib/post-image";
import { prepareInlineImages, removeUnlinkedImages, InlineImageCleanupError, InlineImageLimitError } from "@/lib/post-inline-images";
import { getSupabase } from "@/lib/supabase";
import { hasYoutubeVideo } from "@/lib/youtube";
import { Button } from "@/ui/components/Button/Button";
import { PostEditor, type PostEditorValue } from "@/ui/components/PostEditor/PostEditor";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";

const fieldClass = "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function NewPostDialog({ postId, postTitle, onSaved, compact = false, kind = "post" }: { postId?: string; postTitle?: string; onSaved?: (post: PublishedPost) => void; compact?: boolean; kind?: PostKind } = {}) {
  const { text } = useLanguage();
  const t = kindText(kind, text);
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [original, setOriginal] = useState<PublishedPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [bodyChanged, setBodyChanged] = useState(false);
  const [savedWarning, setSavedWarning] = useState(false);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [content, setContent] = useState<PostEditorValue>({ document: "", plainText: "" });
  const fileInput = useRef<HTMLInputElement>(null);
  const inlineFiles = useRef(new Map<string, File>());

  function resetForm() {
    setImage(null);
    setImageError("");
    setDragging(false);
    setContent({ document: "", plainText: "" });
    setOriginal(null);
    setRemoveImage(false);
    setBodyChanged(false);
    setSavedWarning(false);
    for (const url of inlineFiles.current.keys()) URL.revokeObjectURL(url);
    inlineFiles.current.clear();
  }

  useEffect(() => {
    if (!open || !postId) return;
    let active = true;
    setLoadingPost(true);
    getPost(postId, kind).then((post) => {
      if (!active) return;
      setOriginal(post);
      if (!post) setError(t.notFound);
    }).catch(() => { if (active) setError(t.loadError); }).finally(() => { if (active) setLoadingPost(false); });
    return () => { active = false; };
  }, [open, postId, kind]);

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview({ file: image, url });
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => () => { for (const url of inlineFiles.current.keys()) URL.revokeObjectURL(url); inlineFiles.current.clear(); }, []);

  function addContentImage(file: File) {
    if (!postImageExtension(file)) { setError(t.imageInvalid); return null; }
    const url = URL.createObjectURL(file);
    inlineFiles.current.set(url, file);
    setError("");
    return url;
  }

  function selectImage(file: File | null) {
    if (file && !postImageExtension(file)) {
      setImage(null);
      if (fileInput.current) fileInput.current.value = "";
      setImageError(t.imageInvalid);
      return;
    }
    setImage(file);
    if (file) setRemoveImage(false);
    setImageError("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const body = content.document;
    const imageAlt = String(form.get("imageAlt") ?? "").trim();
    const imageCaption = String(form.get("imageCaption") ?? "").trim();
    const tags = [...new Set(String(form.get("tags") ?? "").split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
    const featured = form.get("featured") === "on";
    if (imageError) return;
    if (tags.length > 10 || tags.some((tag) => tag.length > 40)) {
      setError(t.tagsInvalid);
      return;
    }
    if (!title || !description || (!content.plainText.trim() && !hasYoutubeVideo(body))) {
      setError(t.requiredFields);
      return;
    }
    if ((bodyChanged || !postId) && body.length > 20000) {
      setError(t.bodyTooLong);
      return;
    }
    if (image && !postImageExtension(image)) {
      setError(t.imageInvalid);
      return;
    }
    setPending(true);
    setError("");
    let uploaded: string[] = [];
    try {
      const prepared = (bodyChanged || !postId) ? await prepareInlineImages(getSupabase(), body, inlineFiles.current, original?.inline_image_paths ?? [], optimizePostImage) : { body: original!.body, paths: original!.inline_image_paths, uploaded: [] };
      uploaded = prepared.uploaded;
      if (prepared.body.length > 20000) throw new Error("Post content too long");
      if (postId && original) {
        const result = await updatePost(original, { title, description, body: prepared.body, body_format: bodyChanged ? "tiptap" : original.body_format, image_alt: imageAlt || null, image_caption: imageCaption || null, tags, featured, inline_image_paths: prepared.paths }, image, removeImage, kind);
        onSaved?.(result.post);
        setOriginal(result.post);
        setImage(null);
        setRemoveImage(false);
        setBodyChanged(false);
        if (result.cleanupFailed) {
          setSavedWarning(true);
          setError(t.editImageCleanupError);
          return;
        }
        setOpen(false);
        resetForm();
        return;
      }
      const id = await createPost({ title, description, body: prepared.body, tags, featured, image_caption: imageCaption || null, inline_image_paths: prepared.paths }, image ?? undefined, imageAlt, kind);
      setOpen(false);
      resetForm();
      router.push(`${kindPath(kind)}view/?id=${encodeURIComponent(id)}`);
    } catch (error) {
      if (uploaded.length && !(error instanceof PostImageUncertainError) && !(error instanceof PostUpdateUncertainError)) {
        try { await removeUnlinkedImages(getSupabase(), uploaded); }
        catch { setError(t.imageCleanupUncertain); return; }
      }
      setError(error instanceof InlineImageLimitError ? t.contentImagesLimit : error instanceof Error && error.message === "Post content too long" ? t.bodyTooLong : error instanceof PostImageUncertainError || error instanceof PostUpdateUncertainError || error instanceof InlineImageCleanupError ? t.imageCleanupUncertain : postId ? t.editError : t.publishError);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!pending) { setOpen(nextOpen); setError(""); if (!nextOpen) resetForm(); } }}>
      <Dialog.Trigger asChild>
        {postId ? <button type="button" aria-label={`${t.editPost}: ${postTitle ?? ""}`} title={t.editPost} className={`flex size-11 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-200 dark:hover:bg-zinc-800 ${compact ? "bg-white shadow-sm dark:bg-zinc-900" : ""}`}><Pencil size={18} aria-hidden="true" /></button> : <Button className="min-h-11 gap-2 rounded-xl!"><Plus size={18} aria-hidden="true" />{t.addPost}</Button>}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-zinc-950/50" />
        <div className="pointer-events-none fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
          <Dialog.Content asChild onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }}>
            <motion.div
              data-lenis-prevent
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="surface-shadow pointer-events-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-zinc-950 focus:outline-none sm:p-8 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="text-4xl font-bold">{postId ? t.editTitle : t.createTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" disabled={pending} aria-label={t.close} className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800"><X size={20} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 text-lg leading-7 text-zinc-600 dark:text-zinc-300">{postId ? t.editDescription : t.createDescription}</Dialog.Description>
              {postId && !original ? <p role="status" className="mt-7">{loadingPost ? t.loading : error}</p> : (
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div><label htmlFor="post-title" className="block text-sm font-bold">{t.titleLabel}</label><input id="post-title" name="title" defaultValue={original?.title} required maxLength={120} className={fieldClass} /></div>
                <div><label htmlFor="post-description" className="block text-sm font-bold">{t.descriptionLabel}</label><textarea id="post-description" name="description" defaultValue={original?.description} required maxLength={240} rows={3} className={fieldClass} /></div>
                <div><label htmlFor="post-tags" className="block text-sm font-bold">{t.tagsLabel}</label><input id="post-tags" name="tags" defaultValue={original?.tags.join(", ")} aria-describedby="post-tags-help" className={fieldClass} /><p id="post-tags-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.tagsHelp}</p></div>
                <label className="flex min-h-11 items-center gap-3 text-sm font-bold"><input type="checkbox" name="featured" defaultChecked={original?.featured} className="size-5 accent-orange-600" />{t.featuredLabel}</label>
                <div><p id="post-body-label" className="block text-sm font-bold">{t.bodyLabel}</p><PostEditor initialPost={original} onReady={setContent} onChange={(value) => { setContent(value); setBodyChanged(true); }} onImage={addContentImage} disabled={pending || savedWarning} /><p id="post-link-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.linkHelp}</p></div>
                <div>
                  <p id="post-image-label" className="block text-sm font-bold">{t.imageLabel}</p>
                  <div
                    onDragEnter={(event) => { event.preventDefault(); if (!pending && event.dataTransfer.types.includes("Files")) setDragging(true); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragging(false);
                      if (pending) return;
                      const files = event.dataTransfer.files;
                      if (files.length !== 1) {
                        setImage(null);
                        if (fileInput.current) fileInput.current.value = "";
                        setImageError(t.imageSingle);
                        return;
                      }
                      if (fileInput.current) fileInput.current.value = "";
                      selectImage(files[0]);
                    }}
                    className={`mt-2 rounded-xl border-2 border-dashed p-5 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-300 ${dragging ? "border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-zinc-800" : "border-zinc-300 dark:border-zinc-600"}`}
                  >
                    <input ref={fileInput} id="post-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={pending} onChange={(event) => selectImage(event.target.files?.[0] ?? null)} aria-labelledby="post-image-label" aria-describedby={imageError ? "post-image-help post-image-error" : "post-image-help"} aria-invalid={Boolean(imageError)} className="sr-only" />
                    <div className="flex flex-wrap items-center gap-3">
                      <UploadCloud size={22} aria-hidden="true" className="text-zinc-500 dark:text-zinc-400" />
                      <label htmlFor="post-image" className="cursor-pointer rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600">{t.chooseImage}</label>
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{t.dropImage}</span>
                    </div>
                    {((image && preview?.file === image) || (!image && original?.image_path && !removeImage)) && <img src={image && preview?.file === image ? preview.url : postImageUrl(original!.image_path!)} alt={t.imagePreview} className="mt-4 max-h-64 w-full rounded-xl bg-zinc-100 object-contain dark:bg-zinc-800" />}
                    {(image || imageError || (original?.image_path && !removeImage)) && <div className="mt-4 flex items-center justify-between gap-3"><span role="status" className="wrap-break-words min-w-0 text-sm">{image?.name}</span><button type="button" disabled={pending} onClick={() => { if (fileInput.current) fileInput.current.value = ""; selectImage(null); setRemoveImage(true); }} className="shrink-0 rounded-xl px-3 py-2 text-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{t.removeImage}</button></div>}
                  </div>
                  <p id="post-image-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.imageHelp}</p>
                  {imageError && <p id="post-image-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">{imageError}</p>}
                </div>
                {(image || (original?.image_path && !removeImage)) && <div><label htmlFor="post-image-alt" className="block text-sm font-bold">{t.imageAltLabel}</label><input id="post-image-alt" name="imageAlt" defaultValue={original?.image_alt ?? ""} maxLength={300} aria-describedby="post-image-alt-help" className={fieldClass} /><p id="post-image-alt-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.imageAltHelp}</p></div>}
                {(image || (original?.image_path && !removeImage)) && <div><label htmlFor="post-image-caption" className="block text-sm font-bold">{t.captionLabel}</label><input id="post-image-caption" name="imageCaption" defaultValue={original?.image_caption ?? ""} maxLength={300} className={fieldClass} /></div>}
                {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={pending || savedWarning} className="min-h-11 rounded-xl!">{pending ? <LoadingIndicator label={postId ? t.saving : t.publishing} /> : postId ? t.saveChanges : t.publish}</Button>
              </form>
              )}
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
