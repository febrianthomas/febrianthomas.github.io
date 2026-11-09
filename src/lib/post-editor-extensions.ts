import StarterKit from "@tiptap/starter-kit";

export function postEditorExtensions(editable: boolean) {
  return [StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: !editable, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
  })];
}
