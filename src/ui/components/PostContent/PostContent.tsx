"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { postEditorExtensions } from "@/lib/post-editor-extensions";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { ImageLightboxDialog } from "@/ui/components/ImageLightbox/ImageLightbox";

export function PostContent({ body }: { body: string }) {
  const { text } = useLanguage();
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: postEditorExtensions(false, text.post.openImage),
    content: (() => { try { return JSON.parse(body); } catch { return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: body }] }] }; } })(),
    editorProps: { attributes: { class: "post-rich-content mt-10 text-lg leading-8 text-zinc-700 dark:text-zinc-200" } },
  }, [text.post.openImage]);

  function openImage(target: EventTarget | null) {
    if (target instanceof HTMLImageElement) setImage({ src: target.src, alt: target.alt });
  }

  return <><div onClick={(event) => openImage(event.target)} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && event.target instanceof HTMLImageElement) { event.preventDefault(); openImage(event.target); } }}><EditorContent editor={editor} /></div><Dialog.Root open={Boolean(image)} onOpenChange={(open) => { if (!open) setImage(null); }}>{image && <ImageLightboxDialog src={image.src} alt={image.alt} />}</Dialog.Root></>;
}
