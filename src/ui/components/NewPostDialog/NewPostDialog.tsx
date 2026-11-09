"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, UploadCloud, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import text from "@/content/text.json";
import { createPost, PostImageUncertainError } from "@/lib/posts";
import { postImageExtension } from "@/lib/post-image";
import { Button } from "@/ui/components/Button/Button";
import { PostEditor, type PostEditorValue } from "@/ui/components/PostEditor/PostEditor";

const fieldClass = "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300";

export function NewPostDialog() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [content, setContent] = useState<PostEditorValue>({ document: "", plainText: "" });
  const fileInput = useRef<HTMLInputElement>(null);

  function selectImage(file: File | null) {
    if (file && !postImageExtension(file)) {
      setImage(null);
      if (fileInput.current) fileInput.current.value = "";
      setImageError(text.post.imageInvalid);
      return;
    }
    setImage(file);
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
    if (body.length > 20000) {
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
      const id = await createPost({ title, description, body }, image ?? undefined, imageAlt);
      setOpen(false);
      setImage(null);
      setContent({ document: "", plainText: "" });
      router.push(`/post/view/?id=${encodeURIComponent(id)}`);
    } catch (error) {
      setError(error instanceof PostImageUncertainError ? text.post.imageCleanupUncertain : text.post.publishError);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!pending) { setOpen(nextOpen); setError(""); if (!nextOpen) { setImage(null); setImageError(""); setDragging(false); setContent({ document: "", plainText: "" }); } } }}>
      <Dialog.Trigger asChild>
        <Button className="min-h-11 gap-2 rounded-xl!"><Plus size={18} aria-hidden="true" />{text.post.addPost}</Button>
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
                <Dialog.Title className="font-bagel-fat-one text-4xl">{text.post.createTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" disabled={pending} aria-label={text.post.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-zinc-800"><X size={20} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 text-lg leading-7 text-zinc-600 dark:text-zinc-300">{text.post.createDescription}</Dialog.Description>
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div><label htmlFor="post-title" className="block text-sm font-medium">{text.post.titleLabel}</label><input id="post-title" name="title" required maxLength={120} className={fieldClass} /></div>
                <div><label htmlFor="post-description" className="block text-sm font-medium">{text.post.descriptionLabel}</label><textarea id="post-description" name="description" required maxLength={240} rows={3} className={fieldClass} /></div>
                <div><p id="post-body-label" className="block text-sm font-medium">{text.post.bodyLabel}</p><PostEditor onChange={setContent} disabled={pending} /><p id="post-link-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.linkHelp}</p></div>
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
                    {(image || imageError) && <div className="mt-4 flex items-center justify-between gap-3"><span role="status" className="wrap-break-words min-w-0 text-sm">{image?.name}</span><button type="button" disabled={pending} onClick={() => { if (fileInput.current) fileInput.current.value = ""; selectImage(null); }} className="shrink-0 rounded-xl px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{text.post.removeImage}</button></div>}
                  </div>
                  <p id="post-image-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.imageHelp}</p>
                  {imageError && <p id="post-image-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">{imageError}</p>}
                </div>
                {image && <div><label htmlFor="post-image-alt" className="block text-sm font-medium">{text.post.imageAltLabel}</label><input key={`${image.name}-${image.lastModified}`} id="post-image-alt" name="imageAlt" maxLength={300} aria-describedby="post-image-alt-help" className={fieldClass} /><p id="post-image-alt-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.imageAltHelp}</p></div>}
                {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
                <Button type="submit" disabled={pending} className="min-h-11 rounded-xl!">{pending ? text.post.publishing : text.post.publish}</Button>
              </form>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
