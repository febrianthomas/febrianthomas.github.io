import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { youtubeEmbedUrl } from "./youtube.ts";

const PostImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), storagePath: { default: null, parseHTML: (element) => element.getAttribute("data-storage-path"), renderHTML: (attributes) => attributes.storagePath ? { "data-storage-path": attributes.storagePath } : {} } };
  },
});

const PostYoutube = Youtube.extend({
  renderHTML({ HTMLAttributes }) {
    const src = typeof HTMLAttributes.src === "string" ? youtubeEmbedUrl(HTMLAttributes.src) : null;
    if (!src) return ["div", { "data-youtube-video": "" }];
    return ["div", { "data-youtube-video": "" }, ["iframe", { src, title: "YouTube video", loading: "lazy", allowfullscreen: "true", allow: "encrypted-media; picture-in-picture; fullscreen", referrerpolicy: "strict-origin-when-cross-origin" }]];
  },
});

const PasteYoutube = Extension.create({
  name: "pasteYoutube",
  addProseMirrorPlugins() {
    const { editor } = this;
    return [new Plugin({ key: new PluginKey("pasteYoutube"), props: { handlePaste(view, event) {
      const src = youtubeEmbedUrl(event.clipboardData?.getData("text/plain") ?? "");
      if (!src || !view.state.selection.empty) return false;
      return editor.commands.setYoutubeVideo({ src });
    } } })];
  },
});

export function postEditorExtensions(editable: boolean, imageLabel = "Open image") {
  return [StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: !editable, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
  }), PostImage.configure({ HTMLAttributes: editable ? {} : { tabindex: "0", role: "button", "aria-label": imageLabel } }), PostYoutube.configure({ addPasteHandler: false }), ...(editable ? [PasteYoutube] : [])];
}
