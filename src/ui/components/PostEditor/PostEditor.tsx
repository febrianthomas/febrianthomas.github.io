"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Bold, Code, CodeXml, Heading2, Heading3, Italic, List, ListOrdered, Minus, Quote, Strikethrough, Underline } from "lucide-react";
import { useEffect } from "react";
import text from "@/content/text.json";
import { postEditorExtensions } from "@/lib/post-editor-extensions";
import { Markdown } from "@tiptap/markdown";
import type { PublishedPost } from "@/lib/posts";

export type PostEditorValue = { document: string; plainText: string };

export function PostEditor({ onChange, onReady, disabled, initialPost }: { onChange: (value: PostEditorValue) => void; onReady?: (value: PostEditorValue) => void; disabled: boolean; initialPost?: PublishedPost | null }) {
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
          <button key={label} type="button" aria-label={label} title={label} aria-pressed={active} disabled={!editor || disabled} onMouseDown={(event) => event.preventDefault()} onClick={action} className={`flex h-10 w-10 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}>
            <Icon size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
