"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bold, Code, CodeXml, Heading2, Heading3, ImagePlus, Italic, List, ListOrdered, Minus, Quote, Strikethrough, Underline } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { postEditorExtensions } from "@/lib/post-editor-extensions";
import { Markdown } from "@tiptap/markdown";
import type { PublishedPost } from "@/lib/posts";
import { postImageExtension } from "@/lib/post-image";

export type PostEditorValue = { document: string; plainText: string };

export function PostEditor({ onChange, onReady, onImage, disabled, initialPost }: { onChange: (value: PostEditorValue) => void; onReady?: (value: PostEditorValue) => void; onImage: (file: File) => string | null; disabled: boolean; initialPost?: PublishedPost | null }) {
  const { text } = useLanguage();
  const [imageOpen, setImageOpen] = useState(false);
  const [imageError, setImageError] = useState("");
  const initialContent = initialPost?.body_format === "tiptap" ? JSON.parse(initialPost.body) : initialPost?.body_format === "markdown" ? initialPost.body : initialPost ? { type: "doc", content: initialPost.body.split("\n").map((line) => ({ type: "paragraph", content: line ? [{ type: "text", text: line }] : [] })) } : undefined;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [...postEditorExtensions(true), Markdown],
    content: initialContent,
    contentType: initialPost?.body_format === "markdown" ? "markdown" : "json",
    editorProps: { attributes: { id: "post-body", role: "textbox", "aria-multiline": "true", "aria-required": "true", "aria-labelledby": "post-body-label", "aria-describedby": "post-link-help", class: "post-rich-content min-h-48 px-4 py-3 outline-none" } },
    onUpdate: ({ editor }) => onChange({ document: JSON.stringify(editor.getJSON()), plainText: editor.getText() }),
    onCreate: ({ editor }) => onReady?.({ document: JSON.stringify(editor.getJSON()), plainText: editor.getText() }),
  });
  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      strike: editor?.isActive("strike") ?? false,
      heading: editor?.isActive("heading", { level: 2 }) ?? false,
      subheading: editor?.isActive("heading", { level: 3 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      quote: editor?.isActive("blockquote") ?? false,
      code: editor?.isActive("code") ?? false,
      codeBlock: editor?.isActive("codeBlock") ?? false,
    }),
  });

  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);

  const controls = [
    { label: text.post.bold, icon: Bold, active: active?.bold, action: () => editor?.chain().focus().toggleBold().run() },
    { label: text.post.italic, icon: Italic, active: active?.italic, action: () => editor?.chain().focus().toggleItalic().run() },
    { label: text.post.underline, icon: Underline, active: active?.underline, action: () => editor?.chain().focus().toggleUnderline().run() },
    { label: text.post.strike, icon: Strikethrough, active: active?.strike, action: () => editor?.chain().focus().toggleStrike().run() },
    { label: text.post.heading, icon: Heading2, active: active?.heading, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: text.post.subheading, icon: Heading3, active: active?.subheading, action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: text.post.bulletList, icon: List, active: active?.bulletList, action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: text.post.numberedList, icon: ListOrdered, active: active?.orderedList, action: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: text.post.quote, icon: Quote, active: active?.quote, action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: text.post.inlineCode, icon: Code, active: active?.code, action: () => editor?.chain().focus().toggleCode().run() },
    { label: text.post.codeBlock, icon: CodeXml, active: active?.codeBlock, action: () => editor?.chain().focus().toggleCodeBlock().run() },
    { label: text.post.divider, icon: Minus, active: undefined, action: () => editor?.chain().focus().setHorizontalRule().run() },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-zinc-300 bg-white focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:focus-within:border-zinc-300 dark:focus-within:ring-zinc-300">
      <div role="toolbar" aria-label={text.post.formattingToolbar} className="flex flex-wrap gap-1 border-b border-zinc-200 p-2 dark:border-zinc-700">
        {controls.map(({ label, icon: Icon, active, action }) => (
          <button key={label} type="button" aria-label={label} title={label} aria-pressed={active} disabled={!editor || disabled} onMouseDown={(event) => event.preventDefault()} onClick={action} className={`flex size-10 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}>
            <Icon size={18} aria-hidden="true" />
          </button>
        ))}
        <Dialog.Root open={imageOpen} onOpenChange={(open) => { setImageOpen(open); if (!open) setImageError(""); }}>
          <Dialog.Trigger asChild><button type="button" title={text.post.addContentImage} aria-label={text.post.addContentImage} disabled={!editor || disabled} onMouseDown={(event) => event.preventDefault()} className="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-700"><ImagePlus size={18} aria-hidden="true" /></button></Dialog.Trigger>
          <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-80 bg-zinc-950/60" /><Dialog.Content className="surface-shadow fixed left-1/2 top-1/2 z-90 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 text-zinc-950 focus:outline-none dark:bg-zinc-900 dark:text-zinc-50">
            <Dialog.Title className="text-2xl font-bold">{text.post.addContentImage}</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{text.post.contentImageDescription}</Dialog.Description>
            <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); const data = new FormData(event.currentTarget); const file = data.get("file"); if (!(file instanceof File) || !postImageExtension(file)) { setImageError(text.post.imageInvalid); return; } const src = onImage(file); if (!src || !editor) return; const alt = String(data.get("alt") ?? "").trim(); const caption = String(data.get("caption") ?? "").trim(); const chain = editor.chain().focus().setImage({ src, alt }); if (caption) chain.insertContent({ type: "paragraph", content: [{ type: "text", text: caption }] }); chain.run(); setImageOpen(false); }}>
              <label className="block text-sm">{text.post.imageLabel}<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="mt-2 block w-full text-sm" /></label>
              <label className="block text-sm">{text.post.imageAltLabel}<input name="alt" maxLength={300} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50" /></label>
              <label className="block text-sm">{text.post.captionLabel}<input name="caption" maxLength={300} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50" /></label>
              {imageError && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{imageError}</p>}
              <div className="flex justify-end gap-3"><Dialog.Close asChild><button type="button" className="min-h-11 rounded-xl px-4 text-sm">{text.login.cancel}</button></Dialog.Close><button type="submit" className="min-h-11 rounded-xl bg-zinc-900 px-4 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">{text.post.insertImage}</button></div>
            </form>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
