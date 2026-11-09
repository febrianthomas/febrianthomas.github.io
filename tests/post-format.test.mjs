import assert from "node:assert/strict";
import test from "node:test";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { postEditorExtensions } from "../src/lib/post-editor-extensions.ts";

test("older Markdown posts retain their formatting", () => {
  const markdown = "## Title\n\n**Bold** and *italic*\n\n- Item";
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, { skipHtml: true }, markdown));
  assert.match(html, /<h2>Title<\/h2>/);
  assert.match(html, /<strong>Bold<\/strong>/);
  assert.match(html, /<em>italic<\/em>/);
  assert.match(html, /<ul>[\s\S]*<li>Item<\/li>[\s\S]*<\/ul>/);
});

test("editor documents preserve adjacent and overlapping formatting", () => {
  const content = { type: "doc", content: [{ type: "paragraph", content: [
    { type: "text", text: "testing  " },
    { type: "text", marks: [{ type: "bold" }], text: "testing  " },
    { type: "text", marks: [{ type: "bold" }, { type: "italic" }], text: "testing" },
  ] }] };
  const editor = new Editor({ element: null, extensions: [StarterKit], content });
  const saved = JSON.stringify(editor.getJSON());
  editor.destroy();
  const viewer = new Editor({ element: null, editable: false, extensions: [StarterKit], content: JSON.parse(saved) });
  assert.deepEqual(viewer.getJSON(), content);
  viewer.destroy();
});

test("post links survive saving and render as safe new-tab links", () => {
  const extensions = postEditorExtensions(true);
  const content = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Example", marks: [{ type: "link", attrs: { href: "https://example.com" } }] }] }] };
  const editor = new Editor({ element: null, extensions, content });
  const saved = JSON.stringify(editor.getJSON());
  editor.destroy();
  const viewer = new Editor({ element: null, editable: false, extensions: postEditorExtensions(false), content: JSON.parse(saved) });
  const mark = viewer.state.doc.firstChild.firstChild.marks[0];
  const [, attributes] = mark.type.spec.toDOM(mark, false);
  assert.equal(attributes.href, "https://example.com");
  assert.equal(attributes.target, "_blank");
  assert.match(attributes.rel, /noopener/);
  assert.match(attributes.rel, /noreferrer/);
  viewer.destroy();
});

test("new formatting survives saving and loads in the published post", () => {
  const content = { type: "doc", content: [
    { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Subheading" }] },
    { type: "paragraph", content: [
      { type: "text", text: "Underlined", marks: [{ type: "underline" }] },
      { type: "text", text: "Struck", marks: [{ type: "strike" }] },
      { type: "text", text: "Inline", marks: [{ type: "code" }] },
    ] },
    { type: "codeBlock", content: [{ type: "text", text: "example()" }] },
    { type: "horizontalRule" },
  ] };
  const editor = new Editor({ element: null, extensions: postEditorExtensions(true), content });
  const saved = editor.getJSON();
  editor.destroy();
  const viewer = new Editor({ element: null, editable: false, extensions: postEditorExtensions(false), content: saved });
  assert.deepEqual(viewer.getJSON(), saved);
  assert.deepEqual(viewer.getJSON().content.map((node) => node.type), ["heading", "paragraph", "codeBlock", "horizontalRule"]);
  assert.deepEqual(viewer.getJSON().content[1].content.map((node) => node.marks[0].type), ["underline", "strike", "code"]);
  viewer.destroy();
});
