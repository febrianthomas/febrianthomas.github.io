"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ImagePlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ACCEPTED_IMAGE_MIME_TYPES } from "@/constants/post";
import { INPUT_FIELD_CLASS } from "@/constants/ui";
import { postImageExtension } from "@/lib/post-image";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export function InlineImageDialog({
  disabled,
  onInsert,
}: {
  disabled: boolean;
  onInsert: (file: File, alt: string, caption: string) => void;
}) {
  const { text } = useLanguage();
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    if (!(file instanceof File) || !postImageExtension(file)) {
      setImageError(text.post.imageInvalid);
      return;
    }
    const alt = String(data.get("alt") ?? "").trim();
    const caption = String(data.get("caption") ?? "").trim();
    onInsert(file, alt, caption);
    setOpen(false);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setImageError("");
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          title={text.post.addContentImage}
          aria-label={text.post.addContentImage}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          className="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <ImagePlus size={18} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-zinc-950/60" />
        <Dialog.Content className="surface-shadow fixed left-1/2 top-1/2 z-90 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 text-zinc-950 focus:outline-hidden dark:bg-zinc-900 dark:text-zinc-50">
          <Dialog.Title className="text-2xl font-bold">{text.post.addContentImage}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {text.post.contentImageDescription}
          </Dialog.Description>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm">
              {text.post.imageLabel}
              <input
                name="file"
                type="file"
                accept={ACCEPTED_IMAGE_MIME_TYPES}
                required
                className="mt-2 block w-full text-sm"
              />
            </label>
            <label className="block text-sm">
              {text.post.imageAltLabel}
              <input name="alt" maxLength={300} className={`mt-2 px-3 py-2 ${INPUT_FIELD_CLASS}`} />
            </label>
            <label className="block text-sm">
              {text.post.captionLabel}
              <input name="caption" maxLength={300} className={`mt-2 px-3 py-2 ${INPUT_FIELD_CLASS}`} />
            </label>
            {imageError && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-400">
                {imageError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="min-h-11 rounded-xl px-4 text-sm">
                  {text.login.cancel}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-zinc-900 px-4 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {text.post.insertImage}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
