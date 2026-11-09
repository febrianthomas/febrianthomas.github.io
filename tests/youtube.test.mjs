import assert from "node:assert/strict";
import test from "node:test";
import { Editor } from "@tiptap/core";
import { postEditorExtensions } from "../src/lib/post-editor-extensions.ts";
import { hasYoutubeVideo, youtubeEmbedUrl } from "../src/lib/youtube.ts";

test("normalizes supported YouTube links and rejects other URLs", () => {
  const embed = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
  for (const url of [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=20",
    "https://youtu.be/dQw4w9WgXcQ?si=example",
    "https://youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/live/dQw4w9WgXcQ",
    embed,
  ]) assert.equal(youtubeEmbedUrl(url), embed);
  for (const url of ["https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ", "https://youtube.com@evil.test/watch?v=dQw4w9WgXcQ", "https://youtube.com/watch?v=short", "https://example.com/", "not a link"]) assert.equal(youtubeEmbedUrl(url), null);
});

test("YouTube video survives editor save and renders a restricted playable embed", () => {
  const editor = new Editor({ element: null, extensions: postEditorExtensions(true), content: { type: "doc", content: [{ type: "paragraph" }] } });
  const src = youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
  assert.equal(editor.commands.setYoutubeVideo({ src }), true);
  const saved = editor.getJSON();
  assert.equal(hasYoutubeVideo(JSON.stringify(saved)), true);
  editor.destroy();

  const viewer = new Editor({ element: null, editable: false, extensions: postEditorExtensions(false), content: saved });
  assert.deepEqual(viewer.getJSON(), saved);
  const node = viewer.state.doc.firstChild;
  const rendered = node.type.spec.toDOM(node);
  assert.equal(rendered[0], "div");
  assert.equal(rendered[2][0], "iframe");
  assert.equal(rendered[2][1].src, src);
  assert.equal(rendered[2][1].loading, "lazy");
  viewer.destroy();
});

test("pasting a standalone YouTube link embeds it, while selected text and other links pass through", () => {
  const editor = new Editor({ element: null, extensions: postEditorExtensions(true), content: { type: "doc", content: [{ type: "paragraph" }] } });
  const plugin = editor.extensionManager.plugins.find((item) => item.key.startsWith("pasteYoutube$"));
  assert.ok(plugin);
  const paste = (value, empty) => plugin.props.handlePaste({ state: { selection: { empty } } }, { clipboardData: { getData: () => value } }, null);
  assert.equal(paste("https://example.com/", true), false);
  assert.equal(paste("https://youtu.be/dQw4w9WgXcQ", false), false);
  assert.equal(paste("https://youtu.be/dQw4w9WgXcQ", true), true);
  assert.equal(hasYoutubeVideo(JSON.stringify(editor.getJSON())), true);
  editor.destroy();
});

test("video-only validation rejects malformed or unrelated content", () => {
  assert.equal(hasYoutubeVideo("not json"), false);
  assert.equal(hasYoutubeVideo(JSON.stringify({ type: "doc", content: [{ type: "youtube", attrs: { src: "https://evil.test/embed/dQw4w9WgXcQ" } }] })), false);
});
