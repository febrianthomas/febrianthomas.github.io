"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { ACCEPTED_IMAGE_MIME_TYPES } from "@/constants/post";
import { postImageUrl } from "@/lib/posts";

type CoverImageLabels = {
  imageLabel: string;
  chooseImage: string;
  dropImage: string;
  imagePreview: string;
  removeImage: string;
  imageHelp: string;
  imageSingle: string;
};

export function CoverImageDropzone({
  pending,
  image,
  preview,
  existingImagePath,
  removeImage,
  imageError,
  onSelect,
  onError,
  onRemove,
  labels,
}: {
  pending: boolean;
  image: File | null;
  preview: { file: File; url: string } | null;
  existingImagePath: string | null | undefined;
  removeImage: boolean;
  imageError: string;
  onSelect: (file: File | null) => void;
  onError: (message: string) => void;
  onRemove: () => void;
  labels: CoverImageLabels;
}) {
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function clearInput() {
    if (fileInput.current) fileInput.current.value = "";
  }

  const hasImagePreview = Boolean(
    (image && preview?.file === image) || (!image && existingImagePath && !removeImage),
  );
  const previewSrc =
    image && preview?.file === image
      ? preview.url
      : existingImagePath
        ? postImageUrl(existingImagePath)
        : "";

  return (
    <div>
      <p id="post-image-label" className="block text-sm">
        {labels.imageLabel}
      </p>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          if (!pending && event.dataTransfer.types.includes("Files")) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (pending) return;
          const files = event.dataTransfer.files;
          clearInput();
          if (files.length !== 1) {
            onSelect(null);
            onError(labels.imageSingle);
            return;
          }
          onSelect(files[0]);
        }}
        className={`mt-2 rounded-xl border-2 border-dashed p-5 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-300 ${
          dragging
            ? "border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-zinc-800"
            : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        <input
          ref={fileInput}
          id="post-image"
          name="image"
          type="file"
          accept={ACCEPTED_IMAGE_MIME_TYPES}
          disabled={pending}
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            onSelect(selected);
          }}
          aria-labelledby="post-image-label"
          aria-describedby={imageError ? "post-image-help post-image-error" : "post-image-help"}
          aria-invalid={Boolean(imageError)}
          className="sr-only"
        />
        <div className="flex flex-wrap items-center gap-3">
          <UploadCloud size={22} aria-hidden="true" className="text-zinc-500 dark:text-zinc-400" />
          <label
            htmlFor="post-image"
            className="cursor-pointer rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
          >
            {labels.chooseImage}
          </label>
          <span className="text-sm text-zinc-600 dark:text-zinc-300">{labels.dropImage}</span>
        </div>
        {hasImagePreview && (
          <img
            src={previewSrc}
            alt={labels.imagePreview}
            className="mt-4 max-h-64 w-full rounded-xl bg-zinc-100 object-contain dark:bg-zinc-800"
          />
        )}
        {(image || imageError || (existingImagePath && !removeImage)) && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <span role="status" className="wrap-break-word min-w-0 text-sm">
              {image?.name}
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                clearInput();
                onRemove();
              }}
              className="shrink-0 rounded-xl px-3 py-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
            >
              {labels.removeImage}
            </button>
          </div>
        )}
      </div>
      <p id="post-image-help" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        {labels.imageHelp}
      </p>
      {imageError && (
        <p id="post-image-error" role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
          {imageError}
        </p>
      )}
    </div>
  );
}
