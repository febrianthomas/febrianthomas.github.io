"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_POST_BODY_LENGTH } from "@/constants/post";
import { parsePostTags, validatePostInput } from "@/lib/post-form";
import { optimizePostImage, postImageExtension } from "@/lib/post-image";
import {
  InlineImageCleanupError,
  InlineImageLimitError,
  prepareInlineImages,
  removeUnlinkedImages,
} from "@/lib/post-inline-images";
import { kindPath, kindText } from "@/lib/post-kind";
import { PostUpdateUncertainError } from "@/lib/post-update";
import {
  createPost,
  getPost,
  PostImageUncertainError,
  updatePost,
  type PostKind,
  type PublishedPost,
} from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";
import type { PostEditorValue } from "@/ui/components/PostEditor/PostEditor";

type PostText = ReturnType<typeof kindText>;

type UsePostDialogOptions = {
  kind: PostKind;
  postId?: string;
  onSaved?: (post: PublishedPost) => void;
  t: PostText;
};

export function usePostDialog({ kind, postId, onSaved, t }: UsePostDialogOptions) {
  const router = useRouter();
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
  const [content, setContent] = useState<PostEditorValue>({ document: "", plainText: "" });
  const inlineFiles = useRef(new Map<string, File>());

  function clearInlineFiles() {
    for (const url of inlineFiles.current.keys()) URL.revokeObjectURL(url);
    inlineFiles.current.clear();
  }

  function resetForm() {
    setImage(null);
    setImageError("");
    setContent({ document: "", plainText: "" });
    setOriginal(null);
    setRemoveImage(false);
    setBodyChanged(false);
    setSavedWarning(false);
    clearInlineFiles();
  }

  useEffect(() => {
    if (!open || !postId) return;
    let active = true;
    setLoadingPost(true);
    getPost(postId, kind)
      .then((post) => {
        if (!active) return;
        setOriginal(post);
        if (!post) setError(t.notFound);
      })
      .catch(() => {
        if (active) setError(t.loadError);
      })
      .finally(() => {
        if (active) setLoadingPost(false);
      });
    return () => {
      active = false;
    };
  }, [open, postId, kind, t.loadError, t.notFound]);

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview({ file: image, url });
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => () => clearInlineFiles(), []);

  function addContentImage(file: File) {
    if (!postImageExtension(file)) {
      setError(t.imageInvalid);
      return null;
    }
    const url = URL.createObjectURL(file);
    inlineFiles.current.set(url, file);
    setError("");
    return url;
  }

  function selectImage(file: File | null) {
    if (file && !postImageExtension(file)) {
      setImage(null);
      setImageError(t.imageInvalid);
      return;
    }
    setImage(file);
    if (file) setRemoveImage(false);
    setImageError("");
    setError("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (pending) return;
    setOpen(nextOpen);
    setError("");
    if (!nextOpen) resetForm();
  }

  function handleBodyChange(value: PostEditorValue) {
    setContent(value);
    setBodyChanged(true);
  }

  function handleRemoveImage() {
    selectImage(null);
    setRemoveImage(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (imageError) return;

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const body = content.document;
    const imageAlt = String(form.get("imageAlt") ?? "").trim();
    const imageCaption = String(form.get("imageCaption") ?? "").trim();
    const tags = parsePostTags(String(form.get("tags") ?? ""));
    const featured = form.get("featured") === "on";

    const validationError = validatePostInput({
      title,
      description,
      body,
      plainText: content.plainText,
      tags,
      checkBodyLength: bodyChanged || !postId,
      image,
    });
    if (validationError) {
      setError(t[validationError]);
      return;
    }

    setPending(true);
    setError("");
    let uploaded: string[] = [];

    try {
      const prepared =
        bodyChanged || !postId
          ? await prepareInlineImages(
              getSupabase(),
              body,
              inlineFiles.current,
              original?.inline_image_paths ?? [],
              optimizePostImage,
            )
          : { body: original!.body, paths: original!.inline_image_paths, uploaded: [] };
      uploaded = prepared.uploaded;
      if (prepared.body.length > MAX_POST_BODY_LENGTH) throw new Error("Post content too long");

      if (postId && original) {
        const result = await updatePost(
          original,
          {
            title,
            description,
            body: prepared.body,
            body_format: bodyChanged ? "tiptap" : original.body_format,
            image_alt: imageAlt || null,
            image_caption: imageCaption || null,
            tags,
            featured,
            inline_image_paths: prepared.paths,
          },
          image,
          removeImage,
          kind,
        );
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

      const id = await createPost(
        {
          title,
          description,
          body: prepared.body,
          tags,
          featured,
          image_caption: imageCaption || null,
          inline_image_paths: prepared.paths,
        },
        image ?? undefined,
        imageAlt,
        kind,
      );
      setOpen(false);
      resetForm();
      router.push(`${kindPath(kind)}view/?id=${encodeURIComponent(id)}`);
    } catch (submitError) {
      if (
        uploaded.length &&
        !(submitError instanceof PostImageUncertainError) &&
        !(submitError instanceof PostUpdateUncertainError)
      ) {
        try {
          await removeUnlinkedImages(getSupabase(), uploaded);
        } catch {
          setError(t.imageCleanupUncertain);
          return;
        }
      }
      setError(
        submitError instanceof InlineImageLimitError
          ? t.contentImagesLimit
          : submitError instanceof Error && submitError.message === "Post content too long"
            ? t.bodyTooLong
            : submitError instanceof PostImageUncertainError ||
                submitError instanceof PostUpdateUncertainError ||
                submitError instanceof InlineImageCleanupError
              ? t.imageCleanupUncertain
              : postId
                ? t.editError
                : t.publishError,
      );
    } finally {
      setPending(false);
    }
  }

  return {
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
  };
}
