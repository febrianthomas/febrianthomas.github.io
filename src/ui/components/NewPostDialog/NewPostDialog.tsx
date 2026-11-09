"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, Plus, UploadCloud, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import text from "@/content/text.json";
import { createPost, getPost, postImageUrl, updatePost, PostImageUncertainError, type PublishedPost } from "@/lib/posts";
import { PostUpdateUncertainError } from "@/lib/post-update";
import { postImageExtension } from "@/lib/post-image";
import { Button } from "@/ui/components/Button/Button";
import { PostEditor, type PostEditorValue } from "@/ui/components/PostEditor/PostEditor";
import { LoadingIndicator } from "@/ui/components/LoadingIndicator/LoadingIndicator";

const fieldClass = "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function NewPostDialog({ postId, postTitle, onSaved, compact = false }: { postId?: string; postTitle?: string; onSaved?: (post: PublishedPost) => void; compact?: boolean } = {}) {
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
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [content, setContent] = useState<PostEditorValue>({ document: "", plainText: "" });
  const fileInput = useRef<HTMLInputElement>(null);

  function resetForm() {
    setImage(null);
    setImageError("");
    setDragging(false);
    setContent({ document: "", plainText: "" });
    setOriginal(null);
    setRemoveImage(false);
    setBodyChanged(false);
  }

  useEffect(() => {
    if (!open || !postId) return;
    let active = true;
    setLoadingPost(true);
    getPost(postId).then((post) => {
      if (!active) return;
      setOriginal(post);
      if (!post) setError(text.post.notFound);
    }).catch(() => { if (active) setError(text.post.loadError); }).finally(() => { if (active) setLoadingPost(false); });
    return () => { active = false; };
  }, [open, postId]);

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview({ file: image, url });
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function selectImage(file: File | null) {
    if (file && !postImageExtension(file)) {
      setImage(null);
      if (fileInput.current) fileInput.current.value = "";
      setImageError(text.post.imageInvalid);
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
    if (imageError) return;
    if (!title || !description || !content.plainText.trim()) {
      setError(text.post.requiredFields);
      return;
    }
    if ((bodyChanged || !postId) && body.length > 20000) {
      setError(text.post.bodyTooLong);
      return;
    }
    if (image && !postImageExtension(image)) {
      setError(text.post.imageInvalid);
      return;
    }
    setPending(true);
    setError("");
    try {
      if (postId && original) {
        const result = await updatePost(original, { title, description, body: bodyChanged ? body : original.body, body_format: bodyChanged ? "tiptap" : original.body_format, image_alt: imageAlt || null }, image, removeImage);
        onSaved?.(result.post);
        setOriginal(result.post);
        setImage(null);
        setRemoveImage(false);
        setBodyChanged(false);
        if (result.cleanupFailed) {
          setError(text.post.editImageCleanupError);
          return;
        }
        setOpen(false);
        resetForm();
        return;
      }
      const id = await createPost({ title, description, body }, image ?? undefined, imageAlt);
      setOpen(false);
      resetForm();
      router.push(`/post/view/?id=${encodeURIComponent(id)}`);
    } catch (error) {
      setError(error instanceof PostImageUncertainError || error instanceof PostUpdateUncertainError ? text.post.imageCleanupUncertain : postId ? text.post.editError : text.post.publishError);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!pending) { setOpen(nextOpen); setError(""); if (!nextOpen) resetForm(); } }}>
      <Dialog.Trigger asChild>
        {postId ? <button type="button" aria-label={`${text.post.editPost}: ${postTitle ?? ""}`} title={text.post.editPost} className={`flex h-11 w-11 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-200 dark:hover:bg-zinc-800 ${compact ? "bg-white shadow-sm dark:bg-zinc-900" : ""}`}><Pencil size={18} aria-hidden="true" /></button> : <Button className="min-h-11 gap-2 rounded-xl!"><Plus size={18} aria-hidden="true" />{text.post.addPost}</Button>}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-zinc-950/50" />
        <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <Dialog.Content asChild onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }}>
            <motion.div
              data-lenis-prevent
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="surface-shadow pointer-events-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-zinc-900 bg-white p-6 text-zinc-950 focus:outline-none sm:p-8 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="font-bagel-fat-one text-4xl">{postId ? text.post.editTitle : text.post.createTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" disabled={pending} aria-label={text.post.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800"><X size={20} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 text-lg leading-7 text-zinc-600 dark:text-zinc-300">{postId ? text.post.editDescription : text.post.createDescription}</Dialog.Description>
              {postId && !original ? <p role="status" className="mt-7">{loadingPost ? text.post.loading : error}</p> : (
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div><label htmlFor="post-title" className="block text-sm font-medium">{text.post.titleLabel}</label><input id="post-title" name="title" defaultValue={original?.title} required maxLength={120} className={fieldClass} /></div>
                <div><label htmlFor="post-description" className="block text-sm font-medium">{text.post.descriptionLabel}</label><textarea id="post-description" name="description" defaultValue={original?.description} required maxLength={240} rows={3} className={fieldClass} /></div>
                <div><p id="post-body-label" className="block text-sm font-medium">{text.post.bodyLabel}</p><PostEditor initialPost={original} onReady={setContent} onChange={(value) => { setContent(value); setBodyChanged(true); }} disabled={pending} /><p id="post-link-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.linkHelp}</p></div>
                <div>
                  <p id="post-image-label" className="block text-sm font-medium">{text.post.imageLabel}</p>
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
                        setImageError(text.post.imageSingle);
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
                      <label htmlFor="post-image" className="cursor-pointer rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600">{text.post.chooseImage}</label>
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{text.post.dropImage}</span>
                    </div>
                    {((image && preview?.file === image) || (!image && original?.image_path && !removeImage)) && <img src={image && preview?.file === image ? preview.url : postImageUrl(original!.image_path!)} alt={text.post.imagePreview} className="mt-4 max-h-64 w-full rounded-xl bg-zinc-100 object-contain dark:bg-zinc-800" />}
                    {(image || imageError || (original?.image_path && !removeImage)) && <div className="mt-4 flex items-center justify-between gap-3"><span role="status" className="wrap-break-words min-w-0 text-sm">{image?.name}</span><button type="button" disabled={pending} onClick={() => { if (fileInput.current) fileInput.current.value = ""; selectImage(null); setRemoveImage(true); }} className="shrink-0 rounded-xl px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{text.post.removeImage}</button></div>}
                  </div>
                  <p id="post-image-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.imageHelp}</p>
                  {imageError && <p id="post-image-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">{imageError}</p>}
                </div>
                {(image || (original?.image_path && !removeImage)) && <div><label htmlFor="post-image-alt" className="block text-sm font-medium">{text.post.imageAltLabel}</label><input id="post-image-alt" name="imageAlt" defaultValue={original?.image_alt ?? ""} maxLength={300} aria-describedby="post-image-alt-help" className={fieldClass} /><p id="post-image-alt-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.imageAltHelp}</p></div>}
                {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={pending} className="min-h-11 rounded-xl!">{pending ? <LoadingIndicator label={postId ? text.post.saving : text.post.publishing} /> : postId ? text.post.saveChanges : text.post.publish}</Button>
              </form>
              )}
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
