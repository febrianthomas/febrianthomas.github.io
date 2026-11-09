import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const PostImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), storagePath: { default: null, parseHTML: (element) => element.getAttribute("data-storage-path"), renderHTML: (attributes) => attributes.storagePath ? { "data-storage-path": attributes.storagePath } : {} } };
  },
});

export function postEditorExtensions(editable: boolean, imageLabel = "Open image") {
  return [StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: !editable, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
  }), PostImage.configure({ HTMLAttributes: editable ? {} : { tabindex: "0", role: "button", "aria-label": imageLabel } })];
}
