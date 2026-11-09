"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { postEditorExtensions } from "@/lib/post-editor-extensions";

export function PostContent({ body }: { body: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: postEditorExtensions(false),
    content: (() => { try { return JSON.parse(body); } catch { return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: body }] }] }; } })(),
    editorProps: { attributes: { class: "post-rich-content mt-10 text-lg leading-8 text-zinc-700 dark:text-zinc-200" } },
  });

  return <EditorContent editor={editor} />;
}
